import React, { ChangeEvent, PureComponent } from 'react';
import { getBackendSrv } from '@grafana/runtime';
import { QueryEditorProps, SelectableValue } from '@grafana/data';
import { DataSource } from './datasource';
import {
  CddDataSourceOptions,
  CddQuery,
  optionsPeriod,
  Metric,
  CddField,
  setInitialMetric,
  clearCurrentFields,
  getCurrentFields,
  setCurrentField,
} from './types';
import { FieldCddInput } from './FieldCddInput';
import { FieldCddSelect } from './FieldCddSelect';

type Props = QueryEditorProps<DataSource, CddQuery, CddDataSourceOptions>;

type CddState = {
  metricOptions: SelectableValue[];
};

export class QueryEditor extends PureComponent<Props, CddState> {
  url: string;
  currentMetric: string | undefined;
  historicFieldsList;
  errorMessage =
    'Check the connectivity to the CDD server and make sure that the CDD server configuration in Grafana is correct (URL, Tenant ID, and API Key).';

  constructor(public props: Props) {
    super(props);
    this.url = props.datasource.url;
    this.historicFieldsList = new Set<string>();
    this.state = {
      metricOptions: [] as any,
    };
  }

  componentDidMount() {
    this.updateMetricsField();
  }

  async updateMetricsField() {
    this.doRequestMetrics().then(async (response) => {
      if (response.data) {
        const optionsMetric = [] as any;
        response.data.map((metric: Metric) => {
          const optionMetric: SelectableValue = { label: metric.monitoringMetricDescription, value: metric.name };
          optionsMetric.push(optionMetric);
        });
        this.setState(() => {
          return { metricOptions: optionsMetric };
        });
        setInitialMetric(optionsMetric[0]);
        await this.updateFieldsList();
      } else {
        throw new Error('No metric response from CDD server');
      }
    });
  }

  async updateFieldsList() {
    if (!this.currentMetric) {
      return;
    }
    this.doRequestFields().then((response) => {
      clearCurrentFields();
      response.data.data.map((field: CddField) => {
        setCurrentField(field.tagName, field);
      });
      const { onRunQuery } = this.props;
      onRunQuery();
    });
  }

  async doRequestMetrics() {
    try {
      const result = await getBackendSrv().datasourceRequest({
        method: 'GET',
        url: this.url + '/monitoring/metrics',
        params: { page_size: 30 },
      });
      return result;
    } catch (error) {
      console.error(this.errorMessage, error);
      throw new Error(this.errorMessage);
    }
  }

  async doRequestFields() {
    try {
      const result = await getBackendSrv().datasourceRequest({
        method: 'GET',
        url: this.url + '/monitoring/metrics/tags',
        params: { metric_name: this.currentMetric, page_size: 30 },
      });
      return result;
    } catch (error) {
      console.error(this.errorMessage, error);
      throw new Error(this.errorMessage);
    }
  }

  onQueryMetricChange = (value: SelectableValue<string>) => {
    this.currentMetric = value.value;
    const { onChange, query, onRunQuery } = this.props;
    const selectedMetric = this.getOptionQueryMetric(value.value);
    onChange({ ...query, queryMetric: selectedMetric.value });
    this.updateFieldsList();
    onRunQuery();
  };

  onPeriodChange = (value: SelectableValue<string>) => {
    const { onChange, query, onRunQuery } = this.props;
    const selectedPeriod = this.getOptionPeriod(value.value);
    onChange({ ...query, period: selectedPeriod.value });
    onRunQuery();
  };

  onGenericFieldChange = (fieldName: string, event: ChangeEvent<HTMLInputElement>) => {
    const { onChange, query, onRunQuery } = this.props;
    const savedQueryValues = { ...query };
    savedQueryValues[fieldName] = event.target.value;
    onChange(savedQueryValues);
    onRunQuery();
  };

  getOptionQueryMetric = (value: string | undefined): SelectableValue => {
    const defaultOptionMetric =
      this.state.metricOptions.length > 0
        ? this.state.metricOptions[0]
        : { label: 'Loading...', value: 'typesLoading' };
    const foundOptionType = this.state.metricOptions.find((option) => option.value === value) || defaultOptionMetric;
    return foundOptionType;
  };

  getOptionPeriod = (value: string | undefined): SelectableValue => {
    const foundOptionPeriod = optionsPeriod.find((option) => option.value === value) || optionsPeriod[0];
    return foundOptionPeriod;
  };

  getFieldValue(tagId: string) {
    return this.props.query[tagId] || '';
  }

  render() {
    const { period, queryMetric } = this.props.query;
    const queryPeriodValue = this.getOptionPeriod(period);
    const queryMetricValue = this.getOptionQueryMetric(queryMetric);
    this.currentMetric = queryMetricValue.value;

    const fieldsToRender = [] as any;
    let fields = getCurrentFields();
    fields.forEach((field: CddField, fieldName: string) => {
      fieldsToRender.push(
        <FieldCddInput
          labelWidth={20}
          value={this.getFieldValue(fieldName)}
          onChange={(e) => this.onGenericFieldChange(fieldName, e)}
          label={field.tagDisplayName}
          /*tooltip={field.tagDisplayName}*/
        />
      );
    });

    return (
      <div className="gf-form-group">
        <FieldCddSelect
          options={this.state.metricOptions}
          value={queryMetricValue}
          onChange={this.onQueryMetricChange}
          label="Query Type"
          tooltip_label="Select the tests metric to retrieve"
        />
        <FieldCddSelect
          options={optionsPeriod}
          value={queryPeriodValue}
          onChange={this.onPeriodChange}
          label="Interval"
          tooltip_label="The data will be returned grouped by the time interval"
        />
        <div>{fieldsToRender}</div>
      </div>
    );
  }
}

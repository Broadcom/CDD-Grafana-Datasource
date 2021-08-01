import React, { ChangeEvent, PureComponent } from 'react';
import { getBackendSrv, getDataSourceSrv } from '@grafana/runtime';
import { QueryEditorProps, SelectableValue } from '@grafana/data';
import { DataSource } from './datasource';
import { CddDataSourceOptions, CddQuery, pluginId, optionsPeriod, Metric, CddField, setInitialMetric } from './types';
import { FieldCddInput } from './FieldCddInput';
import { FieldCddSelect } from './FieldCddSelect';

type Props = QueryEditorProps<DataSource, CddQuery, CddDataSourceOptions>;

type CddState = {
  metricOptions: SelectableValue[];
  fieldsList: Map<string, CddField>; // <fieldId, field>
};

export class QueryEditor extends PureComponent<Props, CddState> {
  url: string = getDataSourceSrv().getInstanceSettings(pluginId)?.url + '/reportingRoute' || ''; // reportingRoute is the path in plugin.json
  currentMetric: string | undefined;
  currentFieldsList = new Map<string, CddField>();
  historicFieldsList = new Set<string>();
  errorMessage =
    'Check the connectivity to the CDD server and make sure that the CDD server configuration in Grafana is correct (URL, Tenant ID, and API Key).';

  constructor(public props: Props) {
    super(props);
    this.state = {
      metricOptions: [] as any,
      fieldsList: new Map<string, CddField>(),
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
      // create new list of current fields, add new fields to historic list
      this.currentFieldsList = new Map<string, CddField>();
      response.data.data.map((field: CddField) => {
        this.currentFieldsList.set(field.tagName, field);
        if (!this.historicFieldsList.has(field.tagName)) {
          this.historicFieldsList.add(field.tagName);
        }
      });
      const { query, onRunQuery } = this.props;
      this.clearFields(query);

      this.setState(() => {
        return { fieldsList: this.currentFieldsList };
      });
      onRunQuery();
    });
  }

  // remove fields not used in current metric
  async clearFields(query) {
    this.historicFieldsList.forEach((val, key) => {
      if (!this.currentFieldsList.has(key) && query.hasOwnProperty(key)) {
        delete query[key];
      }
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
      const errorMessage = 'Function doRequestMetrics() failed. ' + this.errorMessage;
      console.error(errorMessage, error);
      throw new Error(errorMessage);
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
      const errorMessage = 'Function doRequestFields() failed. ' + this.errorMessage;
      console.error(errorMessage, error);
      throw new Error(errorMessage);
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
    this.state.fieldsList.forEach((field: CddField, fieldName: string) => {
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

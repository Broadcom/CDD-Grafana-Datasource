import { getBackendSrv, getTemplateSrv } from '@grafana/runtime';
import {
  DataQueryRequest,
  DataQueryResponse,
  DataSourceApi,
  DataSourceInstanceSettings,
  MutableDataFrame,
  FieldType,
  DateTime,
} from '@grafana/data';
import { optionsPeriod, CddQuery, CddDataSourceOptions, getInitialMetric, getCurrentFields } from './types';

export class DataSource extends DataSourceApi<CddQuery, CddDataSourceOptions> {
  url: string;
  annotations = {};
  errorMessage =
    'Check the connectivity to the CDD server and make sure that the CDD server configuration in Grafana is correct (URL, Tenant ID, and API Key).';

  constructor(instanceSettings: DataSourceInstanceSettings<CddDataSourceOptions>) {
    super(instanceSettings);
    this.url = instanceSettings.url + '/reportingRoute'; // reportingRoute is the path in plugin.json
  }

  async doRequest(options: DataQueryRequest<CddQuery>, params) {
    let initialMetric; // for initial load of plugin after changing from another plugin
    if (!params.queryMetric) {
      await new Promise((r) => setTimeout(r, 5000)); // sleep
      initialMetric = getInitialMetric(); // for initial load of plugin after changing from another plugin
      if (initialMetric?.length !== 0) {
        initialMetric = initialMetric.value;
      } else {
        console.log('Select a Query Type.');
        throw new Error('Select a Query Type.');
      }
    }
    const fields = [] as any;
    const currentFields = getCurrentFields();
    currentFields.forEach((value, key) => {
      if (params[key] !== undefined && params[key] !== '') {
        const field = {};
        const fieldName = { tagName: key };
        field['monitoringMetricTag'] = fieldName;
        const fieldValue = getTemplateSrv().replace(params[key], options.scopedVars); // replace Grafana variable with the selected value in the UI by user (if not variable it returns the same value)
        field['tagValueName'] = fieldValue;
        fields.push(field);
      }
    });

    const body = {
      monitoringMetricName: params.queryMetric || initialMetric,
      monitoringMetricTags: fields,
    };
    const from: DateTime = options.range.from;
    const to: DateTime = options.range.to;
    const queryParams = {
      start_date: from.toDate().getTime(),
      end_date: to.toDate().getTime(),
      period: params.period || optionsPeriod[0].value,
      page_size: 30,
    };
    try {
      const result = await getBackendSrv().datasourceRequest({
        method: 'POST',
        url: this.url + '/monitoring/metrics',
        params: queryParams,
        data: body,
        responseType: 'json',
      });
      return result;
    } catch (error) {
      console.error(this.errorMessage, error);
      throw new Error(this.errorMessage);
    }
  }

  async query(options: DataQueryRequest<CddQuery>): Promise<DataQueryResponse> {
    const promises = options.targets.map((params) =>
      this.doRequest(options, params).then((response) => {
        const frame = new MutableDataFrame({
          refId: params.refId,
          fields: [
            { name: 'Time', type: FieldType.time },
            { name: 'Average', type: FieldType.number },
            { name: 'Total', type: FieldType.number },
            { name: 'Minimum', type: FieldType.number },
            { name: 'Maximum', type: FieldType.number },
            { name: 'Last Value', type: FieldType.number },
          ],
        });
        if (response.data?.data?.length > 0) {
          const data = response.data.data[0].monitoringMetricValues;
          data.map((point: any) =>
            frame.appendRow([
              point['monitoringDate'],
              point['averageMetricValue'],
              point['totalMetricValue'],
              point['minimumMetricValue'],
              point['maximumMetricValue'],
              point['lastMetricValue'],
            ])
          );
        }
        return frame;
      })
    );
    return Promise.all(promises).then((data) => ({ data }));
  }

  async doRequestTest() {
    try {
      const result = await getBackendSrv().datasourceRequest({
        method: 'GET',
        url: this.url + '/monitoring/metrics',
      });
      return result;
    } catch (error) {
      const errorMessage = 'Connection test failed. ' + this.errorMessage;
      console.error(errorMessage, error);
      throw new Error(this.errorMessage);
    }
  }

  async testDatasource() {
    return this.doRequestTest().then((response) => {
      if (response?.status !== 200) {
        throw new Error(this.errorMessage);
      }
      return {
        status: 'success',
        message: 'Success',
      };
    });
  }
}

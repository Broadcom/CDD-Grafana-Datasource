import { DataQuery, DataSourceJsonData, SelectableValue } from '@grafana/data';

/**
 * CONSTANTS
 */

export const pluginId = 'Continuous Delivery Director';

export const optionsPeriod: Array<SelectableValue<string>> = [];
const optionPeriod1: SelectableValue = { label: 'Minute', value: 'MINUTE' };
const optionPeriod2: SelectableValue = { label: 'Hour', value: 'HOUR' };
const optionPeriod3: SelectableValue = { label: 'Day', value: 'DAY' };
const optionPeriod4: SelectableValue = { label: 'Week', value: 'WEEK' };
const optionPeriod5: SelectableValue = { label: 'Month', value: 'MONTH' };
const optionPeriod6: SelectableValue = { label: 'Year', value: 'YEAR' };
optionsPeriod.push(optionPeriod1);
optionsPeriod.push(optionPeriod2);
optionsPeriod.push(optionPeriod3);
optionsPeriod.push(optionPeriod4);
optionsPeriod.push(optionPeriod5);
optionsPeriod.push(optionPeriod6);

export const grafanaQueryBuiltInFields = new Set<string>();
grafanaQueryBuiltInFields.add('datasource');
grafanaQueryBuiltInFields.add('hide');
grafanaQueryBuiltInFields.add('period');
grafanaQueryBuiltInFields.add('queryMetric');
grafanaQueryBuiltInFields.add('queryType');
grafanaQueryBuiltInFields.add('refId');

let initialMetric = [] as any;
export function setInitialMetric(metric: string) {
  initialMetric = metric;
}
export function getInitialMetric() {
  return initialMetric;
}

/**
 * FOR QUERY EDITOR
 */

export interface BasicCddDataQuery extends DataQuery {
  start_date?: string;
  end_date?: string;
  page_size?: string;
  page_number?: string;
}

export interface FieldsQuery extends BasicCddDataQuery {
  metric_name?: string;
  filter?: string;
}

export interface Metric {
  name?: string;
  monitoringMetricDescription?: string;
  monitoringMetricCategory?: string;
  className?: string;
}

export interface CddField {
  id: string;
  tagName: string;
  tagDisplayName: string;
  className?: string;
}

export interface FieldsList {
  aaa: string;
  bbb: string;
}

export interface CddQuery extends DataQuery {
  queryMetric: string;
  period: string;
}

/**
 * FOR CONFIG EDITOR
 */

/**
 * These are options configured for each DataSource instance
 */
export interface CddDataSourceOptions extends DataSourceJsonData {
  serverURL?: string;
  tenantId?: string;
}

/**
 * Value that is used in the backend, but never sent over HTTP to the frontend
 */
export interface MySecureJsonData {
  apiKey?: string;
}

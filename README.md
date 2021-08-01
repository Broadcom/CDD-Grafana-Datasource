![CA a Broadcom Company](https://cddirector.io/cdd/assets/images/broadcom-ca-logo.png)


# Continuous Delivery Director Data Source

This is a Grafana data source for fetching metrics from Continuous Delivery Director (CDD).


## Requirements
- Grafana 7.3.1+
- CDD v8.3+ / CDD SaaS license/subscription


## Features
-	Supports queries to fetch metrics data
- Utilizes CDD REST APIs
- Secured authentication through CDD API keys


## Configuration

This data source uses CDD REST APIs to query the underlying data services.

To configure a CDD data source:
1. Open your CDD instance.
2. On the menu bar, click the initials of your user account, for example, SU, then click My Settings, General.
3. Copy the API key and tenant ID that are used to authenticate user access to CDD REST APIs.
4. In Grafana, on the CDD data source settings page, paste the CDD API key and tenant ID.

![screenshot datasource editor](https://github.gwd.broadcom.net/ESD/cdd-grafana-plugin/blob/master/readme_images/screenshot_datasource_editor.png)


# Usage

## Query Types
The following query types are available:

- Total number of successful test suites
- Total number of failed test suites
- Total number of error test suites
- Total number of skipped test suites
- Total number of disabled test suites
- Execution duration


## Query Editor

This section describes the query editor.

## Metrics

The following image displays the Total number of test suites query type:

![screenshot query editor](https://github.gwd.broadcom.net/ESD/cdd-grafana-plugin/blob/master/readme_images/screenshot_query_editor.png)

 
This query type requires the following data:

| Field  | Description |
| ------------- | ------------- |
| Query Type  | Use this field to select the query type. You can select any of the query types described above.  |
| Interval  | Select one of the following time series for viewing and displaying data: Daily; Weekly; Monthly. The data returned is grouped by the selected interval. For example, if you select the time range Last 1 year, and a daily interval, you'll get 365 data points with daily measurements. If you select a monthly interval, you'll get 12 data points with monthly measurements.  |
| Filter  | Restrict the data displayed in the chart by defining filters. You can specify values for the following filters: Project; Plugin; Application; Application Version; Business Application; Business Application Version; Environment; Release; Phase; Task. The more filters you define, the more granular your data will be. For example, let's say you specify the Total number of failed test suites query type and a Daily interval. If you only specify the project name, you'll get a daily total of the failed test suites for the specified project. If you specify the project and an application, you'll get a daily total of the failed test suites for the specific application in the specified project. If you specify the project, an application, and an environment, you'll get a daily total of the failed test suites for the specific application and environment in the specified project.  |

## Data Points

You can display up to a maximum of 768 data points in a chart. The number of points is limited to improve performance and optimize the display.

If your query returns more data points than the maximum data points setting, then the data source consolidates those data points (reduces the number of points returned by aggregating the points together by average or max or another function).




 

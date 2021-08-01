![CA a Broadcom Company](https://cddirector.io/cdd/assets/images/broadcom-ca-logo.png)


# Grafana Data Source Plugin for Continuous Delivery Director

Monitor your release pipeline with Grafana data visualization and analytics software.

If your organization uses Grafana, you can utilize the Continuous Delivery Director Data Source plug-in to query and visualize your adaptive testing metrics. You can download the plug-in from the Grafana community, and add that plug-in as a data source in your company Grafana instance.

The Continuous Delivery Director data source provides the connection between the Continuous Delivery Director database and the underlying data set. This data source uses Continuous Delivery Director REST APIs to query the underlying data services. You can extract data as metrics using query types.

In Grafana, you can configure dashboards, panels, and queries to gain insight into your data. You can also configure time ranges for the data. For example, you can create a dashboard to view the successful and unsuccessful test suites executions in a specific release pipeline for every hour in the last seven days.


## The plug-in supports the following query types:
-	Total number of test suites
-	Total number of successful test suites
-	Total number of failed test suites
-	Total number of error test suites
-	Total number of skipped test suites
-	Total number of disabled test suites
-	Execution duration


Grafana provides many data visualization options, such as time series, tables, bar charts, and pie charts. Time series charts are especially usual for displaying trends in a release pipeline. Time series are returned through queries. A time- series chart displays the time units as the X-axis (horizontal axis), and the units of measure as the Y-axis (vertical axis). The individual metrics appear as a series of data points between the two axes. You can display up to a maximum of 768 data points in a chart. The number of points is limited to improve performance and optimize the display.

If your query returns more data points than the maximum data points setting, then the data source consolidates those data points (reduces the number of points returned by aggregating the points together by average or max or another function).

You can display your data according to the following intervals: Daily, Weekly, Monthly. Intervals control how your data is grouped in the data visualization. For example, if you select the time range Last 1 year, and a Daily interval, you'll get 365 data points with daily measurements. If you select a Monthly interval, you'll get 12 data points with monthly measurements.

You can also restrict the data displayed in the chart by defining filters. You can specify values for the following filters: Project (mandatory); Plugin; Application; Application Version; Business Application; Business Application Version; Environment; Release; Phase; Task.

The more filters you define, the more granular your data will be. For example, let's say you specify the Total number of failed test suites query type and a Daily interval.

-	If you only specify the project name, you'll get a daily total of the failed test suites for the specified project.
-	If you specify the project and an application, you'll get a daily total of the failed test suites for the specific application in the specified project.
-	If you specify the project, an application, and an environment, you'll get a daily total of the failed test suites for the specific application and environment in the specified project.


## Configure Plug-in for Grafana


Add this plug-in to your Grafana instance to visualize Continuous Delivery Director data metrics.
-	Continuous Delivery Director 8.2 or higher / Continuous Delivery Director SaaS
-	Grafana 7.3.1 or higher
-	Familiarity with Grafana

This data source plug-in uses Continuous Delivery Director REST APIs to query the underlying data services.
1.	Log in to Continuous Delivery Director.
2.	On the menu bar, click the initials of your user account, for example, SU.
3.	Click My Settings, then General.
4.	Copy the API key and tenant ID.
These credentials are used to authenticate user access to Continuous Delivery Director REST APIs.
5.	In Grafana, on the Continuous Delivery Director data source settings page, paste the Continuous Delivery Director API key and tenant ID and save.

You can now configure dashboards and panels in Grafana to display Continuous Delivery Director data metrics.

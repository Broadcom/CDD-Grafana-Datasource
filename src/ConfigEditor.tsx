import React, { ChangeEvent, PureComponent } from 'react';
import { LegacyForms } from '@grafana/ui';
import { DataSourcePluginOptionsEditorProps } from '@grafana/data';
import { CddDataSourceOptions, MySecureJsonData } from './types';

const { SecretFormField, FormField } = LegacyForms;

interface Props extends DataSourcePluginOptionsEditorProps<CddDataSourceOptions> {}

interface State {}

export class ConfigEditor extends PureComponent<Props, State> {
  onServerURLChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { onOptionsChange, options } = this.props;
    const jsonData = {
      ...options.jsonData,
      serverURL: event.target.value,
    };
    onOptionsChange({ ...options, jsonData });
  };

  onTenantIdChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { onOptionsChange, options } = this.props;
    const jsonData = {
      ...options.jsonData,
      tenantId: event.target.value,
    };
    onOptionsChange({ ...options, jsonData });
  };

  // Secure field (only sent to the backend)
  onAPIKeyChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { onOptionsChange, options } = this.props;
    onOptionsChange({
      ...options,
      secureJsonData: {
        apiKey: event.target.value,
      },
    });
  };

  onResetAPIKey = () => {
    const { onOptionsChange, options } = this.props;
    onOptionsChange({
      ...options,
      secureJsonFields: {
        ...options.secureJsonFields,
        apiKey: false,
      },
      secureJsonData: {
        ...options.secureJsonData,
        apiKey: '',
      },
    });
  };

  render() {
    const { options } = this.props;
    const { jsonData, secureJsonFields } = options;
    const secureJsonData = (options.secureJsonData || {}) as MySecureJsonData;

    return (
      <div className="gf-form-group">
        <div className="gf-form">
          <FormField
            label="CDD Server URL"
            tooltip="Specify the server URL, for example, https://myserver.acme.com:8080. For SaaS use the URL https://cddirector.io/cdd"
            labelWidth={10}
            inputWidth={25}
            onChange={this.onServerURLChange}
            value={jsonData.serverURL || ''}
            placeholder="https://myserver.acme.com:8080"
          />
        </div>
        <div className="gf-form">
          <FormField
            label="Tenant ID"
            tooltip="For an on-prem install of Continuous Delivery Director, the tenant ID is 00000000-0000-0000-0000-000000000000. For Continuous Delivery Director SaaS, you can find the tenant ID under User Settings."
            labelWidth={10}
            inputWidth={25}
            onChange={this.onTenantIdChange}
            value={jsonData.tenantId || ''}
            placeholder="00000000-0000-0000-0000-000000000000"
          />
        </div>
        <div className="gf-form-inline">
          <div className="gf-form">
            <SecretFormField
              isConfigured={(secureJsonFields && secureJsonFields.apiKey) as boolean}
              value={secureJsonData.apiKey || ''}
              label="API Key"
              tooltip="Specify the CDD user API key"
              placeholder="API Key"
              labelWidth={10}
              inputWidth={20}
              onReset={this.onResetAPIKey}
              onChange={this.onAPIKeyChange}
            />
          </div>
        </div>
      </div>
    );
  }
}

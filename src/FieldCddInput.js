import React from 'react';

import { LegacyForms } from '@grafana/ui';
const { FormField } = LegacyForms;

export class FieldCddInput extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="gf-form">
        <FormField
          labelWidth={13}
          value={this.props.value || ''}
          onChange={this.props.onChange}
          label={this.props.label}
          tooltip={this.props.tooltip}
        />
      </div>
    );
  }
}

import React from 'react';
import { Icon, Select, Tooltip } from '@grafana/ui';

export class FieldCddSelect extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const cursorStyle = { cursor: 'default' };
    const tooltipIconStyle = { color: 'rgba(36,41,46,.75)', width: '14px', height: '14px' };
    return (
      <div className="gf-form">
        <span className="gf-form-label width-13" style={cursorStyle}>
          {this.props.label}
          <Tooltip content={this.props.tooltip_label} theme={'info'} placement={'top'}>
            <Icon name="info-circle" style={tooltipIconStyle} />
          </Tooltip>
        </span>
        <Select width={36} options={this.props.options} value={this.props.value} onChange={this.props.onChange} />
      </div>
    );
  }
}

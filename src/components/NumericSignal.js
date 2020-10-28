import React, { Component } from 'react';

class NumericSignal extends React.Component {
  renderBioSignalValue() {
    return (
      this.props.bioSignalValueAddOn
        ? this.props.bioSignalValue + " / " + this.props.bioSignalValueAddOn
        : this.props.bioSignalValue
    );
  }

  render() {
    return (
      <div className={this.props.className + ' ' + (this.props.warning ? 'red' : '')}>
        <p className="bioSignalType"> {this.props.bioSignalType} </p>
        <p className="bioSignalValue"> {this.renderBioSignalValue()}</p>
      </div>
    );
  }
}

export default NumericSignal;

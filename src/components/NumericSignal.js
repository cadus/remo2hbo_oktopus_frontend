import React, { Component } from 'react';

class NumericSignal extends React.Component {



    render() {
      console.log(this.props.bioSignalValue);
      if (this.props.bioSignalType == "RR"){
        return (
        <div class={this.props.warning ? 'red' : ''}>
          <p className="bioSignalType"> {this.props.bioSignalType} </p>
          <p className="bioSignalValue"> {this.props.bioSignalValue} / {this.props.bioSignalValueAddOn}</p>
        </div>
        );
      } else {
        return (
        <div class={this.props.warning ? 'red' : ''}>
          <p className="bioSignalType"> {this.props.bioSignalType} </p>
          <p className="bioSignalValue"> {this.props.bioSignalValue} </p>
        </div>
        );
      }

    }
  }
  export default NumericSignal;

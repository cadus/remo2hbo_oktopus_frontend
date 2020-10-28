import React, { Component } from 'react';
import NumericSignal from '../components/NumericSignal'
import GraphSignal from '../components/GraphSignal';
import contrastIcon from '../images/contrastIcon.png';
const EVENT_STREAM_ADDRESS = "http://localhost:5000/events"; //    http://141.45.146.235:8200

class MonitorView extends Component {
  constructor(props) {
    super(props);
    this.evtSource = new EventSource(EVENT_STREAM_ADDRESS);
    this.state = {
      connection: "not connected",
      ekg: { min: 20, max: 80, current: 0 },
      pulse: { min: 20, max: 80, current: 0 },
      temperature: { min: 20, max: 80, current: 0 },
      oxygen: { min: 20, max: 80, current: 0 },
      heartrate: { min: 20, max: 80, current: 0 },
      systole: { min: 20, max: 80, current: 0 },
      diastole: { min: 20, max: 80, current: 0 },
    };
  }

  componentDidMount() {
  var that = this;

  this.evtSource.onerror = function (e) {
    console.log("error: ", e);
    that.setState(Object.assign({}, { connection: "error" }));
  };

  this.evtSource.onopen = function (e) {
    console.log("open: ", e);
    while(e.srcElement.readyState == 0) {
      console.log("connecting...");
      that.setState(Object.assign({}, { connection: "connecting..." }));
    }
    that.setState(Object.assign({}, { connection: "connected" }));
  };

  this.evtSource.close = function (e) {
    console.log("close: ",this.evtSource.readyState);
    that.setState(Object.assign({}, { connection: "not connected" }));
  };

  this.subscribeSSE("ekg");
  this.subscribeSSE("pulse");
  this.subscribeSSE("temperature");
  this.subscribeSSE("heartrate");
  this.subscribeSSE("oxygen");
  this.subscribeSSE("diastole");
  this.subscribeSSE("systole");
}

// This function subscribes a server side event for each vital sign to which it is applied:
  subscribeSSE(vitalSign) {
    var that = this;
    this.evtSource.addEventListener(vitalSign, function (e) {
      that.setState({[vitalSign]: Object.assign({...that.state[vitalSign]}, {current: e.data})});
    }, false);
  }

  componentDidUpdate() {
    if(this.state.readyState == 0){
      this.setState(Object.assign({}, { connection: "connecting..." }));
    }
    if(this.state.readyState == 1){
      this.setState(Object.assign({}, { connection: "connected" }));
    }
    if(this.state.readyState == 2){
      this.setState(Object.assign({}, { connection: "closed" }));
    }
  }

  isCritical(vitalSign) {
    return this.state[vitalSign].current < this.state[vitalSign].min ||
      this.state[vitalSign].current > this.state[vitalSign].max;
  }

  render() {
    return (
      <div className="app-container">
        <div id="grid-container">
            <GraphSignal
              className="biosignal-EKG"
              bioSignalType="EKG"
              warning={this.isCritical('ekg')}
              bioSignalValue={this.state.ekg.current}
              color='green'
              valueRangeMin={-10} valueRangeMax={600} />

            <GraphSignal
              className="biosignal-HR-Graph"
              bioSignalType="Pulse"
              warning={this.isCritical('pulse')}
              bioSignalValue={this.state.pulse.current}
              color='lightblue'
              valueRangeMin={0} valueRangeMax={800}/>

            <GraphSignal
              className="biosignal-placeholder-Graph"
              bioSignalType="EKG"
              warning={this.isCritical('ekg')}
              bioSignalValue={this.state.ekg.current}
              color='orange'
              valueRangeMin={-10} valueRangeMax={600} />

            <NumericSignal
              bioSignalType="Temp °C"
              warning={this.isCritical('temperature')}
              bioSignalValue={this.state.temperature.current}
              color='blue'
              className="biosignal-Temp" />

            <NumericSignal
              bioSignalType="HR / min"
              warning={this.isCritical('heartrate')}
              bioSignalValue={this.state.heartrate.current}
              color='red'
              className="biosignal-HR" />

            <NumericSignal
              bioSignalType="spO2 %"
              warning={this.isCritical('oxygen')}
              bioSignalValue={this.state.oxygen.current}
              color='purple'
              className="biosignal-sO2"/>

            <NumericSignal
              bioSignalType="Sys / Dia mmHG"
              warning={this.isCritical('diastole') || this.isCritical('systole')}
              bioSignalValue={this.state.diastole.current} bioSignalValueAddOn={this.state.systole.current}
              color='magenta'
              className="biosignal-RR"/>
        </div>

        <div id="footer">connection status: {this.state.connection}.</div>
      </div>
    );
  }
}

export default MonitorView;

import React, { Component } from 'react';
import './App.css';
import NumericSignal from '../components/NumericSignal'
//import TestGraph from '../components/TestGraph';
import GraphSignal from '../components/GraphSignal';
import ContrastSwitch from '../utils/ContrastSwitch';

class App extends Component {

    constructor(props) {
      super(props);
      this.evtSource = new EventSource("http://141.45.146.235:8200");
      this.state = {
        readyState: "bla",
        connection: "not connected",
        ekg: 0,
        pulse: 0,
        temperature: "no signal",
        oxygen: "no signal",
        heartrate: "no signal",
        systole: "no signal",
        diastole: "no signal",
      };
      this.ekgData = [];
    }
  
    componentDidMount() {
      var that = this;
      
      this.evtSource.onerror = function (e) {
        that.setState(Object.assign({}, { connection: "error" }));
      };

      this.evtSource.onopen = function (e) {
        console.log(e);
        that.setState(Object.assign({}, { connection: "connected" }));
      };

      this.evtSource.close = function (e) {
        console.log(this.evtSource.readyState);
        that.setState(Object.assign({}, { connection: "not connected" }));
      };

        this.evtSource.addEventListener("ekg", function (e) {
        that.setState(Object.assign({}, { "ekg": e.data}));
        that.ekgData.push(e.data);
        console.log("EKG-LENGTH: ", that.ekgData.length);
      }, false);

      this.evtSource.addEventListener("pulse", function (e) {
        that.setState(Object.assign({}, { "pulse": e.data}));
      }, false);

      this.evtSource.addEventListener("temperature", function (e) {
        that.setState(Object.assign({}, { "temperature": e.data}));
      }, false);

      this.evtSource.addEventListener("heartrate", function (e) {
        that.setState(Object.assign({}, { "heartrate": e.data}));
      }, false);

      this.evtSource.addEventListener("oxygen", function (e) {
        that.setState(Object.assign({}, { "oxygen": e.data}));
      }, false);

      this.evtSource.addEventListener("diastole", function (e) {
        that.setState(Object.assign({}, { "diastole": e.data}));
      }, false);

      this.evtSource.addEventListener("systole", function (e) {
        that.setState(Object.assign({}, { "systole": e.data}));
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

    render() {

      return (
        <div className="app-container">
          <div id="header">
            OKTOPUS BIOSIGNAL MONITORING
            <ContrastSwitch/>
          </div>

          <div id="grid-container">

            {/* //TODO: ANPASSEN VON GRAPH AN ECHTES SIGNAL*/}
          {/* 
            <div className="biosignal-EKG"><TestGraph/></div>
            <div className="biosignal-HR-Graph"><TestGraph/></div>
            <div className="biosignal-Test-Graph"><TestGraph/></div>
    */}

    
            <div className="biosignal-EKG">
              <GraphSignal bioSignalType="EKG" bioSignalValue={this.state.ekg} valueRangeMin={-10} valueRangeMax={600} />
            </div>
            <div className="biosignal-HR-Graph">
              <GraphSignal bioSignalType="Pulse" bioSignalValue={this.state.pulse} valueRangeMin={250} valueRangeMax={800}/>
            </div>
            <div className="biosignal-Test-Graph">
              <GraphSignal bioSignalType="EKG" bioSignalValue={this.state.ekg} valueRangeMin={-10} valueRangeMax={600} />
            </div>
          
            

            <div className="biosignal-Temp"> 
              <NumericSignal bioSignalType="°C" bioSignalValue={this.state.temperature} /> 
            </div>
            <div className="biosignal-HR" >
              <NumericSignal bioSignalType="HR" bioSignalValue={this.state.heartrate} />
            </div>
            <div className="biosignal-sO2"  >
              <NumericSignal bioSignalType="sO2" bioSignalValue={this.state.oxygen} />
            </div>
            <div  className="biosignal-RR"> 
              <NumericSignal bioSignalType="RR" bioSignalValue={this.state.diastole} bioSignalValueAddOn={this.state.systole} /> 
            </div>

          </div>

          <div id="footer">status: {this.state.connection}.</div>
        </div>
      );
    }
  }

  export default App;


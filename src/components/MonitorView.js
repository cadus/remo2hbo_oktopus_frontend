import React, { useState, useEffect } from 'react';
import NumericSignal from '../components/NumericSignal'
import GraphSignal from '../components/GraphSignal';
import contrastIcon from '../images/contrastIcon.png';
const { ipcRenderer } = require('electron');

export default ({ color, className, bioSignalValue, bioSignalType, bioSignalValueAddOn, warning }) => {
  const initialValues = {
    ECG0:     { current: 0,  frequency: 500, range: [3, 5] },
    ECG1:     { current: 0,  frequency: 500, range: [0, 2] },
    ECG2:     { current: 0,  frequency: 500, range: [0, 1] },
    pulse:    { current: 0,  frequency: 50,  range: [-2, 2] },
    BP:       { current: 0,  frequency: 5,   range: [0, 0.1] },
    spo2:     { current: 0,  frequency: 50,  range:  [95, 100] },
    temp:     { current: 37, frequency: 1000, range: [0, 1] },
    diastole: { current: 0,  frequency: 1000, range: [0, 1] },
    systole:  { current: 0,  frequency: 1000, range: [0, 1] },
  }
  const [signals, setSignals] = useState(initialValues);

  useEffect(() => {
    Object.keys(initialValues).forEach((signalName) => {
      ipcRenderer.on(signalName, (event, data) => {
        setSignals(prevState => {
          return { ...prevState, [signalName]: { ...prevState[signalName], current: data.toFixed(2) } }
        });
      });
    });
  }, [])

  // function isCritical(vitalSign) {
  //   return signals[vitalSign].current < signals[vitalSign].min ||
  //     signals[vitalSign].current > signals[vitalSign].max;
  // }

  return (
    <div className="app-container">
      <div id="grid-container">
          <GraphSignal className="signal-ecg-0-graph" color={[0, 255, 0]}
                       data={signals['ECG0']} label="ECG0" />

          <GraphSignal className="signal-ecg-1-graph" color={[0, 255, 0]}
                       data={signals['ECG1']} label="ECG1" />

          <GraphSignal className="signal-spo2-graph" color={[255, 0, 255]}
                       data={signals['spo2']} label="spO2" />

          <GraphSignal className="signal-pulse-graph" color={[255, 0, 0]}
                       data={signals['pulse']} label="pulse" />


          <NumericSignal className="signal-ecg-0" color='green' fontSize='6em'
                         data={signals['ECG0']} label="ECG0" />

          <NumericSignal className="signal-ecg-1" color='green' fontSize='6em'
                         data={signals['ECG1']} label="ECG1" />

          <NumericSignal className="signal-pulse" color='red' fontSize='4em'
                         data={signals['pulse']} label="pulse" />

          <NumericSignal className="signal-bp" color='red' fontSize='3em'
                         data={signals['BP']} label="BP" />

          <NumericSignal className="signal-spo2" color='fuchsia' fontSize='4em'
                         data={signals['spo2']} label="spO2" />

          <NumericSignal className="signal-temp" color='white' fontSize='4em'
                         data={signals['temp']} label="Temp" />

          <NumericSignal className="signal-time" color='grey' fontSize='2em'
                         data={{ current: new Date().toLocaleString() }} label="Time" />
      </div>
    </div>
  );
}

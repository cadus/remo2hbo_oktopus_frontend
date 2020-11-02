import React, { useState, useEffect } from 'react';
import NumericSignal from '../components/NumericSignal'
import GraphSignal from '../components/GraphSignal';
import contrastIcon from '../images/contrastIcon.png';

export default ({ color, className, bioSignalValue, bioSignalType, bioSignalValueAddOn, warning }) => {
  const [signals, setSignals] = useState(
    {
      ekg: { min: 0.10, max: 0.90, current: 0 },
      pulse: { min: 0.10, max: 0.90, current: 0 },
      temperature: { min: 0.10, max: 0.90, current: 0 },
      oxygen: { min: 0.10, max: 0.90, current: 0 },
      diastole: { min: 0.30, max: 0.70, current: 0 },
      systole: { min: 0.10, max: 0.90, current: 0 },
    }
  );
  const [connection, setConnection] = useState('not connected');

  useEffect(() => {
    /** Add IPC event listener */
    const { ipcRenderer } = require('electron');

    ['ekg', 'pulse', 'oxygen'].forEach((signalName) => {
      ipcRenderer.on(signalName, (event, data) => {
        setSignals(prevState => {
          return { ...prevState, [signalName]: { ...prevState[signalName], current: data } }
        });
      });
    });
  }, [])

  function isCritical(vitalSign) {
    return signals[vitalSign].current < signals[vitalSign].min ||
      signals[vitalSign].current > signals[vitalSign].max;
  }

  return (
    <div className="app-container">
      <div id="grid-container">
          <GraphSignal
            className="signal-ekg-1-graph"
            bioSignalType="ekg"
            warning={isCritical('ekg')}
            bioSignalValue={signals['ekg'].current}
            color={[255, 0, 255]}
            valueRangeMin={-10} valueRangeMax={200} />

          <GraphSignal
            className="signal-ekg-2-graph"
            bioSignalType="ekg"
            warning={isCritical('ekg')}
            bioSignalValue={signals['ekg'].current}
            color={[255, 255, 0]}
            valueRangeMin={-10} valueRangeMax={200} />

          <GraphSignal
            className="signal-oxygen-graph"
            bioSignalType="oxygen"
            warning={isCritical('oxygen')}
            bioSignalValue={signals['oxygen'].current}
            color={[255, 255, 255]}
            valueRangeMin={-10} valueRangeMax={300} />

          <GraphSignal
            className="signal-pulse-graph"
            bioSignalType="pulse"
            warning={isCritical('pulse')}
            bioSignalValue={signals['pulse'].current}
            color={[0, 255, 255]}
            valueRangeMin={0} valueRangeMax={100}/>

          <NumericSignal
            bioSignalType="EKG"
            warning={isCritical('ekg')}
            bioSignalValue={signals['ekg'].current}
            color='green' fontSize='5em'
            className="signal-ekg-1" />

          <NumericSignal
            bioSignalType="HR/min"
            warning={isCritical('pulse')}
            bioSignalValue={signals['pulse'].current}
            color='red' fontSize='4em'
            className="signal-pulse" />

          <NumericSignal
            bioSignalType="Sys/Dia mmHG"
            warning={isCritical('diastole') || isCritical('systole')}
            bioSignalValue={signals['diastole'].current} bioSignalValueAddOn={signals['systole'].current}
            color='red' fontSize='2em'
            className="signal-rr"/>

          <NumericSignal
            bioSignalType="spO2 %"
            warning={isCritical('oxygen')}
            bioSignalValue={signals['oxygen'].current}
            color='turquoise' fontSize='4em'
            className="signal-oxygen"/>

          <NumericSignal
            bioSignalType="Temp °C"
            warning={isCritical('temperature')}
            bioSignalValue={signals['temperature'].current}
            color='white' fontSize='4em'
            className="signal-temp"/>

          {/* PLACEHOLDERS */}
          <NumericSignal
            bioSignalType="Placeholder A"
            bioSignalValue={123}
            color='grey' fontSize='2em'
            className="signal-placeholder-a"/>

          <NumericSignal
            bioSignalType="Placeholder B"
            bioSignalValue={42}
            color='grey' fontSize='2em'
            className="signal-placeholder-b"/>

          <NumericSignal
            bioSignalType="Placeholder C"
            bioSignalValue={33}
            color='grey' fontSize='2em'
            className="signal-placeholder-c"/>
      </div>

      <div id="footer">connection status: {connection}.</div>
    </div>
  );
}

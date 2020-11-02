import React, { useState, useEffect } from 'react';
import NumericSignal from '../components/NumericSignal'
import GraphSignal from '../components/GraphSignal';
import contrastIcon from '../images/contrastIcon.png';
const EVENT_STREAM_ADDRESS = "http://localhost:5000/events"; //    http://141.45.146.235:8200

export default ({ color, className, bioSignalValue, bioSignalType, bioSignalValueAddOn, warning }) => {
  const evtSource = new EventSource(EVENT_STREAM_ADDRESS);
  const [signals, setSignals] = useState(
    {
      ekg: { min: 10, max: 90, current: 0 },
      pulse: { min: 10, max: 90, current: 0 },
      temperature: { min: 10, max: 90, current: 0 },
      oxygen: { min: 10, max: 90, current: 0 },
      systole: { min: 10, max: 90, current: 0 },
      diastole: { min: 30, max: 70, current: 0 },
    }
  );
  const [connection, setConnection] = useState('not connected');

  useEffect(() => {
    evtSource.onerror = function (e) {
      setConnection("error");
    };

    evtSource.onopen = function (e) {
      setConnection("connected");
    };

    evtSource.close = function (e) {
      setConnection("not connected");
    };

    subscribeSSE("ekg");
    subscribeSSE("pulse");
    subscribeSSE("temperature");
    subscribeSSE("oxygen");
    subscribeSSE("diastole");
    subscribeSSE("systole");
  }, [])

  function subscribeSSE(vitalSign) {
    evtSource.addEventListener(vitalSign, function (e) {
      setSignals(prevState => {
        return { ...prevState, [vitalSign]: { ...prevState[vitalSign], current: e.data } }
      });
    }, false);
  }

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

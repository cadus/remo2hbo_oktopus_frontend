import React, { useState, useEffect } from 'react';
import NumericSignal from '../components/NumericSignal'
import GraphSignal from '../components/GraphSignal';
import contrastIcon from '../images/contrastIcon.png';
const EVENT_STREAM_ADDRESS = "http://localhost:5000/events"; //    http://141.45.146.235:8200

export default ({ color, className, bioSignalValue, bioSignalType, bioSignalValueAddOn, warning }) => {
  const evtSource = new EventSource(EVENT_STREAM_ADDRESS);
  const [signals, setSignals] = useState(
    {
      ekg: { min: 20, max: 80, current: 0 },
      pulse: { min: 20, max: 80, current: 0 },
      temperature: { min: 20, max: 80, current: 0 },
      oxygen: { min: 20, max: 80, current: 0 },
      heartrate: { min: 20, max: 80, current: 0 },
      systole: { min: 20, max: 80, current: 0 },
      diastole: { min: 20, max: 80, current: 0 },
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
    subscribeSSE("heartrate");
    subscribeSSE("oxygen");
    subscribeSSE("diastole");
    subscribeSSE("systole");
  }, [])

  function subscribeSSE(vitalSign) {
    evtSource.addEventListener(vitalSign, function (e) {
      setSignals(prevState => ({ ...prevState, [vitalSign]: {current: e.data} }));
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
            className="biosignal-EKG"
            bioSignalType="EKG"
            warning={isCritical('ekg')}
            bioSignalValue={signals['ekg'].current}
            color='green'
            valueRangeMin={-10} valueRangeMax={600} />

          <GraphSignal
            className="biosignal-HR-Graph"
            bioSignalType="Pulse"
            warning={isCritical('pulse')}
            bioSignalValue={signals['pulse'].current}
            color='lightblue'
            valueRangeMin={0} valueRangeMax={800}/>

          <GraphSignal
            className="biosignal-placeholder-Graph"
            bioSignalType="EKG"
            warning={isCritical('ekg')}
            bioSignalValue={signals['ekg'].current}
            color='orange'
            valueRangeMin={-10} valueRangeMax={600} />

          <NumericSignal
            bioSignalType="Temp °C"
            warning={isCritical('temperature')}
            bioSignalValue={signals['temperature'].current}
            color='blue'
            className="biosignal-Temp" />

          <NumericSignal
            bioSignalType="HR / min"
            warning={isCritical('heartrate')}
            bioSignalValue={signals['heartrate'].current}
            color='red'
            className="biosignal-HR" />

          <NumericSignal
            bioSignalType="spO2 %"
            warning={isCritical('oxygen')}
            bioSignalValue={signals['oxygen'].current}
            color='purple'
            className="biosignal-sO2"/>

          <NumericSignal
            bioSignalType="Sys / Dia mmHG"
            warning={isCritical('diastole') || isCritical('systole')}
            bioSignalValue={signals['diastole'].current} bioSignalValueAddOn={signals['systole'].current}
            color='magenta'
            className="biosignal-RR"/>
      </div>

      <div id="footer">connection status: {connection}.</div>
    </div>
  );
}

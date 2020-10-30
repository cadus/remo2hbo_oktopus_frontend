import { ResponsiveContainer, LineChart, Line, YAxis, CartesianGrid } from "recharts";
import React, { useState, useEffect, useRef } from 'react';


export default ({ valueRangeMin, valueRangeMax, color, className, bioSignalValue, bioSignalType, warning }) => {
  const [data, setData] = useState(initalValues);

  useEffect(() => {
    saveSignal();
  }, [bioSignalValue]);

  function initalValues() {
    // build an array with 0 values
    let array = [];
    for (let i = 0; i < 20; i++) {
      array.push({ name: bioSignalType, value: 0 })
    }
    return array;
  }

  function saveSignal() {
    setData(prevState => {
      let newArray = prevState.concat([{ name: bioSignalType, value: bioSignalValue }])
      newArray.shift();
      return newArray;
    });
  }

  return (
    <div className={className + ' ' + (warning ? 'warning-border' : '')} style={{ color: color }}>
      <span>{bioSignalType}</span>
      <ResponsiveContainer width='100%' height='100%'>
        <LineChart
          margin={{ top: 5, right: 20, left: -20, bottom: 20 }}
          data={data}
        >
          <YAxis domain={[valueRangeMin, valueRangeMax]} />
          <CartesianGrid stroke="rgb(150, 150, 150, 0.2)" />
          <Line
            dataKey="value"
            strokeWidth={3}
            isAnimationActive={false}
            type="monotone"
            stroke={color}
            dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

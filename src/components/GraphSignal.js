import { ResponsiveContainer, LineChart, Line, YAxis, XAxis } from "recharts";
import React, { useState, useEffect, useRef } from 'react';


export default ({ valueRangeMin, valueRangeMax, color, className, bioSignalValue, bioSignalType, warning }) => {
  const [data, setData] = useState(
    [
      {
        "name": "Page A",
        "pulse": 100,
      },
      {
        "name": "Page A",
        "pulse": 80,
      },
      {
        "name": "Page A",
        "pulse": 120,
      },
      {
        "name": "Page A",
        "pulse": 100,
      },
      {
        "name": "Page A",
        "pulse": 80,
      },
      {
        "name": "Page A",
        "pulse": 120,
      },
      {
        "name": "Page A",
        "pulse": 100,
      },
      {
        "name": "Page A",
        "pulse": 80,
      },
      {
        "name": "Page A",
        "pulse": 120,
      },
      {
        "name": "Page A",
        "pulse": 50,
      },
      {
        "name": "Page A",
        "pulse": 80,
      },
      {
        "name": "Page A",
        "pulse": 120,
      },
    ]
  )

  useEffect(() => {
    saveSignal();
  }, [bioSignalValue]);

  function saveSignal() {
    setData(prevState => {
      let newArray = prevState.concat([{ "name": "Page A", "pulse": bioSignalValue }])
      newArray.shift();
      return newArray;
    });
  }

  return (
    <div className={color + ' ' + className + ' ' + (warning ? 'warning-border' : '')}>
      <span>{bioSignalType}</span>
      <span>{bioSignalValue}</span>
      <ResponsiveContainer width='100%' height='100%'>
        <LineChart
          margin={{ top: 5, right: 20, left: -20, bottom: 5 }}
          data={data}
        >
          <YAxis domain={[0, 150]} />
          <Line isAnimationActive={false} type="monotone" dataKey="pulse" stroke={color} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

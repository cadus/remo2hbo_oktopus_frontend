import React, { useEffect, useRef, useState } from "react";
import WebGlPlot, { WebglLine, ColorRGBA } from "webgl-plot";

export default function Chart({ height, color, className, data, label, warning }) {
  const canvasMain = useRef(null);

  const [webglp, setWebglp] = useState(null);
  const [lineObj, setLineObj] = useState(null);

  useEffect(() => {
    if (canvasMain.current) {
      canvasMain.current.width = canvasMain.current.clientWidth;
      canvasMain.current.height = canvasMain.current.clientHeight;

      const numPoints = data.frequency;
      const w = new WebGlPlot(canvasMain.current);
      const l = new WebglLine(new ColorRGBA(color[0], color[1], color[2]), numPoints);
      l.lineSpaceX(-1, 2 / (numPoints - 2));
      w.addLine(l);

      setLineObj(l);
      setWebglp(w);
    }
  }, []);

  useEffect(() => {
    addPoint(lineObj, data);
  }, [data]);

  function addPoint(line, yData) {
    if (line) {
      line.setY(line.numPoints - 1, normalized(yData.current));
      for (let i = 0; i < line.numPoints; i++) {
        line.setY(i, line.getY(i + 1));
      }
      webglp.update();
    }
  }

  function normalized(value) {
    return (value - data.range[0]) / (data.range[1] - data.range[0]);
  }

  const canvasStyle = { width: "100%", height: "150%" };

  return (
    <div className={className + ' ' + (warning ? 'warning-border' : '')}
         style={{ color: `rgb(${color[0]}, ${color[1]}, ${color[2]})` }} >
      <span>{label}</span>
      <canvas style={canvasStyle} ref={canvasMain} />
    </div>
  );
}

import React, { useEffect, useRef, useState } from "react";
import WebGlPlot, { WebglLine, ColorRGBA } from "webgl-plot";

export default function Chart({ height, color, className, bioSignalValue, bioSignalType, warning }) {
  const canvasMain = useRef(null);

  const [webglp, setWebglp] = useState(null);
  const [lineObj, setLineObj] = useState(null);

  useEffect(() => {
    if (canvasMain.current) {
      canvasMain.current.width = canvasMain.current.clientWidth;
      canvasMain.current.height = canvasMain.current.clientHeight;

      const numX = 500;
      const w = new WebGlPlot(canvasMain.current);
      const l = new WebglLine(new ColorRGBA(color[0], color[1], color[2]), numX);
      l.lineSpaceX(-1, 2 / numX);
      w.addLine(l);

      setLineObj(l)
      setWebglp(w);
    }
  }, []);

  useEffect(() => {
    addPoint(lineObj, bioSignalValue);
  }, [bioSignalValue]);

  function addPoint(line, yData) {
    if (line) {
      line.setY(line.numPoints - 1, yData);
      for (let i = 0; i < line.numPoints; i++) {
        line.setY(i, line.getY(i + 1));
      }
      webglp.update();
    }
  }

  const canvasStyle = { width: "100%", height: "150%" };

  return (
    <div className={className + ' ' + (warning ? 'warning-border' : '')} style={{ color: color }}>
      <span>{bioSignalType}</span>
      <canvas style={canvasStyle} ref={canvasMain} />
    </div>
  );
}

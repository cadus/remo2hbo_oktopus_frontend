import React, { useEffect, useRef, useState } from "react";
import WebGlPlot, { WebglLine, ColorRGBA } from "webgl-plot";

export default function Chart({ height, color, className, bioSignalValue, bioSignalType, warning }) {
  let webglp = WebGlPlot;
  let line = WebglLine;

  const canvasMain = useRef(null);

  useEffect(() => {
    if (canvasMain.current) {
      canvasMain.current.width = canvasMain.current.clientWidth;
      canvasMain.current.height = canvasMain.current.clientHeight;

      webglp = new WebGlPlot(canvasMain.current);
      const numX = 100;

      line = new WebglLine(new ColorRGBA(color[0], color[1], color[2]), numX);
      webglp.addLine(line);
      line.lineSpaceX(-1, 2 / numX);

      /** Add IPC event listener */
      const { ipcRenderer } = require('electron');
      ipcRenderer.on(bioSignalType, (event, data) => {
        addPoint(line, data);
      });
    }
  }, []);

  function addPoint(line, yData) {
    line.setY(line.numPoints - 1, yData);
    for (let i = 0; i < line.numPoints; i++) {
      line.setY(i, line.getY(i + 1));
    }
    webglp.update();
  }

  const canvasStyle = { width: "100%", height: "150%" };

  return (
    <div className={className + ' ' + (warning ? 'warning-border' : '')} style={{ color: color }}>
      <span>{bioSignalType}</span>
      <canvas style={canvasStyle} ref={canvasMain} />
    </div>
  );
}

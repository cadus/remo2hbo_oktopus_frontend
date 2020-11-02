import React, { useEffect, useRef, useState } from "react";
import WebGlPlot, { WebglLine, ColorRGBA } from "webgl-plot";

let webglp = WebGlPlot;
let line = WebglLine;

export default function Chart() {
  const [values, setValues] = useState(0);

  const canvasMain = useRef(null);

  useEffect(() => {
    if (canvasMain.current) {
      canvasMain.current.width = canvasMain.current.clientWidth;
      canvasMain.current.height = canvasMain.current.clientHeight;

      webglp = new WebGlPlot(canvasMain.current);
      const numX = 1000;

      line = new WebglLine(new ColorRGBA(1, 0, 0, 1), numX);
      webglp.addLine(line);

      line.lineSpaceX(-1, 2 / numX);

      /** Add IPC event listener */
      const { ipcRenderer } = require('electron');
      ipcRenderer.on('main', (event, data) => {
        setValue(data)
      });
    }
  }, []);

  useEffect(() => {
    let id = 0;
    let renderPlot = () => {
      id = requestAnimationFrame(renderPlot);

      line.setY(line.numPoints - 1, Math.random());
      for (let i = 0; i < line.numPoints; i++) {
        line.setY(i, line.getY(i + 1));
      }

      webglp.update();
    };
    id = requestAnimationFrame(renderPlot);

    return () => {
      renderPlot = () => {};
      cancelAnimationFrame(id);
    };
  }, [values]);

  const canvasStyle = {
    width: "100%",
    height: "35vh"
  };

  return (
    <div>
      <canvas style={canvasStyle} ref={canvasMain} />
    </div>
  );
}

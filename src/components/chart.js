import React, { useEffect, useRef, useState } from "react";
import WebGlPlot, { WebglLine, ColorRGBA } from "webgl-plot";

let webglp = WebGlPlot;
let line = WebglLine;

export default function Chart() {
  const [freq, setFreq] = useState(0.001);
  const [amp, setAmp] = useState(0.5);


  const canvasMain = useRef(null);

  useEffect(() => {
    if (canvasMain.current) {
      webglp = new WebGlPlot(canvasMain.current);
      const numX = 100;

      line = new WebglLine(new ColorRGBA(1, 0, 0, 1), numX);
      webglp.addLine(line);

      line.lineSpaceX(-1, 2 / numX);

      for (let i = 0; i < line.numPoints; i++) {
        line.setY(i, Math.random());
      }

    }
  }, []);

  useEffect(() => {
    let id = 0;
    let renderPlot = () => {
      id = requestAnimationFrame(renderPlot);
      webglp.update();
    };
    id = requestAnimationFrame(renderPlot);

    return () => {
      renderPlot = () => {};
      cancelAnimationFrame(id);
    };
  }, [freq, amp]);

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

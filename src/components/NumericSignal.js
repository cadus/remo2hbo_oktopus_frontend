import React, { useState } from 'react';

export default ({ color, fontSize, className, data, label, warning }) => {

  return (
    <div className={className + ' ' + (warning ? 'warning-border' : '')} style={{ color: color }}>
      <p className="numeric-signal-label"> {label} </p>
      <p className="numeric-signal-value" style={{ fontSize: fontSize }}> {data.current}</p>
    </div>
  );
}

import React, { useState } from 'react';

export default ({ color, fontSize, className, bioSignalValue, bioSignalType, bioSignalValueAddOn, warning }) => {
  function renderBioSignalValue() {
    return (
      bioSignalValueAddOn ? bioSignalValue + " / " + bioSignalValueAddOn : bioSignalValue
    );
  }

  return (
    <div className={className + ' ' + (warning ? 'warning-border' : '')} style={{ color: color }}>
      <p className="bioSignalType"> {bioSignalType} </p>
      <p className="bioSignalValue" style={{ fontSize: fontSize }}> {renderBioSignalValue()}</p>
    </div>
  );
}

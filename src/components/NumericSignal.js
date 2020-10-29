import React, { useState } from 'react';

export default ({ color, className, bioSignalValue, bioSignalType, bioSignalValueAddOn, warning }) => {
  function renderBioSignalValue() {
    return (
      bioSignalValueAddOn ? bioSignalValue + " / " + bioSignalValueAddOn : bioSignalValue
    );
  }

  return (
    <div className={color + ' ' + className + ' ' + (warning ? 'warning-border' : '')}>
      <p className="bioSignalType"> {bioSignalType} </p>
      <p className="bioSignalValue"> {renderBioSignalValue()}</p>
    </div>
  );
}

import React, { useState } from 'react';
import MonitorView from './MonitorView.js';
import SettingsIcon from '../images/settings.png';
import ContrastIcon from '../images/contrastIcon.png';

export default () => {
  const [isDark, setIsDark] = useState(true);
  const { ipcRenderer } = require('electron');

  function toggleContrast() {
    setIsDark(!isDark);
  }

  return (
    <div className={isDark ? 'dark-contrast main' : 'main'}>
      <div id="header">
        <img className='contrast-icon' src={ContrastIcon} onClick={() => toggleContrast()}/>
        <span>OKTOPUS BIOSIGNAL MONITORING</span>
      </div>

      <div>
        <MonitorView />
      </div>
    </div>
  )
}

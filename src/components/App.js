import React, { Component } from 'react';
import MonitorView from './MonitorView.js';
import SettingsIcon from '../images/settings.png';
import ContrastIcon from '../images/contrastIcon.png';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { isDark: true };
    this.toggleContrast = this.toggleContrast.bind(this);
  }

  toggleContrast() {
    this.setState(prevState => ({ isDark: !prevState.isDark }));
  }

  render() {
    return (
      <div className={this.state.isDark ? 'dark-contrast main' : 'main'}>
        <img className='contrast-icon' src={ContrastIcon} onClick={this.toggleContrast}/>
        <div>
          <MonitorView />
        </div>
      </div>
    )
  }
}

export default App;

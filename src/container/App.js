import React, { Component } from 'react';
import './App.css';
import MonitorView from './MonitorView.js';
import MenuView from './MenuView.js';
import SettingsIcon from '../images/settings.png';
import ContrastIcon from '../images/contrastIcon.png';




class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      showMenu: true,
      isDark: true
    };
    this.toggleContrast = this.toggleContrast.bind(this);
    this.toggleMenu = this.toggleMenu.bind(this);
  }

  toggleContrast() {
    this.setState(prevState => ({
      isDark: !prevState.isDark
    }));
  }

  toggleMenu() {
    this.setState(prevState => ({
      showMenu: !prevState.showMenu
    }));
  }

  render() {

      return (
        <div>
          <img className='contrast-icon' src={ContrastIcon} onClick={this.toggleContrast}/>
          <img className='settings-icon' src={SettingsIcon} onClick={this.toggleMenu}/>
          <div className={this.state.isDark ? 'dark-contrast' : ''}>
            {this.state.showMenu ?  <MenuView /> : <MonitorView />}
          </div>
        </div>

      )
    }


}


export default App;

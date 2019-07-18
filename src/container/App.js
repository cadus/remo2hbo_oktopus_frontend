import React, { Component } from 'react';
import './App.css';
import MonitorView from './MonitorView.js';
import MenuView from './MenuView.js';
import SettingsIcon from '../images/settings.png';




class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      showMenu: true
    };
    this.toggleMenu = this.toggleMenu.bind(this);
  }

  toggleMenu() {
    this.setState(prevState => ({
      showMenu: !prevState.showMenu
    }));
  }

  render() {

      return (
        <div>
        <img className='settings-icon' src={SettingsIcon} onClick={this.toggleMenu}/>
        {this.state.showMenu ?  <MenuView /> : <MonitorView />}
        </div>

      )
    }


}


export default App;

import React, { Component } from 'react';
import settingsIcon from '../images/settings.png';

class Settings extends Component {
    constructor(props) {
        super(props);
      }

    render() {
        let settings = <img className="header-icons" align="right" src={settingsIcon} />;
        return settings;
    }
}

export default Settings;
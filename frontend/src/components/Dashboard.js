import React, { Component } from 'react';
import { PermissionComputer, ServerIcon } from './util';

export default class Dashboard extends Component {
    componentDidMount() {
        this.props.getUser();
    }
    render() {
        var guilds = JSON.parse(this.props.guilds);
        if(this.props.guilds)
            return (
                <div style={{textAlign: "center"}}>
                    <h1>Dashboard</h1>
                    <div className="client-guilds" style={{textAlign: "center"}}>
                        {guilds.map(guild => (new PermissionComputer(Number(guild.permissions))).isAdministrator() ? <ServerIcon key={guild.name} server={guild} /> : null)}
                    </div>
                </div>
            );
        return (
            <div>
                <h1>Dashboard</h1>
            </div>
        );
    }
}
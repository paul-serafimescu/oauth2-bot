import { Component } from 'react';
import botIcon from './assets/default.png';
import { ServerIcon, PermissionComputer } from './util';

export default class Profile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: JSON.parse(this.props.user),
            guilds: JSON.parse(this.props.guilds)
        }
    }
    render() {
        return (
            <div style={{textAlign: "center"}}>
                <button className="logout-button" onClick={this.props.logout}>Log Out</button>
                <h1><a id="invite-link" href="https://discord.com/api/oauth2/authorize?client_id=699437697026228348&permissions=8&redirect_uri=http%3A%2F%2Flocalhost%3A3000&scope=bot" target="_blank" rel="noreferrer">Invite bot To Your Server!</a></h1>
                <div style={{height: "1000px", backgroundImage: `url(${botIcon})`, backgroundPosition: "right center", backgroundSize: "cover", backgroundRepeat: "no-repeat"}}>
                    <div style={{border: "1px solid gray", width: "20%", backgroundColor: "#1f2020"}}>
                        <h1>Hello {this.state.user.username}!</h1>
                        <h3>Add Bot to server:</h3>
                        {this.state.guilds.map(guild => (new PermissionComputer(Number(guild.permissions))).isAdministrator() ? <ServerIcon key={guild.name} server={guild} /> : null)}
                    </div>
                </div>
            </div>
        );
    }
}
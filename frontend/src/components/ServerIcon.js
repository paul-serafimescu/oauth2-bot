import { Component } from 'react';
import DefaultIcon from './assets/defaulticon.png';

export default class ServerIcon extends Component {
    render() {
        return (
            <span className="server-icon">
                <a style={{color: 'white'}} href={`guilds/${this.props.server.id}`}>
                    <figure style={{display: "inline-block", textAlign: "center"}}>
                        {this.props.server.icon ?
                            <img style={{borderRadius: "7px"}} src={`https://cdn.discordapp.com/icons/${this.props.server.id}/${this.props.server.icon}.png?size=128`} alt={this.props.server.name}></img> :
                            <div style={{position: "relative"}}>
                                <img style={{borderRadius: "7px", width: "128px"}} src={DefaultIcon} alt={this.props.server.name}></img>
                                <div style={{position: 'absolute', top: "50%", left: "50%", transform: "translate(-50%, -50%"}}><p style={{fontSize: "xx-large"}}>{this.props.server.name.split(" ").map(word => word[0])}</p></div>
                            </div>
                        }
                        <figcaption>{this.props.server.name}</figcaption>
                    </figure>
                </a>
            </span>
        );
    }
}
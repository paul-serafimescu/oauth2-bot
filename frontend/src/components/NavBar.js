import { Component } from 'react';
import { Login as LoginButton, Icon } from './util';

export default class NavBar extends Component {
    render() {
        return (
            <nav className="navBar">
                <span className="navBar-item"><div style={{float: "left", fontSize: "30px"}}><a href="http://localhost:3000">&#8801;</a></div></span>
                <span className="navBar-item"><div style={{fontSize: "30px"}}>Welcome to [Name]</div></span>
                <span className="navBar-item">{!localStorage.getItem('USER') ? <LoginButton /> : <Icon imageUrl={this.props.imageUrl}/>}</span>
            </nav>
        );
    }
}
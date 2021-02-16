import React, { Component } from 'react';
import NavBar from './NavBar';

export default class Layout extends Component {
    render() {
        return (
            <div>
                <NavBar imageUrl={this.props.imageUrl} />
                {this.props.children}
            </div>
        );
    }
}
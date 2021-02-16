import { Component, Fragment } from 'react';

export class CommandForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            action: ''
        };
        this.handleNameChange = this.handleNameChange.bind(this);
        this.handleActionChange = this.handleActionChange.bind(this);
        this.submit = this.submit.bind(this);
    }
    handleNameChange(event) {
        this.setState({name: event.target.value});
    }
    handleActionChange(event) {
        this.setState({action: event.target.value});
    }
    submit(event) {
        this.props.handleSubmit(event);
        this.setState({name: '', action: ''});
    }
    render() {
        return (
            <form style={{width: "100%"}} onSubmit={this.submit}>
                <h2 style={{margin: "20px 40px"}}>Create New Command</h2>
                <input className="command-input-name" type="text" value={this.state.name} onChange={this.handleNameChange} placeholder="Enter Command Name" />
                <input className="command-input-action" type="text" value={this.state.action} onChange={this.handleActionChange} placeholder="Enter Command Action" />
                <p style={{color: 'red', margin: "5px 40px"}}>{this.props.error}</p>
                <input className="command-submit" type="submit" value="Create Command" />
            </form>
        );
    }
}

export class CommandView extends Component {
    render() {
        return (
            <Fragment>
            <tr className="command-view">
                <td className="command-name">
                    <button className="delete-button" value={this.props.command.name} onClick={this.props.delete}><p>&times;</p></button>
                    <p style={{fontSize: "large"}}>${this.props.command.name}</p>
                </td>
                <td>{this.props.command.payload.startsWith("http") ?
                    <figure className="command-image">
                        <img style={{width: "100px"}} src={this.props.command.payload} alt={this.props.command.payload}></img>
                        <figcaption>{this.props.command.payload}</figcaption>
                    </figure>
                     : <p style={{fontSize: "large"}}>{this.props.command.payload}</p>}</td>
                <td>
                    <label className="switch">
                        <input type="checkbox" value={this.props.command.id} defaultChecked={this.props.command.status} onChange={this.props.toggleCmdStatus} />
                        <span className="slider round"></span>
                    </label>
                </td>
            </tr>
            </Fragment>
        );
    }
}

export default class Page extends Component {
    constructor(props) {
        super(props);
        this.state = {
            commands: 'empty',
            error: ''
        };
        this.createCommand = this.createCommand.bind(this);
        this.toggleCmdStatus = this.toggleCmdStatus.bind(this);
        this.delete = this.delete.bind(this);
    }
    async createCommand(event) {
        event.preventDefault();
        for(let i = 0; i < this.state.commands.length; i++)
            if(this.state.commands[i].name === event.target[0].value.trim() || event.target[0].value.trim() === '') {
                event.target[0].value = '';
                event.target[1].value = '';
                return this.setState({error: 'invalid command name'})
            }
        const [name, action] = event.target;
        var response;
        await fetch('http://localhost:8000/create/command', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({name: name.value.split(' ').join('-'), data: action.value, guild_id: this.props.guild.id})
        }).then(response => response.json()).then(resp => response = resp).catch(error => console.log(error));
        let oldStorage = JSON.parse(localStorage.getItem(this.props.guild.name));
        if(oldStorage === "empty")
            oldStorage = [response];
        else
            oldStorage.push(response);
        localStorage.setItem(this.props.guild.name, JSON.stringify(oldStorage));
        this.setState({commands: oldStorage});
        event.target[0].value = '';
        event.target[1].value = '';
        this.setState({error: ''});
    }
    async componentDidMount() {
        var data, response;
        data = JSON.parse(localStorage.getItem(`${this.props.guild.name}`));
        if(!data) {
            await fetch(`http://localhost:8000/guilds?id=${this.props.guild.id}&name=${this.props.guild.name}`).then(response => response.json()).then(resp => response = resp).catch(error => console.log(error));
            data = response.data.length === 0 ? "empty" : response.data;
            localStorage.setItem(`${this.props.guild.name}`, JSON.stringify(data));
        }
        this.setState({commands: data});
    }
    async toggleCmdStatus(event) {
        await fetch('http://localhost:8000/edit/command', {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({id: event.target.value, status: event.target.checked})
        });
        let oldStorage = JSON.parse(localStorage.getItem(this.props.guild.name));
        let editedCmd = oldStorage.find(cmd => cmd.id === Number(event.target.value));
        let index = oldStorage.indexOf(editedCmd);
        editedCmd.status = !editedCmd.status;
        oldStorage[index] = editedCmd;
        localStorage.setItem(this.props.guild.name, JSON.stringify(oldStorage));
        this.setState({commands: oldStorage});
    }
    async delete(event) {
        const val = event.currentTarget.value;
        await fetch('http://localhost:8000/delete/command', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({cmd_name: val, guild_name: this.props.guild.name})
        });
        let oldStorage = JSON.parse(localStorage.getItem(this.props.guild.name));
        let deletedCmd = oldStorage.find(cmd => cmd.name === val);
        let index = oldStorage.indexOf(deletedCmd);
        oldStorage.splice(index, 1);
        oldStorage = oldStorage.length > 0 ? oldStorage : 'empty';
        localStorage.setItem(this.props.guild.name, JSON.stringify(oldStorage));
        this.setState({commands: oldStorage});
    }
    render() {
        return (
            <div className="display-page">
                <h1 style={{textAlign: "center"}}>{this.props.guild.name}</h1>
                <hr style={{width: "90%", border: "1px solid red"}}/>
                <CommandForm error={this.state.error} handleSubmit={this.createCommand} />
                <h3 style={{marginLeft: "40px"}}>Number of Commands: {this.state.commands !== 'empty' ? this.state.commands.length : 0}</h3>
                <div style={{textAlign: "center"}}>
                    <table>
                        <thead>
                            <tr style={{backgroundColor: "#3f464d"}}>
                                <th style={{width: "30%"}}>Command Name</th>
                                <th>Output</th>
                                <th style={{width: "10%"}}>On/Off</th>
                            </tr>
                        </thead>
                        <tbody>
                        {this.state.commands !== 'empty' &&
                            this.state.commands.map(command =>
                                <CommandView
                                    key={command.name}
                                    command={command}
                                    toggleCmdStatus={this.toggleCmdStatus}
                                    delete={this.delete}
                                />)}
                        </tbody>
                    </table>
                    {this.state.commands === 'empty' && <h1 style={{textAlign: "center"}}>You Have No Commands</h1>}
                </div>
            </div>
        );
    }
}
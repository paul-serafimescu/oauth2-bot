import {
    BrowserRouter as Router,
    Route,
    Switch
} from 'react-router-dom';
import { Profile, Dashboard, Layout, Page, BASEURL, Component, getAvatar } from './components/util';

export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            token: localStorage.getItem('ACCESS_TOKEN'),
            user: localStorage.getItem('USER'),
            guilds: localStorage.getItem('GUILDS'),
        }
        this.getUser = this.getUser.bind(this);
        this.logout = this.logout.bind(this);
    }
    async getUser() {
        try {
            let TOKEN = window.location.href.split('=')[2].split('&')[0];
            let currentTime = new Date();
            let EXPIRATION_TIME = window.location.href.split('=')[3].split('&')[0];
            currentTime.setSeconds(currentTime.getSeconds() + Number(EXPIRATION_TIME));
            if(TOKEN.startsWith("The")) alert('uh oh u didnt gib me permission >.<'); // improve this idk
            localStorage.setItem('ACCESS_TOKEN', TOKEN);
            localStorage.setItem('EXPIRATION_TIME', currentTime.toISOString());
            await fetch('https://discord.com/api/users/@me', {
                headers: {
                    Authorization: `Bearer ${TOKEN}`
                }
            })
            .then(response => response.json())
            .then(resp => localStorage.setItem('USER', JSON.stringify(resp)))
            .catch(error => console.log(error));
            await fetch('https://discord.com/api/users/@me/guilds', {
                headers: {
                    Authorization: `Bearer ${TOKEN}`
                }
            })
            .then(response => response.json())
            .then(resp => localStorage.setItem('GUILDS', JSON.stringify(resp)))
            .catch(error => console.log(error));
            this.setState({token: TOKEN, user: localStorage.getItem('USER'), guilds: localStorage.getItem('GUILDS')});
            window.location.href = BASEURL;
        }
        catch {
            var expiration = new Date(localStorage.getItem('EXPIRATION_TIME'));
            var currentTime = new Date();
            if(currentTime.getSeconds() - 1000 >= expiration.getSeconds())
                window.location.href = 'https://discord.com/api/oauth2/authorize?client_id=699437697026228348&redirect_uri=http%3A%2F%2Flocalhost%3A3000&response_type=token&scope=identify%20guilds';
        }

    }
    logout() {
        localStorage.clear();
        this.setState({token: null, user: null, guilds: null});
        window.location.href = BASEURL;
    }
    render() {
        let user = JSON.parse(this.state.user);
        return (
            <Router>
                <Switch>
                    <Layout imageUrl={user ? getAvatar(user.id, user.avatar) : undefined}>
                        <Route exact path="/" render={props =>
                            <Dashboard {...props}
                                getUser={this.getUser}
                                logout={this.logout}
                                token={this.state.token}
                                user={this.state.user}
                                guilds={this.state.guilds}
                            />
                        } />
                        <Route path="/profile" render={props =>
                            <Profile {...props}
                                user={this.state.user}
                                guilds={this.state.guilds}
                                logout={this.logout}
                            />
                        } />
                        {this.state.guilds && JSON.parse(this.state.guilds).map(guild => <Route key={guild.name} path={`/guilds/${guild.id}`} render={props =>
                            <Page {...props}
                                guild={guild}
                            />
                        }/>)}
                    </Layout>
                </Switch>
            </Router>
        );
    }
}

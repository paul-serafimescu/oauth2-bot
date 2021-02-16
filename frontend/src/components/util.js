import Dashboard from './Dashboard';
import Layout from './Layout';
import Icon from './Icon';
import Profile from './Profile';
import ServerIcon from './ServerIcon';
import Page from './Page';
import { Component } from 'react';

const BASEURL = 'http://localhost:3000';

function getTokenEndpoint(client_id) {
    return `https://discord.com/api/oauth2/authorize?client_id=${client_id}&redirect_uri=http%3A%2F%2Flocalhost%3A3000&response_type=token&scope=identify%20guilds`;
}

function getAvatar(id, rawAvatar) {
    return `https://cdn.discordapp.com/avatars/${id}/${rawAvatar}.png`;
}

function Login(props) {
    return (
        <div id="login" style={{textAlign: "right"}}>
            <a href="https://discord.com/api/oauth2/authorize?client_id=699437697026228348&redirect_uri=http%3A%2F%2Flocalhost%3A3000&response_type=token&scope=identify%20guilds">Login</a>
        </div>
    );
}

class PermissionComputer {
    /**
     * @constructor
     * @param {Number} rawPerms
     */
    constructor(rawPerms) {
        this.perms = rawPerms;
        this.permissions = {
            CreateInvite: 0x1,
            KickMembers: 0x2,
            BanMembers: 0x4,
            Administrator: 0x8,
            ManageChannels: 0x10,
            ManageGuild: 0x20,
            ChangeNickname: 0x4000000,
            ManageNicknames: 0x8000000,
            ManageRoles: 0x10000000,
            ManageWebhooks: 0x20000000,
            ManageEmojis: 0x40000000,
            ViewAuditLog: 0x80,
            ViewGuildInsights: 0x80000,
        };
    }
    /**
     * returns 1 if user has permission
     * @param {String} permission
     */
    has(permission) {
        return this.perms & this.permission[permission];
    }
    /**
     * returns 1 if permission shard is administrator
     */
    isAdministrator() {
        return this.perms & this.permissions.ManageGuild;
    }
}

export { Profile, Page, Dashboard, Login, Layout, PermissionComputer, ServerIcon, BASEURL, Component, Icon, getTokenEndpoint, getAvatar };
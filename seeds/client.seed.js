const Client = require('../server/api/oauth/client.model');
const loggger = require('../server/helpers/logger');

if (process.argv.slice(2) && process.argv[2] === 'client') {
    loggger.info('Seeding Clients...');
    Client.findOneAndUpdate({
        clientId: 'authServer',
        clientSecret: 'secret',
    }, {
        grants: [
            'password',
            'refresh_token',
        ],
        redirectUris: [],
        scopes: [
            'grant_permissions',
        ],
    }, {upsert: true, new: true, setDefaultsOnInsert: true}).exec();
    Client.findOneAndUpdate({
        clientId: 'application',
        clientSecret: 'secret',
    }, {
        grants: [
            'authorization_code',
            'refresh_token',
            'client_credentials',
        ],
        redirectUris: [
            'http://localhost:3000/oauth/callback',
        ],
        scopes: [
            'grant_permissions',
        ],
    }, {upsert: true, new: true, setDefaultsOnInsert: true}).exec();
}

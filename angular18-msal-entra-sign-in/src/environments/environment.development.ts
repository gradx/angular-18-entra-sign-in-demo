export const environment = {
    production: false,
    msalConfig: {
        auth: {
            clientId: '165040ca-d322-433d-8dd9-ffdc95008c38',
            authority: 'https://login.microsoftonline.com/common'
        }
    },
    apiConfig: {
        scopes: ['user.read'],
        uri: 'https://graph.microsoft.com/v1.0/me'
    }
};

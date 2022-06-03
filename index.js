const { Provider } = require('oidc-provider');

const LISTENING_PORT = 3000;

const configuration = {
  clients: [{
		application_type: 'web',
		token_endpoint_auth_method: 'none',
    id_token_signed_response_alg: 'HS256',
		response_types: ['id_token'],
		grant_types: ['implicit'],

    client_id: 'test_hs256',
    client_secret: 'k6iKinW8FyZz',
    redirect_uris: ['https://jwt.io', 'https://community.papote.co'],
    scope: 'openid profile email',
  }, {
		application_type: 'web',
		token_endpoint_auth_method: 'none',
		response_types: ['id_token'],
		grant_types: ['implicit'],

    client_id: 'id_provided_by_howtank',
    redirect_uris: ['https://jwt.io'],
    scope: 'openid profile email',
  }, {
		application_type: 'web',
		token_endpoint_auth_method: 'none',
		response_types: ['id_token'],
		grant_types: ['implicit'],

    client_id: 'howtank',
    redirect_uris: ['https://community.papote.co'],
    scope: 'openid profile email',
  }, {
		application_type: 'web',
		token_endpoint_auth_method: 'none',
		response_types: ['id_token'],
		grant_types: ['implicit'],

    client_id: 'ejpTQ9jx6bJd',
    redirect_uris: ['https://ent.espacejapon.com/community/'],
    scope: 'openid profile email',
  }],
  features: {
    claimsParameter: { enabled: true },
    clientCredentials: { enabled: true },
    introspection: { enabled: true },
    devInteractions: { enabled: true },
  },
  claims: {
    email: ['email'],
    profile: ['pseudo', 'first_name', 'last_name', 'birthdate', 'picture']
  },
  routes: {
    // jwks: '/.well-known/jwks.json',
  },
  enabledJWA: {
    idTokenSigningAlgValues: ['RS256', 'HS256'],
  },
  async findAccount(ctx, id) {
    return {
      accountId: id,
      async claims(use, scope) {
        return {
          sub: id,
          email: id,
          pseudo: id,
          first_name: "foo",
          last_name: "bar",
          birthdate: "1970-01-01",
          picture: "",
        }
      }
    }
  }
};

const oidc = new Provider(`http://localhost:${LISTENING_PORT}`, configuration);

oidc.listen(LISTENING_PORT, () => {
  console.log(`oidc-provider listening on port ${LISTENING_PORT}, check http://localhost:${LISTENING_PORT}/.well-known/openid-configuration`);
});

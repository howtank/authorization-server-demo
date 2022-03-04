const { Provider } = require('oidc-provider');

const configuration = {
  clients: [{
		application_type: 'web',
		token_endpoint_auth_method: 'none',
		response_types: ['id_token'],
		grant_types: ['implicit'],

    client_id: 'id_provided_by_howtank',
    redirect_uris: ['https://jwt.io'],
    scope: 'openid profile email',
  }],
  features: {
    claimsParameter: { enabled: true },
    clientCredentials: { enabled: true },
    introspection: { enabled: true },
  },
  claims: {
    email: ['email'],
    profile: ['pseudo', 'first_name', 'last_name', 'birthdate', 'picture']
  },
  routes: {
    // jwks: '/.well-known/jwks.json',
  },
  async findAccount(ctx, id) {
    return {
      accountId: id,
      async claims(use, scope) {
        return {
          sub: id,
          email: "foobar@foo.com",
          pseudo: id,
          first_name: "foo",
          last_name: "bar",
          birthdate: "1970-01-01",
          picture: "azertyuiop",
        }
      }
    }
  }
};

const oidc = new Provider('http://localhost:3000', configuration);

// uncomment the following block to test locally
/* const { invalidate: orig } = oidc.Client.Schema.prototype;

oidc.Client.Schema.prototype.invalidate = function invalidate(message, code) {
  if (code === 'implicit-force-https' || code === 'implicit-forbid-localhost') {
    return;
  }

  orig.call(this, message);
}; */
// end uncomment to test locally

oidc.listen(3000, () => {
  console.log('oidc-provider listening on port 3000, check http://localhost:3000/.well-known/openid-configuration');
});

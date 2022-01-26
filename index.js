const { Provider } = require('oidc-provider');

const configuration = {
  clients: [{
		application_type: 'web',
		token_endpoint_auth_method: 'none',
		response_types: ['id_token'],
		grant_types: ['implicit'],

		// hardcoded for the example only
    client_id: 'id_provided_by_howtank',
    redirect_uris: ['https://community.papote.co/'],
  }],
};

const oidc = new Provider('http://localhost:3000', configuration);

oidc.listen(3000, () => {
  console.log('oidc-provider listening on port 3000, check http://localhost:3000/.well-known/openid-configuration');
});

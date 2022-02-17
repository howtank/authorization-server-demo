const { Provider } = require('oidc-provider');

const configuration = {
  clients: [{
		application_type: 'web',
		token_endpoint_auth_method: 'none',
		response_types: ['id_token'],
		grant_types: ['implicit'],

    client_id: 'id_provided_by_howtank',
    redirect_uris: ['https://jwt.io'],
  }],
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

const TokenService = K2.TokenService;


TokenService
    .getToken()
    .then(response => {
        //Developer can decide to store the token_details and track expiry
        console.log(response)
    })
    .catch(error => {
        console.log(error);
    })
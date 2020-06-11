
const Promise = require('bluebird');

module.exports = (api) => {    
  api.native.get_all_currencies = (coin, api_token, includeExpired = false) => {
    return new Promise((resolve, reject) => {      
      api.native.callDaemon(coin, 'listcurrencies', [includeExpired], api_token)
      .then((allcurrencies) => {
        resolve(allcurrencies.map(currency => ({ ...currency, parent_name: coin})))
      })
      .catch(err => {
        reject(err)
      })
    });
  };

  api.post('/native/get_all_currencies', (req, res, next) => {
    const token = req.body.token;
    const coin = req.body.chainTicker;
    const includeExpired = req.body.includeExpired;

    api.native.get_all_currencies(coin, token, includeExpired)
    .then((currencies) => {
      const retObj = {
        msg: 'success',
        result: currencies,
      };
  
      res.end(JSON.stringify(retObj));  
    })
    .catch(error => {
      const retObj = {
        msg: 'error',
        result: error.message,
      };
  
      res.end(JSON.stringify(retObj));  
    })
  });

  return api;
};
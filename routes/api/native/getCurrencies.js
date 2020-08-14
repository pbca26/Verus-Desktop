
const Promise = require('bluebird');

module.exports = (api) => {    
  api.native.get_all_currencies = (coin, api_token, includeExpired = false) => {
    return new Promise((resolve, reject) => {      
      api.native.callDaemon(coin, 'listcurrencies', [includeExpired], api_token)
      .then((allcurrencies) => {
        //TODO: Change getcurrency instead of listcurrencies so they are the same
        resolve(
          allcurrencies.map((currency) => ({
            parent_name: coin,
            ...currency.currencydefinition,
            bestheight: currency.bestheight,
            lastconfirmedheight: currency.lastconfirmedheight,
          }))
        );
      })
      .catch(err => {
        reject(err)
      })
    });
  };

  // Returns an object with key = currency name and value = currency object
  // for every currency name mentioned in the input array
  api.native.get_currency_data_map = (chain, api_token, currencies = []) => {
    return new Promise(async (resolve, reject) => {   
      let res = {
        currencyData: {},
        currencyNames: {}
      }

      for (let i = 0; i < currencies.length; i++) {
        const currency = currencies[i]

        try {
          const fullCurrencyObj = await api.native.get_currency(chain, api_token, currency)

          if (
            fullCurrencyObj.currencyid != null &&
            fullCurrencyObj.name != null
          ) {
            res.currencyData[currency] = fullCurrencyObj
            res.currencyNames[fullCurrencyObj.currencyid] = fullCurrencyObj.name
          }
        } catch(e) {
          api.log(`Error fetching currency: "${currency}"!`, "getCurrencies")
          api.log(err, "getCurrencies")
        }
      }

      resolve(res)
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

  api.post('/native/get_currency_data_map', (req, res, next) => {
    const token = req.body.token;
    const coin = req.body.chainTicker;
    const currencies = req.body.currencies;

    api.native.get_currency_data_map(coin, token, currencies)
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
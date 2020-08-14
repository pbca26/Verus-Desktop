module.exports = (api) => {  
  api.eth.get_addresses = (coin, network = 'homestead') => {
    let addresses = {
      public: [],
      private: []
    }

    return new Promise((resolve, reject) => {
      if (api.eth.connect[coin] && api.eth.connect[coin].signingKey && api.eth.connect[coin].signingKey.address) {
        addresses.public.push({address: api.eth.connect[coin].signingKey.address, tag: "eth"})
      } else {
        throw new Error(`${coin} hasnt been connected to yet, eth tokens need to be connected to be used.`)
      }

      Promise.all(addresses.public.map((addressObj) => {
        return api.eth.get_balances(addressObj.address, coin, network)
      }))
      .then((addressBalances) => {
        const jsonParsed = api.eth.parseEthJson(addressBalances)

        if (jsonParsed.msg === 'error') throw new Error(jsonParsed.result)
        else addresses.public = addresses.public.map((addressObj, index) => {
          return {...addressObj, balances: {native: addressBalances[index], reserve: {}}}
        })

        resolve(addresses)
      })
      .catch(err => {
        reject(err)
      })
    });
  };

  api.get('/eth/get_addresses', (req, res, next) => {
    const coin = req.query.chainTicker;
    const network = req.query.network
    
    api.eth.get_addresses(coin, network)
    .then((addresses) => {
      const retObj = {
        msg: 'success',
        result: addresses,
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

  api.post('/eth/get_privkey', (req, res, next) => {
    const coin = req.body.chainTicker;
    const token = req.body.token;

    if (api.checkToken(token)) {
      if (api.eth.wallet && api.eth.wallet.signingKey) {
        res.end(JSON.stringify({
          msg: 'success',
          result: api.eth.wallet.signingKey.privateKey,
        }));  
      } else {
        res.end(JSON.stringify({
          msg: 'error',
          result: `No privkey found for coin ${coin}`
        }));  
      }
    } else {
      res.end(JSON.stringify({
        msg: 'error',
        result: 'unauthorized access'
      }));  
    }
  });

  return api;
};
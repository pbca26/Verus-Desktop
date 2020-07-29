const { getRandomIntInclusive } = require('agama-wallet-lib/src/utils');
const fs = require('fs-extra');

module.exports = (api) => {
  api.findCoinName = (network) => {
    for (let key in api.electrumServers) {
      if (key.toLowerCase() === network.toLowerCase()) {
        return key;
      }
    }
  }

  api.addElectrumCoin = async(coin, customServers = [], tags = [], txFee, enableNspv) => {
    coin = coin.toLowerCase();
    
    if (customServers.length > 0 && txFee != null && !isNaN(txFee) && api.electrumServers[coin] == null) {
      api.electrumServers[coin] = {
        serverList: customServers,
        txfee: txFee
      }
    }

    if (tags.includes('is_komodo')) api.customKomodoNetworks[coin] = true

    // select random server
    let randomServer;
    let servers = api.electrumServers[coin] ? api.electrumServers[coin].serverList : []
    
    if (enableNspv &&
        api.nspvPorts[coin.toUpperCase()]) {
      api.log(`start ${coin.toUpperCase()} in NSPV at port ${api.nspvPorts[coin.toUpperCase()]}`, 'spv.coin');
      
      const nspv = api.startNSPVDaemon(coin);

      randomServer = {
        ip: 'localhost',
        port: api.nspvPorts[coin.toUpperCase()],
        proto: 'http',
      };
      servers = 'none';
      api.nspvProcesses[coin] = {
        process: nspv,
        pid: nspv.pid,
      };
      
      api.log(`${coin.toUpperCase()} NSPV daemon PID ${nspv.pid}`, 'spv.coin');
    } else {
      // pick a random server to communicate with
      if (servers &&
          servers.length > 0) {
        const _randomServerId = getRandomIntInclusive(0, servers.length - 1);
        const _randomServer = servers[_randomServerId];
        const _serverDetails = _randomServer.split(':');

        if (_serverDetails.length === 3) {
          randomServer = {
            ip: _serverDetails[0],
            port: _serverDetails[1],
            proto: _serverDetails[2],
          };
        }
      }
    }
    
    api.electrum.coinData[coin] = {
      name: coin,
      server: {
        ip: randomServer.ip,
        port: randomServer.port,
        proto: randomServer.proto,
      },
      serverList: servers ? servers : 'none',
      txfee: coin === 'btc' ? 'calculated' : api.electrumServers[coin] ? api.electrumServers[coin].txfee : 0,
    };

    if (enableNspv) {
      api.electrum.coinData[coin].nspv = true;
    } else {
      // wait for spv connection to be established
      const ecl = await api.ecl(coin);
    }

    if (randomServer) {
      api.log(`random ${coin} electrum server ${randomServer.ip}:${randomServer.port}`, 'spv.coin');
    } else {
      api.log(`${coin} doesnt have any backup electrum servers`, 'spv.coin');
    }

    if (Object.keys(api.electrumKeys).length > 0) {
      const _keys = api.wifToWif(
        api.electrumKeys[Object.keys(api.electrumKeys)[0]].priv,
        coin
      );

      api.electrumKeys[coin] = {
        priv: _keys.priv,
        pub: _keys.pub,
      };
    } else if (api.seed) {
      api.auth(api.seed, true);
    }

    return true;
  }

  //TODO: Re-evauluate as POST or eliminate use of API token
  /*
  api.get('/electrum/coin/changepub', (req, res, next) => {
    if (api.checkToken(req.query.token)) {
      api.electrumKeys[req.query.chainTicker].pub = req.query.pub;

      const retObj = {
        msg: 'success',
        result: 'true',
      };

      res.end(JSON.stringify(retObj));
    } else {
      const retObj = {
        msg: 'error',
        result: 'unauthorized access',
      };

      res.end(JSON.stringify(retObj));
    }
  });*/

  api.post('/electrum/coins/activate', async(req, res, next) => {
    if (api.checkToken(req.body.token)) {
      const { chainTicker, launchConfig } = req.body
      const { customServers, tags, txFee, startupOptions } = launchConfig

      const result = await api.addElectrumCoin(
        chainTicker,
        customServers || [],
        tags,
        txFee,
        startupOptions && startupOptions.nspv
      );

      const retObj = {
        msg: 'success',
        result,
      };

      res.end(JSON.stringify(retObj));
    } else {
      const retObj = {
        msg: 'error',
        result: 'unauthorized access',
      };

      res.end(JSON.stringify(retObj));
    }
  });

  /*api.get('/electrum/coins', (req, res, next) => {
    if (api.checkToken(req.query.token)) {
      let _electrumCoins = JSON.parse(JSON.stringify(api.electrum.coinData)); // deep cloning

      for (let key in _electrumCoins) {
        if (api.electrumKeys[key]) {
          _electrumCoins[key].pub = api.electrumKeys[key].pub;
          _electrumCoins[key].name = key.toUpperCase();
          _electrumCoins[key].pubHex = api.electrumKeys[key].pubHex;
          _electrumCoins[key.toUpperCase()] = JSON.parse(JSON.stringify(_electrumCoins[key]));
          delete _electrumCoins[key];
        }
      }

      const retObj = {
        msg: 'success',
        result: _electrumCoins,
      };

      res.end(JSON.stringify(retObj));
    } else {
      const retObj = {
        msg: 'error',
        result: 'unauthorized access',
      };

      res.end(JSON.stringify(retObj));
    }
  });*/

  api.checkCoinConfigIntegrity = (coin) => {
    let _totalCoins = 0;

    for (let key in api.electrumJSNetworks) {
      if (!api.electrumServers[key] ||
          (api.electrumServers[key] && !api.electrumServers[key].serverList)) {
        //api.log(`disable ${key}, coin config check not passed`, 'spv.coin');
        delete api.electrumServers[key];
        delete api.electrumServersFlag[key];
      } else {
        _totalCoins++;
      }
    }

    api.log(`total supported spv coins ${_totalCoins}`, 'spv.coin');
  };

  return api;
};
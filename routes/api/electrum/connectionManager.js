const { checkTimestamp } = require('agama-wallet-lib/src/time');
const { getRandomIntInclusive } = require('agama-wallet-lib/src/utils');

const CHECK_INTERVAL = 1000;
const MAX_TIME = 30; // s
const MAX_IDLE_TIME = 5 * 60;
const PING_TIME = 60;

// TODO: reconnect/cycle if electrum server is not responding

let electrumServers = {};
let lock = {};

getProtocolVersion = (_ecl, api) => {
  let protocolVersion;
  
  return new Promise((resolve, reject) => {
    _ecl.serverVersion('VerusDesktop')
    .then((serverData) => {
      if (serverData &&
          JSON.stringify(serverData).indexOf('server.version already sent') > -1) {
        api.log('server version already sent', 'ecl.manager');
        resolve('sent');
      }

      let serverVersion = 0;

      if (serverData &&
          typeof serverData === 'object' &&
          serverData[0] &&
          serverData[0].indexOf('ElectrumX') > -1 &&
          Number(serverData[1])
      ) {
        serverVersion = Number(serverData[1]);

        if (serverVersion) {            
          protocolVersion = Number(serverData[1]);
          _ecl.setProtocolVersion(protocolVersion.toString());
        }
      }

      if (serverData.hasOwnProperty('code') &&
          serverData.code === '-777') {
        resolve(-777);
      }

      api.log(`ecl ${`${_ecl.host}:${_ecl.port}:${_ecl.protocol || 'tcp'}`} protocol version: ${protocolVersion}`, 'ecl.manager');
      resolve(protocolVersion);
    });
  });
};

module.exports = (api) => {
  api.eclStack = [];

  api.eclManager = {
    getServer: async(coin, customServer) => {
      if (customServer) api.log(`custom server ${customServer.ip}:${customServer.port}:${customServer.proto}`, 'ecl.manager');
      if ((customServer && !electrumServers[coin][`${customServer.ip}:${customServer.port}:${customServer.proto}`]) ||
          !electrumServers[coin] ||
          (electrumServers[coin] && !Object.keys(electrumServers[coin]).length)) {
        let serverStr = '';

        if (!customServer) {
          serverStr = [
            api.electrum.coinData[coin].server.ip,
            api.electrum.coinData[coin].server.port,
            api.electrum.coinData[coin].server.proto
          ];
        } else {
          serverStr = [
            customServer.ip,
            customServer.port,
            customServer.proto
          ];
        }

        api.log('ecl server doesnt exist yet, lets add', 'ecl.manager')

        const ecl = new api.electrumJSCore(serverStr[1], serverStr[0], serverStr[2]);
        api.log(`ecl conn ${serverStr}`, 'ecl.manager');
        ecl.connect();
        api.log(`ecl req protocol ${serverStr}`, 'ecl.manager');
        const eclProtocolVersion = await getProtocolVersion(ecl, api);
        
        if (!electrumServers[coin]) {
          electrumServers[coin] = {};
        }

        electrumServers[coin][serverStr.join(':')] = {
          server: ecl,
          lastReq: Date.now(),
          lastPing: Date.now(),
        };

        return electrumServers[coin][serverStr.join(':')].server;
      } else {
        if (customServer) {
          api.log(`ecl ${coin} server exists, custom server param provided`, 'ecl.manager');
          let ecl = electrumServers[coin][`${customServer.ip}:${customServer.port}:${customServer.proto}`];
          ecl.lastReq = Date.now();
          return ecl.server;
        } else {
          api.log(`ecl ${coin} server exists`, 'ecl.manager');
          let ecl = Object.keys(electrumServers[coin]) > 1 ? electrumServers[coin][Object.keys(electrumServers[coin])[getRandomIntInclusive(0, Object.keys(electrumServers[coin]).length)]] : electrumServers[coin][Object.keys(electrumServers[coin])[0]];
          ecl.lastReq = Date.now();
          return ecl.server;
        }
      }
    }
  };

  api.initElectrumManager = () => {
    setInterval(() => {
      for (let coin in electrumServers) {
        api.log(`ecl check coin ${coin}`, 'ecl.manager');

        for (let serverStr in electrumServers[coin]) {
          const pingSecPassed = checkTimestamp(electrumServers[coin][serverStr].lastPing);
          api.log(`ping sec passed ${pingSecPassed}`, 'ecl.manager');
          
          if (pingSecPassed > PING_TIME) {
            api.log(`ecl ${coin} ${serverStr} ping limit passed, send ping`, 'ecl.manager');

            getProtocolVersion(electrumServers[coin][serverStr].server, api)
            .then((eclProtocolVersion) => {
              if (eclProtocolVersion === 'sent') {
                api.log(`ecl ${coin} ${serverStr} ping success`, 'ecl.manager');
                electrumServers[coin][serverStr].lastPing = Date.now();
              } else {
                api.log(`ecl ${coin} ${serverStr} ping fail, remove server`, 'ecl.manager');
                delete electrumServers[coin][serverStr];
              }
            });
          }

          const reqSecPassed = checkTimestamp(electrumServers[coin][serverStr].lastReq);
          api.log(`req sec passed ${reqSecPassed}`, 'ecl.manager');
          
          if (reqSecPassed > MAX_IDLE_TIME) {
            api.log(`ecl ${coin} ${serverStr} req limit passed, disconnect server`, 'ecl.manager');
            electrumServers[coin][serverStr].server.close();
            delete electrumServers[coin][serverStr];
          }
        }
      }

      //api.checkOpenElectrumConnections();
    }, CHECK_INTERVAL);
  };

  return api;
};
const { checkTimestamp } = require('agama-wallet-lib/src/time');
const { getRandomIntInclusive } = require('agama-wallet-lib/src/utils');
//const electrumJSCore = require('../electrumjs/electrumjs.core.js');

const CHECK_INTERVAL = 1000;
const MAX_TIME = 30; // s
const MAX_IDLE_TIME = 5 * 60;
const PING_TIME = 60;

// TODO: reconnect/cycle if electrum server is not responding

let electrumServers = {};
let lock = {};

getProtocolVersion = (_ecl) => {
  let protocolVersion;
  
  return new Promise((resolve, reject) => {
    _ecl.serverVersion('VerusDesktop')
    .then((serverData) => {
      if (serverData &&
          JSON.stringify(serverData).indexOf('server.version already sent') > -1) {
        console.log('server version already sent');
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

      console.log(`ecl ${`${_ecl.host}:${_ecl.port}:${_ecl.protocol || 'tcp'}`} protocol version: ${protocolVersion}`);
      resolve(protocolVersion);
    });
  });
};

module.exports = (api) => {
  api.eclStack = [];

  api.eclManager = {
    getServer: async(coin, customServer) => {
      if (customServer) console.log(`custom server ${customServer.ip}:${customServer.port}:${customServer.proto}`);
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

        console.log('ecl server doesnt exist yet, lets add')

        const ecl = new api.electrumJSCore(serverStr[1], serverStr[0], serverStr[2]);
        console.log(`ecl conn ${serverStr}`);
        ecl.connect();
        console.log(`ecl req protocol ${serverStr}`);
        const eclProtocolVersion = await getProtocolVersion(ecl);
        
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
          console.log(`ecl ${coin} server exists, custom server param provided`);
          let ecl = electrumServers[coin][`${customServer.ip}:${customServer.port}:${customServer.proto}`];
          ecl.lastReq = Date.now();
          return ecl.server;
        } else {
          console.log(`ecl ${coin} server exists`);
          let ecl = Object.keys(electrumServers[coin]) > 1 ? electrumServers[coin][Object.keys(electrumServers[coin])[getRandomIntInclusive(0, Object.keys(electrumServers[coin]).length)]] : electrumServers[coin][Object.keys(electrumServers[coin])[0]];
          ecl.lastReq = Date.now();
          return ecl.server;
        }
      }
    }
  };

  return api;
};
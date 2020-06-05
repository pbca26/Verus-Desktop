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
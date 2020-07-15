const fs = require('fs-extra');
const path = require('path');
let _foldersInitRan = false;

module.exports = (api) => {
  api.readVersionFile = () => {
    // read app version
    const rootLocation = path.join(__dirname, '../../');
    const localVersionFile = fs.readFileSync(`${rootLocation}version`, 'utf8');

    return localVersionFile;
  }

  api.createAgamaDirs = () => {
    if (!_foldersInitRan) {
      const rootLocation = path.join(__dirname, '../../');

      fs.readdir(rootLocation, (err, items) => {
        for (let i = 0; i < items.length; i++) {
          if (items[i].substr(0, 3) === 'gen') {
            api.log(`remove ${items[i]}`, 'init');
            fs.unlinkSync(rootLocation + items[i]);
          }
        }
      });

      //COPY OVER STUF FROM "COPY THIS OVER" MARKER
      /*if (!fs.existsSync(api.agamaDir)) {
        fs.mkdirSync(api.agamaDir);

        if (fs.existsSync(api.agamaDir)) {
          api.log(`created agama folder at ${api.agamaDir}`, 'init');
          api.writeLog(`created agama folder at ${api.agamaDir}`);
        }
      } else {
        api.log('agama folder already exists', 'init');
      }*/

      //COPY THIS OVER
      if (!fs.existsSync(api.agamaDir)) {
        fs.mkdirSync(api.agamaDir);

        if (fs.existsSync(api.agamaDir)) {
          api.log(`created verus agama folder at ${api.agamaDir}`, 'init');
          api.writeLog(`created verus agama folder at ${api.agamaDir}`);
        }
      } else {
        api.log('verus agama folder already exists', 'init');
      }

      if (!fs.existsSync(`${api.agamaDir}/shepherd`)) {
        fs.mkdirSync(`${api.agamaDir}/shepherd`);

        if (fs.existsSync(`${api.agamaDir}/shepherd`)) {
          api.log(`created shepherd folder at ${api.agamaDir}/shepherd`, 'init');
          api.writeLog(`create shepherd folder at ${api.agamaDir}/shepherd`);
        }
      } else {
        api.log('agama/shepherd folder already exists', 'init');
      }

      const _subFolders = [
        'pin',
        'csv',
        'log',
        'currencies'
      ];

      for (let i = 0; i < _subFolders.length; i++) {
        if (!fs.existsSync(`${api.agamaDir}/shepherd/${_subFolders[i]}`)) {
          fs.mkdirSync(`${api.agamaDir}/shepherd/${_subFolders[i]}`);

          if (fs.existsSync(`${api.agamaDir}/shepherd/${_subFolders[i]}`)) {
            api.log(`created ${_subFolders[i]} folder at ${api.agamaDir}/shepherd/${_subFolders[i]}`, 'init');
            api.writeLog(`create ${_subFolders[i]} folder at ${api.agamaDir}/shepherd/${_subFolders[i]}`);
          }
        } else {
          api.log(`shepherd/${_subFolders[i]} folder already exists`, 'init');
        }
      }

      if (!fs.existsSync(api.zcashParamsDir)) {
        fs.mkdirSync(api.zcashParamsDir);
      } else {
        api.log('zcashparams folder already exists', 'init');
      }

      api.compareNSPVCoinsFile();

      _foldersInitRan = true;
    }
  }

  api.compareNSPVCoinsFile = () => {
    const rootLocation = path.join(__dirname, '../../');
    const nspvCoinsAgamaDirSize = fs.existsSync(`${api.agamaDir}/coins`) && fs.lstatSync(`${api.agamaDir}/coins`);
    let localNSPVCoinsFile = fs.lstatSync(`${rootLocation}/routes/nspv_coins`);
    
    if (!nspvCoinsAgamaDirSize ||
        (nspvCoinsAgamaDirSize && nspvCoinsAgamaDirSize.size !== localNSPVCoinsFile.size)) {
      api.log('NSPV coins file mismatch, copy over', 'init');
      localNSPVCoinsFile = fs.readFileSync(`${rootLocation}/routes/nspv_coins`, 'utf8');
      fs.writeFileSync(`${api.agamaDir}/coins`, localNSPVCoinsFile, 'utf8');
    } else {
      api.log('NSPV coins file is matching', 'init');
    }

    api.parseNSPVports();
  };

  api.parseNSPVports = () => {
    const rootLocation = path.join(__dirname, '../../');
    const nspvCoinsAgamaDirExists = fs.existsSync(`${api.agamaDir}/coins`);
    let nspvPorts = {};
    
    if (nspvCoinsAgamaDirExists) {
      const nspvCoinsContent = fs.readFileSync(`${api.agamaDir}/coins`, 'utf8');

      try {
        const nspvCoinsContentJSON = JSON.parse(nspvCoinsContent);

        for (let item of nspvCoinsContentJSON) {
          nspvPorts[item.coin] = item.rpcport;
        }
        api.log(`NSPV coins file ${nspvCoinsContentJSON.length} supported coins`, 'init');
      } catch (e) {
        api.log('NSPV coins file unable to parse!', 'init');
      }
    } else {
      api.log('NSPV coins file doesn\'t exist!', 'init');
    }

    api.nspvPorts = nspvPorts;
    
    // extend dpow coins list
    const dpowCoins = Object.keys(nspvPorts);
    api.dpowCoins = [...new Set([].concat(...[api.dpowCoins, dpowCoins]))];
  };

  return api;
};
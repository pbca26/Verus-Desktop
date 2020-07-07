const fs = require('fs-extra');
const path = require('path');
let _foldersInitRan = false;

module.exports = (api) => {
  // Moves existing data to new directory
  api.updateDataFolderFormatv071 = () => {
    const oldDirs = [
      `shepherd`,
      `config.json`,
      `users.json`
    ];

    oldDirs.forEach((dir) => {
      if (fs.existsSync(`${api.VerusDesktopDir}/${dir}`)) {
        try {
          fs.copySync(`${api.VerusDesktopDir}/${dir}`, `${api.agamaDir}/${dir}`)

          api.log(`copied ${api.VerusDesktopDir}/${dir} to ${api.agamaDir}/${dir}`, 'init');
          api.writeLog(`copied ${api.VerusDesktopDir}/${dir} to ${api.agamaDir}/${dir}`);
        } catch(e) {
          api.log(`error copying ${api.VerusDesktopDir}/${dir} to ${api.agamaDir}/${dir}`, 'init');
          api.writeLog(`error copying ${api.VerusDesktopDir}/${dir} to ${api.agamaDir}/${dir}`);
        }
      }
    })
  }

  api.isOldDataFolderFormat = () => {    
    return (
      fs.existsSync(api.VerusDesktopDir) &&
      !fs.existsSync(api.agamaDir)
    ) 
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

      if (!fs.existsSync(api.VerusDesktopDir)) {
        fs.mkdirSync(api.VerusDesktopDir);

        if (fs.existsSync(api.VerusDesktopDir)) {
          api.log(`created verus desktop main folder at ${api.VerusDesktopDir}`, 'init');
          api.writeLog(`created verus desktop main folder at ${api.VerusDesktopDir}`);
        }
      } else {
        api.log('verus desktop main folder already exists', 'init');
      }

      if (!fs.existsSync(api.agamaDir)) {  
        if (api.isOldDataFolderFormat()) {
          fs.mkdirSync(api.agamaDir);
          api.updateDataFolderFormatv071()
        } else {
          fs.mkdirSync(api.agamaDir);
        }

        if (fs.existsSync(api.agamaDir)) {
          api.log(`created verus desktop appdata folder at ${api.agamaDir}`, 'init');
          api.writeLog(`created verus desktop appdata folder at ${api.agamaDir}`);
        }
      } else {
        api.log('verus desktop appdata folder already exists', 'init');
      }

      if (!fs.existsSync(api.backupDir)) {
        fs.mkdirSync(api.backupDir);

        if (fs.existsSync(api.backupDir)) {
          api.log(`created verus desktop backup folder at ${api.agamaDir}`, 'init');
          api.writeLog(`created verus desktop backup folder at ${api.agamaDir}`);
        }
      } else {
        api.log('verus desktop backup folder already exists', 'init');
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

      _foldersInitRan = true;
    }
  }

  return api;
};
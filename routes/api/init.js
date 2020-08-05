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
      if (fs.existsSync(`${api.paths.VerusDesktopDir}/${dir}`)) {
        try {
          fs.copySync(`${api.paths.VerusDesktopDir}/${dir}`, `${api.paths.agamaDir}/${dir}`)

          api.log(`copied ${api.paths.VerusDesktopDir}/${dir} to ${api.paths.agamaDir}/${dir}`, 'init');
          api.writeLog(`copied ${api.paths.VerusDesktopDir}/${dir} to ${api.paths.agamaDir}/${dir}`);
        } catch(e) {
          api.log(`error copying ${api.paths.VerusDesktopDir}/${dir} to ${api.paths.agamaDir}/${dir}`, 'init');
          api.writeLog(`error copying ${api.paths.VerusDesktopDir}/${dir} to ${api.paths.agamaDir}/${dir}`);
        }
      }
    })
  }

  api.isOldDataFolderFormat = () => {    
    return (
      fs.existsSync(api.paths.VerusDesktopDir) &&
      !fs.existsSync(api.paths.agamaDir)
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

      if (!fs.existsSync(api.paths.VerusDesktopDir)) {
        fs.mkdirSync(api.paths.VerusDesktopDir);

        if (fs.existsSync(api.paths.VerusDesktopDir)) {
          api.log(`created verus desktop main folder at ${api.paths.VerusDesktopDir}`, 'init');
          api.writeLog(`created verus desktop main folder at ${api.paths.VerusDesktopDir}`);
        }
      } else {
        api.log('verus desktop main folder already exists', 'init');
      }

      if (!fs.existsSync(api.paths.agamaDir)) {  
        if (api.isOldDataFolderFormat()) {
          fs.mkdirSync(api.paths.agamaDir);
          api.updateDataFolderFormatv071()
        } else {
          fs.mkdirSync(api.paths.agamaDir);
        }

        if (fs.existsSync(api.paths.agamaDir)) {
          api.log(`created verus desktop appdata folder at ${api.paths.agamaDir}`, 'init');
          api.writeLog(`created verus desktop appdata folder at ${api.paths.agamaDir}`);
        }
      } else {
        api.log('verus desktop appdata folder already exists', 'init');
      }

      if (!fs.existsSync(api.paths.backupDir)) {
        fs.mkdirSync(api.paths.backupDir);

        if (fs.existsSync(api.paths.backupDir)) {
          api.log(`created verus desktop backup folder at ${api.paths.agamaDir}`, 'init');
          api.writeLog(`created verus desktop backup folder at ${api.paths.agamaDir}`);
        }
      } else {
        api.log('verus desktop backup folder already exists', 'init');
      }

      if (!fs.existsSync(`${api.paths.agamaDir}/shepherd`)) {
        fs.mkdirSync(`${api.paths.agamaDir}/shepherd`);

        if (fs.existsSync(`${api.paths.agamaDir}/shepherd`)) {
          api.log(`created shepherd folder at ${api.paths.agamaDir}/shepherd`, 'init');
          api.writeLog(`create shepherd folder at ${api.paths.agamaDir}/shepherd`);
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
        if (!fs.existsSync(`${api.paths.agamaDir}/shepherd/${_subFolders[i]}`)) {
          fs.mkdirSync(`${api.paths.agamaDir}/shepherd/${_subFolders[i]}`);

          if (fs.existsSync(`${api.paths.agamaDir}/shepherd/${_subFolders[i]}`)) {
            api.log(`created ${_subFolders[i]} folder at ${api.paths.agamaDir}/shepherd/${_subFolders[i]}`, 'init');
            api.writeLog(`create ${_subFolders[i]} folder at ${api.paths.agamaDir}/shepherd/${_subFolders[i]}`);
          }
        } else {
          api.log(`shepherd/${_subFolders[i]} folder already exists`, 'init');
        }
      }

      if (!fs.existsSync(api.paths.zcashParamsDir)) {
        fs.mkdirSync(api.paths.zcashParamsDir);
      } else {
        api.log('zcashparams folder already exists', 'init');
      }

      _foldersInitRan = true;
    }
  }

  return api;
};
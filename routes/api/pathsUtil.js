const path = require('path');
const fixPath = require('fix-path');
const os = require('os');

const pathsAgama = (api) => {
  if (!api) api = {};

  if (global.USB_MODE) {
    if (os.platform() === 'darwin') fixPath()

    api.VerusDesktopDir = `${global.HOME}/Verus-Desktop`;
    api.agamaDir = `${global.HOME}/Verus-Desktop/appdata`;
    api.backupDir = `${global.HOME}/Verus-Desktop/backups`;

    if (os.platform() === 'win32') {
      api.VerusDesktopDir = path.normalize(api.VerusDesktopDir);
      api.agamaDir = path.normalize(api.agamaDir);
      api.backupDir = path.normalize(api.backupDir);
    }

    return api;
  } else {
    switch (os.platform()) {
      case "darwin":
        fixPath();
        api.VerusDesktopDir = `${global.HOME}/Library/Application Support/Verus-Desktop`;

        api.agamaDir = `${global.HOME}/Library/Application Support/Verus-Desktop/appdata`;
        api.backupDir = `${global.HOME}/Library/Application Support/Verus-Desktop/backups`;
        return api;
        break;

      case "linux":
        api.VerusDesktopDir = `${global.HOME}/.verus-desktop`;

        api.agamaDir = `${global.HOME}/.verus-desktop/appdata`;
        api.backupDir = `${global.HOME}/.verus-desktop/backups`;
        return api;
        break;

      case "win32":
        api.VerusDesktopDir = `${global.HOME}/Verus-Desktop`;
        api.VerusDesktopDir = path.normalize(api.VerusDesktopDir);

        api.agamaDir = `${global.HOME}/Verus-Desktop/appdata`;
        api.agamaDir = path.normalize(api.agamaDir);

        api.backupDir = `${global.HOME}/Verus-Desktop/backups`;
        api.backupDir = path.normalize(api.backupDir);
        return api;
        break;
    }
  }
};

const pathsDaemons = (api) => {
  if (!api) api = {};

  if (global.USB_MODE) {
    switch (os.platform()) {
      case 'darwin':
        fixPath();
        api.komodocliDir = path.join(__dirname, '../../assets/bin/osx'),
        api.kmdDir = `${global.HOME}/Komodo`,
        api.vrscDir = `${global.HOME}/Komodo/VRSC`,
        api.verusDir = `${global.HOME}/Verus`,
        api.verusTestDir = `${global.HOME}/VerusTest`,
        api.zcashParamsDir = `${global.HOME}/ZcashParams`,
        api.chipsDir = `${global.HOME}/Chips`,
        api.mmBin = path.join(__dirname, '../../node_modules/marketmaker/bin/darwin/x64/marketmaker');
        return api;
        break;
  
      case 'linux':
        api.komodocliDir = path.join(__dirname, '../../assets/bin/linux64'),
        api.kmdDir = `${global.HOME}/Komodo`,
        api.vrscDir = `${global.HOME}/Komodo/VRSC`,
        api.verusDir = `${global.HOME}/Verus`,
        api.verusTestDir = `${global.HOME}/VerusTest`,
        api.zcashParamsDir = `${global.HOME}/ZcashParams`,
        api.chipsDir = `${global.HOME}/Chips`,
        api.mmBin = path.join(__dirname, '../../node_modules/marketmaker/bin/linux/x64/marketmaker');
        return api;
        break;
  
      case 'win32':
        api.komodocliDir = path.join(__dirname, '../../assets/bin/win64'),
        api.komodocliDir = path.normalize(api.komodocliDir),
        api.kmdDir = `${global.HOME}/Komodo`,
        api.kmdDir = path.normalize(api.kmdDir),
        api.vrscDir = `${global.HOME}/Komodo/VRSC`,
        api.vrscDir = path.normalize(api.vrscDir),
        api.verusDir = `${global.HOME}/Verus`,
        api.verusDir = path.normalize(api.verusDir),
        api.verusTestDir = `${global.HOME}/VerusTest`,
        api.verusTestDir = path.normalize(api.verusTestDir),
        api.chipsDir = `${global.HOME}/Chips`,
        api.chipsDir = path.normalize(api.chipsDir);
        api.zcashParamsDir = `${global.HOME}/ZcashParams`;
        api.zcashParamsDir = path.normalize(api.zcashParamsDir);
        api.mmBin = path.join(__dirname, '../../node_modules/marketmaker/bin/win32/x64/marketmaker.exe');
        api.mmBin = path.normalize(api.mmBin);
        return api;
        break;
    }
  } else {
    switch (os.platform()) {
      case 'darwin':
        fixPath();
        api.komodocliDir = path.join(__dirname, '../../assets/bin/osx'),
        api.kmdDir = `${global.HOME}/Library/Application Support/Komodo`,
        api.vrscDir = `${global.HOME}/Library/Application Support/Komodo/VRSC`,
        api.verusDir = `${global.HOME}/Library/Application Support/Verus`,
        api.verusTestDir = `${global.HOME}/Library/Application Support/VerusTest`,
        api.zcashParamsDir = `${global.HOME}/Library/Application Support/ZcashParams`,
        api.chipsDir = `${global.HOME}/Library/Application Support/Chips`,
        api.mmBin = path.join(__dirname, '../../node_modules/marketmaker/bin/darwin/x64/marketmaker');
        return api;
        break;
  
      case 'linux':
        api.komodocliDir = path.join(__dirname, '../../assets/bin/linux64'),
        api.kmdDir = `${global.HOME}/.komodo`,
        api.vrscDir = `${global.HOME}/.komodo/VRSC`,
        api.verusDir = `${global.HOME}/.verus`,
        api.verusTestDir = `${global.HOME}/.verustest`,
        api.zcashParamsDir = `${global.HOME}/.zcash-params`,
        api.chipsDir = `${global.HOME}/.chips`,
        api.mmBin = path.join(__dirname, '../../node_modules/marketmaker/bin/linux/x64/marketmaker');
        return api;
        break;
  
      case 'win32':
        api.komodocliDir = path.join(__dirname, '../../assets/bin/win64'),
        api.komodocliDir = path.normalize(api.komodocliDir),
        api.kmdDir = `${global.HOME}/Komodo`,
        api.kmdDir = path.normalize(api.kmdDir),
        api.vrscDir = `${global.HOME}/Komodo/VRSC`,
        api.vrscDir = path.normalize(api.vrscDir),
        api.verusDir = `${global.HOME}/Verus`,
        api.verusDir = path.normalize(api.verusDir),
        api.verusTestDir = `${global.HOME}/VerusTest`,
        api.verusTestDir = path.normalize(api.verusTestDir),
        api.chipsDir = `${global.HOME}/Chips`,
        api.chipsDir = path.normalize(api.chipsDir);
        api.zcashParamsDir = `${global.HOME}/ZcashParams`;
        api.zcashParamsDir = path.normalize(api.zcashParamsDir);
        api.mmBin = path.join(__dirname, '../../node_modules/marketmaker/bin/win32/x64/marketmaker.exe');
        api.mmBin = path.normalize(api.mmBin);
        return api;
        break;
    }
  }
  
}

const setDaemonPath = (api, daemonName) => {
  if (!api) api = {};

  let binName = daemonName + "Bin";
  switch (os.platform()) {
    case 'darwin':
      fixPath();
      api[binName] = path.join(__dirname, `../../assets/bin/osx/${daemonName}/${daemonName}`);
      return api;
      break;
    case 'linux':
      api[binName] = path.join(__dirname, `../../assets/bin/linux64/${daemonName}/${daemonName}`);
      return api;
      break;
    case 'win32':
      api[binName] = path.join(__dirname, `../../assets/bin/win64/${daemonName}/${daemonName}.exe`),
      api[binName] = path.normalize(api[binName]);
      return api;
      break;
  }
}

const setCoinDir = (api, coin, dirNames) => {
  if (!api) api = {};
  const { darwin, linux, win32 } = dirNames

  let dirName = coin + "Dir";
  switch (os.platform()) {
    case 'darwin':
      fixPath();
      api[dirName] = global.USB_MODE
        ? `${global.HOME}/${darwin}`
        : `${global.HOME}/Library/Application Support/${darwin}`;
      return api;
    case 'linux':
      api[dirName] = `${global.HOME}/${linux}`
      return api;
    case 'win32':
      api[dirName] = `${global.HOME}/${win32}`,
      api[dirName] = path.normalize(api[dirName]);
      return api;
  }
}

module.exports = {
  pathsAgama,
  pathsDaemons,
  setDaemonPath,
  setCoinDir
};

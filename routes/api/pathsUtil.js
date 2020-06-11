const path = require('path');
const fixPath = require('fix-path');
const os = require('os');

const pathsAgama = (api) => {
  if (!api) api = {};

  switch (os.platform()) {
    case 'darwin':
      fixPath();
      //api.agamaDirKMD = `${process.env.HOME}/Library/Application Support/Agama`;

      api.agamaDir = `${process.env.HOME}/Library/Application Support/Verus-Desktop`;
      return api;
      break;

    case 'linux':
      //api.agamaDirKMD = `${process.env.HOME}/.agama`;

      api.agamaDir = `${process.env.HOME}/.verus-desktop`;
      return api;
      break;

    case 'win32':
      //api.agamaDirKMD = `${process.env.APPDATA}/Agama`;
      //api.agamaDirKMD = path.normalize(api.agamaDirKMD);

      api.agamaDir = `${process.env.APPDATA}/Verus-Desktop`;
      api.agamaDir = path.normalize(api.agamaDir);
      return api;
      break;
  }
};

const pathsDaemons = (api) => {
  if (!api) api = {};

  switch (os.platform()) {
    case 'darwin':
      fixPath();
      api.komodocliDir = path.join(__dirname, '../../assets/bin/osx'),
      api.kmdDir = `${process.env.HOME}/Library/Application Support/Komodo`,
      api.vrscDir = `${process.env.HOME}/Library/Application Support/Komodo/VRSC`,
      api.verusDir = `${process.env.HOME}/Library/Application Support/Verus`,
      api.verusTestDir = `${process.env.HOME}/Library/Application Support/VerusTest`,
      api.zcashParamsDir = `${process.env.HOME}/Library/Application Support/ZcashParams`,
      api.chipsDir = `${process.env.HOME}/Library/Application Support/Chips`,
      api.mmBin = path.join(__dirname, '../../node_modules/marketmaker/bin/darwin/x64/marketmaker');
      return api;
      break;

    case 'linux':
      api.komodocliDir = path.join(__dirname, '../../assets/bin/linux64'),
      api.kmdDir = `${process.env.HOME}/.komodo`,
      api.vrscDir = `${process.env.HOME}/.komodo/VRSC`,
      api.verusDir = `${process.env.HOME}/.verus`,
      api.verusTestDir = `${process.env.HOME}/.verustest`,
      api.zcashParamsDir = `${process.env.HOME}/.zcash-params`,
      api.chipsDir = `${process.env.HOME}/.chips`,
      api.mmBin = path.join(__dirname, '../../node_modules/marketmaker/bin/linux/x64/marketmaker');
      return api;
      break;

    case 'win32':
      api.komodocliDir = path.join(__dirname, '../../assets/bin/win64'),
      api.komodocliDir = path.normalize(api.komodocliDir),
      api.kmdDir = `${process.env.APPDATA}/Komodo`,
      api.kmdDir = path.normalize(api.kmdDir),
      api.vrscDir = `${process.env.APPDATA}/Komodo/VRSC`,
      api.vrscDir = path.normalize(api.vrscDir),
      api.verusDir = `${process.env.APPDATA}/Verus`,
      api.verusDir = path.normalize(api.verusDir),
      api.verusTestDir = `${process.env.APPDATA}/VerusTest`,
      api.verusTestDir = path.normalize(api.verusTestDir),
      api.chipsDir = `${process.env.APPDATA}/Chips`,
      api.chipsDir = path.normalize(api.chipsDir);
      api.zcashParamsDir = `${process.env.APPDATA}/ZcashParams`;
      api.zcashParamsDir = path.normalize(api.zcashParamsDir);
      api.mmBin = path.join(__dirname, '../../node_modules/marketmaker/bin/win32/x64/marketmaker.exe');
      api.mmBin = path.normalize(api.mmBin);
      return api;
      break;
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
      api[dirName] = `${process.env.HOME}/Library/Application Support/${darwin}`
      return api;
    case 'linux':
      api[dirName] = `${process.env.HOME}/${linux}`
      return api;
    case 'win32':
      api[dirName] = `${process.env.APPDATA}/${win32}`,
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

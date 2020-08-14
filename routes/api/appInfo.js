const fs = require('fs-extra');
const os = require('os');
const { formatBytes } = require('agama-wallet-lib/src/utils');

module.exports = (api) => {
  api.SystemInfo = () => {
    const os_data = {
      totalmem_bytes: os.totalmem(),
      totalmem_readable: formatBytes(os.totalmem()),
      arch: os.arch(),
      cpu: os.cpus()[0].model,
      cpu_cores: os.cpus().length,
      platform: os.platform(),
      os_release: os.release(),
      os_type: os.type(),
    };

    return os_data;
  }

  api.appInfo = () => {
    const sysInfo = api.SystemInfo();
    const releaseInfo = api.appBasicInfo;
    const dirs = {
      agamaDir: api.paths.agamaDir,
      kmdDir: api.paths.kmdDir,
      komododBin: api.komododBin,
      configLocation: `${api.paths.agamaDir}/config.json`,
      cacheLocation: `${api.paths.agamaDir}/spv-cache.json`,
    };
    let spvCacheSize = '2 Bytes';

    try {
      spvCacheSize = formatBytes(fs.lstatSync(`${api.paths.agamaDir}/spv-cache.json`).size);
    } catch (e) {}

    return {
      sysInfo,
      releaseInfo,
      dirs,
      cacheSize: spvCacheSize,
    };
  }

  /*
   *  type: POST
   *
   */
  api.post('/sysinfo', (req, res, next) => {
    if (api.checkToken(req.body.token)) {
      const obj = api.SystemInfo();
      res.send(obj);
    } else {
      const retObj = {
        msg: 'error',
        result: 'unauthorized access',
      };

      res.end(JSON.stringify(retObj));
    }
  });

  /*
   *  type: POST
   *
   */
  api.post('/appinfo', (req, res, next) => {
    if (api.checkToken(req.body.token)) {
      const obj = api.appInfo();
      res.send(obj);
    } else {
      const retObj = {
        msg: 'error',
        result: 'unauthorized access',
      };

      res.end(JSON.stringify(retObj));
    }
  });

  return api;
};
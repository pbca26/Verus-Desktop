const fs = require('fs-extra');

module.exports = (api) => {
  /**
   * Backs up all necessary app data stored for Verus Desktop
   */
  api.backupAppData = async (backupName) => {
    if (
      backupName.includes(".") ||
      backupName.includes("/") ||
      backupName.includes("\\") ||
      backupName.includes("*") ||
      backupName.includes("~") || 
      backupName == null
    ) {
      throw new Error(`Backup data name (${backupName}) cannot include any of the following: ./\\*~`)
    }

    try {
      await fs.access(api.paths.agamaDir, fs.constants.R_OK);
    } catch (e) {
      if (e.code == "EACCES") {
        await fs.chmod(path, "0666");
      } else if (e.code === "ENOENT") {
        api.handleFileProblem(`Verus Desktop directory not found`, !handleErrors)
        return
      }
    }

    try {
      const backupPath = `${api.paths.backupDir}/${backupName}`

      if (await fs.exists(backupPath)) {
        throw new Error(`Backup at ${backupPath} already exists!`)
      }

      await fs.copy(api.paths.agamaDir, backupPath);

      api.log(
        `appdata backup created at ${backupPath}`,
        "backup"
      );
      api.writeLog(`appdata backup created at ${backupPath}`);
      return
    } catch (e) {
      api.log(e, 'backup');
      api.writeLog(e)
      throw e
    }
  };

  api.post('/backup_appdata', async (req, res, next) => {
    const { token, dirName } = req.body
   
    if (api.checkToken(token)) {
      try {
        const retObj = {
          msg: 'success',
          result: await api.backupAppData(dirName),
        };

        res.end(JSON.stringify(retObj));
      } catch (e) {
        const retObj = {
          msg: 'error',
          result: e.message,
        };

        res.end(JSON.stringify(retObj));
      }
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
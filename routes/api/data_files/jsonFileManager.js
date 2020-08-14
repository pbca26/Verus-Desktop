const fs = require('fs-extra');
const _fs = require('graceful-fs');
const fsnode = require('fs');
const { ALLOWED_PATHS_ARR } = require('../utils/constants/index');
const appInfo = require('../appInfo');

module.exports = (api) => {
  api.handleFileProblem = (desc, throwError) => {
    api.log(desc, 'jsonFileManager');
    api.writeLog(desc)

    if (throwError) {
      throw new Error(desc)
    }  
  }

  /**
   * Loads a JSON object from a filepath,
   * and saves it as empty with a description
   * if it doesnt exist
   */
  api.loadJsonFile = async (relativePath, description, handleMissing = true) => {
    if (ALLOWED_PATHS_ARR.includes(relativePath)) {
      const path = `${api.paths.agamaDir}/${relativePath}`

      if (fs.existsSync(path)) {
        let localString = await fs.readFile(path, 'utf8');
        let localJson
        
        try {
          localJson = JSON.parse(localString);

          if (localJson.data == null || localJson.description == null) {
            api.handleFileProblem(`${path} file detected with deprecated format.`, !handleMissing)
            await api.saveJsonFile({}, relativePath, description);
          } else {
            localJson = localJson.data
          }
        } catch (e) {
          console.log(e)

          api.handleFileProblem(`unable to parse local ${path}`, !handleMissing)
          localJson = {};
        }
  
        api.log(`${path} set from local file`, 'loadJsonFile');
        api.writeLog(`${path} set from local file`);
  
        return localJson
      } else {
        api.handleFileProblem(`local ${path} file is not found, saving empty json file.`, !handleMissing)
        await api.saveJsonFile({}, relativePath, description);
  
        return {};
      }
    } else {
      api.handleFileProblem(`${path} path is not on the approved list of file paths, aborting and returning empty JSON.`, !handleMissing)

      return {};
    }
  };

  /**
   * Saves JSON object to file, with optional description
   * for those who want to look at the file
   */
  api.saveJsonFile = async (
    json,
    relativePath,
    description = "No description for this file was provided by the wallet devs :(",
    handleErrors = true
  ) => {
    if (ALLOWED_PATHS_ARR.includes(relativePath)) {
      const path = `${api.paths.agamaDir}/${relativePath}`;

      try {
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

        await fs.writeFile(
          path,
          JSON.stringify({ description, data: json }),
          "utf8"
        );

        api.log(
          `json file is created successfully at: ${path}`,
          "saveJsonFile"
        );
        api.writeLog(`json file is created successfully at: ${path}`);
        return
      } catch (e) {
        api.handleFileProblem(e, !handleErrors)
        return
      }
    } else {
      api.handleFileProblem(`${path} path is not on the approved list of file paths, aborting file save.`, !handleErrors)
      return
    }
  };

  api = require('./currencyData')(api)
  api = require('./nameCommitments')(api)
  api = require('./backup')(api)
  api = require('./updateLog')(api)
  return api;
};
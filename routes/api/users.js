const fs = require('fs-extra');
const _fs = require('graceful-fs');
const fsnode = require('fs');
const Promise = require('bluebird');

module.exports = (api) => {
  api.loadLocalUsers = () => {
    if (fs.existsSync(`${api.agamaDir}/users.json`)) {
      let localUsersJson = fs.readFileSync(`${api.agamaDir}/users.json`, 'utf8');
      let localUsers
      
      try {
        localUsers = JSON.parse(localUsersJson);
      } catch (e) {
        api.log('unable to parse local users.json', 'users');
        localUsers = {};
      }

      api.log('users set from local file', 'users');
      api.writeLog('users set from local file');

      return localUsers
    } else {
      api.log('local users file is not found, saving empty json file.', 'users');
      api.writeLog('local users file is not found, saving empty json file.');
      api.saveLocalUsers({});

      return {};
    }
  };

  api.saveLocalUsers = (users) => {
    const usersFileName = `${api.agamaDir}/users.json`;

    try {
      try {
        _fs.accessSync(api.agamaDir, fs.constants.R_OK)
      } catch (e) {
        if (e.code == 'EACCES') {
          fsnode.chmodSync(usersFileName, '0666');
        } else if (e.code === 'ENOENT') {
          api.log('users directory not found', 'users');
        }
      }
     
      fs.writeFileSync(usersFileName,
                  JSON.stringify(users), 'utf8');

      
      api.log('users.json write file is done', 'users');
      api.log(`app users.json file is created successfully at: ${api.agamaDir}`, 'users');
      api.writeLog(`app users.json file is created successfully at: ${api.agamaDir}`);
    } catch (e) {
      api.log('error writing users', 'users');
      api.log(e, 'users');
    }
  }

  api.backupLocalUsers = () => {
    const users = api.loadLocalUsers()
    const usersFileName = `${api.agamaDir}/users_backup_${new Date().getTime()}.json`;

    try {
      try {
        _fs.accessSync(api.agamaDir, fs.constants.R_OK)
      } catch (e) {
        if (e.code == 'EACCES') {
          fsnode.chmodSync(usersFileName, '0666');
        } else if (e.code === 'ENOENT') {
          api.log('users directory not found', 'users');
        }
      }
     
      fs.writeFileSync(usersFileName,
                  JSON.stringify(users), 'utf8');

      
      api.log(`${usersFileName} write file is done`, 'users');
      api.log(`app ${usersFileName} file is created successfully at: ${api.agamaDir}`, 'users');
      api.writeLog(`app ${usersFileName} file is created successfully at: ${api.agamaDir}`);
    } catch (e) {
      api.log('error writing users', 'users');
      api.log(e, 'users');
    }
  }

  /*
   *  type: POST
   *  params: userObj
   */
  api.post('/users/save', (req, res, next) => {
    if (api.checkToken(req.body.token)) {
      if (!req.body.userObj) {
        const retObj = {
          msg: 'error',
          result: 'no userObj provided',
        };

        res.end(JSON.stringify(retObj));
      } else {
        let retObj 

        try {
          api.saveLocalUsers(req.body.userObj);

          retObj = {
            msg: 'success',
            result: 'users saved',
          };
        } catch(e) {
          retObj = {
            msg: 'error',
            result: e.message,
          };
        }

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

  /*
   *  type: POST
   *  params: none
   */
  api.post('/users/backup', (req, res, next) => {
    if (api.checkToken(req.body.token)) {
      let retObj 

      try {
        api.backupLocalUsers();

        retObj = {
          msg: 'success',
          result: 'users saved',
        };
      } catch(e) {
        retObj = {
          msg: 'error',
          result: e.message,
        };
      }

      res.end(JSON.stringify(retObj));
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
   *  params: none
   */
  api.post('/users/reset', (req, res, next) => {
    if (api.checkToken(req.body.token)) {
      let retObj 

      try {
        api.saveLocalUsers({});

        retObj = {
          msg: 'success',
          result: 'users saved',
        };
      } catch(e) {
        retObj = {
          msg: 'error',
          result: e.message,
        };
      }

      res.end(JSON.stringify(retObj));
    } else {
      const retObj = {
        msg: 'error',
        result: 'unauthorized access',
      };

      res.end(JSON.stringify(retObj));
    }
  });

  /*
   *  type: GET
   *
   */
  api.get('/users/load', (req, res, next) => {
    try {
      const obj = api.loadLocalUsers();
      res.end(JSON.stringify({
        msg: 'success',
        result: obj,
      }));
    } catch (e) {
      res.end(JSON.stringify({
        msg: 'error',
        result: e.message,
      }));
    }
    
  });

  return api;
};
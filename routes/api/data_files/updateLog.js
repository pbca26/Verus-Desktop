const {
  UPDATE_LOG,
  UPDATE_LOG_DESC
} = require("../utils/constants/index");

module.exports = (api) => {
  // Blacklist
  api.loadUpdateLog = () =>
    api.loadJsonFile(UPDATE_LOG, UPDATE_LOG_DESC);
  api.saveUpdateLog = (history) =>
    api.saveJsonFile({ time: (new Date()).getTime(), history }, UPDATE_LOG, UPDATE_LOG_DESC);

  api.get('/load_update_log', async (req, res, next) => {
    api.loadUpdateLog()
    .then((log) => {
      const retObj = {
        msg: 'success',
        result: log,
      };
  
      res.end(JSON.stringify(retObj));  
    })
    .catch(error => {
      const retObj = {
        msg: 'error',
        result: error.message,
      };
  
      res.end(JSON.stringify(retObj));  
    })
  });

  api.post('/save_update_log', async (req, res, next) => {
    const { token, history } = req.body
   
    if (api.checkToken(token)) {
      try {
        const retObj = {
          msg: 'success',
          result: await api.saveUpdateLog(history),
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
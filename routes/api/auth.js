const passwdStrength = require('passwd-strength');

module.exports = (api) => {
  api.checkToken = (token) => {
    if (token === api.appSessionHash) {
      return true;
    }
  };

  api.checkStringEntropy = (str) => {
    // https://tools.ietf.org/html/rfc4086#page-35
    return passwdStrength(str) < 29 ? false : true;
  };

  api.isWatchOnly = () => {
    return api.argv && api.argv.watchonly === 'override' ? false : api._isWatchOnly;
  };

  return api;
};
const fs = require('fs-extra');

module.exports = (api) => {
  /*
   *  type: POST
   *  params: none
   */
  api.post('/addressbook', async (req, res, next) => {
    const token = req.body.token;
    const data = req.body.data;

    if (api.checkToken(req.body.token)) {
      fs.writeFile(`${api.paths.agamaDir}/shepherd/addressBook.json`, JSON.stringify(data), (err) => {
        if (err) {
          api.log('error writing address book file', 'addressBook');

          const retObj = {
            msg: 'error',
            result: 'error writing address book file',
          };

          res.end(JSON.stringify(retObj));
        } else {
          const retObj = {
            msg: 'success',
            result: 'address book is updated',
          };

          res.end(JSON.stringify(retObj));
        }
      });
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
const crypto = require("crypto");

const db = require('../config');

const login = (email, password) => {
  return new Promise((resolve, reject) => {
    try {
      const hashedPwd = crypto.pbkdf2Sync(
        password,
        "realtor",
        10000,
        64,
        "sha512"
      ).toString('base64');

      const query = "select * from users where email = ? and password = ?";
      db.query(
        query,
        [email, hashedPwd],
        (error, results, fields) => {
          if (error) {
            reject(error);
            return;
          }
          console.log('results', results[0]);
          resolve(results[0]);
        }
      );
    } catch (e) {
      console.log(e);
      reject(e.message);
    }
  });
};

module.exports = {
  login
};

var express = require("express");
var router = express.Router();
const connection = require("../db/config");


router.get("/", function(req, res, next) {
  return new Promise((resolve, reject) => {
    try {
      const query = "select * from users where status='active'";
      connection.query(query, (error, results, fields) => {
        if (error) {
          reject(error);
          return;
        }
        resolve(results);
      });
    } catch (e) {
      console.log(e);
    }
  })
    .then(users => res.status(200).json({ users }))
    .catch(error => res.status(500).json({ error: error.message }));
});


module.exports = router;

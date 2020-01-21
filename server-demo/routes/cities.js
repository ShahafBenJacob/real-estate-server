var express = require("express");
var router = express.Router();
const connection = require("../db/config");

router.get("/", function(req, res, next) {
    return new Promise((resolve, reject) => {
      try {
        const query = "SELECT distinct c.name FROM cities c join apartments a on c.id = a.city_id order by 1";
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
      .then(values => res.status(200).json({ values }))
      .catch(error => res.status(500).json({ error: error.message }));
  });

  module.exports = router;

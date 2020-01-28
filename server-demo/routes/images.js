var express = require("express");
var router = express.Router();
const connection = require("../db/config");

// router.get("/", function(req, res, next) {
//     return new Promise((resolve, reject) => {
//       try {
//         const query = 'select * from images';
//         connection.query(query, (error, results, fields) => {
//           if (error) {
//             reject(error);
//             return;
//           }
//           resolve(results);
//         });
//       } catch (e) {
//         console.log(e);
//       }
//     })
//       .then(images => res.status(200).json(images))
//       .catch(error => res.status(500).json({ error: error.message }));
//   });

router.get("/:apartment_id", function(req, res, next) {
    const id = req.url.split('/')[1];
    return new Promise((resolve, reject) => {
      try {
        const query = 'select id, url from images where apartment_id = ?';
        connection.query(query, [id], (error, results, fields) => {
          if (error) {
            reject(error);
            return;
          }
          resolve(results.map(value => [value.id, value.url]));
        });
      } catch (e) {
        console.log(e);
      }
    })
      .then(apartments => res.status(200).json(apartments))
      .catch(error => res.status(500).json({ error: error.message }));
  });

  module.exports = router;

var express = require("express");
var router = express.Router();
const connection = require("../db/config");

const api = require("../db/api/get-apartments");

router.get("/", function(req, res, next) {
  return new Promise((resolve, reject) => {
    try {
      const query = "select * from apartments where availability='available'";
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
    .then(apartments => res.status(200).json({ apartments }))
    .catch(error => res.status(500).json({ error: error.message }));
});

router.get("/", function(req, res, next) {
  api
    .getAll(req.query)
    .then(apartments => res.status(200).json({ apartments }))
    .catch(error => res.status(500).json({ error: error.message }));
});

router.post("/", async function(req, res, next) {
  const {
    user_id,
    address,
    city_id,
    price,
    number_of_room,
    number_of_bath,
    sqft,
    description,
    sale_status,
    availability,
    property_type,
    main_image,
    status
  } = req.body;

  query =
    "INSERT INTO apartments (user_id, address, city_id, price, number_of_room, number_of_bath, sqft, description, sale_status, availability, property_type, main_image, status) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)";
  params = [
    user_id,
    address,
    city_id,
    price,
    number_of_room,
    number_of_bath,
    sqft,
    description,
    sale_status,
    availability,
    property_type,
    main_image,
    status
  ];
  const promise = new Promise((resolve, reject) => {
    connection.query(query, params, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
  const result = await promise;
  addToHistory(result.insertId, user_id, res);
});

addToHistory = (apartmentId, userId, res) => {
  query = "INSERT INTO apartments_history (apartment_id, user_id) VALUES (?,?)";
  params = [apartmentId, userId];
  new Promise((resolve, reject) => {
    connection.query(query, params, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
        return true;
      }
    });
  }).then(res.status(200).json("great"));
};

module.exports = router;

// http://localhost:3000/apartments/?city_id=1&price&number_of_room&number_of_bath&sqft&sale_status&property_type

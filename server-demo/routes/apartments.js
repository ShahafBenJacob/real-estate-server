var express = require("express");
var router = express.Router();

const {isUser} = require('../middlewares/auth');
const connection = require("../db/config");
const getAll = require("../db/api/get-apartments");

createArrOfPrice = (min, max) => {
  let newArr = [];
  for (let i = min; i <= max; i += 500000) {
    newArr.push(i);
  }
  return newArr;
};

router.get("/", function(req, res, next) {
  getAll.getAll(req.query)
    .then(apartments => res.status(200).json(apartments))
    .catch(error => res.status(500).json({ error: error.message }));
});


router.get("/countApartments", (req, res) => {
  return new Promise((resolve, reject) => {
    try {
      const query = 'select count(*) as count from apartments where availability="available"';
      connection.query(query, (error, results, fields) => {
        if (error) {
          reject(error);
          return;
        }
        resolve(results[0]['count']);
      });
    } catch (e) {
      console.log(e);
    }
  })
    .then(values => res.status(200).json(values))
    .catch(error => res.status(500).json({ error: error.message }));
});

router.get("/statistics", (req, res) => {
  return new Promise((resolve, reject) => {
    try {
      const query = `select count(*) as users from users;
      select count(*) as apartments from apartments where availability = "available";
      select count(*) as soldApartments from apartments where availability = "sold";`;
      connection.query(query, (error, results, fields) => {
        if (error) {
          reject(error);
          return;
        }
        resolve({
          users: results[0][0].users,
          apartments: results[1][0].apartments,
          soldApartments: results[2][0].soldApartments
        });
      });
    } catch (e) {
      console.log(e);
    }
  })
    .then(values => res.status(200).json(values))
    .catch(error => res.status(500).json({ error: error.message }));
});

router.get("/buttonsValues", (req, res) => {
  return new Promise((resolve, reject) => {
    try {
      const query = `select distinct property_type from apartments order by 1;
      SELECT distinct c.name FROM cities c join apartments a on c.id = a.city_id order by 1;
      SELECT min(price) as min, max(price) as max FROM apartments;`;
      connection.query(query, (error, results, fields) => {
        if (error) {
          reject(error);
          return;
        }
        resolve({
          property_type: results[0].map(value => value["property_type"]),
          cities_name: results[1].map(value => value["name"]),
          price: createArrOfPrice(results[2][0].min, results[2][0].max)
        });
      });
    } catch (e) {
      console.log(e);
    }
  })
    .then(values => res.status(200).json(values))
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
    availability,
    property_type,
    main_image,
    status
  } = req.body;

  query =
    "INSERT INTO apartments (user_id, address, city_id, price, number_of_room, number_of_bath, sqft, description, availability, property_type, main_image, status) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)";
  params = [
    user_id,
    address,
    city_id,
    price,
    number_of_room,
    number_of_bath,
    sqft,
    description,
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

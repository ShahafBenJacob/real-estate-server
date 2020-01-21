var express = require("express");
var router = express.Router();
const connection = require("../db/config");

const api = require("../db/api/get-apartments");

router.get("/", function(req, res, next) {
  return new Promise((resolve, reject) => {
    try {
      const query = `SELECT a.id, concat(u.first_name, " " ,u.last_name) as user_name ,a.address, c.name as city_name, a.price, a.number_of_room, a.number_of_bath, a.sqft, abs(DATEDIFF(a.created_on, now())) as days_on_web, a.sale_status, a.availability, a.property_type, a.main_image, co.name as country_name FROM apartments a join cities c on a.city_id = c.id join users u on a.user_id = u.id join countries co on co.id = c.country_id where availability='available';`;
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
    .then(apartments => res.status(200).json(apartments))
    .catch(error => res.status(500).json({ error: error.message }));
});

router.get("/", function(req, res, next) {
  api
    .getAll(req.query)
    .then(apartments => res.status(200).json({ apartments }))
    .catch(error => res.status(500).json({ error: error.message }));
});

router.get('/statistics', (req, res) => {
  return new Promise((resolve, reject) => {
    try {
      const query = `select count(*) as users from users;
      select count(*) as apartments from apartments where availability = "available";
      select count(*) as soldApartments from apartments where availability = "sold";`
      connection.query(query, (error, results, fields) => {
        if (error) {
          reject(error);
          return;
        }
        resolve({users: results[0][0].users, apartments: results[1][0].apartments, soldApartments: results[2][0].soldApartments});
      });
    } catch (e) {
      console.log(e);
    }
  })
    .then(values => res.status(200).json(values))
    .catch(error => res.status(500).json({ error: error.message }));
})

router.get('/buttonsValues', (req, res) => {
  return new Promise((resolve, reject) => {
    try {
      const query = `select distinct sale_status from apartments order by 1;
      select distinct property_type from apartments order by 1;
      SELECT distinct c.name FROM cities c join apartments a on c.id = a.city_id order by 1;`
      connection.query(query, (error, results, fields) => {
        if (error) {
          reject(error);
          return;
        }
        resolve({sale_status: results[0].map(value => value['sale_status']), property_type: results[1].map(value => value['property_type']), cities_name: results[2].map(value => value['name'])});
      });
    } catch (e) {
      console.log(e);
    }
  })
    .then(values => res.status(200).json(values))
    .catch(error => res.status(500).json({ error: error.message }));
})

// router.get("/sale_status", function(req, res, next) {
//   return new Promise((resolve, reject) => {
//     try {
//       const query = "select distinct sale_status from apartments order by 1";
//       connection.query(query, (error, results, fields) => {
//         if (error) {
//           reject(error);
//           return;
//         }
//         resolve(results);
//       });
//     } catch (e) {
//       console.log(e);
//     }
//   })
//     .then(values => res.status(200).json({ values }))
//     .catch(error => res.status(500).json({ error: error.message }));
// });

// router.get("/property_type", function(req, res, next) {
//   return new Promise((resolve, reject) => {
//     try {
//       const query = "select distinct property_type from apartments order by 1";
//       connection.query(query, (error, results, fields) => {
//         if (error) {
//           reject(error);
//           return;
//         }
//         resolve(results);
//       });
//     } catch (e) {
//       console.log(e);
//     }
//   })
//     .then(values => res.status(200).json({ values }))
//     .catch(error => res.status(500).json({ error: error.message }));
// });

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

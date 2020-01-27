const connection = require('../config');
const Builder = require('./builders/apartments-builder');


function getAll({city_name, price, number_of_room, number_of_bath, property_type, page=1, size=9}) {
    return new Promise((resolve, reject) => {
        try{
            const {query,params} = Builder.allApartments(page, size)
                            .cityName(city_name)
                            .price(price)
                            .numberOfRoom(number_of_room)
                            .numberOfBath(number_of_bath)
                            .propertyType(property_type)
                            .build();
            connection.query(query, params, (error, results, fields) => {
                if (error) {
                    reject(error);
                    return;
                }
                resolve(results);
            });
        }catch(e){
            console.log(e);
        }
    });
}

module.exports = {
    getAll
};
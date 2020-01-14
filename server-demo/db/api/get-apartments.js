const connection = require('../config');
const Builder = require('./builders/apartments-builder');


function getAll({city_id, price, number_of_room, number_of_bath, sqft, sale_status, property_type, page = 1, size = 10}) {
    return new Promise((resolve, reject) => {
        try{
            const {query,params} = Builder.allApartments(page, size)
                            .cityId(city_id)
                            .price(price)
                            .numberOfRoom(number_of_room)
                            .numberOfBath(number_of_bath)
                            .sqft(sqft)
                            .saleStatus(sale_status)
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
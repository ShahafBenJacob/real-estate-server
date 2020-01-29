class ApartmentsBuilder{
    constructor(size){
        this.query = `SELECT a.id, concat(u.first_name, " " ,u.last_name) as user_name ,a.address, c.name as city_name, a.price, a.number_of_room, a.number_of_bath, a.sqft, abs(DATEDIFF(a.created_on, now())) as days_on_web, a.availability, a.property_type, a.main_image, co.name as country_name FROM apartments a join cities c on a.city_id = c.id join users u on a.user_id = u.id join countries co on co.id = c.country_id where availability="available" and 1
        `;
        this.params = [];
        // this.size = size;
    }
    cityName(city_name){
        if(city_name){
            this.params.push(city_name);
            this.query += ' and c.name = ?';
        }
        return this;
    }
    price(price){
        if(price){
            this.params.push(price);
            this.query += ' and price <= ?';
        }
        return this;
    }
    numberOfRoom(number_of_room){
        if(number_of_room){
            this.params.push(number_of_room);
            this.query += ' and number_of_room = ?';
        }
        return this;        
    }
    numberOfBath(number_of_bath){
        if(number_of_bath){
            this.params.push(number_of_bath);
            this.query += ' and number_of_bath = ?';
        }
        return this;        
    }

    propertyType(property_type){
        if(property_type){
            this.params.push(property_type);
            this.query += ' and property_type = ?';
        }
        return this;        
    }
    build(){
        // this.query += ` limit 0, ${this.size};`

        // this.query += ` limit ${(this.page-1)*this.size}, ${this.size};`
        this.query += 'order by 9'
        return {query: this.query, params: this.params};
    }
}

class Builder {
    static allApartments(){
        return new ApartmentsBuilder();
    }
}

module.exports = Builder;
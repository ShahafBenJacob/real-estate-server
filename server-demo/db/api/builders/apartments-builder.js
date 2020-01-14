class ApartmentsBuilder{
    constructor(page, size){
        this.query = 'Select * from apartments where 1 ';
        this.params = [];
        this.page = page;
        this.size = size;
    }
    cityId(city_id){
        if(city_id){
            this.params.push(city_id);
            this.query += ' and city_id = ?';
        }
        return this;
    }
    price(price){
        if(price){
            this.params.push(price);
            this.query += ' and price = ?';
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
    sqft(sqft){
        if(sqft){
            this.params.push(sqft);
            this.query += ' and sqft = ?';
        }
        return this;        
    }
    saleStatus(sale_status){
        if(sale_status){
            this.params.push(sale_status);
            this.query += ' and sale_status = ?';
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
        this.query += ` limit ${(this.page-1)*this.size}, ${this.size};`
        return {query: this.query, params: this.params};
    }
}

class Builder {
    static allApartments(page, size){
        return new ApartmentsBuilder(page, size);
    }
}

module.exports = Builder;
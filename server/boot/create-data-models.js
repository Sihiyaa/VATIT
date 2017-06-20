'use strict';

var async = require('async');
module.exports = function(app) {
  //data sources

  var db = app.dataSources.db;
  //create all models
  async.parallel({
    customers: async.apply(createCustomers),
    hotels: async.apply(createHotels),
  }, function(err, results) {
    if (err) throw err;
    createReserves(results.customers, results.hotels, function(err) {
      console.log('> database structures/models have been created sucessfully');
    });
  });
  //create customers
  function createCustomers(cb) {
    db.automigrate('Customer', function(err) {
      if (err) return cb(err);
      var Customer = app.models.Customer;
      Customer.create([{
        email: 'asanda@sihiya.com',
        password: 'qwerty',
      }, {
        email: 'greg@greg.com',
        password: 'qwerty',
      }, {
        email: 'test@testing.com',
        password: 'qwerty',
      }], cb);
    });
  }
  //create Hotels
  function createHotels(cb) {
    db.automigrate('Hotel', function(err) {
      if (err) return cb(err);
      var Hotel = app.models.Hotel;
      Hotel.create([{
        name: 'Lakewood',
        city: 'Miami north',
      }, {
        name: 'Bridgewood',
        city: 'Miami south',
      }, {
        name: 'Ridgewood',
        city: 'Miami east',
      }], cb);
    });
  }
  //create reservations
  function createReserves(customers, hotels, cb) {
    db.automigrate('Reserve', function(err) {
      if (err) return cb(err);
      var Reserve = app.models.Reserve;
      var seconds_apart_per_load = 1000 * 60 * 60 * 24;
      Reserve.create([{
        date: Date.now() - (seconds_apart_per_load * 3),
        rating: 3,
        comments: " weekday rates as 110$ for regular customer and 80$ for rewards customer.\n\r" + 
        " weekend rates are 90$ for regular customer and 80$ for a rewards customer. ",
        customerId: customers[0].id,
        hotelId: hotels[0].id,
      }, {
        date: Date.now() - (seconds_apart_per_load * 2),
        rating: 4,
        comments: " weekday rates as 160$ for regular customer and 110$ for rewards customer.\n\r" +
        "  weekend rates are 60$ for regular customer and 50$ for a rewards customer",
        customerId: customers[1].id,
        hotelId: hotels[0].id,
      }, {
        date: Date.now() - (seconds_apart_per_load * 1),
        rating: 5,
        comments: " weekday rates as 220$ for regular customer and 100$ for rewards customer. \n\r" +
        "  weekend rates are 150$ for regular customer and 40$ for a rewards customer." ,
        customerId: customers[1].id,
        hotelId: hotels[1].id,
      }], cb);
    });
  }
};

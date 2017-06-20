'use strict';

module.exports = function(Customer) {
  Customer.status = function(cb) {
    var currentDate = new Date();
    var currentHour = currentDate.getHours();
    var OPEN_MONDAY_HOUR = 8;//8am
    var CLOSE_HOUR = 6;//close at 6pm

    console.log('Current hour is %d', currentHour);
    var response;
    if (currentHour > OPEN_HOUR && currentHour < CLOSE_HOUR) {
      response = 'We are open for business until the weekend.';
    } else {
      response = 'Sorry, we are closed. Open daily from 6am to 8pm until weekend';
    }
    cb(null, response);
  };
  Customer.remoteMethod(
    'status', {
      http: {
        path: '/status',
        verb: 'get',
      },
      returns: {
        arg: 'status',
        type: 'string',
      },
    }
  );
};
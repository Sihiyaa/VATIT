'use strict';

module.exports = function(app) {
  // Install a "/hotel" route that returns "pong"
  app.get('/hotel', function(req, res) {
    res.send('hotels available');
  });
};


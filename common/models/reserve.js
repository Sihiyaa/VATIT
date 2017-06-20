'use strict';

module.exports = function(Reserve) {
  Reserve.beforeRemote('create', function(context, user, next) {
    var req = context.req;
    req.body.customerId = req.accessToken.userId;
    next();
  });
};



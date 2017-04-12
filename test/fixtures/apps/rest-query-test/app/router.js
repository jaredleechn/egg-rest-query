'use strict';

module.exports = app => {
  app.get('/returnQuery', function* () {
    this.body = this.extendQuery;
  });
};

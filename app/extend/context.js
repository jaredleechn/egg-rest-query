'use strict';

const Query = require('../../lib/Query');

module.exports = {
  get extendQuery() {
    return new Query(this.query);
  },
};

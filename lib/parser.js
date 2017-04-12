'use strict';

const parse = require('odata-parser').parse;

module.exports = function getFilterAst(filterStr) {
  try {
    const result = parse(`$filter=${filterStr}`) || {};
    return result.$filter;
  } catch (e) {
    return undefined;
  }
};

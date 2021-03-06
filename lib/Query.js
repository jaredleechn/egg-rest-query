'use strict';

const parseMongoFilter = require('./mongo').filter;
const getFilterAst = require('./parser');

function parseSplit(fieldsStr = '', split = ',') {
  return fieldsStr === ''
    ? []
    : fieldsStr.split(split);
}

function parseNumber(str) {
  if (typeof str !== 'number') {
    try {
      return parseInt(str, 10);
    } catch (e) {
      return 0;
    }
  }
  return Math.floor(str);
}


module.exports = class Query {
  constructor(query) {
    const {
      limit = 1000,
      skip = 0,
      search,
      sort = 'createdAt',
      fields,
      filter,
      expand,
    } = query;

    this.assignPropertyIfNotUndefined({
      limit: parseNumber(limit),
      skip: parseNumber(skip),
      search,
      filter: getFilterAst(filter),
      fields: parseSplit(fields),
      sort: parseSplit(sort),
      expand: parseSplit(expand),
    });
  }

  assignPropertyIfNotUndefined(props) {
    Object.keys(props).forEach(prop => {
      if (props[prop] !== undefined && props[props] !== null) {
        this[prop] = props[prop];
      }
    });
  }

  get mongoFilter() {
    return parseMongoFilter(this.filter);
  }

  get mongoFields() {
    return this.fields.join(',');
  }

  get mongoSort() {
    return this.sort.join(',');
  }

  get mongoInclude() {
    return this.expand.join(',');
  }
};

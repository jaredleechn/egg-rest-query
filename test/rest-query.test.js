'use strict';

const request = require('supertest');
const mm = require('egg-mock');
const assert = require('assert');
const Query = require('../lib/Query');

describe('test/rest-query.test.js', () => {
  let app;
  before(() => {
    app = mm.app({
      baseDir: 'apps/rest-query-test',
    });
    return app.ready();
  });

  after(() => app.close());
  afterEach(mm.restore);

  it('should respnse query correct', () => {
    return request(app.callback())
      .get('/returnQuery?fields=name,member.name&skip=0&limit=10&search=jared&filter=age eq 10')
      .expect(200, {
        fields: [ 'name', 'member.name' ],
        skip: 0,
        limit: 10,
        search: 'jared',
        filter: {
          type: 'eq',
          left: { type: 'property', name: 'age' },
          right: { type: 'literal', value: 10 },
        },
        sort: [ 'createdAt' ],
      });
  });

  it('mongo', () => {
    const query = new Query({
      filter: "productName eq basement and createdAt gt datetimeoffset'2017-03-28T16:40:09.724Z' and startswith(name, 'base')",
      fields: 'a,b',
      sort: 'b,-a',
    });

    const { mongoFilter, mongoFields, mongoSort } = query;
    assert(Array.isArray(mongoFilter.$and));
    assert(mongoFilter.$and[1].$and.length === 2);
    assert(mongoFields === 'a,b');
    assert(mongoSort === 'b,-a');
  });
});

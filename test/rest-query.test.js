'use strict';

const request = require('supertest');
const mm = require('egg-mock');

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
});

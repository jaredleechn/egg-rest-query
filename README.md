# egg-rest-query

[![NPM version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]
[![Test coverage][codecov-image]][codecov-url]
[![David deps][david-image]][david-url]
[![Known Vulnerabilities][snyk-image]][snyk-url]
[![npm download][download-image]][download-url]

[npm-image]: https://img.shields.io/npm/v/egg-rest-query.svg?style=flat-square
[npm-url]: https://npmjs.org/package/egg-rest-query
[travis-image]: https://img.shields.io/travis/eggjs/egg-rest-query.svg?style=flat-square
[travis-url]: https://travis-ci.org/eggjs/egg-rest-query
[codecov-image]: https://img.shields.io/codecov/c/github/eggjs/egg-rest-query.svg?style=flat-square
[codecov-url]: https://codecov.io/github/eggjs/egg-rest-query?branch=master
[david-image]: https://img.shields.io/david/eggjs/egg-rest-query.svg?style=flat-square
[david-url]: https://david-dm.org/eggjs/egg-rest-query
[snyk-image]: https://snyk.io/test/npm/egg-rest-query/badge.svg?style=flat-square
[snyk-url]: https://snyk.io/test/npm/egg-rest-query
[download-image]: https://img.shields.io/npm/dm/egg-rest-query.svg?style=flat-square
[download-url]: https://npmjs.org/package/egg-rest-query

parsing request query into usable db condition for mongoDB etc...

```
request: /api/product?fields=name&sort=createdAt&filter=productName eq basement and createdAt gt datetimeoffset'2017-03-28T16:40:09.724Z' and startswith(name, 'base')
```

patch parsing result into `ctx.extendQuery` with values:

```js
{
  mongoFilter: {
    $and: [{
      productName: {
        $eq: 'basement',
      },
    }, {
      $and: [{
        createdAt: {
          $gt: { __type : 'date', iso: '2017-03-28T16:40:09.724Z' },
        },
      }, {
        name: /^base/i,
      }],
    }],
  },
  mongoSort: 'createdAt',
  mongoFields: 'name',
}
```

and query in mongoDB

```js
const { mongoFilter, mongoSort, mongoFields, skip, top } = ctx.extendQuery;
this.db.class('product').find({
  where: mongoFilter,
  sort: mongoSort,
  fields: mongoFields,
  skip,
  top,
});
```

more filter supported like startswith, endswith, substringof, view [odata-parser](https://github.com/auth0/node-odata-parser/blob/master/test/parser.specs.js)

## Install

```bash
$ npm i egg-rest-query --save
```

## Usage

```js
// {app_root}/config/plugin.js
exports['rest-query'] = {
  enable: true,
  package: 'egg-rest-query',
};
```

then `extendQuery` with be available on `ctx`

## Configuration

```js
// {app_root}/config/config.default.js
exports['rest-query'] = {
};
```

see [config/config.default.js](config/config.default.js) for more detail.

## Example

<!-- example here -->

## Questions & Suggestions

Please open an issue [here](https://github.com/eggjs/egg/issues).

## License

[MIT](LICENSE)

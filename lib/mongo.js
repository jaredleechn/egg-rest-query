'use strict';

module.exports = {
  filter: parseOne,
};

function parseOne(root) {
  if (!root) {
    return {};
  }
  const { left, right, type, name, value, func, args } = root;
  if (!type) {
    return {};
  }
  if (type === 'and' || type === 'or') {
    return {
      [`$${type}`]: [ parseOne(left), parseOne(right) ],
    };
  } else if (type === 'property') {
    return name;
  } else if (type === 'literal') {
    if (value instanceof Date) {
      // a wrapper to temporarily keep compatible with basement.object
      return { __type: 'date', iso: value.toISOString() };
    }
    return value;
  } else if (type === 'functioncall') {
    const [ first, second ] = args;
    switch (func) {
      case 'substringof':
        return {
          [parseOne(second)]: new RegExp(parseOne(first), 'i'),
        };
      case 'startswith':
        return {
          [parseOne(first)]: new RegExp(`^${parseOne(second)}`, 'i'),
        };
      case 'endswith':
        return {
          [parseOne(first)]: new RegExp(`${parseOne(second)}$`, 'i'),
        };
      default:
        return {
          [parseOne(second)]: new RegExp(parseOne(first), 'i'),
        };
    }
  } else {
    return {
      [parseOne(left)]: {
        [`$${type}`]: parseOne(right),
      },
    };
  }
}

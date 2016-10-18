'use strict';

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var iter = require('./iter');

function dropWhile(func, iterable) {
  var _marked = [curriedDropWhile].map(_regenerator2.default.mark);

  function curriedDropWhile(i) {
    var drop, _iterator, _isArray, _i, _ref, item;

    return _regenerator2.default.wrap(function curriedDropWhile$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            drop = true;
            _iterator = iter(i), _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : (0, _getIterator3.default)(_iterator);

          case 2:
            if (!_isArray) {
              _context.next = 8;
              break;
            }

            if (!(_i >= _iterator.length)) {
              _context.next = 5;
              break;
            }

            return _context.abrupt('break', 24);

          case 5:
            _ref = _iterator[_i++];
            _context.next = 12;
            break;

          case 8:
            _i = _iterator.next();

            if (!_i.done) {
              _context.next = 11;
              break;
            }

            return _context.abrupt('break', 24);

          case 11:
            _ref = _i.value;

          case 12:
            item = _ref;

            if (drop) {
              _context.next = 18;
              break;
            }

            _context.next = 16;
            return item;

          case 16:
            _context.next = 22;
            break;

          case 18:
            drop = func(item);

            if (drop) {
              _context.next = 22;
              break;
            }

            _context.next = 22;
            return item;

          case 22:
            _context.next = 2;
            break;

          case 24:
          case 'end':
            return _context.stop();
        }
      }
    }, _marked[0], this);
  }
  if (iterable) {
    return curriedDropWhile(iterable);
  }
  return curriedDropWhile;
}

module.exports = dropWhile;
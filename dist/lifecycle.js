'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _createEagerFactory = require('./createEagerFactory');

var _createEagerFactory2 = _interopRequireDefault(_createEagerFactory);

var _createHelper = require('./createHelper');

var _createHelper2 = _interopRequireDefault(_createHelper);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var LIFECYCLE_METHODS = ['componentWillMount', 'componentDidMount', 'componentWillReceiveProps', 'shouldComponentUpdate', 'componentWillUpdate', 'componentDidUpdate', 'componentWillUnmount'];

/**
 * A higher-order component that permits to hook a lifecycle method. Available methods are:
 * - componentWillMount
 * - componentDidMount
 * - componentWillReceiveProps
 * - shouldComponentUpdate
 * - componentWillUpdate
 * - componentDidUpdate
 * - componentWillUnmount
 * You should use this helper as an escape hatch, in
 * case you need to access component lifecycle methods.
 *
 * @static
 * @category Higher-order-components
 * @param {Object} spec Lifecycle spec
 * @returns {HigherOrderComponent} A function that takes a component and returns a new component.
 * @example
 *
 * // Create a hoc that will log when a component will mount
 * const logWhenMount = lifecycle({componentWillMount: () => console.log('will mount')});
 */
var lifecycle = function lifecycle(spec) {
  return function (BaseComponent) {
    var factory = (0, _createEagerFactory2.default)(BaseComponent);

    if (process.env.NODE_ENV !== 'production' && Object.prototype.hasOwnProperty.call(spec, 'render')) {
      /* eslint-disable no-console */
      console.error('lifecycle() does not support the render method; its behavior is to ' + 'pass all props and state to the base component.');
      /* eslint-enable no-console */
    }

    var Lifecycle = function (_Component) {
      _inherits(Lifecycle, _Component);

      function Lifecycle() {
        _classCallCheck(this, Lifecycle);

        return _possibleConstructorReturn(this, _Component.apply(this, arguments));
      }

      Lifecycle.prototype.render = function render() {
        return factory(_extends({}, this.props, this.state));
      };

      return Lifecycle;
    }(_react.Component);

    Object.entries(spec).forEach(function (_ref) {
      var name = _ref[0],
          impl = _ref[1];

      if (!LIFECYCLE_METHODS.includes(name)) {
        /* eslint-disable no-console */
        console.error('lifecycle() does not support "' + name + '" method, only lifecycle methods are supported.');
        /* eslint-enable no-console */
      } else {
        Lifecycle.prototype[name] = impl;
      }
    });

    return Lifecycle;
  };
};

exports.default = (0, _createHelper2.default)(lifecycle, 'lifecycle');
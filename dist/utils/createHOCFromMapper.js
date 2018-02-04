'use strict';

exports.__esModule = true;
exports.isMapperComponent = exports.mappersInfoSymbol = undefined;

var _react = require('react');

var _createBehaviorSubject = require('./createBehaviorSubject');

var _createBehaviorSubject2 = _interopRequireDefault(_createBehaviorSubject);

var _createSymbol = require('./createSymbol');

var _createSymbol2 = _interopRequireDefault(_createSymbol);

var _asyncThrow = require('./asyncThrow');

var _asyncThrow2 = _interopRequireDefault(_asyncThrow);

var _createEagerFactory = require('../createEagerFactory');

var _createEagerFactory2 = _interopRequireDefault(_createEagerFactory);

var _setConfig = require('../setConfig');

var _setObservableConfig = require('../setObservableConfig');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /* eslint-disable no-console */


var MAPPERS_INFO = (0, _createSymbol2.default)('mappersInfo');
exports.mappersInfoSymbol = MAPPERS_INFO;

var observablePropType = function observablePropType() {};

var createComponentFromMappers = function createComponentFromMappers(mappers, childFactory) {
  var _CONTEXT_TYPES, _class, _temp2;

  var _getConfig = (0, _setConfig.getConfig)(),
      OBSERVABLES = _getConfig.observablesKey;

  var CONTEXT_TYPES = (_CONTEXT_TYPES = {}, _CONTEXT_TYPES[OBSERVABLES] = observablePropType, _CONTEXT_TYPES);

  return _temp2 = _class = function (_Component) {
    _inherits(_class, _Component);

    function _class() {
      var _temp, _this, _ret;

      _classCallCheck(this, _class);

      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      return _ret = (_temp = (_this = _possibleConstructorReturn(this, _Component.call.apply(_Component, [this].concat(args))), _this), _this.props$ = (0, _createBehaviorSubject2.default)(_this.props), _temp), _possibleConstructorReturn(_this, _ret);
    }

    _class.prototype.componentWillMount = function componentWillMount() {
      var _this2 = this,
          _childContext;

      var childProps$ = this.props$;
      var childObservables = this.context[OBSERVABLES];
      for (var i = 0; i < mappers.length; i += 1) {
        ;
        var _mappers$i = mappers[i](childProps$, childObservables);

        childProps$ = _mappers$i[0];
        childObservables = _mappers$i[1];
      }

      this.childPropsSubscription = _setObservableConfig.config.toESObservable(childProps$).subscribe({
        next: function next(childProps) {
          _this2.setState({ childProps: childProps });
        },
        error: function error(_error) {
          (0, _asyncThrow2.default)(_error);
          _this2.setState({
            childProps: _this2.state ? _this2.state.childProps : {}
          });
        }
      });

      this.childContext = (_childContext = {}, _childContext[OBSERVABLES] = childObservables, _childContext);
    };

    _class.prototype.getChildContext = function getChildContext() {
      return this.childContext;
    };

    _class.prototype.componentWillReceiveProps = function componentWillReceiveProps(nextProps) {
      this.props$.next(nextProps);
    };

    _class.prototype.componentWillUnmount = function componentWillUnmount() {
      this.childPropsSubscription.unsubscribe();
    };

    _class.prototype.shouldComponentUpdate = function shouldComponentUpdate(nextProps, nextState) {
      return nextState && (!this.state || this.state.childProps !== nextState.childProps);
    };

    _class.prototype.render = function render() {
      if (!this.state) {
        return null;
      }

      return this.constructor[MAPPERS_INFO].childFactory(this.state.childProps);
    };

    return _class;
  }(_react.Component), _class[MAPPERS_INFO] = { mappers: mappers, childFactory: childFactory }, _class.contextTypes = CONTEXT_TYPES, _class.childContextTypes = CONTEXT_TYPES, _temp2;
};

var isMapperComponent = exports.isMapperComponent = function isMapperComponent(BaseComponent) {
  return typeof BaseComponent === 'function' && BaseComponent[MAPPERS_INFO];
};

exports.default = function (mapper) {
  return function (BaseComponent) {
    if (isMapperComponent(BaseComponent)) {
      return createComponentFromMappers([mapper].concat(BaseComponent[MAPPERS_INFO].mappers), BaseComponent[MAPPERS_INFO].childFactory);
    }

    return createComponentFromMappers([mapper], (0, _createEagerFactory2.default)(BaseComponent));
  };
};
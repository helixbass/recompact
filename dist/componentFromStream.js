'use strict';

exports.__esModule = true;
exports.componentFromStreamWithConfig = undefined;

var _react = require('react');

var _createBehaviorSubject = require('./utils/createBehaviorSubject');

var _createBehaviorSubject2 = _interopRequireDefault(_createBehaviorSubject);

var _setObservableConfig = require('./setObservableConfig');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var componentFromStreamWithConfig = exports.componentFromStreamWithConfig = function componentFromStreamWithConfig(config) {
  return function (propsToVdom) {
    return function (_Component) {
      _inherits(ComponentFromStream, _Component);

      function ComponentFromStream() {
        var _temp, _this, _ret;

        _classCallCheck(this, ComponentFromStream);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        return _ret = (_temp = (_this = _possibleConstructorReturn(this, _Component.call.apply(_Component, [this].concat(args))), _this), _this.state = { vdom: null

          // Stream of props
        }, _this.props$ = (0, _createBehaviorSubject2.default)(_this.props), _this.vdom$ = config.toESObservable(propsToVdom(_this.props$)), _temp), _possibleConstructorReturn(_this, _ret);
      }

      // Stream of vdom


      ComponentFromStream.prototype.componentWillMount = function componentWillMount() {
        var _this2 = this;

        // Subscribe to child prop changes so we know when to re-render
        this.subscription = this.vdom$.subscribe({
          next: function next(vdom) {
            _this2.setState({ vdom: vdom });
          }
        });
      };

      ComponentFromStream.prototype.componentWillReceiveProps = function componentWillReceiveProps(nextProps) {
        // Receive new props from the owner
        this.props$.next(nextProps);
      };

      ComponentFromStream.prototype.shouldComponentUpdate = function shouldComponentUpdate(nextProps, nextState) {
        return nextState.vdom !== this.state.vdom;
      };

      ComponentFromStream.prototype.componentWillUnmount = function componentWillUnmount() {
        // Complete stream
        this.props$.complete();

        // Clean-up subscription before un-mounting
        this.subscription.unsubscribe();
      };

      ComponentFromStream.prototype.render = function render() {
        return this.state.vdom;
      };

      return ComponentFromStream;
    }(_react.Component);
  };
};

var componentFromStream = componentFromStreamWithConfig(_setObservableConfig.config);

exports.default = componentFromStream;
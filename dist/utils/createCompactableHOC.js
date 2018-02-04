'use strict';

exports.__esModule = true;
exports.compactableSymbol = undefined;

var _createHOCFromMapper = require('./createHOCFromMapper');

var compactable = Symbol('compactable'); /* eslint-disable no-param-reassign */

exports.compactableSymbol = compactable;

var isCompactable = function isCompactable(Component) {
  return typeof Component === 'function' && Component[compactable];
};

exports.default = function (createCompactableComponent, createComponent) {
  return function (BaseComponent) {
    if (isCompactable(BaseComponent)) {
      BaseComponent = BaseComponent[compactable];
    }

    var Component = createComponent(BaseComponent);
    Component[compactable] = createCompactableComponent(BaseComponent);

    if ((0, _createHOCFromMapper.isMapperComponent)(BaseComponent)) {
      return Component[compactable];
    }

    return Component;
  };
};
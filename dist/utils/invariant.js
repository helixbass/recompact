"use strict";

exports.__esModule = true;

exports.default = function (condition, message) {
  if (!condition) {
    var error = new Error(message);
    error.framesToPop = 1; // Discard the invariant's own frame.

    throw error;
  }
};
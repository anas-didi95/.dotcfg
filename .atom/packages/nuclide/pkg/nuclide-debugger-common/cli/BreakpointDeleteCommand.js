'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _asyncToGenerator = _interopRequireDefault(require('async-to-generator'));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 *
 * 
 * @format
 */

class BreakpointDeleteCommand {

  constructor(debug) {
    this.name = 'delete';
    this.helpText = '[index]: permanently deletes a breakpoint.';

    this._debugger = debug;
  }

  execute(args) {
    var _this = this;

    return (0, _asyncToGenerator.default)(function* () {
      let index = -1;

      if (args.length !== 1 || isNaN(index = parseInt(args[0], 10))) {
        throw new Error("Format is 'breakpoint delete index'");
      }

      yield _this._debugger.deleteBreakpoint(index);
    })();
  }
}
exports.default = BreakpointDeleteCommand;
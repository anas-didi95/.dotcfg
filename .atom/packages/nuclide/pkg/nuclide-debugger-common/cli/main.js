'use strict';

var _asyncToGenerator = _interopRequireDefault(require('async-to-generator'));

let main = (() => {
  var _ref = (0, _asyncToGenerator.default)(function* () {
    const dispatcher = new (_CommandDispatcher || _load_CommandDispatcher()).default();
    const cli = new (_CommandLine || _load_CommandLine()).default(dispatcher);

    dispatcher.registerCommand(new (_HelpCommand || _load_HelpCommand()).default(cli, dispatcher));
    dispatcher.registerCommand(new (_QuitCommand || _load_QuitCommand()).default(function () {
      return cli.close();
    }));

    try {
      // see if there's session information on the command line
      const debuggerAdapterFactory = new (_DebuggerAdapterFactory || _load_DebuggerAdapterFactory()).default();
      const adapter = debuggerAdapterFactory.adapterFromArguments((_yargs || _load_yargs()).default.argv);

      const logger = buildLogger();
      const debuggerInstance = new (_Debugger || _load_Debugger()).default(logger, cli);

      if (adapter != null) {
        yield debuggerInstance.launch(adapter);
      }

      debuggerInstance.registerCommands(dispatcher);

      yield cli.run();
      yield debuggerInstance.closeSession();
      cli.outputLine();

      process.exit(0);
    } catch (x) {
      cli.outputLine(x.message);
      process.exit(1);
    }
  });

  return function main() {
    return _ref.apply(this, arguments);
  };
})();

var _CommandLine;

function _load_CommandLine() {
  return _CommandLine = _interopRequireDefault(require('./CommandLine'));
}

var _CommandDispatcher;

function _load_CommandDispatcher() {
  return _CommandDispatcher = _interopRequireDefault(require('./CommandDispatcher'));
}

var _Debugger;

function _load_Debugger() {
  return _Debugger = _interopRequireDefault(require('./Debugger'));
}

var _DebuggerAdapterFactory;

function _load_DebuggerAdapterFactory() {
  return _DebuggerAdapterFactory = _interopRequireDefault(require('./DebuggerAdapterFactory'));
}

var _HelpCommand;

function _load_HelpCommand() {
  return _HelpCommand = _interopRequireDefault(require('./HelpCommand'));
}

var _log4js;

function _load_log4js() {
  return _log4js = _interopRequireDefault(require('log4js'));
}

var _QuitCommand;

function _load_QuitCommand() {
  return _QuitCommand = _interopRequireDefault(require('./QuitCommand'));
}

var _yargs;

function _load_yargs() {
  return _yargs = _interopRequireDefault(require('yargs'));
}

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

function buildLogger() {
  const args = (_yargs || _load_yargs()).default.argv;
  const level = (args.loglevel || 'ERROR').toUpperCase();
  const validLevels = new Set(['TRACE', 'DEBUG', 'INFO', 'WARN', 'ERROR', 'FATAL']);

  if (!validLevels.has(level)) {
    throw new Error(`${level} is not a valid loglevel.`);
  }

  (_log4js || _load_log4js()).default.getLogger('nuclide-commons/process').setLevel(level);

  const logger = (_log4js || _load_log4js()).default.getLogger('default');
  logger.setLevel(level);
  return logger;
}

main();
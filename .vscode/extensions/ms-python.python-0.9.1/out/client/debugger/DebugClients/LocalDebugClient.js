"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const child_process = require("child_process");
const path = require("path");
const vscode_debugadapter_1 = require("vscode-debugadapter");
const open_1 = require("../../common/open");
const pathUtils_1 = require("../../common/platform/pathUtils");
const environment_1 = require("../../common/variables/environment");
const Utils_1 = require("../Common/Utils");
const LocalDebugServer_1 = require("../DebugServers/LocalDebugServer");
const DebugClient_1 = require("./DebugClient");
const VALID_DEBUG_OPTIONS = [
    'RedirectOutput',
    'DebugStdLib',
    'BreakOnSystemExitZero',
    'DjangoDebugging'
];
var DebugServerStatus;
(function (DebugServerStatus) {
    DebugServerStatus[DebugServerStatus["Unknown"] = 1] = "Unknown";
    DebugServerStatus[DebugServerStatus["Running"] = 2] = "Running";
    DebugServerStatus[DebugServerStatus["NotRunning"] = 3] = "NotRunning";
})(DebugServerStatus || (DebugServerStatus = {}));
class LocalDebugClient extends DebugClient_1.DebugClient {
    // tslint:disable-next-line:no-any
    constructor(args, debugSession, canLaunchTerminal) {
        super(args, debugSession);
        this.canLaunchTerminal = canLaunchTerminal;
    }
    get debugServerStatus() {
        if (this.debugServer && this.debugServer.IsRunning) {
            return DebugServerStatus.Running;
        }
        if (this.debugServer && !this.debugServer.IsRunning) {
            return DebugServerStatus.NotRunning;
        }
        return DebugServerStatus.Unknown;
    }
    CreateDebugServer(pythonProcess) {
        this.pythonProcess = pythonProcess;
        this.debugServer = new LocalDebugServer_1.LocalDebugServer(this.debugSession, this.pythonProcess);
        return this.debugServer;
    }
    get DebugType() {
        return DebugClient_1.DebugType.Local;
    }
    Stop() {
        if (this.debugServer) {
            this.debugServer.Stop();
            this.debugServer = undefined;
        }
        if (this.pyProc) {
            try {
                this.pyProc.send('EXIT');
                // tslint:disable-next-line:no-empty
            }
            catch (_a) { }
            try {
                this.pyProc.stdin.write('EXIT');
                // tslint:disable-next-line:no-empty
            }
            catch (_b) { }
            try {
                this.pyProc.disconnect();
                // tslint:disable-next-line:no-empty
            }
            catch (_c) { }
            this.pyProc = undefined;
        }
    }
    getLauncherFilePath() {
        const currentFileName = module.filename;
        const ptVSToolsPath = path.join(path.dirname(currentFileName), '..', '..', '..', '..', 'pythonFiles', 'PythonTools');
        return path.join(ptVSToolsPath, 'visualstudio_py_launcher.py');
    }
    // tslint:disable-next-line:no-any
    displayError(error) {
        const errorMsg = typeof error === 'string' ? error : ((error.message && error.message.length > 0) ? error.message : '');
        if (errorMsg.length > 0) {
            this.debugSession.sendEvent(new vscode_debugadapter_1.OutputEvent(errorMsg, 'stderr'));
        }
    }
    // tslint:disable-next-line:max-func-body-length member-ordering no-any
    LaunchApplicationToDebug(dbgServer, processErrored) {
        return __awaiter(this, void 0, void 0, function* () {
            const environmentVariables = yield this.getEnvironmentVariables();
            // tslint:disable-next-line:max-func-body-length cyclomatic-complexity no-any
            return new Promise((resolve, reject) => {
                const fileDir = this.args && this.args.program ? path.dirname(this.args.program) : '';
                let processCwd = fileDir;
                if (typeof this.args.cwd === 'string' && this.args.cwd.length > 0 && this.args.cwd !== 'null') {
                    processCwd = this.args.cwd;
                }
                let pythonPath = 'python';
                if (typeof this.args.pythonPath === 'string' && this.args.pythonPath.trim().length > 0) {
                    pythonPath = this.args.pythonPath;
                }
                if (!environmentVariables.hasOwnProperty('PYTHONIOENCODING')) {
                    environmentVariables.PYTHONIOENCODING = 'UTF-8';
                }
                if (!environmentVariables.hasOwnProperty('PYTHONUNBUFFERED')) {
                    environmentVariables.PYTHONUNBUFFERED = '1';
                }
                const ptVSToolsFilePath = this.getLauncherFilePath();
                const launcherArgs = this.buildLauncherArguments();
                const args = [ptVSToolsFilePath, processCwd, dbgServer.port.toString(), '34806ad9-833a-4524-8cd6-18ca4aa74f14'].concat(launcherArgs);
                switch (this.args.console) {
                    case 'externalTerminal':
                    case 'integratedTerminal': {
                        const isSudo = Array.isArray(this.args.debugOptions) && this.args.debugOptions.some(opt => opt === 'Sudo');
                        this.launchExternalTerminal(isSudo, processCwd, pythonPath, args, environmentVariables).then(resolve).catch(reject);
                        break;
                    }
                    default: {
                        // As we're spawning the process, we need to ensure all env variables are passed.
                        // Including those from the current process (i.e. everything, not just custom vars).
                        const envParser = new environment_1.EnvironmentVariablesService(new pathUtils_1.PathUtils(Utils_1.IS_WINDOWS));
                        envParser.mergeVariables(process.env, environmentVariables);
                        this.pyProc = child_process.spawn(pythonPath, args, { cwd: processCwd, env: environmentVariables });
                        this.handleProcessOutput(this.pyProc, reject);
                        // Here we wait for the application to connect to the socket server.
                        // Only once connected do we know that the application has successfully launched.
                        this.debugServer.DebugClientConnected
                            .then(resolve)
                            .catch(ex => console.error('Python Extension: debugServer.DebugClientConnected', ex));
                    }
                }
            });
        });
    }
    // tslint:disable-next-line:member-ordering
    handleProcessOutput(proc, failedToLaunch) {
        proc.on('error', error => {
            // If debug server has started, then don't display errors.
            // The debug adapter will get this info from the debugger (e.g. ptvsd lib).
            const status = this.debugServerStatus;
            if (status === DebugServerStatus.Running) {
                return;
            }
            if (status === DebugServerStatus.NotRunning && typeof (error) === 'object' && error !== null) {
                return failedToLaunch(error);
            }
            // This could happen when the debugger didn't launch at all, e.g. python doesn't exist.
            this.displayError(error);
        });
        proc.stderr.setEncoding('utf8');
        proc.stderr.on('data', error => {
            // We generally don't need to display the errors as stderr output is being captured by debugger
            // and it gets sent out to the debug client.
            // Either way, we need some code in here so we read the stdout of the python process,
            // Else it just keep building up (related to issue #203 and #52).
            if (this.debugServerStatus === DebugServerStatus.NotRunning) {
                return failedToLaunch(error);
            }
        });
        proc.stdout.on('data', d => {
            // This is necessary so we read the stdout of the python process,
            // Else it just keep building up (related to issue #203 and #52).
            // tslint:disable-next-line:prefer-const no-unused-variable
            let x = 0;
        });
    }
    // tslint:disable-next-line:member-ordering
    buildLauncherArguments() {
        let vsDebugOptions = ['RedirectOutput'];
        if (Array.isArray(this.args.debugOptions)) {
            vsDebugOptions = this.args.debugOptions.filter(opt => VALID_DEBUG_OPTIONS.indexOf(opt) >= 0);
        }
        // If internal or external console, then don't re-direct the output.
        if (this.args.console === 'integratedTerminal' || this.args.console === 'externalTerminal') {
            vsDebugOptions = vsDebugOptions.filter(opt => opt !== 'RedirectOutput');
        }
        // Include a dummy value, to ensure something gets sent.
        // Else, argument positions get messed up due to an empty string.
        vsDebugOptions = vsDebugOptions.length === 0 ? ['DUMMYVALUE'] : vsDebugOptions;
        const programArgs = Array.isArray(this.args.args) && this.args.args.length > 0 ? this.args.args : [];
        if (typeof this.args.module === 'string' && this.args.module.length > 0) {
            return [vsDebugOptions.join(','), '-m', this.args.module].concat(programArgs);
        }
        return [vsDebugOptions.join(','), this.args.program].concat(programArgs);
    }
    launchExternalTerminal(sudo, cwd, pythonPath, args, env) {
        return new Promise((resolve, reject) => {
            if (this.canLaunchTerminal) {
                const command = sudo ? 'sudo' : pythonPath;
                const commandArgs = sudo ? [pythonPath].concat(args) : args;
                const isExternalTerminal = this.args.console === 'externalTerminal';
                const consoleKind = isExternalTerminal ? 'external' : 'integrated';
                const termArgs = {
                    kind: consoleKind,
                    title: 'Python Debug Console',
                    cwd,
                    args: [command].concat(commandArgs),
                    env
                };
                this.debugSession.runInTerminalRequest(termArgs, 5000, (response) => {
                    if (response.success) {
                        resolve();
                    }
                    else {
                        reject(response);
                    }
                });
            }
            else {
                open_1.open({ wait: false, app: [pythonPath].concat(args), cwd, env, sudo: sudo }).then(proc => {
                    this.pyProc = proc;
                    resolve();
                }, error => {
                    if (this.debugServerStatus === DebugServerStatus.Running) {
                        return;
                    }
                    reject(error);
                });
            }
        });
    }
    getEnvironmentVariables() {
        return __awaiter(this, void 0, void 0, function* () {
            const args = this.args;
            const envParser = new environment_1.EnvironmentVariablesService(new pathUtils_1.PathUtils(Utils_1.IS_WINDOWS));
            const envFileVars = yield envParser.parseFile(args.envFile);
            const hasEnvVars = args.env && Object.keys(args.env).length > 0;
            if (!envFileVars && !hasEnvVars) {
                return {};
            }
            if (envFileVars && !hasEnvVars) {
                return envFileVars;
            }
            if (!envFileVars && hasEnvVars) {
                return args.env;
            }
            // Merge the two sets of environment variables.
            const env = Object.assign({}, args.env);
            envParser.mergeVariables(envFileVars, env);
            return env;
        });
    }
}
exports.LocalDebugClient = LocalDebugClient;
//# sourceMappingURL=LocalDebugClient.js.map
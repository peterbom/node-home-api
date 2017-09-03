// Copyright (c) Brock Allen & Dominick Baier. All rights reserved.
// Licensed under the Apache License, Version 2.0. See LICENSE in the project root for license information.

let nopLogger = {
    info(){},
    warn(){},
    error(){}
};

const NONE = 0;
const ERROR = 1;
const WARN = 2;
const INFO = 3;

let _logger;
let _level;

function init() {
    _logger = _logger || console;
    _level = _level !== undefined ? _level : INFO;
}

class Log {
    static get NONE() {return NONE};
    static get ERROR() {return ERROR};
    static get WARN() {return WARN};
    static get INFO() {return INFO};
    
    static get level() {
        init();
        return _level;
    }

    static set level(value) {
        init();
        value = Number.parseInt(value);
        if (NONE <= value && value <= INFO){
            _level = value;
        } else {
            throw new Error("Invalid log level");
        }
    }
    
    static get logger() {
        init();
        return _logger;
    }

    static set logger(value){
        init();
        if (value.info && value.warn && value.error) {
            _logger = value;
        } else {
            throw new Error("Invalid logger");
        }
    }
    
    static info(...args) {
        init();
        if (_level >= INFO){
            _logger.info.apply(_logger, Array.from(args));
        }
    }

    static warn(...args) {
        init();
        if (_level >= WARN){
            _logger.warn.apply(_logger, Array.from(args));
        }
    }

    static error(...args) {
        init();
        if (_level >= ERROR){
            _logger.error.apply(_logger, Array.from(args));
        }
    }
}

exports.Log = Log;
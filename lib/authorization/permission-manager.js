"use strict";

exports.__esModule = true;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var PermissionManager = exports.PermissionManager = function () {
    function PermissionManager() {
        _classCallCheck(this, PermissionManager);
    }

    PermissionManager.prototype.getPermissions = function getPermissions(email) {
        switch (email) {
            case "pete_bomber@hotmail.com":
            case "petebomber@gmail.com":
                return ["home_manage", "packaging_maintain", "experiment_perform"];
            case "wanthanaj@gmail.com":
                return ["home_manage", "packaging_maintain"];
            default:
                return [];
        }
    };

    return PermissionManager;
}();
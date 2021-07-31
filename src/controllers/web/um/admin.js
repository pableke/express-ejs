
const dao = require("app/dao/factory.js");
const valid = require("app/lib/validator-box.js");
const util = require("app/lib/util-box.js");
const pagination = require("app/lib/pagination.js");

// View config
const TPL_LIST = "web/list/menu/menus";
const TPL_FORM = "web/forms/menu/menu";
const LIST = { basename: "/um", prevname: "/user" };

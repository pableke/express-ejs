
const dao = require("app/dao/factory.js");
const valid = require("app/lib/validator-box.js");
const util = require("app/lib/util-box.js");

// Components
const pagination = require("app/components/pagination.js");

// View config
const TPL_LIST = "web/list/um/xxx";
const TPL_FORM = "web/forms/um/xxx";
const LIST = { basename: "/um", prevname: "/user" };

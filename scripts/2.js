const glob = require("glob");

(() => glob.sync("files/*.csv", {}))();

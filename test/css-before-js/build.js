var path = require("path");
var stealTools = require("steal-tools");

module.exports = stealTools.build({
	main: "main",
	config: path.join(__dirname, "stealconfig.js")
}, {
	minify: false
});

var stealTools = require("steal-tools");

module.exports = stealTools.build({
	main: "main",
	config: __dirname+"/config.js"
},{
	minify: false,
	debug: true,
	bundleAssets: true
});

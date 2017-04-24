
Promise.resolve()
	.then(function() {
		console.log("creating build for css-paths");
		return require("./css-paths/build");
	})
	.then(function() {
		console.log("\ncreating build for css-before-js");
		return require("./css-before-js/build");
	})
	.then(function() {
		console.log("\ncreating build for css-instantiated");
		return require("./css-instantiated/build");
	})
	.then(function() {
		console.log("\ncreating build for css-local-import");
		return require("./css-local-import/build");
	});

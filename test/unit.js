var helpers = require("./helpers");
var QUnit = require("steal-qunit");

QUnit.module("SSR", {
	setup: function() {
		this.resetEnv = helpers.fakeBeingInNode();
	},
	teardown: function() {
		this.resetEnv();
	}
});

// Skipping this for now as I can't find a good way to mock the global document
QUnit.skip("Throws if there is not a document", function(assert){
	var done = assert.async();

	var loader = helpers.clone()
		.rootPackage({
			name: "app",
			version: "1.0.0",
			main: "main.js"
		})
		.allowFetch("app@1.0.0#app.css!steal-css")
		.loader;

	loader.env = "production";

	loader["import"]("app/app.css!steal-css")
	.then(function(){
		console.log('here');
		QUnit.ok(false, "This should have failed");
	}, function(err){
		console.log('erro', err, err.stack);
	})
	.then(done, done);
});

QUnit.test("updates url()s in Node", function(assert) {
	var done = assert.async()
	var mod = {
		source: "background-image: url('../../../foo/bar/baz.png')",
		address: "http://localhost/my/cool/app/main.css"
	};

	var loader = helpers.clone()
		.loader;

	loader["import"]("steal-css")
		.then(function(css){
			var newSrc = css.CSSModule.prototype.updateURLs.call(mod);

			QUnit.equal(newSrc.indexOf("background-image: url(http://localhost/foo/bar/baz.png)"), 0);
			done();
		});
});

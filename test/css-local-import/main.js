require("./main.css");

var p = document.getElementsByTagName("p").item(0);
var s = getComputedStyle(p);

if (window.assert) {
	assert.equal(s.fontSize, "30px", "should load the @import");
	done();
}
else {
	console.log("fontSize: ", s.fontSize);
}

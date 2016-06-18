"format cjs";

require("main.css");

var btn = document.getElementById('test-element');
var links = document.getElementsByTagName('link');

if (typeof window !== "undefined" && window.QUnit) {

	QUnit.equal(links.length, 1, "css file is loaded and appended on the document");
	QUnit.equal(links[0].onload.toString().replace(/\s/g, ''), "function(){}", 'set onload to noop()');
	QUnit.equal(getComputedStyle(btn).backgroundColor, 'rgb(255, 0, 0)', 'css applied');

	QUnit.start();
	removeMyself();
}else{
	console.log(getComputedStyle(btn));
}

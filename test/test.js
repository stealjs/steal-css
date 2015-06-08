QUnit.module("steal-css plugin");

var makeIframe = function(src){
	var iframe = document.createElement('iframe');
	window.removeMyself = function(){
		delete window.removeMyself;
		document.body.removeChild(iframe);
	};
	document.body.appendChild(iframe);
	iframe.src = src;
};

asyncTest("url paths in css work", function(){
	makeIframe("css_paths/site.html");
});

QUnit.start();

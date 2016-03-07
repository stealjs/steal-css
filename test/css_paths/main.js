import "css_paths/folder/main.css!";


var testImage = function(selector, cb){
	var image = new Image();
	image.onload = function(){
		cb();
	};
	image.onerror = function(){
		cb(selector);
		QUnit.ok(false, "image not loaded");
		QUnit.start();
		removeMyself();
	};
	image.src = $(selector).css("background-image").replace(/url\("?/,"").replace(/"?\)/,"");
};

if (typeof window !== "undefined" && window.QUnit) {
	testImage("#test-element", function(err){
		if(err){
			QUnit.ok(false, err);
			QUnit.start();
			removeMyself();
		} else {
			QUnit.ok(true, "#test-element");
			testImage("#test-relative", function(err){
				if(err){
					QUnit.ok(false, err);
				} else {
					QUnit.ok(true, "#test-relative");
				}
				QUnit.start();
				removeMyself();
			});
		}
		
	});
	
} else {
	console.log("background-image", $("#test-element").css("background-image"));
	console.log("tilde", $("#test-relative").css("background-image"));
}

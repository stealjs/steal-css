var loader = require("@loader");

var isNode = typeof process === "object" && {}.toString.call(process) ===
	"[object process]";
var importRegEx = /@import [^uU]['"]?([^'"\)]*)['"]?/g;
var resourceRegEx =  /url\(['"]?([^'"\)]*)['"]?\)/g;
	
var waitSeconds = (loader.cssOptions && loader.cssOptions.timeout)
	? parseInt(loader.cssOptions.timeout, 10) : 60;
var noop = function () {};
var attachEvents = function(link, cb){
	if( link.addEventListener ){
		link.addEventListener( "load", cb );
		link.addEventListener( "error", cb );
		// IE 8 and above
	} else if( link.attachEvent ){
		link.attachEvent( "onload", cb );
		link.attachEvent( "onerror", cb );
	} else {
		link.onload = cb;
		link.onerror = cb;
	}
};
var detachEvents = function(link, cb){
	if( link.removeEventListener ){
		link.removeEventListener("load", cb);
		link.removeEventListener("error", cb);

		// IE 8 and above
	} else if( link.detachEvent ){
		link.detachEvent("onload", cb);
		link.detachEvent("onerror", cb);
	} else {
		link.onload = noop;
		link.onerror = noop;
	}
};

if(isProduction()) {
	exports.fetch = function(load) {
		// inspired by https://github.com/filamentgroup/loadCSS
		// and http://stackoverflow.com/questions/3078584/link-element-onload

		var polling;
		var onloadCss = function(link, cb){
			polling = setTimeout(function() {
				var styleSheets = document.styleSheets;
				for (var i = 0; i < styleSheets.length; i++) {
					if (styleSheets[i].href == link.href) {
						detachEvents(link, cb);
						return cb();
					}
				}
				onloadCss(link, cb);
				// sometimes polling is faster then the onload event
				// if polling is faster, then tests fail in firefox!
				// we have to increase the timeout.
				// 100 seems to be a good way.
				// if someone gets problems we can adjust this timeout
			}, 100);
		};

		// wait until the css file is loaded
		return new Promise(function(resolve, reject) {
			var timeout = setTimeout(function() {
				reject('Unable to load CSS');
			}, waitSeconds * 1000);

			var link = document.createElement('link');
			link.type = 'text/css';
			link.rel = 'stylesheet';
			link.href = load.address;

			var loadCB = function(event) {
				clearTimeout(timeout);
				clearTimeout(polling);
				detachEvents(link, loadCB);

				if(event && event.type === "error"){
					reject('Unable to load CSS');
				} else {
					resolve('');
				}
			};
			// attach onload event for all browser
			// wherever onload event is fired if
			// css file is loaded
			attachEvents(link, loadCB);
			// fallback, polling styleSheets
			onloadCss(link, loadCB);

			document.head.appendChild(link);

		});
	};

} else {

	exports.instantiate = function(load) {
		var loader = this;

		// Replace @import's that don't start with a "u" or "U" and do start
		// with a single or double quote with a path wrapped in "url()"
		// relative to the page
		load.source = load.source.replace(importRegEx, function(whole, part) {
			if(isNode) {
				return "@import url(" + part + ")";
			}else{
				return "@import url(" + steal.joinURIs( load.address, part) + ")";
			}
		});


		load.metadata.deps = [];
		load.metadata.execute = function(){

			var source = load.source+"/*# sourceURL="+load.address+" */";
			source = source.replace(resourceRegEx, function(whole, part) {
				return "url(" + steal.joinURIs( load.address, part) + ")";
			});

			if(load.source && typeof document !== "undefined") {
				var doc = document.head ? document : document.getElementsByTagName ?
					document : document.documentElement;

				var head = doc.head || doc.getElementsByTagName('head')[0],
					style = document.createElement('style');

				if(!head) {
					var docEl = doc.documentElement || doc;
					head = document.createElement("head");
					docEl.insertBefore(head, docEl.firstChild);
				}

				// make source load relative to the current page
				style.type = 'text/css';

				if (style.styleSheet){
					style.styleSheet.cssText = source;
				} else {
					style.appendChild(document.createTextNode(source));
				}
				head.appendChild(style);

				if(loader.has("live-reload")) {
					var cssReload = loader["import"]("live-reload", { name: "$css" });
					Promise.resolve(cssReload).then(function(reload){
						loader["import"](load.name).then(function(){
							reload.once(load.name, function(){
								head.removeChild(style);
							});
						});
					});
				}
			}

			return System.newModule({source: source});
		};
		load.metadata.format = "css";
	};

}

function isProduction(){
	return (loader.isEnv && loader.isEnv("production")) ||
		loader.env === "production";
}
exports.locateScheme = true;
exports.buildType = "css";
exports.includeInBuild = true;

var loader = require("@loader");

var isNode = typeof process === "object" && {}.toString.call(process) ===
	"[object process]";
var importRegEx = /@import [^uU]['"]?([^'"\)]*)['"]?/g;
var resourceRegEx =  /url\(['"]?([^'"\)]*)['"]?\)/g;
	
var waitSeconds = 100;
var noop = function () {};
var isWebkit = (typeof window !== 'undefined') ?
	window.navigator.userAgent.match(/AppleWebKit\/([^ ;]*)/) : false;
var webkitLoadCheck = function (link, callback) {
		setTimeout(function () {
			for (var i = 0; i < document.styleSheets.length; i++) {
				var sheet = document.styleSheets[i];
				if (sheet.href == link.href)
					return callback();
			}
			webkitLoadCheck(link, callback);
		}, 10);
	};

if(isProduction()) {
	exports.fetch = function(load) {
		// stolen from https://github.com/systemjs/plugin-css/edit/master/css.js
		// thanks!
		// wait until the css file is loaded
		return new Promise(function(resolve, reject) {
			var timeout = setTimeout(function() {
				reject('Unable to load CSS');
			}, waitSeconds * 1000);

			var _callback = function(error) {
				clearTimeout(timeout);
				link.onload = link.onerror = noop;
				setTimeout(function() {
					if (error)
						reject(error);
					else
						resolve('');
				}, 7);
			};

			var link = document.createElement('link');
			link.type = 'text/css';
			link.rel = 'stylesheet';
			link.href = load.address;

			if (!isWebkit) {
				link.onload = function() {
					_callback();
				}
			} else {
				webkitLoadCheck(link, _callback);
			}
			link.onerror = function(event) {
				_callback(event.error || new Error('Error loading CSS file.'));
			};

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

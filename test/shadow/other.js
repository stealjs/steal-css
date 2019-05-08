var globalStyles = require("./main.css");

var styles = globalStyles.default.cloneNode(true);

var root = document.createElement("div");
root.id = "other";
root.attachShadow({ mode: "open" });
root.shadowRoot.innerHTML = `
	<div class="other"><h2>Other</h2></div>
`;
root.shadowRoot.prepend(styles);
document.body.append(root);

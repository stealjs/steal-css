import { clone as cloneStyles } from "./main.css";

var root = document.createElement("div");
root.id = "other";
root.attachShadow({ mode: "open" });
root.shadowRoot.innerHTML = `
	<div class="other"><h2>Other</h2></div>
`;
root.shadowRoot.prepend(cloneStyles());
document.body.append(root);

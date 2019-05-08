require("./other");
const globalStyles = require("./main.css");

const styles = globalStyles.default.cloneNode(true);

const root = document.createElement("div");
root.id = "main";
root.attachShadow({ mode: 'open' });
root.shadowRoot.innerHTML = `
	<div class="thing">
	  <h1>Hello world</h1>
	</div>
`;
root.shadowRoot.prepend(styles);

document.body.append(root);

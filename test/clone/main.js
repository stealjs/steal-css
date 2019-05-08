require("./other");
const styles = require("./main.css");

const root = document.createElement("div");
root.id = "main";
root.attachShadow({ mode: 'open' });
root.shadowRoot.innerHTML = `
	<div class="thing">
	  <h1>Hello world</h1>
	</div>
`;
root.shadowRoot.prepend(styles.clone());

document.body.append(root);

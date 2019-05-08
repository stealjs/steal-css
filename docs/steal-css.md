@module {{}} steal-css
@parent StealJS.ecosystem
@group steal-css.exports Exports
@group steal-css.other Other

@description

**steal-css** is a plugin for Steal that allows declaring CSS dependencies in your project. Importing a CSS file will result in its styles being applied to the page automatically.

@option {string} source The __source__ property is the raw CSS string of the module. In production this will be an empty string as the raw source is not fetched by JavaScript.

@option {HTMLElement} default The __default__ export is the element that was inserted into the page. In development mode this will be a [style](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/style) element; in production it will be [link](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/link).

@option {function():HTMLElement} clone The __clone__ export is a function that returns a cloned version of the element that was inserted into the page. This is useful when using styles in [Shadow DOM](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_shadow_DOM) where you will need to insert a different copy of the element in each shadowRoot.

@body

## Use

Install steal-css with npm and save it as a development dependency:

```
> npm install steal-css --save-dev
```

In your package.json add steal-css as a plugin under your **steal** configuration:

```json
...

"steal": {
  "plugins": [
    "steal-css"
  ]
}
```

To load a CSS module in your JavaScript code, just import it just as you would any other module:

```js
import "./styles.css";
```

## Getting the element

The element used to apply the styles is exported as the default export. You can use this if you wanted to do something clever, like provide a way to unapply the styles.

```js
import styles from "./styles.css";

let btn = document.querySelector("#disable-theme");
btn.addEventListener("click", () => {
	styles.remove();
});
```

## Cloning the element

[Shadow DOM](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_shadow_DOM) provides a way to encapsulate DOM and styles. It's usually used when building web components. Selectors inside of Shadow DOM will not have global CSS applied to them. The __clone__ function provides a way to quickly clone the style element for use within a web component.

__my-element.css__

```css
#root {
	font-size: 125%;
}
```

__my-element.js__

```js
import { clone as cloneStyles } from "./styles.css";

class MyElement extends HTMLElement {
	constructor() {
		super();
		this.attachShadow({ mode: "open" });
		this.shadowRoot.innerHTML = `
			<div id="root">Hello world!</div>
		`;

		// Clone a copy of the styles into the shadowRoot.
		this.shadowRoot.prepend(cloneStyles());
	}
}

customElements.define("my-element", MyElement);
```

# thumbnails.js: Scrolling Thumbnails

*DEPRICATION WARNING: the functionality in this script has been superceeded / trivialised by updated web standards.*

Browsing through a long list of irregularly shaped thumbnails using scrolling controls.

## How to include the script

The stylesheet is best included in the header of the document.

```html
<link rel="stylesheet" href="css/thumbnails.css"/>
```

This include can be added to the header or placed inline before the script is invoked.

```html
<script src="lib/transitions.js"></script>
<script src="js/thumbnails.js"></script>
```

Or use [Require.js](https://requirejs.org/).

```js
requirejs([
	'lib/transitions.js',
	'js/thumbnails.js'
], function(transitions, Thumbnails) {
	...
});
```

Or use imported as a component in existing projects.

```js
@import {transitions = require('lib/transitions.js";
@import {Thumbnails} from "js/Thumbnails.js";
```

## How to start the script

```javascript
var thumbnails = new Thumbnails({
	'element': document.getElementById('id'),
	'square' : true,
	'onselected' : function (index, event) {}
});
```

**id : {string}** - The ID attribute of an element somewhere in the document.

**square : {boolean}** - Optional boolean to centre images into fixed squares or retain their irregular shapes.

**onselected : {function}** - An optional callback to run when images are selected.
- *index : {integer}* - The index of the thumbnail that was selected.
- *event : {event object}* - The event object of the click.

## How to control the script

### Focus

```javascript
thumbnails.focus(index);
```

Highlights and centres a specific thumbnail.

**index : {integer}** - The index of the thumbnail to centre and highlight.

### Left

```javascript
thumbnails.left();
```

Scrolls the list of thumbnails one page to the left.

### Right

```javascript
thumbnails.right();
```

Scrolls the list of thumbnails one page to the right.

## License

This work is licensed under a [MIT License](https://opensource.org/licenses/MIT). The latest version of this and other scripts by the same author can be found on [Github](https://github.com/WoollyMittens).

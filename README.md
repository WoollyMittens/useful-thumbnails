# thumbnails.js: Scrolling Thumbnails

Browsing through a long list of irregularly shaped thumbnails using scrolling controls.

Try the <a href="http://www.woollymittens.nl/default.php?url=useful-thumbnails">demo</a>.

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

Or import into an MVC framework.

```js
var transitions = require('lib/transitions.js');
var Thumbnails = require('js/Thumbnails.js');
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

## How to build the script

This project uses node.js from http://nodejs.org/

This project uses gulp.js from http://gulpjs.com/

The following commands are available for development:
+ `npm install` - Installs the prerequisites.
+ `gulp import` - Re-imports libraries from supporting projects to `./src/libs/` if available under the same folder tree.
+ `gulp dev` - Builds the project for development purposes.
+ `gulp dist` - Builds the project for deployment purposes.
+ `gulp watch` - Continuously recompiles updated files during development sessions.
+ `gulp serve` - Serves the project on a temporary web server at http://localhost:8500/.
+ `gulp php` - Serves the project on a temporary php server at http://localhost:8500/.

## License

This work is licensed under a Creative Commons Attribution 3.0 Unported License. The latest version of this and other scripts by the same author can be found at http://www.woollymittens.nl/

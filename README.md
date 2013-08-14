# useful.thumbnails.js: Scrolling Thumbnails

Browsing through a long list of irregularly shaped thumbnails using scrolling controls.

Try the <a href="http://www.woollymittens.nl/useful/default.php?url=sort">sort demo</a>.

## How to use the script

The stylesheet is best included in the header of the document.

```html
<link rel="stylesheet" href="./css/thumbnails.css"/>
```

This include can be added to the header or placed inline before the script is invoked.

```html
<script src="./js/useful.thumbnails.js"></script>
```

To enable the use of HTML5 tags in Internet Explorer 8 and lower, include *html5.js*. To provide an alternative for *document.querySelectorAll* and CSS3 animations in Internet Explorer 8 and lower, include *jQuery*.

```html
<!--[if lte IE 9]>
	<script src="//html5shiv.googlecode.com/svn/trunk/html5.js"></script>
	<script src="//ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js"></script>
<![endif]-->
```

### Constructor

```javascript
var thumbnails = new useful.Thumbnails( document.getElementById('id'), {
	'square' : true,
	'onselected' : function (index, event) {}
});
```

This is the safest way of starting the script, but allows for only one target element at a time.

**id : {string}** - The ID attribute of an element somewhere in the document.

**square : {boolean}** - Optional boolean to centre images into fixed squares or retain their irregular shapes.

**onselected : {function}** - An optional callback to run when images are selected.

**index : {integer}** - The index of the thumbnail that was selected.

**event : {event object}** - The event object of the click.


### Methods

#### Start

```javascript
thumbnails.start();
```

Start the functionality

#### Focus

```javascript
thumbnails.focus(index);
```

Highlights and centres a specific thumbnail.

**index : {integer}** - The index of the thumbnail to centre and highlight.

#### Left

```javascript
thumbnails.left();
```

Scrolls the list of thumbnails one page to the left.

#### Right

```javascript
thumbnails.right();
```

Scrolls the list of thumbnails one page to the right.

## License
This work is licensed under a Creative Commons Attribution 3.0 Unported License. The latest version of this and other scripts by the same author can be found at http://www.woollymittens.nl/

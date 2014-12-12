/*
	Source:
	van Creij, Maurice (2014). "useful.thumbnails.js: Scrolling through a long list of thumbnails using paging controls.", version 20141127, http://www.woollymittens.nl/.

	License:
	This work is licensed under a Creative Commons Attribution 3.0 Unported License.
*/

// create the global object if needed
var useful = useful || {};

// extend the global object
useful.Thumbnails = function () {

	// PROPERTIES

	"use strict";

	// METHODS

	this.init = function (config) {
		// store the configuration
		this.config = config;
		this.element = config.element;
		// make sure the default options are known
		this.config.square = this.config.square || false;
		this.config.onselected = this.config.onselected || function () {};
		// apply the options
		this.element.className += (this.config.square) ? ' tn-square' : '';
		// clean end of line markers from the dom
		this.clean();
		// add the buttons to the scroller
		this.construct();
		// return the object
		return this;
	};

	this.clean = function () {
		// clean the list of white space
		this.element.innerHTML = this.element.innerHTML.replace(/\t|\r|\n/g, '');
	};

	this.construct = function () {
		var a, b;
		// store scroller parts
		this.config.list = this.element.getElementsByTagName('ul')[0];
		this.config.items = this.config.list.getElementsByTagName('li');
		this.config.links = this.config.list.getElementsByTagName('a');
		this.config.images = this.config.list.getElementsByTagName('img');
		// set the start position
		this.config.list.style.marginLeft = '0px';
		// add the left button
		this.config.leftButton = document.createElement('button');
		this.config.leftButton.innerHTML = '&lt;';
		this.config.leftButton.className = 'tn-left tn-disabled';
		this.config.leftButton.onclick = this.onLeftButton();
		this.element.appendChild(this.config.leftButton);
		// add the right button
		this.config.rightButton = document.createElement('button');
		this.config.rightButton.innerHTML = '&gt;';
		this.config.rightButton.className = 'tn-right tn-enabled';
		this.config.rightButton.onclick = this.onRightButton();
		this.element.appendChild(this.config.rightButton);
		// centre the thumbnails if square
		if (this.config.square) {
			// for all thumbnails
			for (a = 0, b = this.config.images.length; a < b; a += 1) {
				// add an onclick handler
				this.config.links[a].addEventListener('click', this.onSelected(a));
				// re-centre when the image changes
				this.config.images.onload = this.center(this.config.images[a]);
				// centre the image
				this.center(this.config.images[a]);
			}
		}
	};

	this.center = function (image) {
		var imageWidth, imageHeight, rowHeight;
		// measure the available space
		rowHeight = this.element.offsetHeight;
		// centre the image in its surroundings
		image.parentNode.style.width =  rowHeight + 'px';
		image.parentNode.style.height =  rowHeight + 'px';
		imageWidth = image.offsetWidth;
		imageHeight = image.offsetHeight;
		if (imageWidth > imageHeight) {
			imageWidth = imageWidth / imageHeight * rowHeight;
			imageHeight = rowHeight;
		} else {
			imageHeight = imageHeight /  imageWidth * rowHeight;
			imageWidth = rowHeight;
		}
		image.style.width = Math.round(imageWidth) + 'px';
		image.style.height = Math.round(imageHeight) + 'px';
		image.style.left = '50%';
		image.style.top = '50%';
		image.style.marginLeft = Math.round(-imageWidth / 2) + 'px';
		image.style.marginTop = Math.round(-imageHeight / 2) + 'px';
	};

	this.measure = function () {
		var stop = false, m = {}, itemWidth = 0;
		// get the component dimensions
		m.currentLeft = parseInt(this.config.list.style.marginLeft, 10);
		m.buttonsWidth = this.config.leftButton.offsetWidth + this.config.rightButton.offsetWidth;
		m.pageWidth = this.element.offsetWidth - m.buttonsWidth;
		m.totalWidth = 0;
		m.pageLeft = 0;
		// determine the length of the scroller
		for (var a = 0, b = this.config.items.length; a < b; a += 1) {
			// add the item's width to the max distance
			itemWidth = this.config.items[a].offsetWidth;
			m.totalWidth += itemWidth;
			// add the item's width to the page distance
			if (m.totalWidth > -m.currentLeft) {
				if (m.pageLeft + itemWidth < m.pageWidth && !stop) {
					m.pageLeft += itemWidth;
				} else {
					stop = true;
				}
			}
		}
		// store the maximum scroll position
		m.maxLeft = m.pageWidth - m.totalWidth;
		// return the measurements
		return m;
	};

	this.left = function () {
		// calculate the positions
		var m = this.measure();
		// limit the distance
		if (m.currentLeft + m.pageLeft < 0) {
			// move the collection to the right
			useful.transitions.byRules(this.config.list, {'marginLeft' : (m.currentLeft + m.pageLeft) + 'px'});
			// enable the buttons
			this.enableBoth();
		} else {
			// stop the position at its max
			useful.transitions.byRules(this.config.list, {'marginLeft' : '0px'});
			// disable the left button
			this.enableRight();
		}
		// cancel the click
		return false;
	};

	this.right = function () {
		// calculate the positions
		var m = this.measure();
		// limit the distance
		if (m.currentLeft - m.pageLeft > m.maxLeft) {
			// move the collection to the left
			useful.transitions.byRules(this.config.list, {'marginLeft' : (m.currentLeft - m.pageLeft) + 'px'});
			// enable the button
			this.enableBoth();
		} else {
			// stop the position at its max
			useful.transitions.byRules(this.config.list, {'marginLeft' : m.maxLeft + 'px'});
			// disable the right button
			this.enableLeft();
		}
		// cancel the click
		return false;
	};

	this.focus = function (index) {
		// calculate the positions
		var a, b, m = this.measure(), centerLeft;
		// for all links
		for (a = 0, b = this.config.links.length; a < b; a += 1) {
			// highlight the link
			this.config.links[a].className = (a === index) ? 'tn-active' : 'tn-passive';
		}
		// calculate the centre
		centerLeft = (m.pageWidth + m.buttonsWidth - this.config.items[index].offsetWidth) / 2 - this.config.items[index].offsetLeft;
		// limit the distance
		if (centerLeft > 0) {
			// stop the position at its max
			useful.transitions.byRules(this.config.list, {'marginLeft' : '0px'});
			// disable the left button
			this.enableRight();
		} else if (centerLeft < m.maxLeft) {
			// move the collection to the left
			useful.transitions.byRules(this.config.list, {'marginLeft' : m.maxLeft + 'px'});
			// disable the right button
			this.enableLeft();
		} else {
			// move the collection to the left
			useful.transitions.byRules(this.config.list, {'marginLeft' : centerLeft + 'px'});
			// enable the buttons
			this.enableBoth();
		}
	};

	this.enableBoth = function () {
		this.config.leftButton.className = this.config.leftButton.className.replace(/disabled/, 'enabled');
		this.config.rightButton.className = this.config.rightButton.className.replace(/disabled/, 'enabled');
	};

	this.enableLeft = function () {
		this.config.leftButton.className = this.config.leftButton.className.replace(/disabled/, 'enabled');
		this.config.rightButton.className = this.config.rightButton.className.replace(/enabled/, 'disabled');
	};

	this.enableRight = function () {
		this.config.leftButton.className = this.config.leftButton.className.replace(/enabled/, 'disabled');
		this.config.rightButton.className = this.config.rightButton.className.replace(/disabled/, 'enabled');
	};

	// EVENTS

	this.onSelected = function (index) {
		var context = this;
		return function (event) { context.config.onselected(index, event); };
	};

	this.onRedraw = function (image) {
		var context = this;
		return function () { context.redraw(image); return false; };
	};

	this.onLeftButton = function () {
		var context = this;
		return function () { context.left(); return false; };
	};

	this.onRightButton = function () {
		var context = this;
		return function () { context.right(); return false; };
	};

};

// return as a require.js module
if (typeof module !== 'undefined') {
	exports = module.exports = useful.Thumbnails;
}

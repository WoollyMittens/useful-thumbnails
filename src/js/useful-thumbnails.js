/*
	Source:
	van Creij, Maurice (2013). "useful.thumbnails.js: Scrolling through a long list of thumbnails using paging controls.", version 20130814, http://www.woollymittens.nl/.

	License:
	This work is licensed under a Creative Commons Attribution 3.0 Unported License.
*/

(function (useful) {

	// invoke strict mode
	"use strict";

	// private functions
	useful.Thumbnails = function (obj, cfg) {
		// properties
		this.obj = obj;
		this.cfg = cfg;
		// methods
		this.start = function () {
			// make sure the default options are known
			this.cfg.square = this.cfg.square || false;
			this.cfg.onselected = this.cfg.onselected || function () {};
			// apply the options
			this.obj.className += (this.cfg.square) ? ' tn-square' : '';
			// clean end of line markers from the dom
			this.clean();
			// add the buttons to the scroller
			this.construct();
		};
		this.clean = function () {
			// clean the list of white space
			this.obj.innerHTML = this.obj.innerHTML.replace(/\t|\r|\n/g, '');
		};
		this.construct = function () {
			var a, b;
			// store scroller parts
			this.cfg.list = this.obj.getElementsByTagName('ul')[0];
			this.cfg.items = this.cfg.list.getElementsByTagName('li');
			this.cfg.links = this.cfg.list.getElementsByTagName('a');
			this.cfg.images = this.cfg.list.getElementsByTagName('img');
			// set the start position
			this.cfg.list.style.marginLeft = '0px';
			// add the left button
			this.cfg.leftButton = document.createElement('button');
			this.cfg.leftButton.innerHTML = '&lt;';
			this.cfg.leftButton.className = 'tn-left tn-disabled';
			this.cfg.leftButton.onclick = this.onLeftButton();
			this.obj.appendChild(this.cfg.leftButton);
			// add the right button
			this.cfg.rightButton = document.createElement('button');
			this.cfg.rightButton.innerHTML = '&gt;';
			this.cfg.rightButton.className = 'tn-right tn-enabled';
			this.cfg.rightButton.onclick = this.onRightButton();
			this.obj.appendChild(this.cfg.rightButton);
			// centre the thumbnails if square
			if (this.cfg.square) {
				// for all thumbnails
				for (a = 0, b = this.cfg.images.length; a < b; a += 1) {
					// add an onclick handler
					this.cfg.links[a].addEventListener('click', this.onSelected(a));
					// re-centre when the image changes
					this.cfg.images.onload = this.center(this.cfg.images[a]);
					// centre the image
					this.center(this.cfg.images[a]);
				}
			}
		};
		this.center = function (image) {
			var imageWidth, imageHeight, rowHeight;
			// measure the available space
			rowHeight = this.obj.offsetHeight;
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
			m.currentLeft = parseInt(this.cfg.list.style.marginLeft, 10);
			m.buttonsWidth = this.cfg.leftButton.offsetWidth + this.cfg.rightButton.offsetWidth;
			m.pageWidth = this.obj.offsetWidth - m.buttonsWidth;
			m.totalWidth = 0;
			m.pageLeft = 0;
			// determine the length of the scroller
			for (var a = 0, b = this.cfg.items.length; a < b; a += 1) {
				// add the item's width to the max distance
				itemWidth = this.cfg.items[a].offsetWidth;
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
				useful.transitions.byRules(this.cfg.list, {'marginLeft' : (m.currentLeft + m.pageLeft) + 'px'});
				// enable the buttons
				this.enableBoth();
			} else {
				// stop the position at its max
				useful.transitions.byRules(this.cfg.list, {'marginLeft' : '0px'});
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
				useful.transitions.byRules(this.cfg.list, {'marginLeft' : (m.currentLeft - m.pageLeft) + 'px'});
				// enable the button
				this.enableBoth();
			} else {
				// stop the position at its max
				useful.transitions.byRules(this.cfg.list, {'marginLeft' : m.maxLeft + 'px'});
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
			for (a = 0, b = this.cfg.links.length; a < b; a += 1) {
				// highlight the link
				this.cfg.links[a].className = (a === index) ? 'tn-active' : 'tn-passive';
			}
			// calculate the centre
			centerLeft = (m.pageWidth + m.buttonsWidth - this.cfg.items[index].offsetWidth) / 2 - this.cfg.items[index].offsetLeft;
			// limit the distance
			if (centerLeft > 0) {
				// stop the position at its max
				useful.transitions.byRules(this.cfg.list, {'marginLeft' : '0px'});
				// disable the left button
				this.enableRight();
			} else if (centerLeft < m.maxLeft) {
				// move the collection to the left
				useful.transitions.byRules(this.cfg.list, {'marginLeft' : m.maxLeft + 'px'});
				// disable the right button
				this.enableLeft();
			} else {
				// move the collection to the left
				useful.transitions.byRules(this.cfg.list, {'marginLeft' : centerLeft + 'px'});
				// enable the buttons
				this.enableBoth();
			}
		};
		this.enableBoth = function () {
			this.cfg.leftButton.className = this.cfg.leftButton.className.replace(/disabled/, 'enabled');
			this.cfg.rightButton.className = this.cfg.rightButton.className.replace(/disabled/, 'enabled');
		};
		this.enableLeft = function () {
			this.cfg.leftButton.className = this.cfg.leftButton.className.replace(/disabled/, 'enabled');
			this.cfg.rightButton.className = this.cfg.rightButton.className.replace(/enabled/, 'disabled');
		};
		this.enableRight = function () {
			this.cfg.leftButton.className = this.cfg.leftButton.className.replace(/enabled/, 'disabled');
			this.cfg.rightButton.className = this.cfg.rightButton.className.replace(/disabled/, 'enabled');
		};
		// event handlers
		this.onSelected = function (index) {
			var context = this;
			return function (event) { context.cfg.onselected(index, event); };
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

}(window.useful = window.useful || {}));

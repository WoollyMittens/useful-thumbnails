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
				transitions.byRules(this.cfg.list, {'marginLeft' : (m.currentLeft + m.pageLeft) + 'px'});
				// enable the buttons
				this.enableBoth();
			} else {
				// stop the position at its max
				transitions.byRules(this.cfg.list, {'marginLeft' : '0px'});
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
				transitions.byRules(this.cfg.list, {'marginLeft' : (m.currentLeft - m.pageLeft) + 'px'});
				// enable the button
				this.enableBoth();
			} else {
				// stop the position at its max
				transitions.byRules(this.cfg.list, {'marginLeft' : m.maxLeft + 'px'});
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
				transitions.byRules(this.cfg.list, {'marginLeft' : '0px'});
				// disable the left button
				this.enableRight();
			} else if (centerLeft < m.maxLeft) {
				// move the collection to the left
				transitions.byRules(this.cfg.list, {'marginLeft' : m.maxLeft + 'px'});
				// disable the right button
				this.enableLeft();
			} else {
				// move the collection to the left
				transitions.byRules(this.cfg.list, {'marginLeft' : centerLeft + 'px'});
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
			var scope = this;
			return function () { scope.redraw(image); return false; };
		};
		this.onLeftButton = function () {
			var scope = this;
			return function () { scope.left(); return false; };
		};
		this.onRightButton = function () {
			var scope = this;
			return function () { scope.right(); return false; };
		};
	};

	/*
		useful.transitions.js
	*/

	// private functions
	var transitions = transitions || {};

	// checks the compatibility of CSS3 transitions for this browser
	transitions.compatibility = function () {
		var eventName, newDiv, empty;
		// create a test div
		newDiv = document.createElement('div');
		// use various tests for transition support
		if (typeof(newDiv.style.MozTransition) !== 'undefined') { eventName = 'transitionend'; }
		try { document.createEvent('OTransitionEvent'); eventName = 'oTransitionEnd'; } catch (e) { empty = null; }
		try { document.createEvent('WebKitTransitionEvent'); eventName = 'webkitTransitionEnd'; } catch (e) { empty = null; }
		try { document.createEvent('transitionEvent'); eventName = 'transitionend'; } catch (e) { empty = null; }
		// remove the test div
		newDiv = empty;
		// pass back working event name
		return eventName;
	};

	// applies a list of rules
	transitions.byRules = function (element, rules, endEventHandler) {
		var rule, endEventName, endEventFunction;
		// validate the input
		rules.transitionProperty = rules.transitionProperty || 'all';
		rules.transitionDuration = rules.transitionDuration || '300ms';
		rules.transitionTimingFunction = rules.transitionTimingFunction || 'ease';
		endEventHandler = endEventHandler || function () {};
		endEventName = transitions.compatibility();
		// if CSS3 transitions are available
		if (typeof endEventName !== 'undefined') {
			// set the onComplete handler and immediately remove it afterwards
			element.addEventListener(endEventName, endEventFunction = function () {
				endEventHandler();
				element.removeEventListener(endEventName, endEventFunction, true);
			}, true);
			// for all rules
			for (rule in rules) {
				if (rules.hasOwnProperty(rule)) {
					// implement the prefixed value
					element.style[transitions.compatibility(rule)] = rules[rule];
					// implement the value
					element.style[rule] = rules[rule];
				}
			}
		// else if jQuery is available
		} else if (typeof jQuery !== 'undefined') {
			var jQueryEasing, jQueryDuration;
			// pick the equivalent jQuery animation function
			jQueryEasing = (rules.transitionTimingFunction.match(/ease/gi)) ? 'swing' : 'linear';
			jQueryDuration = parseInt(rules.transitionDuration.replace(/s/g, '000').replace(/ms/g, ''), 10);
			// remove rules that will make Internet Explorer complain
			delete rules.transitionProperty;
			delete rules.transitionDuration;
			delete rules.transitionTimingFunction;
			// use animate from jQuery
			jQuery(element).animate(
				rules,
				jQueryDuration,
				jQueryEasing,
				endEventHandler
			);
		// else
		} else {
			// for all rules
			for (rule in rules) {
				if (rules.hasOwnProperty(rule)) {
					// implement the prefixed value
					element.style[transitions.compatibility(rule)] = rules[rule];
					// implement the value
					element.style[rule] = rules[rule];
				}
			}
			// call the onComplete handler
			endEventHandler();
		}
	};

	/*
		useful.polyfills.js
	*/

	// private functions
	var polyfills = polyfills || {};

	// allow addEventListener (https://gist.github.com/jonathantneal/3748027)
	polyfills.addEventListener = function () {
		!window.addEventListener && (function (WindowPrototype, DocumentPrototype, ElementPrototype, addEventListener, removeEventListener, dispatchEvent, registry) {
			WindowPrototype[addEventListener] = DocumentPrototype[addEventListener] = ElementPrototype[addEventListener] = function (type, listener) {
				var target = this;
				registry.unshift([target, type, listener, function (event) {
					event.currentTarget = target;
					event.preventDefault = function () { event.returnValue = false; };
					event.stopPropagation = function () { event.cancelBubble = true; };
					event.target = event.srcElement || target;
					listener.call(target, event);
				}]);
				this.attachEvent("on" + type, registry[0][3]);
			};
			WindowPrototype[removeEventListener] = DocumentPrototype[removeEventListener] = ElementPrototype[removeEventListener] = function (type, listener) {
				for (var index = 0, register; register = registry[index]; ++index) {
					if (register[0] == this && register[1] == type && register[2] == listener) {
						return this.detachEvent("on" + type, registry.splice(index, 1)[0][3]);
					}
				}
			};
			WindowPrototype[dispatchEvent] = DocumentPrototype[dispatchEvent] = ElementPrototype[dispatchEvent] = function (eventObject) {
				return this.fireEvent("on" + eventObject.type, eventObject);
			};
		})(Window.prototype, HTMLDocument.prototype, Element.prototype, "addEventListener", "removeEventListener", "dispatchEvent", []);
	};

	// allow console.log
	polyfills.consoleLog = function () {
		if (!document.console) {
			window.console = {};
			window.console.log = function () {
				// if the reporting panel doesn't exist
				var a, b, messages = '', reportPanel = document.getElementById('reportPanel');
				if (!reportPanel) {
					// create the panel
					reportPanel = document.createElement('DIV');
					reportPanel.id = 'reportPanel';
					reportPanel.style.background = '#fff none';
					reportPanel.style.border = 'solid 1px #000';
					reportPanel.style.color = '#000';
					reportPanel.style.fontSize = '12px';
					reportPanel.style.padding = '10px';
					reportPanel.style.position = (navigator.userAgent.indexOf('MSIE 6') > -1) ? 'absolute' : 'fixed';
					reportPanel.style.right = '10px';
					reportPanel.style.bottom = '10px';
					reportPanel.style.width = '180px';
					reportPanel.style.height = '320px';
					reportPanel.style.overflow = 'auto';
					reportPanel.style.zIndex = '100000';
					reportPanel.innerHTML = '&nbsp;';
					// store a copy of this node in the move buffer
					document.body.appendChild(reportPanel);
				}
				// truncate the queue
				var reportString = (reportPanel.innerHTML.length < 1000) ? reportPanel.innerHTML : reportPanel.innerHTML.substring(0, 800);
				// process the arguments
				for (a = 0, b = arguments.length; a < b; a += 1) {
					messages += arguments[a] + '<br/>';
				}
				// output the queue to the panel
				reportPanel.innerHTML = messages + reportString;
			};
		}
	};

	// for immediate use
	polyfills.addEventListener();
	polyfills.consoleLog();

}(window.useful = window.useful || {}));

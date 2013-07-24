/*
	Source:
	van Creij, Maurice (2012). "useful.sort.js: Simple table sorting functionality", version 20120606, http://www.woollymittens.nl/.

	License:
	This work is licensed under a Creative Commons Attribution 3.0 Unported License.

	Prerequisites:
	<script src="./js/useful.js"></script>
*/

(function (useful) {

	// invoke strict mode
	"use strict";

	// private functions
	var thumbnails = {};
	thumbnails = {
		start : function (element, config) {
			// store the parent node
			config.parent = element;
			// clean end of line markers from the dom
			thumbnails.clean(config);
			// add the buttons to the scroller
			thumbnails.construct(config);
		},
		clean : function (config) {
			// clean the list of white space
			config.parent.innerHTML = config.parent.innerHTML.replace(/\t|\r|\n/g, '');
		},
		construct : function (config) {
			// store scroller parts
			config.list = config.parent.getElementsByTagName('ul')[0];
			// set the start position
			config.list.style.marginLeft = '0px';
			// add the left button
			config.leftButton = document.createElement('button');
			config.leftButton.innerHTML = '&lt;';
			config.leftButton.className = 'tn-left tn-enabled';
			config.leftButton.onclick = this.left(config);
			config.parent.appendChild(config.leftButton);
			// add the right button
			config.rightButton = document.createElement('button');
			config.rightButton.innerHTML = '&gt;';
			config.rightButton.className = 'tn-right tn-disabled';
			config.rightButton.onclick = this.right(config);
			config.parent.appendChild(config.rightButton);
		},
		measure : function (config) {
			var a, b, items;
			// measure the buttons
			config.buttonSize = config.leftButton.offsetWidth + config.rightButton.offsetWidth;
			// determine the step size
			config.stepSize = config.parent.offsetWidth - config.buttonSize;
			// make the width include the buttons
			config.totalSize = 0;
			// add every individual thumbnail to the total
			var items = config.list.getElementsByTagName('li');
			for (a = 0, b = items.length; a < b; a += 1) {
				config.totalSize += items[a].offsetWidth;
			}
			// store the scroll limit
			config.scrollLimit = config.totalSize - config.stepSize;
			// store the total size
			config.totalSize += config.buttonSize;
		},
		left : function (config) {
			return function () {
				var current, next, limit, step;
				// get the current position of the scroller
				current = parseInt(config.list.style.marginLeft);
				// measure the length of the scroller
				thumbnails.measure(config);
				// determine the step size
				step = config.stepSize;
				// determine the limit
				limit = -config.scrollLimit;
				// calculate the new positions
				next = current - step;
				// if the new position if beyond the limit
				if (next < limit) {
					// disable the button
					config.leftButton.className = config.leftButton.className.replace(/enabled/, 'disabled');
					// use the limit instead
					next = limit;
				} else {
					// enable the button
					config.leftButton.className = config.leftButton.className.replace(/disabled/, 'enabled');
					config.rightButton.className = config.rightButton.className.replace(/disabled/, 'enabled');
				}
				// apply the new position
				useful.css.setRules(config.list, {'marginLeft' : next + 'px'});
				// cancel the actual click
				return false;
			}
		},
		right : function (config) {
			return function () {
				var current, next, step;
				// get the current position of the scroller
				current = parseInt(config.list.style.marginLeft);
				// measure the length of the scroller
				thumbnails.measure(config);
				// determine the step size
				step = config.stepSize;
				// calculate the new positions
				next = current + step;
				// if the new position if beyond the limit
				if (next > 0) {
					// disable the button
					config.rightButton.className = config.rightButton.className.replace(/enabled/, 'disabled');
					// use the limit instead
					next = 0;
				} else {
					// enable the button
					config.leftButton.className = config.leftButton.className.replace(/disabled/, 'enabled');
					config.rightButton.className = config.rightButton.className.replace(/disabled/, 'enabled');
				}
				// apply the new position
				useful.css.setRules(config.list, {'marginLeft' : next + 'px'});
				// cancel the actual click
				return false;
			}
		}
	};

	// public functions
	useful.models = useful.models || {};
	useful.models.clone = function (model) {
		var clonedModel, ClonedModel;
		// if the method exists
		if (typeof(Object.create) !== 'undefined') {
			clonedModel = Object.create(model);
		}
		// else use a fall back
		else {
			ClonedModel = function () {};
			ClonedModel.prototype = model;
			clonedModel = new ClonedModel();
		}
		// return the clone
		return clonedModel;
	};

	useful.css = useful.css || {};
	useful.css.select = function (input, parent) {
		var a, b, elements;
		// validate the input
		parent = parent || document;
		input = (typeof input === 'string') ? {'rule' : input, 'parent' : parent} : input;
		input.parent = input.parent || document;
		input.data = input.data || {};
		// use querySelectorAll to select elements, or defer to jQuery
		elements = (typeof(document.querySelectorAll) !== 'undefined') ?
			input.parent.querySelectorAll(input.rule) :
			(typeof(jQuery) !== 'undefined') ? jQuery(input.parent).find(input.rule).get() : [];
		// if there was a handler
		if (typeof(input.handler) !== 'undefined') {
			// for each element
			for (a = 0 , b = elements.length; a < b; a += 1) {
				// run the handler and pass a unique copy of the data (in case it's a model)
				input.handler(elements[a], useful.models.clone(input.data));
			}
		// else assume the function was called for a list of elements
		} else {
			// return the selected elements
			return elements;
		}
	};
	useful.css.compatibility = function () {
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
	useful.css.prefix = function (property) {
		// pick the prefix that goes with the browser
		return (navigator.userAgent.match(/webkit/gi)) ? 'webkit' + property.substr(0, 1).toUpperCase() + property.substr(1):
			(navigator.userAgent.match(/firefox/gi)) ? 'Moz' + property.substr(0, 1).toUpperCase() + property.substr(1):
			(navigator.userAgent.match(/microsoft/gi)) ? 'ms' + property.substr(0, 1).toUpperCase() + property.substr(1):
			(navigator.userAgent.match(/opera/gi)) ? 'O' + property.substr(0, 1).toUpperCase() + property.substr(1):
			property;
	};
	useful.css.setRules = function (element, rules, endEventHandler) {
		var rule, endEventName, endEventFunction;
		// validate the input
		rules.transitionProperty = rules.transitionProperty || 'all';
		rules.transitionDuration = rules.transitionDuration || '300ms';
		rules.transitionTimingFunction = rules.transitionTimingFunction || 'ease';
		endEventHandler = endEventHandler || function () {};
		endEventName = useful.css.compatibility();
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
					element.style[useful.css.compatibility(rule)] = rules[rule];
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
					element.style[useful.css.compatibility(rule)] = rules[rule];
					// implement the value
					element.style[rule] = rules[rule];
				}
			}
			// call the onComplete handler
			endEventHandler();
		}
	};

	useful.thumbnails = {};
	useful.thumbnails.start = thumbnails.start;

}(window.useful = window.useful || {}));

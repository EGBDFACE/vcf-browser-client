const d3Selection = require('d3-selection');
const d3Collection = require('d3-collection');
const d3Color = require('d3-color');
const d3Timer = require('d3-timer');
const PIXI = require('pixi.js');

var getSize = function (value, dim) {
	if (typeof value == 'string') {
		if (value.substring(value.length - 2) === 'px') return +value.substring(0, value.length - 2);
		else if (value.substring(value.length - 1) === '%') return 0.01 * value.substring(0, value.length - 1) * (dim || 1);
		else if (value.substring(value.length - 2) === 'em') return value.substring(0, value.length - 2) * (dim || 1);
	} else if (typeof value == 'number') return value
	else return 0;
};

var sizeTags = {};

function nodeDim(node) {
	var tag = sizeTags[node.tagName];
	return tag ? tag(node) : {
		x: 0,
		y: 0,
		width: node.context.canvas.width,
		height: node.context.canvas.height
	};
}

var gradients = {
	linearGradient: function linearGradient(node, gradNode, opacity) {
		var ctx = gradNode.context,
			dim = nodeDim(node),
			x1 = getSize(gradNode.attrs.get('x1') || '0%', dim.width),
			x2 = getSize(gradNode.attrs.get('x2') || '100%', dim.width),
			y1 = getSize(gradNode.attrs.get('y1') || '0%', dim.height),
			y2 = getSize(gradNode.attrs.get('y2') || '0%', dim.height),
			col;

		var gradient = ctx.createLinearGradient(x1, y1, x2, y2);
		gradNode.each(function (child) {
			col = d3Color.color(child.attrs.get('stop-color'));
			if (opacity || opacity === 0) col.opacity = opacity;
			gradient.addColorStop(getSize(child.attrs.get('offset')), '' + col);
		});
		return gradient;
	},
	radialGradient: function radialGradient(node, gradNode, opacity) {
		var ctx = gradNode.context,
			dim = nodeDim(node),
			cx = getSize(gradNode.attrs.get('cx') || '50%', dim.width),
			cy = getSize(gradNode.attrs.get('cy') || '50%', dim.height),
			fx = getSize(gradNode.attrs.get('fx') || cx, dim.width),
			fy = getSize(gradNode.attrs.get('fy') || cy, dim.height),
			r = getSize(gradNode.attrs.get('r') || '50%', Math.max(dim.height, dim.width)),
			col;

		var gradient = ctx.createRadialGradient(dim.x + fx, dim.y + fy, 0, dim.x + cx, dim.y + cy, r);
		gradNode.each(function (child) {
			col = d3Color.color(child.attrs.get('stop-color'));
			if (opacity || opacity === 0) col.opacity = opacity;
			gradient.addColorStop(getSize(child.attrs.get('offset')), '' + col);
		});
		return gradient;
	}
};

function getColor(node, value, opacity) {
	if (value && value !== 'none') {
		if (typeof value === 'string' && value.substring(0, 4) === 'url(') {
			var selector = value.substring(4, value.length - 1),
				gradNode = selectCanvas(node.rootNode).select(selector).node();
			return gradNode ? gradient(node, gradNode, opacity) : null;
		}
		if (opacity || opacity === 0) {
			var col = d3Color.color(value);
			if (col) {
				col.opacity = opacity;
				return '' + col;
			}
		} else return value;
	}
}

function color2hex(color) {
	return rgb2hex(d3Color.color(color).rgb().toString());

	function rgb2hex(rgb) {
		var a = rgb.split("(")[1].split(")")[0];
		a = a.split(',');
		var b = a.map(function (x) {
			x = parseInt(x).toString(16);
			return (x.length == 1) ? "0" + x : x;
		});
		return '0x' + b.join('');
	}
}

function StyleNode(node) {
	this.node = node;
}

StyleNode.prototype = {
	getPropertyValue: function getPropertyValue(name) {
		var value = this.node.getValue(name);
		if (value === undefined) value = window.getComputedStyle(this.node.context.canvas).getPropertyValue(name);
		return value;
	}
};

function gradient(node, gradNode, opacity) {
	var g = gradients[gradNode.tagName];
	if (g) return g(node, gradNode, opacity);
}

var _setAttribute = function (node, attr, value) {
	var current = node.attrs.get(attr);
	if (current === value) return false;
	node.attrs.set(attr, value);
	return true;
};

function deque() {
	return new Deque();
}

function Deque() {
	this._head = null;
	this._tail = null;
	this._length = 0;

	Object.defineProperty(this, 'length', {
		get: function get() {
			return this._length;
		}
	});
}

Deque.prototype = deque.prototype = {
	prepend: function prepend(child, refChild) {
		if (!this._length) {
			child._prev = null;
			child._next = null;
		} else if (refChild) {
			child._prev = refChild._prev;
			child._next = refChild;

			if (refChild._prev) refChild._prev._next = child;

			refChild._prev = child;
		} else {
			child._prev = this._tail;
			child._next = null;
			this._tail._next = child;
		}
		if (!child._prev) this._head = child;
		if (!child._next) this._tail = child;
		this._length++;
	},
	remove: function remove(child) {
		if (child._prev) child._prev._next = child._next;

		if (child._next) child._next._prev = child._prev;

		if (this._head === child) this._head = child._next;

		if (this._tail === child) this._tail = child._prev;

		delete child._prev;
		delete child._next;

		this._length--;
	},
	list: function list() {
		var child = this._head,
			list = [];
		while (child) {
			list.push(child);
			child = child._next;
		}
		return list;
	},
	each: function each(f) {
		var child = this._head;
		while (child) {
			f(child);
			child = child._next;
		}
	}
};

var transform = function (node) {
	var container = new PIXI.Container();
	if (!node.attrs) {
		node.ownContainer = container;
		node.glElem = container;
		node.rootNode.activeContainer.addChild(container);
		return;
	}
	var x = +(node.attrs.get('x') || 0),
		y = +(node.attrs.get('y') || 0),
		trans = node.attrs.get('transform'),
		ctx = node.context,
		rotation = 0,
		transX = 0,
		transY = 0,
		scaleX = 1,
		scaleY = 1,
		sx,
		sy,
		transResult;

	transResult = getTrans(x, y, sx, sy, rotation, trans);
	x = transResult.x;
	y = transResult.y;
	sx = transResult.sx;
	sy = transResult.sy;
	rotation = transResult.rotation;
	// if (x || y) ctx.translate(node.factor * x, node.factor * y);
	if (x || y) transX = x, transY = y;
	if (sx || sy) {
		scaleX = sx, scaleY = sy;
	}
	// if (rotation) {
	//     container.pivot.set(-transX, -transY);
	//     container.rotation = rotation;
	// } else {
	container.setTransform(transX || 0, transY || 0, scaleX || 1, scaleY || 1, rotation || 0);
	// }
	node.ownContainer = container;
	node.glElem = container;
	node.rootNode.activeContainer.addChild(container);
	return container;
};

var tagDraws = d3Collection.map();

function getTrans(x, y, sx, sy, rotation, trans) {
	if (typeof trans === 'string') {
		var index1 = trans.indexOf('translate('),
			index2,
			s,
			bits;
		if (index1 > -1) {
			s = trans.substring(index1 + 10);
			index2 = s.indexOf(')');
			bits = s.substring(0, index2).split(',');
			x += +bits[0];
			if (bits.length === 2) y += +bits[1];
		}

		index1 = trans.indexOf('rotate(');
		if (index1 > -1) {
			s = trans.substring(index1 + 7);
			var angle = +s.substring(0, s.indexOf(')'));
			if (angle === angle) rotation = angle * Math.PI / 180;
		}

		index1 = trans.indexOf('scale(');
		if (index1 > -1) {
			s = trans.substring(index1 + 6);
			index2 = s.indexOf(')');
			bits = s.substring(0, index2).split(',');
			sx = +bits[0];
			sy = sx;
			if (bits.length === 2) sy = +bits[1];
		}
	} else if (trans) {
		x += trans.x;
		y += trans.y;
		sx = trans.k;
		sy = trans.k;
	}
	// // if (sx) {
	// sy = sy || sx;
	// // }
	return {
		x: x,
		y: y,
		sx: sx,
		sy: sy,
		rotation: rotation
	}
}

// control redraw
// whenever append or remove node and set or remove attrs, redraw starts
function touch(node, v) {
	var root = node.rootNode;
	if (!root._touches) root._touches = 0;
	root._touches += v;
	if (!root._touches || root._scheduled) return;
	root._scheduled = d3Timer.timeout(redraw(root));
	// root._scheduled = redraw(root)();
}

function draw(node, point) {
	var children = node.countNodes,
		drawer = tagDraws.get(node.tagName),
		factor = node.factor,
		container = node.getContainer(),
		attrs = node.attrs;
	node.rootNode.activeContainer = container;
	if (node.tagName === 'clipPath') {
		collectClipPath(node);
	}
	if (node.tagName === 'rect' && node.parentNode.tagName === 'clipPath') return;
	if (node.tagName === 'g') {
		// here g use transform usually
		transform(node);
		// set clip path for container
		var clipPath = attrs && attrs['$clip-path'];
		if (clipPath) {
			node.ownContainer.mask = node.rootNode.clipPath[clipPath.slice(clipPath.indexOf('#') + 1, -1)];
			node.ownContainer.addChild(node.ownContainer.mask);
		}
	}
	if (drawer === false) return;
	else if (node.tagName !== 'g' && node.tagName !== 'canvas' && attrs) {
		var ctx = node.context,
			stroke,
			fill,
			width,
			trans = node.attrs.get('transform'),
			content,
			transResult,
			clipPath = attrs['$clip-path'];

		var graphic = new PIXI.Graphics();
		if (trans) {
			transResult = getTrans(0, 0, 1, 1, 0, trans);
			graphic.setTransform(transResult.x || 0, transResult.y || 0, transResult.sx || 1, transResult.sy || 1, transResult.rotation || 0);
		}
		content = graphic;
		if (!isUndefined(attrs['$opacity'])) graphic.alpha = isNaN(+attrs['$opacity']) ? 1 : +attrs['$opacity'];
		// if (attrs['$stroke-linecap']) ctx.lineCap = attrs['$stroke-linecap'];
		// if (attrs['$stroke-linejoin']) ctx.lineJoin = attrs['$stroke-linejoin'];
		//
		// clipPath
		if (clipPath) {
			graphic.mask = node.rootNode.clipPath[clipPath.slice(clipPath.indexOf('#') + 1, -1)];
			container.addChild(graphic.mask);
		}
		// Stroke
		stroke = {
			color: +color2hex((node.getValue('stroke') === 'none' ? undefined : node.getValue('stroke')) || '#000'),
			alpha: node.getValue('stroke-opacity')
		};
		// if (stroke) graphic.lineColor = stroke;
		if (attrs['$stroke-width'] !== undefined) {
			width = getSize(node.attrs['$stroke-width']);
			graphic.lineWidth = +width;
		} else {
			graphic.lineWidth = undefined;
		}
		// stroke = width === 0 ? false : stroke;
		//
		// Fill
		var fillValue = node.getValue('fill');
		var fillOpacityValue = node.getValue('fill-opacity');
		fill = {
			color: fillValue === 'none' ? undefined : fillValue === undefined ? undefined : +color2hex(fillValue),
			alpha: isUndefined(fillOpacityValue) ? 1 : +fillOpacityValue
		};
		// if (fill) ctx.fillStyle = fill;
		// fill === 'none' || !fill ? false : fill;
		//
		if (drawer) {
			content = drawer(node, graphic, stroke, fill, point);
			if (node.tagName !== 'text') content = graphic;
		}
		node.glElem = content;
		// if (drawer) drawer(node, graphic, stroke, fill, point);
		container.addChild(content);
		// if (children) node.each(function (child) {
		// return draw(child, point);
		// });

		// deal with clip-path
		// if (attrs['$clip-path']) {
		//     clipPath(node, ctx);
		// }

		// restore
		// ctx.restore();
	}
	// add listeners
	if (node.listeners.length) {
		node.glElem.interactive = true;
		node.listeners.forEach(function (listener, i) {
			node.glElem.on(listener.type, listener.listener.bind(node))
		})
	}
	if (children) {
		node.each(function (child) {
			return draw(child, point);
		});
	}
}

// clipPath
function collectClipPath(node) {
	var id = node.id;
	var attrs = node.attrs;
	var graphic = new PIXI.Graphics();
	graphic.beginFill(node.rootNode.renderer.backgroundColor);
	if (node.countNodes) {
		node.each(function (child) {
			attrs = child.attrs;
			if (child.tagName === 'rect') {
				graphic.drawRect(attrs['$x'] || 0, attrs['$y'] || 0, attrs['$width'], attrs['$height']);
			} else if (child.tagName === 'circle') {
				graphic.drawCircle(attrs['$cx'] || 0, attrs['$cy'] || 0, attrs['$r']);
			}
		})
	}
	graphic.endFill();
	node.rootNode.clipPath[id] = graphic;
}
// deal with clip-path
// function clipPath(node, ctx) {
//     var rootNode = node.rootNode;
//     var attrs = node.attrs;
//     ctx.save();
//     var trans = ctx.getTransform();
//     ctx.setTransform(1, 0, 0, 1, 0, 0);
//     ctx.scale(ctx._factor, ctx._factor);
//     var left = rootNode.clientLeft;
//     var top = rootNode.clientTop;
//     var width = rootNode.clientWidth;
//     var height = rootNode.clientHeight;
//     var topOffset = attrs['$y'] || 0 + trans[4];
//     var leftOffset = attrs['$x'] || 0 + trans[5];
//     var rightOffset = width - leftOffset - attrs['$width'];
//     var bottomOffset = height - topOffset - attrs['$height'];
//     ctx.clearRect(left, top, width, topOffset);
//     ctx.clearRect(width - rightOffset, top, rightOffset, height);
//     ctx.clearRect(left, top, leftOffset, height);
//     ctx.clearRect(left, height - bottomOffset, width, bottomOffset);
//     ctx.restore();
// }

function redraw(node, point) {

	return function () {
		var renderer = node.renderer;
		node._touches = 0;
		// here we should reset all CanvasElement's ownContainer to null
		resetOwnContainer(node);
		node.stage.removeChildren();
		node.ownContainer = node.stage;
		if (point) point.nodes = [];
		draw(node, point);
		node._scheduled = false;
		touch(node, 0);
		// render here
		renderer.clear();
		renderer.render(node.stage);
		return point ? point.nodes : null;
	};
}

function resetOwnContainer(node) {
	if (node.countNodes) {
		node.each(function (n) {
			resetOwnContainer(n);
		})
	}
	node.ownContainer = null;
}

function NodeIterator(node) {
	this.node = node;
	this.context = node.context;
	this.current = node;
}

NodeIterator.prototype = {
	next: function next() {
		var current = this.current;
		if (!current) return null;
		if (current.firstChild) current = current.firstChild;
		else {
			while (current) {
				if (current.nextSibling) {
					current = current.nextSibling;
					break;
				}
				current = current.parentNode;
				if (current === this.node) current = null;
			}
		}
		this.current = current;
		return current;
	}
};

var mouseEvents = {
	mouseenter: 'mousemove',
	mouseleave: 'mousemove'
};

function canvasListener(event) {
	var context = this.getContext('webgl'),
		root = context._rootElement;
	// set refresh to true
	root.refresh = true;
	if (!root) return;
	trigger(root, event);
}

function canvasNodeListener(event) {
	var context = this.getContext('webgl'),
		root = context._rootElement;
	if (!root) return;

	event.canvasPoint = {
		x: root.factor * event.offsetX,
		y: root.factor * event.offsetY
	};

	var nodes = redraw(root, event.canvasPoint)(),
		handler = event.type === 'mousemove' ? mousemoveEvent : defaultEvent;

	handler(context, nodes, event);
}

function defaultEvent(context, nodes, event) {
	for (var i = nodes.length - 1; i >= 0; --i) {
		if (trigger(nodes[i], event)) break;
	}
}

function mousemoveEvent(context, nodes, event) {
	var actives = context._activeNodes,
		newActives = [],
		active = nodes.length ? nodes[nodes.length - 1] : null,
		node,
		i;

	// Handle actives
	if (actives) {
		for (i = 0; i < actives.length; ++i) {
			node = actives[i];
			if (active && node !== active && node.parentNode === active.parentNode) trigger(node, event, 'mouseleave');
			else if (nodes.indexOf(node) > -1) {
				newActives.push(node);
				trigger(node, event, 'mousemove');
			} else trigger(node, event, 'mouseleave');
		}
	}

	context._activeNodes = actives = newActives;

	if (actives.indexOf(active) === -1) {
		actives.push(active);
		trigger(active, event, 'mouseenter');
	}
}

function trigger(node, event, type) {
	var listeners = node.events[type || event.type];
	if (listeners) {
		for (var j = 0; j < listeners.length; ++j) {
			listeners[j].call(node, event);
		}
		return node;
	}
}

var namespace = 'canvas';

/**
 * A proxy for a data entry on canvas
 *
 * It partially implements the Node Api (please pull request!)
 * https://developer.mozilla.org/en-US/docs/Web/API/Node
 *
 * It allows the use the d3-select and d3-transition libraries
 * on canvas joins
 */
function CanvasElement(tagName, context) {
	var _deque,
		events = {},
		renderer = {},
		stage = {},
		glElem = null,
		listeners = [],
		activeContainer = null,
		ownContainer = null,
		refresh = false,
		options = {},
		// collect clippath in the rootNode
		clipPath = {},
		text = '';

	Object.defineProperties(this, {
		context: {
			get: function get() {
				return context;
			}
		},
		renderer: {
			get: function get() {
				return renderer;
			},
			set: function set(value) {
				renderer = value;
			}
		},
		stage: {
			get: function get() {
				return stage;
			},
			set: function set(value) {
				stage = value;
			}
		},
		glElem: {
			get: function get() {
				return glElem;
			},
			set: function set(value) {
				glElem = value;
			}
		},
		listeners: {
			get: function get() {
				return listeners;
			},
			set: function set(value) {
				listeners = value;
			}
		},
		refresh: {
			get: function get() {
				return refresh;
			},
			set: function set(value) {
				refresh = value;
			}
		},
		activeContainer: {
			get: function get() {
				return activeContainer;
			},
			set: function set(value) {
				activeContainer = value;
			}
		},
		ownContainer: {
			get: function get() {
				return ownContainer;
			},
			set: function set(value) {
				ownContainer = value;
			}
		},
		clipPath: {
			get: function get() {
				return clipPath;
			},
			set: function set(value) {
				clipPath = value;
			}
		},
		deque: {
			get: function get() {
				if (!_deque) _deque = deque();
				return _deque;
			}
		},
		events: {
			get: function get() {
				return events;
			}
		},
		tagName: {
			get: function get() {
				return tagName;
			}
		},
		childNodes: {
			get: function get() {
				return _deque ? _deque.list() : [];
			}
		},
		firstChild: {
			get: function get() {
				return _deque ? _deque._head : null;
			}
		},
		lastChild: {
			get: function get() {
				return _deque ? _deque._tail : null;
			}
		},
		parentNode: {
			get: function get() {
				return this._parent;
			}
		},
		previousSibling: {
			get: function get() {
				return this._prev;
			}
		},
		nextSibling: {
			get: function get() {
				return this._next;
			}
		},
		namespaceURI: {
			get: function get() {
				return namespace;
			}
		},
		textContent: {
			get: function get() {
				return text;
			},
			set: function set(value) {
				text = '' + value;
				touch(this, 1);
			}
		},
		clientLeft: {
			get: function get() {
				return context.canvas.clientLeft;
			}
		},
		clientTop: {
			get: function get() {
				return context.canvas.clientTop;
			}
		},
		clientWidth: {
			get: function get() {
				return context.canvas.clientWidth;
			}
		},
		clientHeight: {
			get: function get() {
				return context.canvas.clientHeight;
			}
		},
		rootNode: {
			get: function get() {
				return this.context._rootElement;
			}
		},
		//
		// Canvas Element properties
		countNodes: {
			get: function get() {
				return _deque ? _deque._length : 0;
			}
		},
		factor: {
			get: function get() {
				return this.context._factor;
			}
		}
	});
}

CanvasElement.prototype = {
	querySelectorAll: function querySelectorAll(selector) {
		return this.countNodes ? select$1(selector, this, []) : [];
	},
	querySelector: function querySelector(selector) {
		if (this.countNodes) return select$1(selector, this);
	},
	createElementNS: function createElementNS(namespaceURI, qualifiedName) {
		return new CanvasElement(qualifiedName, this.context);
	},
	hasChildNodes: function hasChildNodes() {
		return this.countNodes > 0;
	},
	contains: function contains(child) {
		while (child) {
			if (child._parent == this) return true;
			child = child._parent;
		}
		return false;
	},
	appendChild: function appendChild(child) {
		return this.insertBefore(child);
	},
	insertBefore: function insertBefore(child, refChild) {
		if (child === this) throw Error('inserting self into children');
		if (!(child instanceof CanvasElement)) throw Error('Cannot insert a non canvas element into a canvas element');
		if (child._parent) child._parent.removeChild(child);
		this.deque.prepend(child, refChild);
		child._parent = this;
		touch(this, 1);
		return child;
	},
	removeChild: function removeChild(child) {
		if (child._parent === this) {
			delete child._parent;
			this.deque.remove(child);
			touch(this, 1);
			return child;
		}
	},
	setAttribute: function setAttribute(attr, value) {
		if (attr === 'class') {
			this.class = value;
		} else if (attr === 'id') {
			this.id = value;
		} else {
			if (!this.attrs) this.attrs = d3Collection.map();
			if (_setAttribute(this, attr, value)) touch(this, 1);
		}
	},
	removeAttribute: function removeAttribute(attr) {
		if (this.attrs) {
			this.attrs.remove(attr);
			touch(this, 1);
		}
	},
	getAttribute: function getAttribute(attr) {
		var value = this.attrs ? this.attrs.get(attr) : undefined;
		if (value === undefined && !this._parent) value = this.context.canvas[attr];
		return value;
	},
	addEventListener: function addEventListener(type, listener) {
		var canvas = this.context.canvas;
		if (this.rootNode === this) {
			arguments[1] = canvasListener;
			canvas.addEventListener.apply(canvas, arguments);
		} else {
			// arguments[0] = mouseEvents[type] || type;
			// arguments[1] = canvasNodeListener;
			// canvas.addEventListener.apply(canvas, arguments);
			this.listeners.push({
				type: type,
				listener: listener
			})
		}
		var listeners = this.events[type];
		if (!listeners) this.events[type] = listeners = [];
		if (listeners.indexOf(listener) === -1) listeners.push(listener);
	},
	removeEventListener: function removeEventListener(type, listener) {
		var listeners = this.events[type];
		if (listeners) {
			var i = listeners.indexOf(listener);
			if (i > -1) listeners.splice(i, 1);
		}
	},
	getBoundingClientRect: function getBoundingClientRect() {
		return this.context.canvas.getBoundingClientRect();
	},


	// Canvas methods
	each: function each(f) {
		if (this.countNodes) this.deque.each(f);
	},
	getValue: function getValue(attr) {
		var value = this.getAttribute(attr);
		if (value === undefined && this._parent) return this._parent.getValue(attr);
		return value;
	},
	getContainer: function getContainer() {
		var container = this.ownContainer;
		if (container === null && this._parent) return this._parent.getContainer();
		return container;
	},


	// Additional attribute functions
	removeProperty: function removeProperty(name) {
		this.removeAttribute(name);
	},
	setProperty: function setProperty(name, value) {
		this.setAttribute(name, value);
	},
	getProperty: function getProperty(name) {
		return this.getAttribute(name);
	},
	getPropertyValue: function getPropertyValue(name) {
		return this.getAttribute(name);
	},


	// Proxies to this object
	getComputedStyle: function getComputedStyle(node) {
		return new StyleNode(node);
	},


	get ownerDocument() {
		return this;
	},

	get style() {
		return this;
	},

	get defaultView() {
		return this;
	},

	get document() {
		return this.rootNode;
	}
};

function select$1(selector, node, selections) {

	var selectors = selector.split(' '),
		iterator = new NodeIterator(node),
		child = iterator.next(),
		classes,
		bits,
		tag,
		id,
		sel;

	for (var s = 0; s < selectors.length; ++s) {
		selector = selectors[s];
		if (selector === '*') {
			selector = {};
		} else {
			if (selector.indexOf('#') > -1) {
				bits = selector.split('#');
				tag = bits[0];
				id = bits[1];
			} else if (selector.indexOf('.') > -1) {
				bits = selector.split('.');
				tag = bits[0];
				classes = bits.splice(1).join(' ');
			} else tag = selector;
			selector = {
				tag: tag,
				id: id,
				classes: classes
			};
		}
		selectors[s] = selector;
	}

	while (child) {
		for (var _s = 0; _s < selectors.length; ++_s) {
			sel = selectors[_s];

			if (!sel.tag || child.tagName === sel.tag) {
				if (sel.id && child.id !== sel.id) {
					// nothing to do
				} else if (sel.classes && !child.class) {
					//  && (child.class && child.class.trim().split(' ').indexOf(sel.classes) === -1)
				} else if (sel.classes && child.class && child.class.trim().split(' ').indexOf(sel.classes) === -1) {

				} else if (selections) {
					selections.push(child);
					break;
				} else return child;
			}
		}
		child = iterator.next();
	}

	return selections;
}

var resolution = function (factor) {
	return factor || window.devicePixelRatio || 1;
};

var path = function (attr, factor) {

	var factor2 = factor * factor,
		orginSize = attr.size();

	function path() {
		return canvasPath(attr, arguments);
	}

	attr.size(size2);

	path.size = function (_) {
		if (arguments.length === 0) return size2;
		orginSize = _;
		return path;
	};

	return path;

	function size2(d) {
		return factor2 * orginSize(d);
	}
};

function canvasPath(attr, parameters) {

	return function () {
		attr.apply(this, parameters);
	};
}

var originalAttr = d3Selection.selection.prototype.attr;
var defaultFactor;

d3Selection.selection.prototype.attr = selectionAttr;
d3Selection.selection.prototype.toCanvas = toCanvas;
d3Selection.selection.prototype.canvasResolution = canvasResolution;

function selectCanvas(context, factor) {
	var s = d3Selection.selection();
	if (!context) return s;

	if (isCanvas(context) && arguments.length === 1) return s.select(function () {
		return context;
	});

	if (typeof context === 'string') {
		context = d3Selection.select(context).node();
		if (!context) return s;
	}
	if (context.getContext) context = (PIXI.utils.isWebGLSupported()) ? context.getContext('webgl') : context.getContext('2d');

	if (!context._rootElement) {
		if (!factor) factor = defaultFactor || resolution();
		context._factor = factor;
		context._rootElement = new CanvasElement('canvas', context);
	}
	return s.select(function () {
		return context._rootElement;
	});
}

function selectionAttr(name, value) {
	if (arguments.length > 1) {
		var node = this._parents[0] || this.node(),
			attr;
		// if (isCanvas(node) && typeof value.context === 'function') {
		//     attr = value.pathObject;
		//     if (!attr) {
		//         value.context(node.context);
		//         attr = path(value, node.factor);
		//         value.pathObject = attr;
		//     }
		//     arguments[1] = attr;
		// }
	}
	return originalAttr.apply(this, arguments);
}

function isCanvas(node) {
	return node instanceof CanvasElement;
}

function toCanvas(renderer) {
	var s = this,
		node = s.node();

	if (node.tagName === 'CANVAS' && !isCanvas(node)) {
		s = selectCanvas(node);
		node = s.node();
	}

	if (isCanvas(node)) {
		// var ctx = node.context,
		//     factor = node.factor,
		//     width = ctx.canvas.width,
		//     height = ctx.canvas.height;
		// record ctx
		// getTransform(ctx);
		// ctx.beginPath();
		// ctx.closePath();
		// ctx.setTransform(1, 0, 0, 1, 0, 0);
		// ctx.clearRect(0, 0, width, height);
		// init renderer
		// node.renderer = PIXI.autoDetectRenderer({
		//     width: width,
		//     height: height,
		//     resolution: factor,
		//     view: ctx.canvas,
		//     backgroundColor: 0xffffff,
		//     antialias: true
		// });
		// node.renderer.view.style.width = width + 'px';
		// node.renderer.view.style.height = height + 'px';
		node.renderer = renderer;
		node.stage = new PIXI.Container();
		node.ownContainer = node.stage;
		node.activeContainer = node.stage;
		canvasResolution(renderer.resolution);
		// if (factor > 1) {
		//     ctx.canvas.style.width = width + 'px';
		//     ctx.canvas.style.height = height + 'px';
		//     ctx.canvas.width = width * factor;
		//     ctx.canvas.height = height * factor;
		//     ctx.scale(factor, factor);
		// }
	}
	return s;
}

function canvasResolution(value) {
	if (arguments.length === 1) {
		defaultFactor = value;
		return this;
	}
	return this.factor;
}

var version = "1.0.0";

var circle = function (node, graphic, stroke, fill, point) {
	var attrs = node.attrs,
		ctx = node.context,
		f = node.factor;
	graphic.lineStyle(isUndefined(graphic.lineWidth) ? 1 : graphic.lineWidth, stroke.color || 0, stroke.alpha || 1);
	graphic.beginFill(fill.color || 0, fill.alpha || 1);
	// ctx.arc(f * attrs.get('cx', 0), f * attrs.get('cy', 0), f * attrs.get('r', 0), 0, 2 * Math.PI);
	// ctx.arc(attrs.get('cx', 0), attrs.get('cy', 0), attrs.get('r', 0), 0, 2 * Math.PI);
	graphic.drawCircle(attrs.get('cx', 0), attrs.get('cy', 0), attrs.get('r', 0));
	graphic.endFill();
	// if (stroke) ctx.stroke();
	// if (fill) ctx.fill();
	if (point && graphic.containsPoint(point.x, point.y)) point.nodes.push(node);
};

sizeTags.circle = function (node) {
	var r = (node.attrs.get('r') || 0);
	return {
		x: (node.attrs.get('cx') || 0) - r,
		y: (node.attrs.get('cy') || 0) - r,
		width: 2 * r,
		height: 2 * r
	};
};

var line = function (node, graphic, stroke, fill, point) {
	var attrs = node.attrs,
		ctx = node.context;
	graphic.lineStyle(isUndefined(graphic.lineWidth) ? 1 : graphic.lineWidth, stroke.color || 0, stroke.alpha || 1);
	graphic.moveTo(attrs.get('x1') || 0, attrs.get('y1') || 0);
	graphic.lineTo(attrs.get('x2') || 0, attrs.get('y2') || 0);
	// if (stroke) ctx.stroke();
	if (point && graphic.isPointInPath(point.x, point.y)) point.nodes.push(node);
};

var re = /[-+]?(?:\d+\.?\d*|\.?\d+)(?:[eE][-+]?\d+)?/g;

var path$1 = function (node, graphic, stroke, fill, point) {
	var path, arcFlag = 0;
	graphic.lineStyle(isUndefined(graphic.lineWidth) ? 1 : graphic.lineWidth, stroke.color || 0, isUndefined(stroke.alpha) ? 1 : +stroke.alpha);
	// ctx = node.context;
	if (!isUndefined(fill.color)) {
		graphic.beginFill(fill.color, fill.alpha);
	}
	var pathType = node.attrs.get('pathType');
	if (pathType) {
		const type = node.attrs.get('pathType');
		const pathData = node.attrs.get('pathData');
		const cx = pathData.cx || 0;
		const cy = pathData.cy || 0;
		if (type === 'arc') {
			if (pathData.innerRadius && pathData.outerRadius) {
				// if (pathData.innerRadius !== pathData.outerRadius) {
				graphic.moveTo(pathData.outerRadius * Math.sin(pathData.start) + cx, -pathData.outerRadius * Math.cos(pathData.start) + cy);
				graphic.arc(cx, cy, pathData.outerRadius, pathData.start - Math.PI / 2, pathData.end - Math.PI / 2);
				graphic.lineTo(pathData.innerRadius * Math.sin(pathData.end) + cx, -pathData.innerRadius * Math.cos(pathData.end) + cy);
				graphic.arc(cx, cy, pathData.innerRadius, pathData.end - Math.PI / 2, pathData.start - Math.PI / 2, true);
				graphic.lineTo(pathData.outerRadius * Math.sin(pathData.start) + cx, -pathData.outerRadius * Math.cos(pathData.start) + cy);
				// } 
				// else {
				//     graphic.moveTo(pathData.outerRadius * Math.sin(pathData.start), -pathData.outerRadius * Math.cos(pathData.start));
				//     graphic.arc(0, 0, pathData.outerRadius, pathData.start - Math.PI / 2, pathData.end - Math.PI / 2);
				// }
			}
		} else if (type === 'circle') {
			graphic.drawCircle(pathData.cx, pathData.cy, pathData.radius);
		} else if (type === 'ribbon') {
			path = node.attrs.get('d');
		}
	} else {
		path = node.attrs.get('d');
	}
	if (path) {
		var pathArr = parsePath(path);
		var position = {
			x: 0,
			y: 0
		};
		for (var i = 0; i < pathArr.length; i++) {
			var index = pathArr[i].search(/[MHVLAQ]/);
			if (index !== -1) {
				var sign = pathArr[i].substring(0, index + 1);
				var data = pathArr[i].substring(index + 1).trim();
				if (sign === 'M') {
					position.x = +data.split(/[ ,]/)[0];
					position.y = +data.split(/[ ,]/)[1];
					graphic.moveTo(position.x, position.y);
				} else if (sign === 'V') {
					position.y = +data;
					graphic.lineTo(position.x, position.y);
				} else if (sign === 'H') {
					position.x = +data;
					graphic.lineTo(position.x, position.y);
				} else if (sign === 'L') {
					position.x = +data.split(/[ ,]/)[0];
					position.y = +data.split(/[ ,]/)[1];
					graphic.lineTo(position.x, position.y);
				} else if (sign === 'A') {
					// when the sign is A, we try to get path from pathData in the node attrs
					if (pathType) {
						const arcPath = node.attrs.get('pathData');
						if (pathType === 'ribbon') {
							graphic.arc(arcPath[arcFlag].cx, arcPath[arcFlag].cy, arcPath[arcFlag].radius, arcPath[arcFlag].startAngle, arcPath[arcFlag].endAngle);
							arcFlag++;
						}
					}
					// here just consider rx = ry
					// let x1 = position.x;
					// let y1 = position.y;
					// const pathRecord = data.split(/[ ,]/);
					// const r = +pathRecord[0];
					// let largeArc = +pathRecord[3] === 1 ? true : false;
					// const anticlockwise = +pathRecord[4] === 0 ? true : false;
					// let x2 = +pathRecord[5];
					// let y2 = +pathRecord[6];
					// // swap x1, y1 with x2, y2
					// let tmp;
					// if (x1 > x2) {
					//     tmp = x1;
					//     x1 = x2;
					//     x2 = tmp;
					//     tmp = y1;
					//     y1 = y2;
					//     y2 = tmp;
					//     anticlockwise != anticlockwise;
					// }
					// const theta1 = Math.acos(Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2)) / 2 / r);
					// const l = r * Math.sin(theta1);
					// const theta2 = Math.atan((y2 - y1) / (x2 - x1));
					// const theta3 = Math.PI / 2 + theta2;
					// const circleCenter1 = {
					//     x: l * Math.cos(theta3) + (x1 + x2) / 2,
					//     y: l * Math.sin(theta3) + (y1 + y2) / 2
					// };
					// const circleCenter2 = {
					//     x: -l * Math.cos(theta3) + (x1 + x2) / 2,
					//     y: -l * Math.sin(theta3) + (y1 + y2) / 2
					// };
					// let center;
					// if ((anticlockwise && !largeArc) || (!anticlockwise && largeArc)) {
					//     center = circleCenter1;
					// } else {
					//     center = circleCenter2;
					// }
					// let startAngle = Math.asin((y1 - center.y) / r);
					// let endAngle = Math.asin((y2 - center.y) / r);
					// if (x1 < center.x) {
					//     if (y1 > center.y) {
					//         startAngle = Math.PI - startAngle;
					//     } else {
					//         startAngle = -Math.PI - startAngle;
					//     }
					// }
					// if (x2 < center.x) {
					//     if (y2 > center.y) {
					//         endAngle = Math.PI - endAngle;
					//     } else {
					//         endAngle = -Math.PI - endAngle;
					//     }
					// }
					// graphic.arc(center.x, center.y, r, startAngle, endAngle, anticlockwise);

				} else if (sign === 'Q') {
					const pathRecord = data.split(/[ ,]/);
					graphic.quadraticCurveTo(+pathRecord[0], +pathRecord[1], +pathRecord[2], +pathRecord[3]);
				}
			}
		}
		if (!isUndefined(fill.color)) {
			graphic.endFill();
		}
		// graphic.endFill();
		// if (typeof path === 'function') {
		//     ctx.beginPath();
		//     path(node);
		//     if (stroke) ctx.stroke();
		//     if (fill) ctx.fill();
		//     if (point && ctx.isPointInPath(point.x, point.y)) point.nodes.push(node);
		// } else if (window.Path2D) {
		//     var Path2D = window.Path2D,
		//         // p = new Path2D(multiply(path, node.factor));
		//         p = new Path2D(path);
		//     if (stroke) ctx.stroke(p);
		//     if (fill) ctx.fill(p);
		//     if (point && ctx.isPointInPath(p, point.x, point.y)) point.nodes.push(node);
		// }
	}
	if (point && graphic.containsPoint(point.x, point.y)) point.nodes.push(node);
};

// parse path
function parsePath(path) {
	// temporarily support MVHLAQ
	return path.match(/[MVHLAQ]([ \d,\.e-])+/g);
}

function multiply(path, factor) {
	if (factor === 1) return path;
	var pm,
		index = 0,
		result = '';
	path = path + '';
	while (pm = re.exec(path)) {
		result += path.substring(index, pm.index) + factor * pm[0];
		index = pm.index + pm[0].length;
	}
	return result + path.substring(index);
}

var rect = function (node, graphic, stroke, fill, point) {
	var attrs = node.attrs,
		ctx = node.context,
		x = attrs.get('x') || 0,
		y = attrs.get('y') || 0,
		height = attrs.get('height') || 0,
		width = attrs.get('width') || 0;
	// if (width && height && height !== width) ctx.scale(1.0, height / width);
	graphic.lineStyle(isUndefined(graphic.lineWidth) ? 1 : graphic.lineWidth, stroke.color || 0, stroke.alpha || 1);
	fill.color && graphic.beginFill(fill.color, fill.alpha || 1);
	graphic.drawRect(x, y, width, height);
	fill.color && graphic.endFill();
	if (point && graphic.containsPoint(point.x, point.y)) point.nodes.push(node);
};

sizeTags.rect = function (node) {
	var w = (node.attrs.get('width') || 0);
	return {
		x: 0,
		y: 0,
		height: w,
		width: w
	};
};

function isUndefined(v) {
	return typeof v === 'undefined';
}

function isNaN(v) {
	return v !== v
}

var fontProperties = ['style', 'variant', 'weight', 'size', 'family'];
var defaultBaseline = 'alphabetic';
// var textAlign = {
//     start: 'left',
//     middle: 'center',
//     end: 'right'
// };

var text = function (node) {
	// if (!node.textContent) return;
	var factor = node.factor,
		size = fontString(node),
		ctx = node.context,
		trans = node.attrs.get('transform');
	var text = new PIXI.Text(node.textContent || '');
	text.style.fontSize = size;
	text.style.fontFamily = node.getValue('font-family') || 'AvenirNext-Medium, Baskerville, Palatino-Roman, Helvetica, "Times New Roman"';
	// text.style.align = textAlign[node.getValue('text-anchor')] || textAlign.middle;
	var textAnchor = node.getValue('text-anchor');
	if (textAnchor === 'middle') {
		text.anchor.x = 0.5;
		text.pivot.set(0.5, 1);
	} else if (textAnchor === 'end') {
		text.anchor.x = 1;
	}
	text.style.textBaseline = node.getValue('text-baseline') || defaultBaseline;
	text.anchor.y = 0.75;
	text.position.set(getSize(node.attrs.get('x') || 0, size) + getSize(node.attrs.get('dx') || 0, size), (getSize(node.attrs.get('dy') || 0, size) + getSize(node.attrs.get('y') || 0, size)));
	if (trans) {
		const transResult = getTrans(0, 0, 1, 1, 0, trans);
		// text.setTransform(transResult.x || 0, transResult.y || 0, transResult.sx || 1, transResult.sy || 1, 0);
		text.scale.x = transResult.sx;
		text.scale.y = transResult.sy;
		text.rotation = transResult.rotation || 0;
	}
	return text;
};

function fontString(node) {
	var bits = [],
		size = 0,
		key = void 0,
		v = void 0,
		family = void 0;
	for (var i = 0; i < fontProperties.length; ++i) {
		key = fontProperties[i];
		v = node.getValue('font-' + key);
		if (v) {
			if (key === 'size') {
				size = getSize(v);
				v = size + 'px';
			} else if (key === 'family') {
				family = v;
			}
			bits.push(v);
		}
	}
	//
	if (size) {
		if (!family) bits.push('sans serif');
		node.context.font = bits.join(' ');
	}
	return size;
}

function render() {
	var node = this.node().rootNode;
	node.renderer.render(node.stage);
}

tagDraws.set('circle', circle);
tagDraws.set('line', line);
tagDraws.set('path', path$1);
tagDraws.set('rect', rect);
tagDraws.set('text', text);

tagDraws.set('linearGradient', false);
tagDraws.set('radialGradient', false);

exports.selectCanvas = selectCanvas;
exports.resolution = resolution;
exports.getSize = getSize;
exports.canvasVersion = version;
// edit d3 selection and export
Object.keys(d3Selection).forEach(function (key) {
	exports[key] = d3Selection[key];
});

Object.defineProperty(exports, '__esModule', {
	value: true
});
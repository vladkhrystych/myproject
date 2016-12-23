/*jslint sloppy: true, indent: 2 */
/*global XMLHttpRequest */

(function (global) {
  "use strict";

  var sent = {};
  global.onerror = function (message, filename, lineno, colno, error) {
    message = (message || "").toString();
    filename = (filename || "").toString();
    lineno = (lineno || 0).toString();
    colno = (colno || 0).toString();
    var stack = error ? (error.stack || "").toString() : "";
    var data = "message=" + encodeURIComponent(message) + "&" +
               "filename=" + encodeURIComponent(filename) + "&" +
               "lineno=" + encodeURIComponent(lineno) + "&" +
               "colno=" + encodeURIComponent(colno) + "&" +
               "stack=" + encodeURIComponent(stack);
    if (sent[data] == undefined) {
      sent[data] = data;
      var xhr = new XMLHttpRequest();
      xhr.open("POST", "//matrixcalc.org/jserrors.php?error=1", true);
      xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
      xhr.send(data);
    }
  };

}(this));


(function (global) {
  "use strict";

  // Firefox 3.6, Opera 11.50
  if (Object.create == undefined) {
    var F = function (properties) {
      if (properties != undefined) {
        for (var key in properties) {
          if (Object.prototype.hasOwnProperty.call(properties, key)) {
            Object.defineProperty(this, key, properties[key]);
          }
        }
      }
    };
    Object.create = function (prototype, properties) {
      F.prototype = prototype;
      var object = new F(properties);
      F.prototype = undefined;
      return object;
    };
  }

  if (Object.defineProperty == undefined && Object.prototype.__defineGetter__ != undefined && Object.prototype.__defineSetter__ != undefined) {
    Object.defineProperty = function (object, property, descriptor) {
      var getter = descriptor.get;
      if (getter != undefined) {
        object.__defineGetter__(property, getter);
      }
      var setter = descriptor.set;
      if (setter != undefined) {
        object.__defineSetter__(property, setter);
      }
    };
  }

  if (Date.now == undefined) {
    Date.now = function () {
      return new Date().getTime();
    };
  }

  if (Object.keys == undefined) {
    Object.keys = function (object) {
      var keys = [];
      for (var name in object) {
        if (Object.prototype.hasOwnProperty.call(object, name)) {
          keys.push(name);
        }
      }
      return keys;
    };
  }

  if (Object.getOwnPropertyDescriptor == undefined && Object.prototype.__lookupGetter__ != undefined && Object.prototype.__lookupSetter__ != undefined) {
    Object.getOwnPropertyDescriptor = function (object, property) {
      if (Object.prototype.hasOwnProperty.call(object, property)) {
        var getter = Object.prototype.__lookupGetter__.call(object, property);
        var setter = Object.prototype.__lookupSetter__.call(object, property);
        if (getter != undefined || setter != undefined) {
          return {
            get: getter,
            set: setter,
            enumerable: false,
            configurable: true
          };
        }
        return {
          value: object[property],
          writable: true,
          enumerable: true,
          configurable: true
        };
      }
      return undefined;
    };
  }

}(this));


(function (global) {
  "use strict";

  if (Math.trunc == undefined) {
    Math.trunc = function (x) {
      return x < 0 ? 0 - Math.floor(0 - x) : Math.floor(x);
    };
  }

  if (Object.assign == undefined) {
    Object.assign = function (target) {
      for (var i = 1; i < arguments.length; i += 1) {
        var source = arguments[i];
        if (source != undefined) {
          for (var key in source) {
            if (Object.prototype.hasOwnProperty.call(source, key)) {
              target[key] = source[key];
            }
          }
        }
      }
      return target;
    };
  }

  if (Number.parseInt == undefined) {
    Number.parseInt = parseInt;
  }

  if (Number.parseFloat == undefined) {
    Number.parseFloat = parseFloat;
  }

}(this));

/*global document, Element */

// element.classList for (IE 8 - IE 9, Konqueror 4.13)
// Object.defineProperty with DOM

if (!("classList" in document.documentElement)) {
  (function (E) {

    "use strict";

    var update = function (cl) {
      for (var i = 0; i < cl.tokens.length; i += 1) {
        cl[i] = cl.tokens[i];
      }
      cl.length = cl.tokens.length;
    };

    function ClassList(element) {
      this.element = element;
      var s = element.className.replace(/^\s+|\s+$/g, "").replace(/\s+/g, " ");
      this.tokens = s === "" ? [] : s.split(" ");
      update(this);
    }

    ClassList.prototype.item = function (index) {
      return this.tokens[index];
    };
    ClassList.prototype.contains = function (className) {
      var i = -1;
      while (++i < this.tokens.length) {
        if (this.tokens[i] === className) {
          return true;
        }
      }
      return false;
    };
    ClassList.prototype.add = function (className) {
      var i = -1;
      while (++i < this.tokens.length) {
        if (this.tokens[i] === className) {
          return;
        }
      }
      this.tokens.push(className);
      update(this);
      this.element.className = this.tokens.join(" ");
    };
    ClassList.prototype.remove = function (className) {
      var i = -1;
      var k = 0;
      while (++i < this.tokens.length) {
        if (this.tokens[i] !== className) {
          this.tokens[k] = this.tokens[i];
          k += 1;
        }
      }
      if (k !== i) {
        this.tokens.length = k;
        update(this);
        this.element.className = this.tokens.join(" ");
      }
    };
    ClassList.prototype.toggle = function (className, force) {
      force = force == undefined ? !this.contains(className) : force;
      if (force) {
        this.add(className);
      } else {
        this.remove(className);
      }
      return force;
    };
    ClassList.prototype.toString = function () {
      return this.element.className;
    };

    Object.defineProperty(Element.prototype, "classList", {
      get: function () {
        return new ClassList(this);
      },
      set: undefined,
      enumerable: false, // IE 8 bug
      configurable: true
    });

  }());
}

/*global Event, Node, document, window, Element, HTMLElement, DOMTokenList */

// Chrome < 30, Firefox < 10, Safari < 7
if (!("onmouseenter" in document.documentElement)) {
  document.addEventListener("mouseover", function (event) {
   "use strict";
    var relatedTarget = event.relatedTarget;
    while (relatedTarget != undefined && relatedTarget !== event.target) {
      relatedTarget = relatedTarget.parentNode;
    }
    if (relatedTarget == undefined) {
      var e = document.createEvent("MouseEvent");
      e.initMouseEvent("mouseenter", false, false, event.view, event.detail,  event.screenX, event.screenY, event.clientX, event.clientY, event.ctrlKey, event.altKey, event.shiftKey, event.metaKey, event.button, event.relatedTarget);
      event.target.dispatchEvent(e);
    }
  }, false);
  document.documentElement.onmouseenter = undefined;
}

// Chrome < 30, Firefox < 10, Safari < 7
if (!("onmouseleave" in document.documentElement)) {
  document.addEventListener("mouseout", function (event) {
    "use strict";
    var relatedTarget = event.relatedTarget;
    while (relatedTarget != undefined && relatedTarget !== event.target) {
      relatedTarget = relatedTarget.parentNode;
    }
    if (relatedTarget == undefined) {
      var e = document.createEvent("MouseEvent");
      e.initMouseEvent("mouseleave", false, false, event.view, event.detail,  event.screenX, event.screenY, event.clientX, event.clientY, event.ctrlKey, event.altKey, event.shiftKey, event.metaKey, event.button, event.relatedTarget);
      event.target.dispatchEvent(e);
    }
  }, false);
  document.documentElement.onmouseleave = undefined;
}

// Firefox < 6
if ("getPreventDefault" in Event.prototype && !("defaultPrevented" in Event.prototype)) {
  Object.defineProperty(Event.prototype, "defaultPrevented", {
    get: function () {
      "use strict";
      return this.getPreventDefault();
    },
    set: undefined,
    enumerable: false,
    configurable: true
  });
}

// IE 8 - IE 11 (not Edge)
if (window.clipboardData != undefined) {
  Object.defineProperty(Event.prototype, "clipboardData", {
    get: function () {
      "use strict";
      return window.clipboardData;
    },
    set: undefined,
    enumerable: false,
    configurable: true
  });
}

// IE 8 - IE 11, Edge 12 - 14 - ?
// see notes at http://caniuse.com/#feat=clipboard
// only for IE? (Safari < 10 does not support `document.execCommand('copy')`, but works fine with `Ctrl+C`)
if (!("oncopy" in document)) {
  window.setTimeout(function () {
    "use strict";

    var lastFocusedNode = undefined;

    var removeCopyFix = function () {
      var copyFix = document.getElementById("copy-fix");
      if (copyFix != undefined) {
        document.body.removeChild(copyFix);
        if (lastFocusedNode != undefined) {
          lastFocusedNode.focus();
          lastFocusedNode = undefined;
        }
      }
    };

    var addCopyFix = function () {
      var activeElement = document.activeElement;
      if (activeElement == undefined || activeElement.tagName.toUpperCase() !== "INPUT" && activeElement.tagName.toUpperCase() !== "TEXTAREA") {
        var selection = window.getSelection();
        if (selection.isCollapsed) {
          var copyFix = document.createElement("div");
          copyFix.id = "copy-fix";
          copyFix.innerHTML = "&nbsp;";
          document.body.appendChild(copyFix);
          lastFocusedNode = document.activeElement; // IE 11
          selection.collapse(copyFix, 0);
          selection.selectAllChildren(copyFix);
          window.setTimeout(function () {
            removeCopyFix();
          }, 0);
        }
      }
    };

    document.addEventListener("keydown", function (event) {
      if (event.keyCode === "C".charCodeAt(0) && (event.ctrlKey || event.metaKey) && !event.altKey && !event.shiftKey && !event.defaultPrevented) {
        addCopyFix();
      }
    }, false);

    var nativeExecCommand = document.execCommand;
    document.execCommand = function (name, showDefaultUI, value) {
      if (name === "copy") {
        addCopyFix();
      }
      nativeExecCommand.call(this, name, showDefaultUI, value);
    };

    document.addEventListener("copy", function (event) {
      removeCopyFix();
    }, false);
  }, 0);
}

// IE 8 - IE 9 Drag and Drop helper
if (window.XDomainRequest != undefined && !("draggable" in document.documentElement)) {
  document.addEventListener("selectstart", function (event) {
    "use strict";
    var target = event.target;
    while (target != undefined && !(target.nodeType === Node.ELEMENT_NODE && target.getAttribute("draggable") != undefined)) {
      target = target.parentNode;
    }
    if (target != undefined) {
      event.preventDefault();
      target.dragDrop();
    }
  }, false);
}

// Chrome < 4, Firefox < 4, IE < 9, Opera < 11, Safari < 5
if (document.head == undefined) {
  document.head = document.documentElement.firstElementChild;
}

if (Element.prototype.scrollIntoViewIfNeeded == undefined) {
  Element.prototype.scrollIntoViewIfNeeded = function () {
    "use strict";
    // `centerIfNeeded` is not implemented
    var rect = this.getBoundingClientRect();
    if (rect.left < 0 || document.documentElement.clientWidth < rect.right ||
        rect.top < 0 || document.documentElement.clientHeight < rect.bottom) {
      this.scrollIntoView(document.documentElement.clientHeight < rect.bottom - rect.top || rect.top < 0);
    }
  };
}

// Chrome < 20, Safari < 6
if (!("click" in HTMLElement.prototype)) {
  HTMLElement.prototype.click = function (element) {
    "use strict";
    var event = document.createEvent("MouseEvent");
    event.initMouseEvent("click", true, true, window, 1,  0, 0, 0, 0, false, false, false, false, 0, undefined);
    this.dispatchEvent(event);
  };
}

// Firefox < 9
if (Node.prototype.contains == undefined) {
  Node.prototype.contains = function (otherNode) {
    "use strict";
    var x = otherNode;
    while (x !== this && x != undefined) {
      x = x.parentNode;
    }
    return x != undefined;
  };
}

// IE 10 - IE 11, Opera 11.50 - Opera 12.18, Firefox < 24, Chrome < 24, Safari < 7
if (document.documentElement.classList.toggle("test", false)) {
  DOMTokenList.prototype.toggle = function (token, force) {
    "use strict";
    force = force == undefined ? !this.contains(token) : force;
    if (force) {
      this.add(token);
    } else {
      this.remove(token);
    }
    return force;
  };
}

// Scrolling while you're dragging
// Chrome 49 - OK, Opera 12 - OK, IE 8 - not OK, IE 11 - OK, Firefox 49 - not OK
// https://bugzilla.mozilla.org/show_bug.cgi?id=41708
// TypeError: Cannot use 'in' operator to search for 'mozCursor' in undefined in Safari
if ((window.DataTransfer != undefined && window.DataTransfer.prototype != undefined && "mozCursor" in window.DataTransfer.prototype) || window.XDomainRequest != undefined) {
  (function () {
    "use strict";
    var lastScrollTop = 0;
    document.addEventListener("dragover", function (event) {
      if (lastScrollTop === window.pageYOffset) { // The skip if the web browser has the support of this feature
        var t = event.clientY;
        var b = document.documentElement.clientHeight - event.clientY;
        var dy = t < 16 ? -1 * (16 - t) * (16 - t) : (b < 16 ? +1 * (b - 16) * (b - 16) : 0);
        if (dy !== 0) {
          window.scrollBy(0, dy);
        }
      }
      lastScrollTop = window.pageYOffset;
    }, false);
  }());
}


// TODO: https://bugzilla.mozilla.org/show_bug.cgi?id=688580 (Firefox < 31)
if (document.readyState === "interactive") {
  (function () {
    "use strict";
    var contentLoadedTimeoutId = 0;
    var onTimeout = function () {
      contentLoadedTimeoutId = window.setTimeout(onTimeout, 10);
      if (document.readyState === "complete") {
        var event = document.createEvent("Event");
        event.initEvent("DOMContentLoaded", false, false);
        document.dispatchEvent(event);
      }
    };
    onTimeout();
    document.addEventListener("DOMContentLoaded", function (event) {
      window.clearTimeout(contentLoadedTimeoutId);
    }, false);
  }());
}

/*global document, window, Element */

(function () {
  "use strict";

  var cubicBezier = function (a, b, t) {
    return 3 * a * (1 - t) * (1 - t) * t + 3 * b * (1 - t) * t * t + t * t * t;
  };

  var cubic = function (x, error, a, b, c, d) {
    var start = 0;
    var end = 1;
    while (end - start > error) {
      var middle = (start + end) / 2;
      var e = cubicBezier(a, c, middle);
      if (e < x) {
        start = middle;
      } else {
        end = middle;
      }
    }
    return cubicBezier(b, d, start);
  };

  var easeInOut = function (x, error) {
    return cubic(x, error, 0.42, 0, 0.58, 1);
  };

  var animationNameCounter = 0;

  // Opera 12 doesn't like `styleSheet#deleteRule`, so let's create style elements for every animation
  var createStyleElement = function (name, css) {
    var styleElement = document.createElement("style");
    styleElement.id = name;
    styleElement.appendChild(document.createTextNode(css));
    document.head.appendChild(styleElement);
  };

  var removeStyleElement = function (name) {
    var styleElement = document.getElementById(name);
    document.head.removeChild(styleElement);
  };

  var setAnimationStyles = function (element, keyframes, options) {
    animationNameCounter += 1;
    var newName = "animation" + animationNameCounter.toString();
    var oldName = element.style.animationName;
    if (keyframes != undefined) {
      var c = "";
      for (var j = 0; j < keyframes.length; j += 1) {
        var x = keyframes[j];
        c += (100 * j / (keyframes.length - 1)).toString() + "% { " +
             (x.opacity != undefined ? "opacity: " + x.opacity.toString() + ";" : "") +
             (x.transform != undefined ? "transform: " + x.transform.toString() + ";" : "") +
             " } \n";
      }
      var rule = "@keyframes " + newName + " { " + c + " } ";
      createStyleElement(newName, rule);
    }
    element.style.animationDuration = options == undefined ? "" : (options.duration / 1000).toString() + "s";
    element.style.animationFillMode = options == undefined ? "" : options.fill;
    element.style.animationName = keyframes == undefined ? "" : newName;
    element.style.animationTimingFunction = options == undefined ? "" : options.easing;
    if (oldName !== "") {
      removeStyleElement(oldName);
    }
  };

  var animations = [];

  var interpolateValues = function (a, b, p) {
    return (1 - p) * a + p * b;
  };

  var addValues = function (a, b) {
    return a + b;
  };

  function Transform(name, arg) {
    this.name = name;
    this.arg = arg;
  }

  Transform.prototype.toString = function () {
    return this.name + "(" + this.arg.toString() + (this.name !== "scale" ? "px" : "") + ")";
  };

  Transform.parseTransform = function (transform) {
    var match = /^\s*([a-zA-Z]+)\(([^\),]+)\)\s*$/.exec(transform);
    if (match == undefined) {
      throw new Error();
    }
    var name = match[1];
    var arg = Number.parseFloat(match[2]);
    return new Transform(name, arg);
  };

  function Keyframe(opacity, transform) {
    this.opacity = opacity;
    this.transform = transform;
  }

  Keyframe.parseKeyframe = function (style) {
    var opacity = style.opacity == undefined || style.opacity === "" ? undefined : Number.parseFloat(style.opacity);
    var transform = style.transform == undefined || style.transform === "" ? undefined : Transform.parseTransform(style.transform);
    return new Keyframe(opacity, transform);
  };

  Keyframe.prototype.interpolate = function (keyframe, p) {
    var opacity = undefined;
    if (this.opacity != undefined || keyframe.opacity != undefined) {
      opacity = interpolateValues(this.opacity != undefined ? this.opacity : 1, keyframe.opacity != undefined ? keyframe.opacity : 1, p);
    }
    var transform = undefined;
    if (this.transform != undefined || keyframe.transform != undefined) {
      if (this.transform == undefined && keyframe.transform == undefined && this.transform.name !== keyframe.transform.name) {
        throw new Error();
      }
      var name = this.transform != undefined ? this.transform.name : keyframe.transform.name;
      transform = new Transform(name, interpolateValues(this.transform != undefined ? this.transform.arg : (name === "scale" ? 1 : 0), keyframe.transform != undefined ? keyframe.transform.arg : (name === "scale" ? 1 : 0), p));
    }
    return new Keyframe(opacity, transform);
  };

  Keyframe.prototype.add = function (keyframe, composite) {
    var opacity = keyframe.opacity == undefined ? this.opacity : (this.opacity == undefined || composite !== "add" ? keyframe.opacity : addValues(this.opacity, keyframe.opacity));
    var transform = keyframe.transform == undefined ? this.transform : (this.transform == undefined || composite !== "add" ? keyframe.transform : new Transform(this.transform.name, this.transform.name === "scale" ? this.transform.arg * keyframe.transform.arg : addValues(this.transform.arg, keyframe.transform.arg)));
    return new Keyframe(opacity, transform);
  };

  Keyframe.willChange = "transform, opacity";

  var generateKeyframes = function (element, startTime, endTime) {
    var style = Keyframe.parseKeyframe(element.style);
    var keyframes = [];
    for (var time = startTime; time < endTime; time += 1000 / 60) {
      var value = style;
      for (var i = 0; i < animations.length; i += 1) {
        var a = animations[i];
        if (a.element === element) {
          var timeFraction = (time - a.startTime) / a.duration;
          if (timeFraction < 0) {
            timeFraction = 0;
          }
          if (timeFraction > 1) {
            timeFraction = 1;
          }
          var p = easeInOut(timeFraction, 1000 / 60 / a.duration / 32);
          var frame0 = value.add(a.keyframes[0], a.composite);
          var frame1 = value.add(a.keyframes[1], a.composite);
          value = frame0.interpolate(frame1, p);
        }
      }
      keyframes.push(value);
    }
    return keyframes;
  };

  if (window.operamini == undefined &&
      ("animationName" in document.documentElement.style) &&
      ("transform" in document.documentElement.style) &&
      (Element.prototype.animate == undefined || window.KeyframeEffect == undefined || !("composite" in window.KeyframeEffect.prototype))) {
    Element.prototype.animate = function (frames, keyframeEffectOptions) {
      var now = Date.now();
      var keyframes = [];
      for (var j = 0; j < frames.length; j += 1) {
        keyframes.push(Keyframe.parseKeyframe(frames[j]));
      }
      var element = this;
      var animation = {
        element: element,
        keyframes: keyframes,
        duration: keyframeEffectOptions.duration,
        composite: keyframeEffectOptions.composite,
        startTime: now
      };
      animations.push(animation);
      element.style.willChange = Keyframe.willChange;
      var endTime = 0;
      for (var i = 0; i < animations.length; i += 1) {
        if (animations[i].element === element) {
          endTime = Math.max(endTime, animations[i].startTime + animations[i].duration);
        }
      }
      var animationKeyframes = generateKeyframes(element, now, endTime);
      setAnimationStyles(element, animationKeyframes, {duration: endTime - now, fill: "both", easing: "linear"});
      window.setTimeout(function () {
        var k = 0;
        var active = 0;
        for (var i = 0; i < animations.length; i += 1) {
          if (animations[i] !== animation) {
            if (animations[i].element === element) {
              active += 1;
            }
            animations[k] = animations[i];
            k += 1;
          }
        }
        animations.length = k;
        if (active === 0) {
          setAnimationStyles(element, undefined, undefined);
          element.style.willChange = "";
        }
      }, animation.duration);
      return animation;
    };
  }

}(this));

/*global window, document, Element */

(function () {
  "use strict";

  function Inert() {
  }
  Inert.observers = [];
  Inert.dialogs = [];
  Inert.f = function (tabIndex) {
    return -42 - tabIndex;
  };
  Inert.toggleInert = function (node, dialog, value) {
    if (!dialog.contains(node)) {
      if ((value && node.tabIndex >= 0) || (!value && node.tabIndex <= Inert.f(0))) {
        node.tabIndex = Inert.f(node.tabIndex);
      }
      var c = node.firstElementChild;
      while (c != undefined) {
        Inert.toggleInert(c, dialog, value);
        c = c.nextElementSibling;
      }
    }
  };
  Inert.push = function (dialog) {
    Inert.toggleInert(document.documentElement, dialog, true);
    if (window.MutationObserver != undefined) {
      var observer = new window.MutationObserver(function (mutations) {
        for (var i = 0; i < mutations.length; i += 1) {
          var mutation = mutations[i];
          var addedNodes = mutation.addedNodes;
          for (var j = 0; j < addedNodes.length; j += 1) {
            Inert.toggleInert(addedNodes[j], dialog, true);
          }
          var removedNodes = mutation.removedNodes;
          for (var k = 0; k < removedNodes.length; k += 1) {
            Inert.toggleInert(removedNodes[k], dialog, false);
          }
        }
      });
      observer.observe(document.documentElement, {
        childList: true,
        subtree: true
      });
      Inert.observers.push(observer);
    }
    Inert.dialogs.push(dialog);
  };
  Inert.pop = function () {
    var dialog = Inert.dialogs.pop();
    if (window.MutationObserver != undefined) {
      var observer = Inert.observers.pop();
      observer.disconnect();
    }
    Inert.toggleInert(document.documentElement, dialog, false);
  };

  var setFocus = function (dialog) {
    var autofocus = dialog.querySelector("*[autofocus]");
    autofocus.focus();
  };

  var show = function () {
    if (this.getAttribute("open") == undefined) {
      this.setAttribute("open", "open");
      setFocus(this);
    }
  };

  var showModal = function () {
    if (this.getAttribute("open") == undefined) {
      this.setAttribute("data-modal", "data-modal");
      this.setAttribute("open", "open");
      Inert.push(this);
      setFocus(this);
    }
  };

  var close = function (returnValue) {
    if (this.getAttribute("open") != undefined) {
      if (this.getAttribute("data-modal") != undefined) {
        this.removeAttribute("data-modal");
        Inert.pop();
      }
      this.removeAttribute("open");
      this.returnValue = returnValue;
      var event = document.createEvent("Event");
      event.initEvent("close", false, false);
      this.dispatchEvent(event);
    }
  };

  Element.prototype.initDialog = function () {
    var dialog = this;
    if (dialog.show == undefined || dialog.showModal == undefined || dialog.close == undefined) {
      dialog.setAttribute("role", "dialog");
      dialog.show = show;
      dialog.showModal = showModal;
      dialog.close = close;
      dialog.returnValue = undefined;
      dialog.addEventListener("keydown", function (event) {
        var DOM_VK_ESCAPE = 27;
        if (event.keyCode === DOM_VK_ESCAPE && !event.ctrlKey && !event.altKey && !event.shiftKey && !event.metaKey && !event.defaultPrevented) {
          event.preventDefault();
          this.close(undefined);
        }
      }, false);
      dialog.addEventListener("submit", function (event) {
        event.preventDefault();
        this.close(event.target.getAttribute("value"));
      }, false);
    }
  };

}());

/*global document, Element*/

(function () {
  "use strict";

  Element.prototype.initDetails = function () {
    var details = this;
    var summary = details.firstElementChild;
    if (summary.tagName.toUpperCase() !== "SUMMARY") {
      throw new Error();
    }
    if (!("open" in details) || !("ontoggle" in details) || summary.tabIndex === -1) {
      details.setAttribute("role", "group");
      summary.setAttribute("aria-expanded", "false");// Note: on <summary>
      summary.setAttribute("role", "button");
      summary.setAttribute("tabindex", "0");
      summary.addEventListener("click", function (event) {
        var summary = this;
        var details = summary.parentNode;
        event.preventDefault();
        var isOpen = details.getAttribute("open") != undefined;
        if (!isOpen) {
          summary.setAttribute("aria-expanded", "true");// Note: on <summary>
          details.setAttribute("open", "open");
        } else {
          details.setAttribute("aria-expanded", "false");
          details.removeAttribute("open");
        }
        summary.focus();
        var e = document.createEvent("Event");
        e.initEvent("toggle", false, false);
        details.dispatchEvent(e);
      }, false);
      // role="button" => click should be fired with SPACE key too
      summary.addEventListener("keydown", function (event) {
        var DOM_VK_SPACE = 32;
        if (event.keyCode === DOM_VK_SPACE && !event.ctrlKey && !event.altKey && !event.shiftKey && !event.metaKey && !event.defaultPrevented) {
          event.preventDefault(); // scrolling
        }
        var DOM_VK_RETURN = 13;
        if (event.keyCode === DOM_VK_RETURN && !event.ctrlKey && !event.altKey && !event.shiftKey && !event.metaKey && !event.defaultPrevented) {
          event.preventDefault();
          this.click();
        }
      }, false);
      summary.addEventListener("keyup", function (event) {
        var DOM_VK_SPACE = 32;
        if (event.keyCode === DOM_VK_SPACE && !event.ctrlKey && !event.altKey && !event.shiftKey && !event.metaKey && !event.defaultPrevented) {
          event.preventDefault();
          this.click();
        }
      }, false);
    }
  };

}());

/*global document, window, Node, Element, HTMLInputElement, HTMLTextAreaElement, TextRange*/

(function () {
  "use strict";

  // IE ? - IE 11
  // "scrollIntoView" behaviour for setSelectionRange
  if (Object.getOwnPropertyDescriptor != undefined && HTMLInputElement.prototype.createTextRange != undefined) {
    var fixSetSelectionRange = function (C) {
      var setSelectionRange = C.prototype.setSelectionRange;
      C.prototype.setSelectionRange = function (selectionStart, selectionEnd, selectionDirection) {
        setSelectionRange.call(this, selectionStart, selectionEnd, selectionDirection);
        var textRange = this.createTextRange();
        textRange.moveStart("character", this.selectionStart);
        textRange.moveEnd("character", this.selectionEnd - this.value.length);
        textRange.scrollIntoView(true);
      };
    };
    fixSetSelectionRange(HTMLInputElement);
    fixSetSelectionRange(HTMLTextAreaElement);
  }

  // IE 8 - IE 10
  // see https://github.com/codemirror/CodeMirror/commit/63591907b0dcd51c2f64dc967143e044ecac6923
  if (Object.getOwnPropertyDescriptor != undefined && HTMLInputElement.prototype.createTextRange != undefined && document.attachEvent != undefined) {
    var originalGetBoundingClientRect = TextRange.prototype.getBoundingClientRect;
    TextRange.prototype.getBoundingClientRect = function () {
      var zoomX = window.screen.logicalXDPI / window.screen.deviceXDPI;
      var zoomY = window.screen.logicalYDPI / window.screen.deviceYDPI;
      var rect = originalGetBoundingClientRect.call(this);
      return {
        top: rect.top * zoomY,
        right: rect.right * zoomX,
        bottom: rect.bottom * zoomY,
        left: rect.left * zoomX,
        height: (rect.bottom - rect.top) * zoomY,
        width: (rect.right - rect.left) * zoomX
      };
    };
  }

  // https://connect.microsoft.com/IE/feedback/details/1015764/ie11-scrollleft-for-text-input-elements-is-always-0
  // IE 11, Edge has problems with input.scrollLeft (always 0)
  // IE 10 - 11 - input.scrollWidth
  // see also https://github.com/gregwhitworth/scrollWidthPolyfill/
  if (Object.getOwnPropertyDescriptor != undefined && HTMLInputElement.prototype.createTextRange != undefined) {
    var fixScrollProperty = function (property) {
      var originalScrollProperty = Object.getOwnPropertyDescriptor(Element.prototype, property);
      if (originalScrollProperty != undefined) {
        Object.defineProperty(Element.prototype, property, {
          get: function () {
            if (this.tagName.toUpperCase() !== "INPUT") {
              return originalScrollProperty.get.call(this);
            }
            var inputElement = this;
            var textRange = inputElement.createTextRange();
            var inputStyle = window.getComputedStyle(inputElement, undefined);
            var paddingLeft = Number.parseFloat(inputStyle.paddingLeft);
            var paddingRight = Number.parseFloat(inputStyle.paddingRight);
            var rangeRect = textRange.getBoundingClientRect();
            var scrollLeft = inputElement.getBoundingClientRect().left + inputElement.clientLeft + paddingLeft - rangeRect.left;
            var scrollWidth = Math.max(inputElement.clientWidth, paddingLeft + (rangeRect.right - rangeRect.left) + paddingRight);
            return property === "scrollLeft" ? scrollLeft : scrollWidth;
          },
          set: function (value) { // Note: it is not possible to use `originalScrollProperty.set` here in IE 8-?
            return originalScrollProperty.set.call(this, value);
          },
          enumerable: false,
          configurable: true
        });
      }
      fixScrollProperty("scrollLeft");
      //fixScrollProperty("scrollWidth");
    };
  }

  // a bug in Chrome on Windows 47 - 53 - ?
  // https://bugs.chromium.org/p/chromium/issues/detail?id=652102
  if (Object.getOwnPropertyDescriptor != undefined) {
    var lastDevicePixelRatio = 0;
    var lastScrollLeftFix = 1;
    var originalScrollLeft = undefined;
    try {
      originalScrollLeft = Object.getOwnPropertyDescriptor(Element.prototype, "scrollLeft");
    } catch (error) {
      // NS_ERROR_XPC_BAD_CONVERT_JS: Could not convert JavaScript argument in Firefox 17
      window.setTimeout(function () {
        throw error;
      }, 0);
    }
    if (originalScrollLeft != undefined && originalScrollLeft.get != undefined && originalScrollLeft.set != undefined) { // Safari < 10, Opera 12
      Object.defineProperty(HTMLInputElement.prototype, "scrollLeft", {
        get: function () {
          if (this.tagName.toUpperCase() !== "INPUT") {
            return originalScrollLeft.get.call(this);
          }
          if (lastDevicePixelRatio !== window.devicePixelRatio) {
            lastDevicePixelRatio = window.devicePixelRatio;
            var input = document.createElement("input");
            document.body.appendChild(input);
            input.style.width = "1px";
            input.style.overflow = "hidden";
            input.value = "xxxxxxxxxxxxxxx";
            originalScrollLeft.set.call(input, 16383);
            var s = originalScrollLeft.get.call(input);
            if (s === 0) { // IE - Edge
              lastScrollLeftFix = 1;
            } else {
              lastScrollLeftFix = (input.scrollWidth - input.clientWidth) / s;
              if ((1 - lastScrollLeftFix) * (1 - lastScrollLeftFix) < 0.05 * 0.05) {
                lastScrollLeftFix = 1;
              }
            }
            document.body.removeChild(input);
          }
          // lastScrollLeftFix equals window.devicePixelRatio in Chrome 49 - 53
          return lastScrollLeftFix * originalScrollLeft.get.call(this);
        },
        set: function (value) {
          originalScrollLeft.set.call(this, value);
        },
        enumerable: false,
        configurable: true
      });
    }
  }

}());

// IE <= 11, Opera <= 12, Firefox < 20 (caretPositionFromPoint)
if (document.caretPositionFromPoint == undefined && document.caretRangeFromPoint == undefined) {
  document.caretRangeFromPoint = function (x, y) {
    "use strict";
    var element = document.elementFromPoint(x, y);
    var walk = function (candidate, e, x, y) {
      var element = candidate;
      var c = e.firstChild;
      if (c == undefined && e.nodeType === Node.TEXT_NODE && e.parentNode.tagName.toUpperCase() !== "TEXTAREA") {
        var range = document.createRange();
        range.setStart(e, 0);
        range.setEnd(e, e.nodeValue.length);
        var rect = range.getBoundingClientRect();
        if (x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom) {
          element = e;
        }
      }
      while (c != undefined) {
        element = walk(element, c, x, y);
        c = c.nextSibling;
      }
      return element;
    };
    element = walk(element, element, x, y);
    var result = document.createRange();
    result.selectNode(element);
    if (element.nodeType === Node.TEXT_NODE) {
      var length = element.nodeValue.length;
      var min = 1 / 0;
      for (var i = 0; i < length; i += 1) {
        var range = document.createRange();
        range.setStart(element, i);
        range.setEnd(element, i + 1); // Opera 12 needs a not collapsed range, seems
        var rect = range.getBoundingClientRect();
        var d = x - (rect.left + rect.right) / 2;
        var distance = d < 0 ? 0 - d : 0 + d;
        if (distance < min && y >= rect.top && y <= rect.bottom) { // && rect.right === rect.left
          result = range;
          min = distance;
        }
      }
    }
    return result;
  };
}

// Firefox < 20, Chrome, Edge, Opera, Safari
if (document.caretPositionFromPoint == undefined) {
  document.caretPositionFromPoint = function (x, y) {
    "use strict";
    var element = document.elementFromPoint(x, y);
    if (element.tagName.toUpperCase() !== "INPUT" && element.tagName.toUpperCase() !== "TEXTAREA") {
      var caretRange = document.caretRangeFromPoint(x, y);
      return {
        offsetNode: caretRange.startContainer,
        offset: caretRange.startOffset
      };
    }
    var input = element;
    var inputStyle = window.getComputedStyle(input, undefined);

    var scrollLeft = input.scrollLeft;
    var scrollTop = input.scrollTop;

    var inputRect = input.getBoundingClientRect();

    var value = input.value.replace(/\r\n/g, "\n") + "\n"; // IE - \r\n
    var div = document.createElement("div");
    div.appendChild(document.createTextNode(value));
    div.style.position = "absolute";
    div.style.display = "inline-block";

    div.style.margin = "0px";
    div.style.border = "0px solid transparent";

    div.style.paddingLeft = inputStyle.paddingLeft;
    div.style.paddingRight = inputStyle.paddingRight;
    div.style.paddingTop = inputStyle.paddingTop;
    div.style.paddingBottom = inputStyle.paddingBottom;

    div.style.left = (inputRect.left + window.pageXOffset + input.clientLeft).toString() + "px";
    div.style.top = (inputRect.top + window.pageYOffset + input.clientTop).toString() + "px";
    div.style.width = input.clientWidth.toString() + "px";
    div.style.height = input.clientHeight.toString() + "px";

    if ("boxSizing" in div.style) {
      div.style.boxSizing = "border-box";
    }
    if ("MozBoxSizing" in div.style) {
      div.style.MozBoxSizing = "border-box";
    }
    if ("webkitBoxSizing" in div.style) {
      div.style.webkitBoxSizing = "border-box";
    }

    div.style.whiteSpace = input.tagName.toUpperCase() === "INPUT" ? "nowrap" : "pre";
    div.style.wordWrap = inputStyle.wordWrap;

    div.style.font = inputStyle.fontSize + " " + inputStyle.fontFamily; // FF does not like font
    div.style.overflow = "hidden";
    div.style.visibility = "visible"; // Opera 12 needs visible
    div.style.zIndex = "100000";//?

    document.body.appendChild(div);
    div.scrollLeft = scrollLeft;
    div.scrollTop = scrollTop;

    var range = document.caretRangeFromPoint(x, y);
    var result = {
      offsetNode: input,
      offset: range.startOffset
    };
    document.body.removeChild(div);

    return result;
  };
}

/*global Node, window, document*/

(function () {
  "use strict";
  
  // TODO: change - http://dev.w3.org/html5/html-author/charref (`&RightArrow;` and `&LeftRightArrow;` are not supported by IE 8 - 9 , Android 2.3, Konqueror )
  // &RightArrow;
  // &LeftRightArrow;
  // &ApplyFunction;

  var operators = {
    ",": {c: ",", p: -10},//?
    "\u2192": {c: "->", p: -9},//? &rarr;
    "\u2194": {c: "<->", p: -9},//? &harr;
    ".^": {c: ".^", p: 7},
    "^": {c: "^", p: 6},
    "\u00D7": {c: "*", p: 5},// &times;
    "\u2061": {c: "", p: 5},//? &ApplyFunction;
    "/": {c: "/", p: 4},
    "\u2212": {c: "-", p: 3}, // &minus;
    "+": {c: "+", p: 2}
  };

  var isRightToLeftAssociative = function (operator) {
    return operator === "^" || operator === ".^";
  };

  var fence = function (x, operator, left) {
    return (x.precedence < operators[operator].p || (x.precedence === operators[operator].p && (left && !isRightToLeftAssociative(x) || !left && isRightToLeftAssociative(x)))) ? "(" + x.string + ")" : x.string;
  };

  var transformMTABLE = function (node) {
    var childNode = node.firstElementChild;
    var rows = "";
    while (childNode != undefined) {
      if (childNode.tagName.toUpperCase() === "MTR") {
        var c = childNode.firstElementChild;
        var row = "";
        while (c != undefined) {
          if (c.tagName.toUpperCase() === "MTD") {
            row += (row !== "" ? ", " : "") + fence(transformMathML(c), ",", true);
          }
          c = c.nextElementSibling;
        }
        rows += (rows !== "" ? ", " : "") + "{" + row + "}";
      }
      childNode = childNode.nextElementSibling;
    }
    return "{" + rows + "}"; // "(" + ... + ")" ?
  };
  
  function TransformResult(string, precedence) {
    this.string = string;
    this.precedence = precedence;
  }

  var transformMathML = function (node) {
    var tagName = node.tagName.toUpperCase();
    if (tagName === "MATH" ||
        tagName === "CUSTOM-MATH" ||
        tagName === "MTD" ||
        tagName === "MTR" ||
        tagName === "MROW" ||
        tagName === "MENCLOSE" ||
        tagName === "MFENCED" ||
        tagName === "MO" ||
        tagName === "MPADDED" ||
        tagName === "MSPACE" ||
        tagName === "MSTYLE" ||
        tagName === "MUNDER" ||
        tagName === "MI" ||
        tagName === "MN") {
      var childNode = node.firstChild;
      var s = "";
      var p = 42;
      while (childNode != undefined) {
        if (childNode.nodeType === Node.TEXT_NODE) {
          s += childNode.nodeValue;
        } else if (childNode.nodeType === Node.ELEMENT_NODE) {
          var tmp = transformMathML(childNode);
          s += tmp.string;
          p = Math.min(p, tmp.precedence);
        }
        childNode = childNode.nextSibling;
      }
      if (tagName === "MO") {
        var o = operators[s];
        p = Math.min(p, o == undefined ? 0 : o.p);
        s = o == undefined ? s : o.c;
      }
      return tagName === "MFENCED" ? new TransformResult(node.getAttribute("open") + s + node.getAttribute("close"), 42) : new TransformResult(s, p);
    }
    if (tagName === "MSUP") {
      return new TransformResult(fence(transformMathML(node.firstElementChild), "^", true) + "^" + fence(transformMathML(node.firstElementChild.nextElementSibling), "^", false), operators["^"].p);
    }
    if (tagName === "MSUB") {
      //TODO: fix a_(1,2) ?
      var x = transformMathML(node.firstElementChild.nextElementSibling).string;
      return new TransformResult(transformMathML(node.firstElementChild).string + "_" + (x.indexOf(",") !== -1 ? "(" + x + ")" : x), 42); // "(" + ... + ")" ?
    }
    if (tagName === "MFRAC") {
      return new TransformResult(fence(transformMathML(node.firstElementChild), "/", true) + "/" + fence(transformMathML(node.firstElementChild.nextElementSibling), "/", false), operators["/"].p);
    }
    if (tagName === "MSQRT") {
      return new TransformResult("sqrt(" + transformMathML(node.firstElementChild).string + ")", 42);
    }
    if (tagName === "MTABLE") {
      return new TransformResult(transformMTABLE(node), 42);
    }
    if (tagName === "MTEXT") {//?
      return new TransformResult("", 42);
      //var range = document.createRange();
      //range.setStart(node, 0);
      //range.setEnd(node, getLength(node));
      //var ss = serialize(range, false, specialSerializer).replace(/^\s+|\s+$/g, "");
      //return new TransformResult(ss === "" ? "" : "text(" + ss + ")", 42);
    }
    throw new Error("transformMathML:" + tagName);
  };

  var isBlock = function (display) {
    switch (display) {
      case "inline":
      case "inline-block":
      case "inline-flex":
      case "inline-grid":
      case "inline-table":
      case "none":
      case "table-column":
      case "table-column-group":
      case "table-cell":
        return false;
    }
    return true;
  };

  var getLength = function (container) {
    if (container.nodeType === Node.TEXT_NODE) {
      return container.nodeValue.length;
    }
    if (container.nodeType === Node.ELEMENT_NODE) {
      var i = 0;
      var child = container.firstChild;
      while (child != undefined) {
        child = child.nextSibling;
        i += 1;
      }
      return i;
    }
  };

  var getChildNode = function (container, offset, node, roundUp) {
    var child = undefined;
    var x = container;
    var intersectsAll = (roundUp ? offset === getLength(container) : offset === 0);
    while (x !== node) {
      child = x;
      intersectsAll = intersectsAll && (roundUp ? child.nextSibling == undefined : child.previousSibling == undefined);
      x = x.parentNode;
    }
    if (child != undefined) {
      child = roundUp ? child.nextSibling : child;
    } else {
      var i = -1;
      child = container.firstChild; // node === container
      while (++i < offset) {
        child = child.nextSibling;
      }
    }
    return {child: child, intersectsAll: intersectsAll};
  };

  var serialize = function (range, isLineStart, specialSerializer) {
    // big thanks to everyone
    // see https://github.com/timdown/rangy/blob/master/src/modules/rangy-textrange.js
    // see https://github.com/WebKit/webkit/blob/ec2f4d46b97bb20fd0877b1f4b5ec50f7b9ec521/Source/WebCore/editing/TextIterator.cpp#L1188
    // see https://github.com/jackcviers/Rangy/blob/master/spec/innerText.htm

    var node = range.commonAncestorContainer;
    var startContainer = range.startContainer;
    var startOffset = range.startOffset;
    var endContainer = range.endContainer;
    var endOffset = range.endOffset;

    if (node.nodeType === Node.TEXT_NODE) {
      var nodeValue = node.nodeValue.slice(node === startContainer ? startOffset : 0, node === endContainer ? endOffset : node.nodeValue.length);
      nodeValue = nodeValue.replace(/[\u0020\n\r\t\v]+/g, " ");
      if (isLineStart) {
        nodeValue = nodeValue.replace(/^[\u0020\n\r\t\v]/g, "");
      }
      return nodeValue;
    }
    if (node.nodeType === Node.ELEMENT_NODE) {
      var display = window.getComputedStyle(node, undefined).display;
      if (display === "none") {
        return "";
      }
      var intersectsAll = true;
      var tmp0 = getChildNode(startContainer, startOffset, node, false);
      var startChildNode = tmp0.child;
      intersectsAll = intersectsAll && tmp0.intersectsAll;
      var tmp1 = getChildNode(endContainer, endOffset, node, true);
      var endChildNode = tmp1.child;
      intersectsAll = intersectsAll && tmp1.intersectsAll;
      var childNode = startChildNode;
      var result = "";
      if (isBlock(display) && !isLineStart) {
        result += "\n";
        isLineStart = true;
      }
      var x = undefined;
      if (intersectsAll) {
        x = specialSerializer(node);
      }
      if (x != undefined) {
        result += x;
      } else {
        while (childNode !== endChildNode) {
          var childNodeRange = document.createRange();
          childNodeRange.setStart(childNode, 0);
          childNodeRange.setEnd(childNode, getLength(childNode));
          if (childNode === startChildNode && startContainer !== node) {
            childNodeRange.setStart(startContainer, startOffset);
          }
          if (childNode.nextSibling === endChildNode && endContainer !== node) {
            childNodeRange.setEnd(endContainer, endOffset);
          }
          var v = serialize(childNodeRange, isLineStart, specialSerializer);
          isLineStart = v === "" && isLineStart || v.slice(-1) === "\n";
          result += v;
          childNode = childNode.nextSibling;
        }
      }
      if (display === "table-cell") {
        result += "\t";
      }
      if (isBlock(display) && !isLineStart) {
        result = result.replace(/[\u0020\n\r\t\v]$/g, "");
        result += "\n";
        isLineStart = true;
      }
      return result;
    }
    return "";
  };

  var serializePlainText = function (range, specialSerializer) {
    var isLineStart = !(range.startContainer.nodeType === Node.TEXT_NODE && range.startContainer.nodeValue.slice(0, range.startOffset).replace(/\s+/g, "") !== "");
    var isLineEnd = !(range.endContainer.nodeType === Node.TEXT_NODE && range.endContainer.nodeValue.slice(range.endOffset, range.endContainer.nodeValue.length).replace(/\s+/g, "") !== "");
    var value = serialize(range, false, specialSerializer);
    if (isLineStart) {
      value = value.replace(/^\s/g, "");
    }
    if (isLineEnd) {
      value = value.replace(/\s$/g, "");
    }
    return value;
  };

  var specialSerializer = function (node) {
    var tagName = node.tagName.toUpperCase();
    var isMathMLNode = tagName.charCodeAt(0) === "M".charCodeAt(0) &&
                       tagName !== "MAIN" &&
                       tagName !== "MAP" &&
                       tagName !== "MARK" &&
                       tagName !== "MATH" &&
                       tagName !== "MENU" &&
                       tagName !== "MENUITEM" &&
                       tagName !== "META" &&
                       tagName !== "METER";
    if (isMathMLNode || tagName === "MATH" || tagName === "CUSTOM-MATH") {
      try {
        return transformMathML(node).string;
      } catch (error) {
        window.setTimeout(function () {
          throw error;
        }, 0);
      }
    }
    // <br> is used in hypercomments
    if (tagName === "BR") {//?
      return "\n";
    }
    return undefined;
  };

  var serializeHTML = function (range) {
    var fragment = range.cloneContents();
    var div = document.createElement("div");
    div.appendChild(fragment);
    return div.innerHTML;
  };

  var onCopyOrDragStart = function (event) {
    var dataTransfer = event.type === "copy" ? event.clipboardData : event.dataTransfer;
    var tagName = event.target.nodeType === Node.ELEMENT_NODE ? event.target.tagName.toUpperCase() : "";
    if ("\v" !== "v" && tagName !== "INPUT" && tagName !== "TEXTAREA" && tagName !== "A" && tagName !== "IMG") {
      //! dataTransfer.effectAllowed throws an exception in FireFox if tagName is INPUT or TEXTAREA
      if ((event.type === "copy" || dataTransfer.effectAllowed === "uninitialized") && !event.defaultPrevented) {
        var selection = window.getSelection();
        var rangeCount = selection.rangeCount;
        if (rangeCount !== 0) {
          var i = -1;
          var plainText = "";
          var htmlText = "";
          while (++i < rangeCount) {
            var range = selection.getRangeAt(i);
            htmlText += serializeHTML(range);
            plainText += serializePlainText(range, specialSerializer);
          }
          try {
            dataTransfer.setData("Text", plainText);
            dataTransfer.setData("text/html", htmlText);
          } catch (error) {
            // IE
            if (window.console != undefined) {
              window.console.log(error);
            }
          }
          if (event.type === "copy") {
            event.preventDefault();
          } else {
            dataTransfer.effectAllowed = "copy";//?
          }
        }
      }
    }
  };

  document.addEventListener("copy", onCopyOrDragStart, false);
  document.addEventListener("dragstart", onCopyOrDragStart, false);
}());

/*jslint plusplus: true, vars: true, indent: 2 */

(function (global) {
  "use strict";

  if (Math.trunc == undefined) {
    Math.trunc = function (x) {
      return x < 0 ? 0 - Math.floor(0 - x) : Math.floor(x);
    };
  }
  if ((-2147483649).toString(16) === "-0") { // Opera 12
    var numberToString = Number.prototype.toString;
    Number.prototype.toString = function (radix) {
      "use strict";
      return (this < 0 ? "-" : "") + numberToString.call(this < 0 ? 0 - this : this, radix);
    };
  }

  // BigInteger.js
  // Available under Public Domain
  // https://github.com/Yaffle/BigInteger/

  // For implementation details, see "The Handbook of Applied Cryptography"
  // http://www.cacr.math.uwaterloo.ca/hac/about/chap14.pdf

  var parseInteger = function (s, from, to, radix) {
    var i = from - 1;
    var n = 0;
    var y = radix < 10 ? radix : 10;
    while (++i < to) {
      var code = s.charCodeAt(i);
      var v = code - 48;
      if (v < 0 || y <= v) {
        v = 10 - 65 + code;
        if (v < 10 || radix <= v) {
          v = 10 - 97 + code;
          if (v < 10 || radix <= v) {
            throw new RangeError();
          }
        }
      }
      n = n * radix + v;
    }
    return n;
  };

  var createArray = function (length) {
    var x = new Array(length);
    var i = -1;
    while (++i < length) {
      x[i] = 0;
    }
    return x;
  };

  // count >= 1
  var pow = function (x, count) {
    var accumulator = 1;
    var v = x;
    var c = count;
    while (c > 1) {
      var q = Math.trunc(c / 2);
      if (q * 2 !== c) {
        accumulator *= v;
      }
      v *= v;
      c = q;
    }
    return accumulator * v;
  };

  var epsilon = 1 / 4503599627370496;
  while (1 + epsilon / 2 !== 1) {
    epsilon /= 2;
  }
  var BASE = 2 / epsilon;
  var s = 134217728;
  while (s * s < 2 / epsilon) {
    s *= 2;
  }
  var SPLIT = s + 1;

  var fastTrunc = function (x) {
    var v = (x - BASE) + BASE;
    return v > x ? v - 1 : v;
  };

  // Veltkamp-Dekker's algorithm
  // see http://web.mit.edu/tabbott/Public/quaddouble-debian/qd-2.3.4-old/docs/qd.pdf
  // with FMA:
  // var product = a * b;
  // var error = Math.fma(a, b, -product);
  var performMultiplication = function (carry, a, b) {
    var at = SPLIT * a;
    var ahi = at - (at - a);
    var alo = a - ahi;
    var bt = SPLIT * b;
    var bhi = bt - (bt - b);
    var blo = b - bhi;
    var product = a * b;
    var error = ((ahi * bhi - product) + ahi * blo + alo * bhi) + alo * blo;

    var hi = fastTrunc(product / BASE);
    var lo = product - hi * BASE + error;

    if (lo < 0) {
      lo += BASE;
      hi -= 1;
    }

    lo += carry - BASE;
    if (lo < 0) {
      lo += BASE;
    } else {
      hi += 1;
    }

    return {lo: lo, hi: hi};
  };

  var performDivision = function (a, b, divisor) {
    if (a >= divisor) {
      throw new RangeError();
    }
    var p = a * BASE;
    var y = p / divisor;
    var r = p % divisor;
    var q = fastTrunc(y);
    if (y === q && r > divisor - r) {
      q -= 1;
    }
    r += b - divisor;
    if (r < 0) {
      r += divisor;
    } else {
      q += 1;
    }
    y = fastTrunc(r / divisor);
    r -= y * divisor;
    q += y;
    return {q: q, r: r};
  };

  function BigInteger(sign, magnitude, length, value) {
    this.sign = sign;
    this.magnitude = magnitude;
    this.length = length;
    this.value = value;
  }

  var createBigInteger = function (sign, magnitude, length, value) {
    return length === 0 ? 0 : (length === 1 ? (sign === 1 ? 0 - value : value) : new BigInteger(sign, magnitude, length, value));
  };

  var valueOf = function (x) {
    if (typeof x === "number") {
      return new BigInteger(x < 0 ? 1 : 0, undefined, x === 0 ? 0 : 1, x < 0 ? 0 - x : 0 + x);
    }
    return x;
  };

  var parseBigInteger = function (s, radix) {
    if (radix == undefined) {
      radix = 10;
    }
    if (radix !== 10 && (radix < 2 || radix > 36 || radix !== Math.trunc(radix))) {
      throw new RangeError("radix argument must be an integer between 2 and 36");
    }
    var length = s.length;
    if (length === 0) {
      throw new RangeError();
    }
    var sign = 0;
    var signCharCode = s.charCodeAt(0);
    var from = 0;
    if (signCharCode === 43) { // "+"
      from = 1;
    }
    if (signCharCode === 45) { // "-"
      from = 1;
      sign = 1;
    }

    length -= from;
    if (length === 0) {
      throw new RangeError();
    }
    if (pow(radix, length) <= BASE) {
      var value = parseInteger(s, from, from + length, radix);
      return createBigInteger(value === 0 ? 0 : sign, undefined, value === 0 ? 0 : 1, value);
    }
    var groupLength = 0;
    var groupRadix = 1;
    var limit = fastTrunc(BASE / radix);
    while (groupRadix <= limit) {
      groupLength += 1;
      groupRadix *= radix;
    }
    var size = Math.trunc((length - 1) / groupLength) + 1;

    var magnitude = createArray(size);
    var k = size;
    var i = length;
    while (i > 0) {
      k -= 1;
      magnitude[k] = parseInteger(s, from + (i > groupLength ? i - groupLength : 0), from + i, radix);
      i -= groupLength;
    }

    var j = -1;
    while (++j < size) {
      var c = magnitude[j];
      var l = -1;
      while (++l < j) {
        var tmp = performMultiplication(c, magnitude[l], groupRadix);
        var lo = tmp.lo;
        var hi = tmp.hi;
        magnitude[l] = lo;
        c = hi;
      }
      magnitude[j] = c;
    }

    while (size > 0 && magnitude[size - 1] === 0) {
      size -= 1;
    }

    return createBigInteger(size === 0 ? 0 : sign, magnitude, size, magnitude[0]);
  };

  var compareMagnitude = function (a, b) {
    if (a.length !== b.length) {
      return a.length < b.length ? -1 : +1;
    }
    var i = a.length;
    while (--i >= 0) {
      if ((a.magnitude == undefined ? a.value : a.magnitude[i]) !== (b.magnitude == undefined ? b.value : b.magnitude[i])) {
        return (a.magnitude == undefined ? a.value : a.magnitude[i]) < (b.magnitude == undefined ? b.value : b.magnitude[i]) ? -1 : +1;
      }
    }
    return 0;
  };

  var compareTo = function (x, y) {
    var a = valueOf(x);
    var b = valueOf(y);
    var c = a.sign === b.sign ? compareMagnitude(a, b) : 1;
    return a.sign === 1 ? 0 - c : c; // positive zero will be returned for c === 0
  };

  var add = function (x, y, isSubtraction) {
    var a = valueOf(x);
    var b = valueOf(y);
    var z = compareMagnitude(a, b);
    var minSign = z < 0 ? a.sign : (isSubtraction ? 1 - b.sign : b.sign);
    var minMagnitude = z < 0 ? a.magnitude : b.magnitude;
    var minLength = z < 0 ? a.length : b.length;
    var minValue = z < 0 ? a.value : b.value;
    var maxSign = z < 0 ? (isSubtraction ? 1 - b.sign : b.sign) : a.sign;
    var maxMagnitude = z < 0 ? b.magnitude : a.magnitude;
    var maxLength = z < 0 ? b.length : a.length;
    var maxValue = z < 0 ? b.value : a.value;

    // |a| <= |b|
    if (minLength === 0) {
      return createBigInteger(maxSign, maxMagnitude, maxLength, maxValue);
    }
    var subtract = 0;
    var resultLength = maxLength;
    if (minSign !== maxSign) {
      subtract = 1;
      if (minLength === resultLength) {
        while (resultLength > 0 && (minMagnitude == undefined ? minValue : minMagnitude[resultLength - 1]) === (maxMagnitude == undefined ? maxValue : maxMagnitude[resultLength - 1])) {
          resultLength -= 1;
        }
      }
      if (resultLength === 0) { // a === (-b)
        return createBigInteger(0, createArray(0), 0, 0);
      }
    }
    // result !== 0
    var result = createArray(resultLength + (1 - subtract));
    var i = -1;
    var c = 0;
    while (++i < resultLength) {
      var aDigit = i < minLength ? (minMagnitude == undefined ? minValue : minMagnitude[i]) : 0;
      c += (maxMagnitude == undefined ? maxValue : maxMagnitude[i]) + (subtract === 1 ? 0 - aDigit : aDigit - BASE);
      if (c < 0) {
        result[i] = BASE + c;
        c = 0 - subtract;
      } else {
        result[i] = c;
        c = 1 - subtract;
      }
    }
    if (c !== 0) {
      result[resultLength] = c;
      resultLength += 1;
    }
    while (resultLength > 0 && result[resultLength - 1] === 0) {
      resultLength -= 1;
    }
    return createBigInteger(maxSign, result, resultLength, result[0]);
  };

  var multiply = function (x, y) {
    var a = valueOf(x);
    var b = valueOf(y);
    if (a.length === 0 || b.length === 0) {
      return createBigInteger(0, createArray(0), 0, 0);
    }
    var resultSign = a.sign === 1 ? 1 - b.sign : b.sign;
    if (a.length === 1 && (a.magnitude == undefined ? a.value : a.magnitude[0]) === 1) {
      return createBigInteger(resultSign, b.magnitude, b.length, b.value);
    }
    if (b.length === 1 && (b.magnitude == undefined ? b.value : b.magnitude[0]) === 1) {
      return createBigInteger(resultSign, a.magnitude, a.length, a.value);
    }
    var resultLength = a.length + b.length;
    var result = createArray(resultLength);
    var i = -1;
    while (++i < b.length) {
      var c = 0;
      var j = -1;
      while (++j < a.length) {
        var carry = 0;
        c += result[j + i] - BASE;
        if (c >= 0) {
          carry = 1;
        } else {
          c += BASE;
        }
        var tmp = performMultiplication(c, a.magnitude == undefined ? a.value : a.magnitude[j], b.magnitude == undefined ? b.value : b.magnitude[i]);
        var lo = tmp.lo;
        var hi = tmp.hi;
        result[j + i] = lo;
        c = hi + carry;
      }
      result[a.length + i] = c;
    }
    while (resultLength > 0 && result[resultLength - 1] === 0) {
      resultLength -= 1;
    }
    return createBigInteger(resultSign, result, resultLength, result[0]);
  };

  var divideAndRemainder = function (x, y, isDivision) {
    var a = valueOf(x);
    var b = valueOf(y);
    if (b.length === 0) {
      throw new RangeError();
    }
    if (a.length === 0) {
      return createBigInteger(0, createArray(0), 0, 0);
    }
    var quotientSign = a.sign === 1 ? 1 - b.sign : b.sign;
    if (b.length === 1 && (b.magnitude == undefined ? b.value : b.magnitude[0]) === 1) {
      if (isDivision === 1) {
        return createBigInteger(quotientSign, a.magnitude, a.length, a.value);
      }
      return createBigInteger(0, createArray(0), 0, 0);
    }

    var divisorOffset = a.length + 1; // `+ 1` for extra digit in case of normalization
    var divisorAndRemainder = createArray(divisorOffset + b.length + 1); // `+ 1` to avoid `index < length` checks
    var divisor = divisorAndRemainder;
    var remainder = divisorAndRemainder;
    var n = -1;
    while (++n < a.length) {
      remainder[n] = a.magnitude == undefined ? a.value : a.magnitude[n];
    }
    var m = -1;
    while (++m < b.length) {
      divisor[divisorOffset + m] = b.magnitude == undefined ? b.value : b.magnitude[m];
    }

    var top = divisor[divisorOffset + b.length - 1];

    // normalization
    var lambda = 1;
    if (b.length > 1) {
      lambda = fastTrunc(BASE / (top + 1));
      if (lambda > 1) {
        var carry = 0;
        var l = -1;
        while (++l < divisorOffset + b.length) {
          var tmp = performMultiplication(carry, divisorAndRemainder[l], lambda);
          var lo = tmp.lo;
          var hi = tmp.hi;
          divisorAndRemainder[l] = lo;
          carry = hi;
        }
        divisorAndRemainder[divisorOffset + b.length] = carry;
        top = divisor[divisorOffset + b.length - 1];
      }
      // assertion
      if (top < fastTrunc(BASE / 2)) {
        throw new RangeError();
      }
    }

    var shift = a.length - b.length + 1;
    if (shift < 0) {
      shift = 0;
    }
    var quotient = undefined;
    var quotientLength = 0;

    var i = shift;
    while (--i >= 0) {
      var t = b.length + i;
      var q = BASE - 1;
      if (remainder[t] !== top) {
        var tmp2 = performDivision(remainder[t], remainder[t - 1], top);
        var q2 = tmp2.q;
        var r2 = tmp2.r;
        q = q2;
      }

      var ax = 0;
      var bx = 0;
      var j = i - 1;
      while (++j <= t) {
        var rj = remainder[j];
        var tmp3 = performMultiplication(bx, q, divisor[divisorOffset + j - i]);
        var lo3 = tmp3.lo;
        var hi3 = tmp3.hi;
        remainder[j] = lo3;
        bx = hi3;
        ax += rj - remainder[j];
        if (ax < 0) {
          remainder[j] = BASE + ax;
          ax = -1;
        } else {
          remainder[j] = ax;
          ax = 0;
        }
      }
      while (ax !== 0) {
        q -= 1;
        var c = 0;
        var k = i - 1;
        while (++k <= t) {
          c += remainder[k] - BASE + divisor[divisorOffset + k - i];
          if (c < 0) {
            remainder[k] = BASE + c;
            c = 0;
          } else {
            remainder[k] = c;
            c = +1;
          }
        }
        ax += c;
      }
      if (isDivision === 1 && q !== 0) {
        if (quotientLength === 0) {
          quotientLength = i + 1;
          quotient = createArray(quotientLength);
        }
        quotient[i] = q;
      }
    }

    if (isDivision === 1) {
      if (quotientLength === 0) {
        return createBigInteger(0, createArray(0), 0, 0);
      }
      return createBigInteger(quotientSign, quotient, quotientLength, quotient[0]);
    }

    var remainderLength = a.length + 1;
    if (lambda > 1) {
      var r = 0;
      var p = remainderLength;
      while (--p >= 0) {
        var tmp4 = performDivision(r, remainder[p], lambda);
        var q4 = tmp4.q;
        var r4 = tmp4.r;
        remainder[p] = q4;
        r = r4;
      }
      if (r !== 0) {
        // assertion
        throw new RangeError();
      }
    }
    while (remainderLength > 0 && remainder[remainderLength - 1] === 0) {
      remainderLength -= 1;
    }
    if (remainderLength === 0) {
      return createBigInteger(0, createArray(0), 0, 0);
    }
    var result = createArray(remainderLength);
    var o = -1;
    while (++o < remainderLength) {
      result[o] = remainder[o];
    }
    return createBigInteger(a.sign, result, remainderLength, result[0]);
  };

  var negate = function (x) {
    var a = valueOf(x);
    return createBigInteger(1 - a.sign, a.magnitude, a.length, a.value);
  };

  var toString = function (sign, magnitude, length, radix) {
    var result = sign === 1 ? "-" : "";

    var remainderLength = length;
    if (remainderLength === 0) {
      return "0";
    }
    if (remainderLength === 1) {
      result += magnitude[0].toString(radix);
      return result;
    }
    var groupLength = 0;
    var groupRadix = 1;
    var limit = fastTrunc(BASE / radix);
    while (groupRadix <= limit) {
      groupLength += 1;
      groupRadix *= radix;
    }
    // assertion
    if (groupRadix * radix <= BASE) {
      throw new RangeError();
    }
    var size = remainderLength + Math.trunc((remainderLength - 1) / groupLength) + 1;
    var remainder = createArray(size);
    var n = -1;
    while (++n < remainderLength) {
      remainder[n] = magnitude[n];
    }

    var k = size;
    while (remainderLength !== 0) {
      var groupDigit = 0;
      var i = remainderLength;
      while (--i >= 0) {
        var tmp = performDivision(groupDigit, remainder[i], groupRadix);
        var q = tmp.q;
        var r = tmp.r;
        remainder[i] = q;
        groupDigit = r;
      }
      while (remainderLength > 0 && remainder[remainderLength - 1] === 0) {
        remainderLength -= 1;
      }
      k -= 1;
      remainder[k] = groupDigit;
    }
    result += remainder[k].toString(radix);
    while (++k < size) {
      var t = remainder[k].toString(radix);
      var j = groupLength - t.length;
      while (--j >= 0) {
        result += "0";
      }
      result += t;
    }
    return result;
  };

  BigInteger.prototype.toString = function (radix) {
    if (radix == undefined) {
      radix = 10;
    }
    if (radix !== 10 && (radix < 2 || radix > 36 || radix !== Math.trunc(radix))) {
      throw new RangeError("radix argument must be an integer between 2 and 36");
    }
    return toString(this.sign, this.magnitude, this.length, radix);
  };

  BigInteger.parseInt = parseBigInteger;
  BigInteger.compareTo = function (x, y) {
    if (typeof x === "number" && typeof y === "number") {
      return x < y ? -1 : (y < x ? +1 : 0);
    }
    return compareTo(x, y);
  };
  BigInteger.add = function (x, y) {
    if (typeof x === "number" && typeof y === "number") {
      var value = x + y;
      if (value > -BASE && value < +BASE) {
        return value;
      }
    }
    return add(x, y, 0);
  };
  BigInteger.subtract = function (x, y) {
    if (typeof x === "number" && typeof y === "number") {
      var value = x - y;
      if (value > -BASE && value < +BASE) {
        return value;
      }
    }
    return add(x, y, 1);
  };
  BigInteger.multiply = function (x, y) {
    if (typeof x === "number" && typeof y === "number") {
      var value = 0 + x * y;
      if (value > -BASE && value < +BASE) {
        return value;
      }
    }
    return multiply(x, y);
  };
  BigInteger.divide = function (x, y) {
    if (typeof x === "number" && typeof y === "number") {
      if (y !== 0) {
        return 0 + Math.trunc(x / y);
      }
    }
    return divideAndRemainder(x, y, 1);
  };
  BigInteger.remainder = function (x, y) {
    if (typeof x === "number" && typeof y === "number") {
      if (y !== 0) {
        return 0 + x % y;
      }
    }
    return divideAndRemainder(x, y, 0);
  };
  BigInteger.negate = function (x) {
    if (typeof x === "number") {
      return 0 - x;
    }
    return negate(x);
  };

  global.BigInteger = BigInteger;

}(this));

/*jslint plusplus: true, vars: true, indent: 2 */
/*global BigInteger */

// Thanks to Eduardo Cavazos
// see also https://github.com/dharmatech/Symbolism/blob/master/Symbolism/Symbolism.cs

// public API: 
// Expression.prototype.add
// Expression.prototype.subtract
// Expression.prototype.multiply
// ...
// protected API:
// Expression.prototype.addExpression
// Expression.prototype.addInteger

(function (global) {
  "use strict";

  //TODO: rename Symbol

  var pow = function (x, count, accumulator) {
    if (count < 0) {
      throw new RangeError();
    }
    return (count < 1 ? accumulator : (2 * Math.trunc(count / 2) !== count ? pow(x, count - 1, accumulator.multiply(x)) : pow(x.multiply(x), Math.trunc(count / 2), accumulator)));
  };

  Expression.prototype.powExpression = function (x) {
    var y = this;

    //!
    if (y instanceof Division && y.a instanceof Integer && y.b instanceof Integer && y.b.compareTo(Integer.TWO) === 0) {
      //?
      return x.pow(y.a.subtract(Integer.ONE).divide(y.b)).multiply(x.squareRoot());
    }
    //!
    throw new RangeError("UserError");
  };

  Expression.prototype.compare4Addition = function (y) {
    var x = this;
    if (x instanceof Symbol && y instanceof Integer) {
      return +1;
    }
    if (x instanceof Integer && y instanceof Symbol) {
      return -1;
    }
    if (x instanceof Integer && y instanceof Integer) {
      return x.compareTo(y);
    }
    if (x instanceof Symbol && y instanceof Symbol) {
      return x.symbol < y.symbol ? -1 : (y.symbol < x.symbol ? +1 : 0);
    }
    //!
    if (x instanceof Matrix && y instanceof MatrixSymbol) {
      return +1;
    }
    if (x instanceof MatrixSymbol && y instanceof Matrix) {
      return -1;
    }
    if (x instanceof Matrix && y instanceof Matrix) {
      return 0;
    }
    
    //!new 2016-10-09
    if (x instanceof Multiplication || y instanceof Multiplication) {
      return Multiplication.compare4Addition(x, y);
    }

    //!new 2016-12-17
    if (x instanceof Addition || y instanceof Addition) {
      return Addition.compare4Addition(x, y);
    }

    //!
    throw new RangeError();
  };
  
  var compare = function (x, y) {
    return x.compare4Addition(y);
  };

  var compare4Multiplication = function (x, y) {
    //TODO: Exponentiation + Exponentiation, Exponentiation + Symbol, Symbol + Exponentiation
    return x.compare4Multiplication(y);
  };

  var getBase = function (x) {
    return x instanceof Exponentiation ? x.a : x;
  };
  var getExponent = function (x) {
    return x instanceof Exponentiation ? x.b : Integer.ONE;
  };

  var getConstant = function (x) {
    if (x instanceof Integer) {
      return x;
    } else if (x instanceof Multiplication) {
      var c = undefined;
      for (var i = x.factors(); i.value() != undefined; i = i.next()) {
        c = i.value();
      }
      if (c instanceof Integer) {
        return c;
      }
    }
    return Integer.ONE;
  };
  var getTerm = function (x) {
  // TODO: fix performance ?
    if (x instanceof Integer) {
      return undefined;
    }
    if (x instanceof Multiplication) {
      var terms = [];
      for (var i = x.factors(); i.value() != undefined; i = i.next()) {
        var t = getTerm(i.value());
        if (t != undefined) {
          terms.push(t);
        }
      }
      var result = undefined;
      for (var j = terms.length - 1; j >= 0; j -= 1) {
        result = result == undefined ? terms[j] : new Multiplication(result, terms[j]);
      }
      return result;
    }
    return x;
  };

  var multiplyByInteger = function (x, y) {
    if (x.compareTo(Integer.ZERO) === 0) {
      return x;
    }
    if (x.compareTo(Integer.ONE) === 0) {
      return y;
    }
    return new Multiplication(x, y);
  };
  
  Expression.prototype.multiplyExpression = function (x) {
    var y = this;

    //!
    if (x instanceof IdentityMatrix && y instanceof MatrixSymbol) {
      return y;
    }
    if (y instanceof IdentityMatrix && x instanceof MatrixSymbol) {
      return x;
    }
    //!
    // rest

    var c = 0;
    if (x instanceof Integer && y instanceof Symbol) {
      return multiplyByInteger(x, y);
    }
    if (x instanceof Symbol && y instanceof Integer) {
      return multiplyByInteger(y, x);
    }
    if (x instanceof Symbol && y instanceof Symbol) {
      c = compare4Multiplication(x, y);
      if (c === 0) {
        return x.pow(Integer.TWO);
      }
      return c > 0 ? new Multiplication(y, x) : new Multiplication(x, y);
    }
    if (x instanceof Integer && y instanceof Exponentiation) {
      return multiplyByInteger(x, y);
    }
    if (x instanceof Exponentiation && y instanceof Integer) {
      return multiplyByInteger(y, x);
    }
    if (x instanceof Exponentiation && y instanceof Symbol) {
      c = compare4Multiplication(getBase(x), y);
      if (c === 0) {
        return y.pow(getExponent(x).add(Integer.ONE));
      }
      return c > 0 ? new Multiplication(y, x) : new Multiplication(x, y);
    }
    if (x instanceof Symbol && y instanceof Exponentiation) {
      c = compare4Multiplication(x, getBase(y));
      if (c === 0) {
        return x.pow(getExponent(y).add(Integer.ONE));
      }
      return c > 0 ? new Multiplication(y, x) : new Multiplication(x, y);
    }
    if (x instanceof Exponentiation && y instanceof Exponentiation) {
      c = compare4Multiplication(getBase(x), getBase(y));
      if (c === 0) {
        return getBase(x).pow(getExponent(x).add(getExponent(y)));
      }
      return c > 0 ? new Multiplication(y, x) : new Multiplication(x, y);
    }
    if (x instanceof SquareRoot && y instanceof SquareRoot) {
      return x.a.multiply(y.a).squareRoot();
    }
    if (x instanceof Integer && y instanceof SquareRoot) {
      return multiplyByInteger(x, y);
    }
    if (x instanceof SquareRoot && y instanceof Integer) {
      return multiplyByInteger(y, x);
    }
    if (x instanceof Symbol && y instanceof SquareRoot) {
      return new Multiplication(y, x);
    }
    if (x instanceof SquareRoot && y instanceof Symbol) {
      return new Multiplication(x, y);
    }
    if (x instanceof Exponentiation && y instanceof SquareRoot) {
      return new Multiplication(y, x);
    }
    if (x instanceof SquareRoot && y instanceof Exponentiation) {
      return new Multiplication(x, y);
    }
    //!
    if (x instanceof MatrixSymbol && y instanceof Matrix) {
      return new Multiplication(x, y);
    }
    if (x instanceof Matrix && y instanceof MatrixSymbol) {
      return new Multiplication(x, y);
    }
    //!
    //throw new RangeError();
/*
    if (x instanceof SquareRoot && y instanceof SquareRoot) {
      return x.a.multiply(y.a).squareRoot();
    }
    */
    if (x instanceof Integer && y instanceof Expression) {
      if (x.compareTo(Integer.ZERO) === 0) {
        return x;
      }
      if (x.compareTo(Integer.ONE) === 0) {
        return y;
      }
    }
    if (x instanceof Expression && y instanceof Integer) {
      if (y.compareTo(Integer.ZERO) === 0) {
        return y;
      }
      if (y.compareTo(Integer.ONE) === 0) {
        return x;
      }
    }
    var cmp = compare4Multiplication(getBase(x), getBase(y));
    if (cmp === 0) {
      return getBase(x).pow(getExponent(x).add(getExponent(y)));
    }
    if (cmp < 0) {
      return new Multiplication(x, y);
    }
    if (cmp > 0) {
      return new Multiplication(y, x);
    }

  };

  var compare4Addition = function (x, y) {
    // undefined | Symbol | Exponentiation | Multiplication
    if (x == undefined && y == undefined) {
      return 0;
    }
    if (x == undefined) {
      return -1;
    }
    if (y == undefined) {
      return +1;
    }
    var xIterator = x.factors();
    var yIterator = y.factors();
    while (true) {
      var fx = xIterator.value();
      xIterator = xIterator.next();
      var fy = yIterator.value();
      yIterator = yIterator.next();
      if (fx == undefined && fy == undefined) {
        return 0;
      }
      if (fx == undefined) {
        return -1;
      }
      if (fy == undefined) {
        return +1;
      }

      //!
      var cmp = 0;
      if (fx instanceof SquareRoot || fy instanceof SquareRoot) {
        if (fx instanceof SquareRoot && fy instanceof SquareRoot) {
          cmp = -fx.a.compareTo(fy.a);
        } else if (/*fx instanceof Integer || */fy instanceof Symbol || fy instanceof Exponentiation) {
          cmp = -1;
        } else if (/*fy instanceof Integer || */fx instanceof Symbol || fx instanceof Exponentiation) {
          cmp = +1;
        } else {
          throw new RangeError();//?
        }
      } else {
        // x^3*y^2, x^2*y^3
        cmp = -compare(getBase(fx), getBase(fy));
        if (cmp === 0) {
          cmp = compare(getExponent(fx), getExponent(fy));
        }
      }
      if (cmp !== 0) {
        return cmp;
      }
    }
  };

  Expression.compare4AdditionXXX = compare4Addition;

  Expression.prototype.addExpression = function (x) {
    var y = this;

    // rest

    if (x instanceof Expression && y instanceof Addition) {
      return x.add(y.a).add(y.b);
    }
    if (x instanceof Addition && y instanceof Expression) {
      var c = compare4Addition(getTerm(x.b), getTerm(y));
      if (c === 0) {
        return x.a.add(x.b.add(y));
      }
      if (y.equals(Integer.ZERO)) {
        return x;
      }
      return c > 0 ? new Addition(x, y) : x.a.add(y).add(x.b);
    }

//TODO: (?)
//.add4(x, x.b, y) instead of "compare4Addition" + "getTerm" + "getConstant"
//.multiply4(x, x.b, y) instead of "compare4Multiplicaiton"
    var fxTerm = getTerm(x);
    var fyTerm = getTerm(y);
    var cmp = compare4Addition(fxTerm, fyTerm);
    if (cmp === 0) {
      var constant = getConstant(x).add(getConstant(y));
      var last = fxTerm == undefined ? constant : constant.multiply(fxTerm);
      return last;
    }
    if (cmp > 0) {
      var tmp = x;
      x = y;
      y = tmp;
    }
    if (x.equals(Integer.ZERO)) {
      return y;
    }
    //?
    if (y.equals(Integer.ZERO)) {
      return x;
    }
    return new Addition(y, x);
  };

  var checkMultivariatePolynomial = function (e, d) {
    return true;
  //TODO: FIX!!!
    if (d < 1 && e instanceof Addition) {
      return checkMultivariatePolynomial(e.a, 0) && checkMultivariatePolynomial(e.b, 1);
    }
    if (d < 2 && e instanceof Integer) {
      return true;
    }
    if (d < 2 && e instanceof Multiplication && (e.a instanceof Integer || e.a instanceof Symbol)) {
      return checkMultivariatePolynomial(e.b, 2);
    }
    if (d < 3 && e instanceof Multiplication) {
      return (e.a instanceof Symbol) && checkMultivariatePolynomial(e.b, 2);
    }
    if (d < 4 && e instanceof Exponentiation) {
      return (e.a instanceof Symbol) && (e.b instanceof Integer) && e.b.compareTo(Integer.ZERO) > 0;
    }
    if (e instanceof Symbol) {
      return true;
    }
    return false;
  };

  var pseudoRemainder = function (x, y, v) {
    var lcg = getLeadingCoefficient(y, v);
    var x1 = getLargestExponent(x, v).subtract(getLargestExponent(y, v)).add(Integer.ONE);
    // assertion
    if (x1.compareTo(Integer.ONE) < 0) {
      throw new RangeError();
    }
    x = x.multiply(lcg.pow(x1));
    return divideAndRemainder(x, y, v).remainder;
  };

  var divideAndRemainderInternal = function (x, y, v) {
    if (y.equals(Integer.ZERO)) {
      throw new RangeError("ArithmeticException");
    }
    var div = Integer.ZERO;
    var rem = x;
    var e0 = undefined;
    var e1 = undefined;
    // compareTo for Integers
    while (!rem.equals(Integer.ZERO) && (e0 = getLeadingX(rem, v)).exponent.compareTo((e1 = getLeadingX(y, v)).exponent) >= 0) {
      var n = e0.exponent.subtract(e1.exponent);

      var d = e0.coefficient.divide(e1.coefficient);
      if (d instanceof Division) {
        return undefined;
      }
      var q = d.multiply(v.pow(n));
      div = div.add(q);
      rem = rem.subtract(y.multiply(q));
    }
    return {quotient: div, remainder: rem};
  };

  var divideAndRemainder = function (x, y, v) {
    var result = divideAndRemainderInternal(x, y, v);
    if (result == undefined) {
      throw new RangeError(); // AssertionError
    }
    return result;
  };

  var divideByInteger = function (x, f) {
    if (f.equals(Integer.ZERO)) {
      throw new RangeError("ArithmeticException");
    }
    var result = Integer.ZERO;
    for (var additions = x.summands(); additions.value() != undefined; additions = additions.next()) {
      var fx = additions.value();
      var rest = Integer.ONE;
      var t = undefined;
      var multiplications = fx.factors();
      var z = undefined;
      // TODO: check, fix?
      while ((z = multiplications.value()) != undefined) {
        multiplications = multiplications.next();
        if (z instanceof Integer) {
          t = z;
        } else {
          if (rest === Integer.ONE) {
            rest = z;
          } else {
            rest = z.multiply(rest);
          }
        }
      }
      if (!(t instanceof Integer)) {
        throw new RangeError();
      }
      result = result.add(t.divide(f).multiply(rest));
    }
    return result;
  };

  // returns Expression + Integer
  var getLeadingX = function (x, v) {
    var coefficients = getCoefficients(x, v);
    return coefficients[coefficients.length - 1];
  };

  var getLeadingCoefficient = function (x, v) {
    return getLeadingX(x, v).coefficient;
  };

  // returns Integer
  var getLargestExponent = function (x, v) {
    return getLeadingX(x, v).exponent;
  };

  var getCoefficients = function (x, v) {
    var result = [];
    for (var additions = x.summands(); additions.value() != undefined; additions = additions.next()) {
      var fx = additions.value();
      var e = Integer.ZERO;
      var c = Integer.ONE;
      var multiplications = fx.factors();
      var t = undefined;
      while ((t = multiplications.value()) != undefined) {
        multiplications = multiplications.next();
        if (getBase(t).equals(v)) {
          e = e.add(getExponent(t));
        } else {
          c = c.multiply(t);
        }
      }
      var tmp = {
        coefficient: c,
        exponent: e
      };
      var k = result.length - 1;
      while (k >= 0 && tmp.exponent.compareTo(result[k].exponent) < 0) {
        k -= 1;
      }
      if (k >= 0 && tmp.exponent.compareTo(result[k].exponent) === 0) {
        result[k].coefficient = tmp.coefficient.add(result[k].coefficient);
      } else {
        result.push(tmp);
        var i = result.length - 1;
        while (i >= k + 2) {
          result[i] = result[i - 1];
          i -= 1;
        }
        result[k + 1] = tmp;
      }
    }
    if (result.length === 0) {
      //TODO: remove?
      result.push({
        coefficient: Integer.ZERO,
        exponent: Integer.ZERO
      });
    }
    return result;
  };

  Expression.getCoefficients = getCoefficients;

  //TODO: remove
  var getFirstAdditionOperand = function (x) {
    var result = x;
    while (result instanceof Addition) {
      result = result.a;
    }
    return result;
  };
  //TODO: remove
  var getLastMultiplicationOperand = function (x) {
    var result = x;
    while (result instanceof Multiplication) {
      result = result.b;
    }
    return result;
  };

  var getVariable = function (e) {
    //? square roots at first
    for (var additions = e.summands(); additions.value() != undefined; additions = additions.next()) {
      var x = additions.value();
      for (var multiplications = x.factors(); multiplications.value() != undefined; multiplications = multiplications.next()) {
        var y = multiplications.value();
        if (y instanceof SquareRoot) {
        //TODO: assert(y instanceof Integer)
          return y;
        }
      }
    }
    //?

    var result = getBase(getLastMultiplicationOperand(getFirstAdditionOperand(e)));
    //!?
    //if (result instanceof SquareRoot) {
    //  return undefined;
    //}
    //
    return result instanceof Integer ? undefined : result;
  };

  var content = function (x, v) {
    var coefficients = getCoefficients(x, v);
    var i = coefficients.length;
    var cx = undefined;
    var vcx = undefined;
    while (--i >= 0) {
      var c = coefficients[i];
      vcx = vcx == undefined ? getVariable(c.coefficient) : vcx;
      cx = cx == undefined ? c.coefficient : gcd(cx, c.coefficient, vcx);
    }
    return cx;
  };

  var pp = function (x, v) {
    var c = content(x, v);
    return divideAndRemainder(x, c, v).quotient;
  };

  var integerGCD = function (a, b) {
    if (a.compareTo(Integer.ZERO) < 0) {
      a = a.negate();
    }
    if (b.compareTo(Integer.ZERO) < 0) {
      b = b.negate();
    }
    var t = undefined;
    while (b.compareTo(Integer.ZERO) !== 0) {
      t = a.remainder(b);
      a = b;
      b = t;
    }
    return a;
  };

  // http://www-troja.fjfi.cvut.cz/~liska/ca/node33.html
  var gcd = function (a, b, v) {
    if (v == undefined) {
      if (getVariable(a) != undefined) {
      //?
        return gcd(a, b, getVariable(a));
      }
      if (getVariable(b) != undefined) {
        return gcd(a, b, getVariable(b));      
      }
      return integerGCD(getConstant(content(a, v)), getConstant(content(b, v)));
    }

    //TODO: fix (place condition for degrees earlier - ?)
    if (getLargestExponent(a, v).compareTo(getLargestExponent(b, v)) < 0) {
      //!!!
      var tmp = a;
      a = b;
      b = tmp;
    }

    var contentA = content(a, v);
    var contentB = content(b, v);
    var ppA = divideAndRemainder(a, contentA, v).quotient;
    var ppB = divideAndRemainder(b, contentB, v).quotient;
    var A = ppA;
    var B = ppB;
    while (!B.equals(Integer.ZERO)) {
      var r = pseudoRemainder(A, B, v);
      A = B;
      B = r;
    }
    return gcd(contentA, contentB, getVariable(contentA)).multiply(pp(A, v));
  };

  // ! new 21.12.2013 (square roots)
  var MultiplicationIterator = function (e) {
    this.e = e;
  };
  MultiplicationIterator.prototype.value = function () {
    if (this.e == undefined) {
      return undefined;
    }
    return this.e instanceof Multiplication ? this.e.b : this.e;
  };
  MultiplicationIterator.prototype.next = function () {
    if (this.e == undefined) {
      return undefined;
    }
    return new MultiplicationIterator(this.e instanceof Multiplication ? this.e.a : undefined);
  };

  var getConjugateFactor = function (a) {
    var p = undefined;
    for (var additions = a.summands(); additions.value() != undefined; additions = additions.next()) {
      var x = additions.value();
      var multiplications = x.factors();
      var y = undefined;
      while ((y = multiplications.value()) != undefined) {
        multiplications = multiplications.next();
        if (y instanceof SquareRoot) {
        //TODO: assert(y instanceof Integer)
          if (p == undefined) {
            p = y.a;
          } else {
            var z = integerGCD(p, y.a);
            if (z.compareTo(Integer.ONE) !== 0) {
              p = z;//!
            }
          }
        }
      }
    }
    return p;
  };

  // TODO: test
  var getConjugate = function (a) {
  //TODO: fix
  //if (true) return undefined;
    var p = getConjugateFactor(a);
    // make up - v
    if (p == undefined) {
      return undefined;
    }
    var up = Integer.ZERO;
    var v = Integer.ZERO;
    for (var additions = a.summands(); additions.value() != undefined; additions = additions.next()) {
      var x = additions.value();
      var multiplications = x.factors();
      var y = undefined;
      var ok = false;
      while ((y = multiplications.value()) != undefined) {
        multiplications = multiplications.next();
        if (y instanceof SquareRoot) {
          var z = integerGCD(p, y.a);
          if (z.compareTo(Integer.ONE) !== 0) {
            ok = true;
          }
        }
      }
      if (ok) {
        up = up.add(x);
      } else {
        v = v.add(x);
      }
    }
    return up.subtract(v);
  };

  Expression.fillLinearEquationVariablesMap = function (e, onVariable) {
    if (e instanceof Division) {
      throw new RangeError();
    }
    for (var additions = e.summands(); additions.value() != undefined; additions = additions.next()) {
      var x = additions.value();
      var multiplications = x.factors();
      var y = undefined;
      var v = undefined;
      var c = Integer.ONE;
      while ((y = multiplications.value()) != undefined) {
        multiplications = multiplications.next();
        if (y instanceof Exponentiation) {
          throw new RangeError();//?
        } else if (y instanceof Symbol) {
          if (v != undefined) {
            throw new RangeError();
          }
          v = y;
        } else {
          if (!(y instanceof Integer)) {//TODO: sqrt ?!?;
            throw new RangeError();
          }
          c = c.multiply(y);
        }
      }
      var variable = v == undefined ? "" : v.toString();
      onVariable(c, variable);
    }
  };

  var has = function (e, Class) {
    if (e instanceof Class) {
      return true;
    }
    if (e instanceof BinaryOperation) {
      return has(e.a, Class) || has(e.b, Class);
    }
    if (e instanceof Negation) {
      return has(e.b, Class);
    }
    if (e instanceof Expression.Function) {
      return has(e.a, Class);
    }
    return false;//?
  };

  Expression.prototype.divideExpression = function (x, allowConjugate) {
    allowConjugate = allowConjugate == undefined ? true : allowConjugate;
    var y = this;
    //if (Expression.getIdentityMatrixCoefficient(x) != undefined) {
    //  if (y instanceof Matrix) {
    //    return Expression.getIdentityMatrixCoefficient(x).divide(y);
    //  }
    //  return Expression.makeIdentityMatrixWithCoefficient(Expression.getIdentityMatrixCoefficient(x).divide(y));
    //}
    //if (Expression.getIdentityMatrixCoefficient(y) != undefined) {
    //  if (x instanceof Matrix) {
    //    return x.divide(Expression.getIdentityMatrixCoefficient(y));
    //  }
    //  return Expression.makeIdentityMatrixWithCoefficient(x.divide(Expression.getIdentityMatrixCoefficient(y)));
    //}

    if (has(x, IdentityMatrix)) {//?
      throw new RangeError("NotSupportedError");
    }
    //if (has(x, MatrixSymbol)) {
    //  throw new RangeError("NotSupportedError");
    //}
    if (has(y, MatrixSymbol)) {
      throw new RangeError("NotSupportedError");
    }
    /*
    if (x instanceof Multiplication && x.b instanceof IdentityMatrix) {
      return x.a.divide(y);
    } else if (x instanceof IdentityMatrix) {
      return Integer.ONE.divide(y);
    }
    if (y instanceof Multiplication && y.b instanceof IdentityMatrix) {
      return x.divide(y.a);
    } else if (y instanceof IdentityMatrix) {
      return x;
    }
    */

    if (x instanceof Matrix && y instanceof Matrix) {
      // TODO: callback ???
      return new Matrix(x.matrix.multiply(y.matrix.inverse()));
    }
    if (x instanceof Matrix && y instanceof Expression) {
      return new Matrix(x.matrix.scale(y.inverse()));
    }
    if (x instanceof Expression && y instanceof Matrix) {
      if (Expression.callback != undefined) {
        Expression.callback(new Expression.Event("inverse", y));
      }
      return new Matrix(y.matrix.inverse().scale(x));
    }

    if (y.equals(Integer.ZERO)) {
      //TODO: fix?
      throw new RangeError("ArithmeticException");
    }
    if (x.equals(Integer.ZERO)) {
      return Integer.ZERO;
    }
    if (y.equals(Integer.ONE)) {
      return x;
    }

    if (!checkMultivariatePolynomial(x, 0)) {
      throw new RangeError();
    }
    if (!checkMultivariatePolynomial(y, 0)) {
      throw new RangeError();
    }

    //!!! new (21.12.2013)
    if (allowConjugate) { //TODO: remove hack!
      var e = getConjugate(content(y, undefined));
      if (e != undefined) {
        return x.multiply(e).divide(y.multiply(e));
      }
    }

    var v = getVariable(x);//???
    //TODO: move?

    // gcd
    var g = gcd(x, y, v);

    if (!g.equals(Integer.ONE)) {
      if (v == undefined || g instanceof Integer) {
        //???
        x = divideByInteger(x, g);
        y = divideByInteger(y, g);
        return x.divide(y, false);//!!! allowConjugate
      }
      var x2 = divideAndRemainder(x, g, v).quotient;
      var y2 = divideAndRemainder(y, g, v).quotient;
      return x2.divide(y2, false);//!!! allowConjugate
    }
    
    //var lc = getConstant(getLeadingCoefficient(y, v));
    var lc = getConstant(getLeadingCoefficient(y, getVariable(y)));
    if (lc.compareTo(Integer.ZERO) < 0) {
      return x.negate().divide(y.negate(), false);//!!! allowConjugate
    }
    return new Division(x, y);
  };

  function Expression() {
    throw new Error("Do not call for better performance");
  }

  Expression.callback = undefined;
  Expression.Event = function (type, data, second) {
    second = second == undefined ? undefined : second;
    this.type = type;
    this.data = data;
    this.second = second;
  };

  Expression.prototype.compare4Multiplication = function (y) {
    throw new Error(this.toString());
  };
  Expression.prototype.compare4MultiplicationInteger = function (x) {
    throw new Error();
  };
  Expression.prototype.compare4MultiplicationSymbol = function (x) {
    throw new Error();
  };
  Expression.prototype.compare4MultiplicationSquareRoot = function (x) {
    throw new Error();
  };

  Expression.prototype.negate = function () {
    return Integer.ONE.negate().multiply(this);
  };
  Expression.prototype.add = function (y) {
    return y.addExpression(this);
  };
  Expression.prototype.subtract = function (y) {
    return this.add(y.negate());
  };
  Expression.prototype.divide = function (y, allowConjugate) {
    return y.divideExpression(this, allowConjugate);
  };
  Expression.prototype.multiply = function (y) {
    return y.multiplyExpression(this);
  };
  Expression.prototype.pow = function (y) {
    return y.powExpression(this);
  };
  Expression.prototype.getDenominator = function () {
    //TODO: FIX!!!!
    return this instanceof Division ? this.b : Integer.ONE;
  };
  Expression.prototype.getNumerator = function () {
    //TODO: FIX!!!!
    return this instanceof Division ? this.a : this;
  };
  Expression.prototype.inverse = function () {
    return Integer.ONE.divide(this);
  };
  // TODO: fix or remove ?
  Expression.prototype.gcd = function (x) {
    return gcd(this, x, getVariable(this));
  };

  //TODO: merge with Fraction.js ?!?
  var precedence = {
    binary: {
      ".^": 5,
      "^": 5,
      "*": 3,
      "/": 3,
      "+": 2,
      "-": 2
    },
    unary: {
      "-": 5//HACK
    }
  };

  function Symbol(symbol) {
    //Expression.call(this);
    this.symbol = symbol;
  }

  Symbol.prototype = Object.create(Expression.prototype);

  Symbol.prototype.compare4Multiplication = function (y) {
    return y.compare4MultiplicationSymbol(this);
  };
  Symbol.prototype.compare4MultiplicationInteger = function (x) {
    return -1;
  };
  Symbol.prototype.compare4MultiplicationSymbol = function (x) {
    return x.symbol < this.symbol ? -1 : (this.symbol < x.symbol ? +1 : 0);
  };
  Symbol.prototype.compare4MultiplicationSquareRoot = function (x) {
    return -1;
  };

  Symbol.prototype.toString = function (options) {
    return this.symbol;
  };


  Expression.prototype.addInteger = function (x) {
    return this.addExpression(x);
  };
  Expression.prototype.multiplyInteger = function (x) {
    return this.multiplyExpression(x);
  };
  Expression.prototype.divideInteger = function (x) {
    return this.divideExpression(x);
  };
  Expression.prototype.truncatingDivideInteger = function () {
    throw new Error();
  };
  Expression.prototype.remainderInteger = function () {
    throw new Error();
  };

  function Integer(value) {
    //Expression.call(this);
    this.value = value;
  }

  Integer.prototype = Object.create(Expression.prototype);
  
  Integer.prototype.powExpression = function (x) {
    var y = this;
    if (x instanceof IdentityMatrix) {
      return new IdentityMatrix(x.symbol);
    }
    if (x instanceof MatrixSymbol) {
      if (y.equals(Integer.ZERO)) {
        return Integer.ONE;
      }
      return new Exponentiation(x, y);//?
    }
    if (y.compareTo(Integer.ZERO) < 0) {
      return Integer.ONE.divide(x.pow(y.negate()));
    }
    if (x instanceof Matrix) {
      if (y.compareTo(Integer.ONE) > 0) {
        if (Expression.callback != undefined) {
          Expression.callback(new Expression.Event("pow", x, new Expression.Matrix(global.Matrix.I(1).map(function () { return y; }))));
        }
      }
      return new Matrix(pow(x.matrix, Number.parseInt(y.toString(), 10), global.Matrix.I(x.matrix.rows())));
    }
    if (y.equals(Integer.ZERO)) {
      return Integer.ONE;
    }
    if (y.equals(Integer.ONE)) {
      return x;
    }

    if (x instanceof Symbol) {
      return new Exponentiation(x, y);
    }
    if (x instanceof Exponentiation) {
      return x.a.pow(x.b.multiply(y));
    }
    // assert(x instanceof Operation || x instanceof Integer);
    return pow(x, Number.parseInt(y.toString(), 10), Integer.ONE);
  };

  Integer.prototype.compare4Multiplication = function (y) {
    return y.compare4MultiplicationInteger(this);
  };
  Integer.prototype.compare4MultiplicationInteger = function (x) {
    return this.compareToInteger(x);
    //return 0;
  };
  Integer.prototype.compare4MultiplicationSymbol = function (x) {
    return +1;
  };
  Integer.prototype.compare4MultiplicationSquareRoot = function (x) {
    return +1;
  };

  Integer.prototype.negate = function () {
    return new Integer(BigInteger.negate(this.value));
  };
  Integer.prototype.compareTo = function (y) {
    return y.compareToInteger(this);
  };
  Integer.prototype.compareToInteger = function (x) {
    return BigInteger.compareTo(x.value, this.value);
  };
  Integer.prototype.add = function (y) {
    return y.addInteger(this);
  };
  Integer.prototype.addInteger = function (x) {
    return new Integer(BigInteger.add(x.value, this.value));
  };
  Integer.prototype.multiply = function (y) {
    return y.multiplyInteger(this);
  };
  Integer.prototype.multiplyInteger = function (x) {
    return new Integer(BigInteger.multiply(x.value, this.value));
  };
  Integer.prototype.divide = function (y, allowConjugate) {
    return y.divideInteger(this, allowConjugate);
  };
  //! for performance only
  Integer.prototype.divideInteger = function (x) {
    var y = this;
    if (y.equals(Integer.ZERO)) {
      //TODO: fix?
      throw new RangeError("ArithmeticException");
    }
    var gInteger = integerGCD(x, y);
    if (y.compareTo(Integer.ZERO) < 0) {
      gInteger = gInteger.negate();
    }
    x = x.truncatingDivide(gInteger);
    y = y.truncatingDivide(gInteger);
    return y.compareTo(Integer.ONE) === 0 ? x : new Division(x, y);
  };
  Integer.prototype.truncatingDivide = function (y) {
    return y.truncatingDivideInteger(this);
  };
  Integer.prototype.truncatingDivideInteger = function (x) {
    return new Integer(BigInteger.divide(x.value, this.value));
  };
  Integer.prototype.remainder = function (y) {
    return y.remainderInteger(this);
  };
  Integer.prototype.remainderInteger = function (x) {
    return new Integer(BigInteger.remainder(x.value, this.value));
  };
  Integer.prototype.toString = function (options) {
    return this.value.toString();
  };

  Integer.parseInteger = function (s) {
    return new Integer(BigInteger.parseInt(s, 10));
  };
  Integer.ZERO = Integer.parseInteger("0");
  Integer.ONE = Integer.parseInteger("1");
  Integer.TWO = Integer.parseInteger("2");
  Integer.TEN = Integer.parseInteger("10");


  
  function Matrix(matrix) {
    //Expression.call(this);
    this.matrix = matrix;
  }

  Matrix.prototype = Object.create(Expression.prototype);
  
  Matrix.prototype.equals = function (x) {
    if (x instanceof Integer) {
      return false;//?
    }
    throw new RangeError("NotSupportedError");//?
  };
  Matrix.prototype.compare4Multiplication = function (x) {
    if (x instanceof Matrix) {
      return 0;
    }
    return +1;
  };
  Matrix.prototype.compare4MultiplicationSquareRoot = function (x) {
    return +1;
  };

  Matrix.prototype.multiply = function (y) {
    return y.multiplyMatrix(this);
  };
  Expression.prototype.multiplyMatrix = function (x) {
    var t = getIdentityMatrixCoefficient(this);
    if (t != undefined) {
      return new Matrix(x.matrix.scale(t));
    }
    //throw new RangeError("UserError");
    return this.multiplyExpression(x);
  };
  Matrix.prototype.multiplyExpression = function (x) {
    var t = getIdentityMatrixCoefficient(x);
    if (t != undefined) {
      return new Matrix(this.matrix.scale(t));
    }
    //throw new RangeError("UserError");
    return Expression.prototype.multiplyExpression.call(this, x);
  };
  Matrix.prototype.multiplyMatrix = function (x) {
    if (Expression.callback != undefined) {
      Expression.callback(new Expression.Event("multiply", x, this));
    }
    return new Matrix(x.matrix.multiply(this.matrix));
  };
  Matrix.prototype.compare4MultiplicationSymbol = function (x) {
    return +1;
  };
  //Matrix.prototype.multiplyMultiplication = Matrix.prototype.multiplyExpression;
  Matrix.prototype.multiplyDivision = Matrix.prototype.multiplyExpression;
  Matrix.prototype.add = function (y) {
    return y.addMatrix(this);
  };
  Matrix.prototype.addMatrix = function (x) {
    return new Matrix(x.matrix.add(this.matrix));
  };

  var isScalar = function (x) {
    if (x instanceof MatrixSymbol) {
      return false;
    }
    if (x instanceof Symbol || x instanceof Integer) {
      return true;
    }
    if (x instanceof BinaryOperation) {
      return isScalar(x.a) && isScalar(x.b);
    }
    if (x instanceof Negation) {
      return isScalar(x.b);
    }
    if (x instanceof Expression.Function) {
      return isScalar(x.a);
    }
    return false;//?
  };
  
  Expression.isScalar = isScalar;

  var getIdentityMatrixCoefficient = function (x) {
    var t = undefined;
    if (x instanceof Multiplication && x.b instanceof IdentityMatrix) {
      t = x.a;
    } else if (x instanceof IdentityMatrix) {
      t = Integer.ONE;
    } else if (isScalar(x)) {
      t = x;
    }
    return t;
  };

  Expression.prototype.addMatrix = function (x) {
    var t = getIdentityMatrixCoefficient(this);
    if (t != undefined) {
      //?
      if (x.matrix.rows() === x.matrix.cols()) {
        return new Matrix(global.Matrix.I(x.matrix.rows()).scale(t)).add(x);
      } else {
        throw new RangeError("NotSupportedError");
      }
    }
    //throw new RangeError("UserError");
    return this.addExpression(x);
  };
  Matrix.prototype.addExpression = function (x) {
    var t = getIdentityMatrixCoefficient(x);
    if (t != undefined) {
      //?
      if (this.matrix.rows() === this.matrix.cols()) {
        return this.add(new Matrix(global.Matrix.I(this.matrix.rows()).scale(t)));
      } else {
        throw new RangeError("NotSupportedError");
      }
    }
    //throw new RangeError("UserError");
    return Expression.prototype.addExpression.call(this, x);
  };

  Matrix.prototype.toString = function (options) {
    return this.matrix.toString(setTopLevel(true, options));
  };

  //?
  /*
  Matrix.prototype.equals = function (b) {
    var a = this;
    if (!(b instanceof Matrix)) {
      return false;
    }
    var am = a.matrix;
    var bm = b.matrix;
    if (am.rows() !== bm.rows() || am.cols() !== bm.cols()) {
      return false;
    }
    var i = -1;
    while (++i < am.rows()) {
      var j = -1;
      while (++j < bm.rows()) {
        if (am.e(i, j) !== bm.e(i, j)) {
          return false;
        }
      }
    }
    return true;
  };
  */
  //?

  function BinaryOperation(a, b) {
    //Expression.call(this);
    this.a = a;
    this.b = b;
  }

  BinaryOperation.prototype = Object.create(Expression.prototype);

  BinaryOperation.prototype.isNegation = function () {
    // TODO: What about NonSimplifiedExpression(s) ?
    //if (this instanceof Multiplication && this.a instanceof NonSimplifiedExpression && this.a.e instanceof Integer && this.a.e.equals(Integer.ONE.negate())) {
    //  return true;
    //}
    return (this instanceof Multiplication && this.a instanceof Integer && this.a.equals(Integer.ONE.negate()));
  };

  var setTopLevel = function (isTopLevel, options) {
    return options == undefined ? {isTopLevel: isTopLevel} : Object.assign({}, options, {isTopLevel: isTopLevel});
  };

  Expression.setTopLevel = setTopLevel;

  BinaryOperation.prototype.toString = function (options) {
    var a = this.a;
    var b = this.b;
    var isSubtraction = false;
    // TODO: check
    /*
    if (Expression.simplification && this instanceof Addition && Expression.isNegative(a)) {
      var tmp = b;
      b = a;
      a = tmp;
    }*/

    if (this instanceof Addition && Expression.isNegative(b)) {
      isSubtraction = true;
      b = b.negateCarefully();//?
    }
    var fa = a.getPrecedence() + (Expression.isRightToLeftAssociative(a) ? -1 : 0) < this.getPrecedence();
    var fb = this.getPrecedence() + (Expression.isRightToLeftAssociative(this) ? -1 : 0) >= b.getPrecedence();
    if (options != undefined && options.isTopLevel != undefined && options.isTopLevel === false) {
      fa = fa || a.isUnaryPlusMinus();
    }
    fb = fb || b.isUnaryPlusMinus(); // 1*-3 -> 1*(-3)
    fb = fb || (this.unwrap() instanceof Exponentiation && b.unwrap() instanceof Exponentiation); // 2^3^4
    var s = isSubtraction ? "-" : this.getS();
    //TODO: fix spaces (matrix parsing)
    if (this.isNegation()) {
      // assert(fa === false);
      return "-" + (fb ? "(" : "") + b.toString(setTopLevel(fb, options)) + (fb ? ")" : "");
    }
    return (fa ? "(" : "") + a.toString(setTopLevel(fa || options == undefined || options.isTopLevel, options)) + (fa ? ")" : "") + s + (fb ? "(" : "") + b.toString(setTopLevel(fb, options)) + (fb ? ")" : "");
  };

  //?
  Expression.prototype.unwrap = function () {
    return this;
  };

  function Exponentiation(a, b) {
    BinaryOperation.call(this, a, b);
  }

  Exponentiation.prototype = Object.create(BinaryOperation.prototype);

  function Multiplication(a, b) {
    BinaryOperation.call(this, a, b);
  }

  Multiplication.prototype = Object.create(BinaryOperation.prototype);

  Multiplication.prototype.multiply = function (y) {
    return y.multiplyMultiplication(this);
  };
  Expression.prototype.multiplyMultiplication = function (x) {
    var c = compare4Multiplication(getBase(x.b), getBase(this));
    if (c === 0) {
      return x.a.multiply(x.b.multiply(this));
    }
    return c > 0 ? x.a.multiply(this).multiply(x.b) : new Multiplication(x, this);
  };
  Multiplication.prototype.multiplyExpression = function (x) {
    return x.multiply(this.a).multiply(this.b);
  };
  Multiplication.prototype.multiplyMultiplication = Multiplication.prototype.multiplyExpression;

  function Negation(b) {
    //Expression.call(this);
    this.b = b;
  }

  Negation.prototype = Object.create(Expression.prototype);

  Expression.prototype.equalsNegation = function (x) {
    return false;
  };
  Negation.prototype.equalsNegation = function (b) {
    return this.b.equals(b.b);
  };
  Negation.prototype.equals = function (b) {
    return b.equalsNegation();
  };
  Negation.prototype.toString = function (options) {
    var b = this.b;
    var fb = this.getPrecedence() + (Expression.isRightToLeftAssociative(this) ? -1 : 0) >= b.getPrecedence();
    fb = fb || b.isUnaryPlusMinus();
    // assert(fa === false);
    return "-" + (fb ? "(" : "") + b.toString(setTopLevel(fb, options)) + (fb ? ")" : "");
  };

  function Subtraction(a, b) {
    BinaryOperation.call(this, a, b);
  }

  Subtraction.prototype = Object.create(BinaryOperation.prototype);

  Subtraction.prototype.getS = function () {
    return "-";
  };

  //

  function Addition(a, b) {
    BinaryOperation.call(this, a, b);
  }

  Addition.prototype = Object.create(BinaryOperation.prototype);
  Addition.prototype.multiply = function (y) {
    return y.multiplyAddition(this);
  };
  Expression.prototype.multiplyAddition = function (x) {
    return x.a.multiply(this).add(x.b.multiply(this));
  };
  Addition.prototype.multiplyExpression = function (x) {
    return x.multiply(this.a).add(x.multiply(this.b));
  };
  Addition.prototype.multiplyMultiplication = Addition.prototype.multiplyExpression;

  function Division(a, b) {
    BinaryOperation.call(this, a, b);
  }

  Division.prototype = Object.create(BinaryOperation.prototype);
  Division.prototype.multiply = function (y) {
    return y.multiplyDivision(this);
  };
  Expression.prototype.multiplyDivision = function (x) {
    return x.a.multiply(this).divide(x.b);
  };
  Division.prototype.multiplyExpression = function (x) {
    return x.multiply(this.a).divide(this.b);
  };
  Division.prototype.multiplyMultiplication = Division.prototype.multiplyExpression;
  Division.prototype.add = function (y) {
    return y.addDivision(this);
  };
  Expression.prototype.addDivision = function (x) {
    return x.a.add(this.multiply(x.b)).divide(x.b);
  };
  Division.prototype.addExpression = function (x) {
    return x.multiply(this.b).add(this.a).divide(this.b);
  };
  Division.prototype.divide = function (y, allowConjugate) {
    return this.a.divide(this.b.multiply(y));
  };
  Division.prototype.divideExpression = function (x, allowConjugate) {
    return x.multiply(this.b).divide(this.a);
  };

  // TODO: move
  Expression.prototype.equals = function (b) {
    throw new RangeError();//?
  };
  Expression.prototype.equalsInteger = function () {
    return false;
  };
  Integer.prototype.equals = function (y) {
    // TODO: fix
    if (y == undefined) {
      return false;
    }
    return y.equalsInteger(this);
  };
  Integer.prototype.equalsInteger = function (x) {
    return x.compareTo(this) === 0;
  };
  Symbol.prototype.equals = function (b) {
    return b instanceof Symbol && this.symbol === b.symbol;
  };
  //TODO: Matrix.prototype.equals
  BinaryOperation.prototype.equals = function (b) {
    return b instanceof BinaryOperation && this.getS() === b.getS() && this.a.equals(b.a) && this.b.equals(b.b);
  };

  function MatrixSymbol(symbol) {//TODO: only for square matrix !!!
    Symbol.call(this, symbol);
  }
  MatrixSymbol.prototype = Object.create(Symbol.prototype);

  Exponentiation.prototype.inverse = function () {
    return this.pow(Integer.ONE.negate());
  };
  MatrixSymbol.prototype.inverse = function () {//TODO: only for square matrix !!!
    return this.pow(Integer.ONE.negate());
  };
  MatrixSymbol.prototype.compare4Multiplication = function (y) {
    return y.compare4MultiplicationMatrixSymbol(this);
  };
  Expression.prototype.compare4MultiplicationMatrixSymbol = function (x) {
    return +1;
  };
  Matrix.prototype.compare4MultiplicationMatrixSymbol = function (x) {
    return x instanceof IdentityMatrix ? +1 : -1;//?
  };
  MatrixSymbol.prototype.compare4MultiplicationMatrixSymbol = function (x) {
    var c = Symbol.prototype.compare4MultiplicationSymbol.call(this, x);
    return c === +1 ? -1 : c;
  };
  MatrixSymbol.prototype.compare4MultiplicationSymbol = function (x) {
    return -1;
  };
  MatrixSymbol.prototype.equals = function (b) {
    return b instanceof MatrixSymbol && Symbol.prototype.equals.call(this, b);
  };
  //...

  Expression.MatrixSymbol = MatrixSymbol;

  function IdentityMatrix(symbol) {
    MatrixSymbol.call(this, symbol);
  }
  IdentityMatrix.prototype = Object.create(MatrixSymbol.prototype);
  IdentityMatrix.prototype.multiply = function (y) {
    return y.multiplyIdentityMatrix(this);
  };
  Expression.prototype.multiplyIdentityMatrix = function (x) {
    return this.multiplyExpression(x);
  };
  IdentityMatrix.prototype.multiplyIdentityMatrix = function (x) {
    return new IdentityMatrix(this.symbol);
  };
  IdentityMatrix.prototype.addMatrix = function (x) {
    return x.add(new Matrix(global.Matrix.I(x.matrix.rows())));
  };
  IdentityMatrix.prototype.add = function (y) {
    return y.addIdentityMatrix(this);
  };
  Expression.prototype.addIdentityMatrix = function (x) {
    return this.addExpression(x);//?
  };
  Matrix.prototype.addIdentityMatrix = function (x) {
    return new Matrix(global.Matrix.I(this.matrix.rows())).add(this);
  };

  Expression.IdentityMatrix = IdentityMatrix;

  BinaryOperation.prototype.getS = function () {
    throw new Error("abstract");
  };
  Exponentiation.prototype.getS = function () {
    return "^";
  };
  Multiplication.prototype.getS = function () {
    return "*";
  };
  Negation.prototype.getS = function () {
    return "-";
  };
  Addition.prototype.getS = function () {
    return "+";
  };
  Division.prototype.getS = function () {
    return "/";
  };

  Expression.Function = function (name, a) {
    //Expression.call(this);
    this.name = name;
    this.a = a;
  };
  Expression.Function.prototype = Object.create(Expression.prototype);
  Expression.Function.prototype.toString = function (options) {
  //?
    return this.name + "(" + this.a.toString(setTopLevel(true, options)) + ")";
  };
  Expression.Function.prototype.equals = function (b) {
    return b instanceof Expression.Function && this.name === b.name && this.a.equals(b.a);
  };

  Negation.prototype.isUnaryPlusMinus = function () {
    return true;
  };
  BinaryOperation.prototype.isUnaryPlusMinus = function () {
    return this.isNegation();
  };
  Expression.Function.prototype.isUnaryPlusMinus = function () {
    return false;//!
  };
  Expression.prototype.isUnaryPlusMinus = function () {
    return false;
  };
  Integer.prototype.isUnaryPlusMinus = function () {//?
    return this.compareTo(Integer.ZERO) < 0;
  };

  Negation.prototype.getPrecedence = function () {
    return precedence.unary["-"];
  };
  BinaryOperation.prototype.getPrecedence = function () {
    return this.isNegation() ? precedence.unary["-"] : precedence.binary[this.getS()];
  };
  Expression.Function.prototype.getPrecedence = function () {
    return precedence.unary["-"];
  };
  Expression.prototype.getPrecedence = function () {
    return 1000;
  };
  Integer.prototype.getPrecedence = function () {//?
    return this.compareTo(Integer.ZERO) < 0 ? precedence.unary["-"] : 1000;
  };



  Expression.isNegative = function (x) {
    if (x instanceof NonSimplifiedExpression) {
      //return Expression.isNegative(x.e);
      return false;
    }
    if (x instanceof Integer) {
      return x.compareTo(Integer.ZERO) < 0;
    }
    if (x instanceof Addition) {
      return Expression.isNegative(x.a) && Expression.isNegative(x.b);
    }
    if (x instanceof Multiplication) {
      return Expression.isNegative(x.a) !== Expression.isNegative(x.b);
    }
    if (x instanceof Division) {
      return Expression.isNegative(x.a) !== Expression.isNegative(x.b);
    }
    if (x instanceof Negation) {
      return !Expression.isNegative(x.a);
    }
    return false;
  };

  //TODO: remove
  Expression.prototype.negateCarefully = function () {
    if (this instanceof NonSimplifiedExpression) {
      return new NonSimplifiedExpression(this.e.negateCarefully());
    }
    if (this instanceof Integer) {
      return new Integer(BigInteger.negate(this.value));
    }
    if (this instanceof Addition) {
      return new Addition(this.a.negateCarefully(), this.b.negateCarefully());
    }
    if (this instanceof Multiplication) {
      return Expression.isNegative(this.b) ? new Multiplication(this.a, this.b.negateCarefully()) : (this.a.negateCarefully().equals(Integer.ONE) ? this.b : new Multiplication(this.a.negateCarefully(), this.b));
    }
    if (this instanceof Division) {
      return Expression.isNegative(this.b) ? new Division(this.a, this.b.negateCarefully()) : new Division(this.a.negateCarefully(), this.b);
    }
    if (this instanceof Negation) {
      return this.b;//!
    }
    return this.negate();
  };

  function SquareRoot(a) {
    Expression.Function.call(this, "sqrt", a);
  }

  SquareRoot.prototype = Object.create(Expression.Function.prototype);
  
  SquareRoot.prototype.compare4Multiplication = function (y) {
    return y.compare4MultiplicationSquareRoot(this);
  };
  SquareRoot.prototype.compare4MultiplicationInteger = function (x) {
    return -1;
  };
  SquareRoot.prototype.compare4MultiplicationSymbol = function (x) {
    return +1;
  };
  SquareRoot.prototype.compare4MultiplicationSquareRoot = function (x) {
    return 0;
  };

  SquareRoot.prototype.toString = function (options) {
    var fa = this.a.getPrecedence() < this.getPrecedence();
    return (fa ? "(" : "") + this.a.toString(setTopLevel(fa || options == undefined || options.isTopLevel, options)) + (fa ? ")" : "") + "^" + "0.5";
  };

  Expression.prototype.squareRoot = function () {
    var x = this;
    //?
    if (x instanceof Division) {
      return x.a.squareRoot().divide(x.b.squareRoot());
    }
    if (x instanceof Integer) {
      var n = x;
      if (n.compareTo(Integer.ZERO) < 0) {
        throw new RangeError("UserError");
      }
      if (n.compareTo(Integer.ZERO) === 0) {
        return x;
      }
      var t = Integer.TWO;
      var y = Integer.ONE;
      while (t.multiply(t).compareTo(n) <= 0) {
        while (n.remainder(t.multiply(t)).compareTo(Integer.ZERO) === 0) {
          n = n.truncatingDivide(t.multiply(t));
          y = y.multiply(t);
        }
        t = t.add(Integer.ONE);
      }
      if (n.compareTo(Integer.ONE) === 0) {
        return y;
      }
      if (y.compareTo(Integer.ONE) === 0) {
        return new SquareRoot(n);
      }
      return y.multiply(new SquareRoot(n));
    }
    throw new RangeError("UserError");
  };

  Expression.Rank = function (matrix) {
    Expression.Function.call(this, "rank", matrix);
  };
  Expression.Rank.prototype = Object.create(Expression.Function.prototype);

  Expression.prototype.rank = function () {
    var x = this;
    if (!(x instanceof Matrix)) {
      throw new RangeError("UserError");//?
    }
    //!
    if (Expression.callback != undefined) {
      Expression.callback(new Expression.Event("rank", x));
    }
    return Integer.parseInteger(x.matrix.rank().toString());
  };
  Expression.Determinant = function (matrix) {
    Expression.Function.call(this, "determinant", matrix);
  };
  Expression.Determinant.prototype = Object.create(Expression.Function.prototype);
  Expression.prototype.determinant = function () {
    var x = this;
    if (!(x instanceof Matrix)) {
      throw new RangeError("UserError");//?
    }
    //!
    if (Expression.callback != undefined) {
      Expression.callback(new Expression.Event(x.matrix.getDeterminantEventType("determinant").type, x));
    }
    return x.matrix.determinant();
  };
  Expression.Transpose = function (matrix) {
    Expression.Function.call(this, "transpose", matrix);
  };
  Expression.Transpose.prototype = Object.create(Expression.Function.prototype);
  Expression.prototype.transpose = function () {
    var x = this;
    if (!(x instanceof Matrix)) {
      throw new RangeError("UserError");//?
    }
    return new Matrix(x.matrix.transpose());
  };

  Expression.NoAnswerExpression = function (matrix, name, second) {
    Expression.Function.call(this, name, matrix);
    this.second = second;
  };
  Expression.NoAnswerExpression.prototype = Object.create(Expression.Function.prototype);
  //TODO: remove secondArgument (?)
  Expression.prototype.transformNoAnswerExpression = function (name, second) {
    second = second == undefined ? undefined : second;
    if (!(this instanceof Matrix)) {
      throw new RangeError("UserError");//?
    }
    if (name === "LU-decomposition") {
      if (Expression.callback != undefined) {
        Expression.callback(new Expression.Event("LU-decomposition", this));
      }
    }
    // This will add details twise
    //if (name === "analyse-compatibility") {
    //  if (Expression.callback != undefined) {
    //    Expression.callback(new Expression.Event("analyse-compatibility", this));
    //  }
    //}
    if (name === "solve") {
      if (Expression.callback != undefined) {
        Expression.callback(new Expression.Event("solve", this));
      }
    }
    return new Expression.NoAnswerExpression(this, name, second);
  };

  //Expression.NoAnswerExpression.prototype.multiplyExpression =
  //Expression.NoAnswerExpression.prototype.multiplyMatrix =
  //Expression.NoAnswerExpression.prototype.multiplySymbol =
  //Expression.NoAnswerExpression.prototype.multiplyInteger =
  Expression.NoAnswerExpression.prototype.multiply = function () {
    throw new RangeError("UserError");
  };
  
  //TODO: remove (only for second)
  Expression.NoAnswerExpression.prototype.toString = function (options) {
    if (this.second == undefined) {
      return Expression.Function.prototype.toString.call(this, options);
    }
    return this.a.toString(setTopLevel(true, options)) + " " + this.name + " " + this.second.toString(setTopLevel(true, options));
  };


  Expression.ElementWisePower = function (a, b) {
    BinaryOperation.call(this, a, b);
  };
  Expression.ElementWisePower.prototype = Object.create(BinaryOperation.prototype);
  Expression.ElementWisePower.prototype.getS = function () {
    return ".^";
  };
  Expression.prototype.elementWisePower = function (e) {
    if (!(this instanceof Matrix)) {
      throw new RangeError("UserError");//?
    }
    return new Matrix(this.matrix.map(function (element, i, j) {
      return element.pow(e);
    }));
  };

  Expression.isRightToLeftAssociative = function (x) {
    if (x instanceof NonSimplifiedExpression) {
      return Expression.isRightToLeftAssociative(x.e);
    }
    if (x instanceof Integer) {
      return x.compareTo(Integer.ZERO) < 0;
    }
    if (x instanceof Negation) {
      return true;
    }
    if (x instanceof BinaryOperation) {
      if (x.isNegation()) {
        return true;
      }
      return x instanceof Exponentiation;
    }
    return false;
  };

  var everySimpleDivisorInteger = function (n, callback) {
    if (n.compareTo(Integer.ZERO) < 0) {
      n = n.negate();
    }
    var d = Integer.TWO;
    var step = Integer.ONE;
    while (n.compareTo(Integer.ONE) > 0) {
      while (n.remainder(d).compareTo(Integer.ZERO) === 0) {
        n = n.truncatingDivide(d);
        if (!callback(d)) {
          return false;
        }
      }
      d = d.add(step);
      step = Integer.TWO;
      if (d.multiply(d).compareTo(n) > 0) {
        d = n;
      }
    }
    return true;
  };

  //?
  Expression.everySimpleDivisor = function (e, callback) {
    if (e instanceof Matrix) {
      throw new RangeError();
    }
    e = e.getNumerator();//?
    var v = getVariable(e);
    if (v != undefined) {
      var c = content(e, v);
      if (!c.equals(Integer.ONE) && !Expression.everySimpleDivisor(c, callback)) {
        return false;
      }
      //?

      e = pp(e, v);

      //?
      if (e.equals(v) || e.negate().equals(v)) {//???
        if (!callback(v)) {
          return false;
        }
        return true;
      }

      var coefficients = getCoefficients(e, v);
      var an = coefficients[coefficients.length - 1].coefficient;
      var a0 = coefficients[0].coefficient;

      var flag = Expression.everyDivisor(a0, function (p) {
        return Expression.everyDivisor(an, function (q) {
          // calcAt(p.divide(q), coefficients)
          var s = 2;
          var f = p.divide(q);
          while (--s >= 0) {
            if (s === 0) {
              f = f.negate();
            }

            //var x = v.subtract(f);
            var x = s === 0 ? v.multiply(q).subtract(p) : v.multiply(q).add(p);

            var z = divideAndRemainderInternal(e, x, v);
            while (z != undefined && z.remainder.equals(Integer.ZERO)) {
              e = z.quotient;
              if (!callback(x)) {
                return false;
              }
              z = divideAndRemainderInternal(e, x, v);
            }

          }
          return true;
        });
      });
      if (!flag) {
        return false;
      }
      if (!e.equals(Integer.ONE.negate())) {//?
        if (!e.equals(Integer.ONE)) {
          return callback(e);
        }
      }
    } else {
      if (e instanceof Symbol) {
        if (!callback(Integer.ONE)) {
          return false;
        }
        if (!callback(e)) {
          return false;
        }
      } else if (e instanceof Integer) {
        return everySimpleDivisorInteger(e, callback);
      } else {
        throw new RangeError();//?
      }
    }
    return true;
  };

  Expression.everyDivisor = function (e, callback) {
    var divisors = [];
    if (!callback(Integer.ONE)) {
      return false;
    }
    return Expression.everySimpleDivisor(e, function (d) {
      var l = divisors.length;
      var n = 1;
      var k = -1;
      while (++k < l) {
        n *= 2;
      }
      var i = -1;
      while (++i < n) {
        var z = d;
        var j = -1;
        var x = i;
        while (++j < l) {
          var half = Math.trunc(x / 2);
          if (2 * half !== x) {
            z = z.multiply(divisors[j]);
          }
          x = half;
        }
        if (!callback(z)) {
          return false;
        }
      }
      divisors.push(d);
      return true;
    });
  };

  Expression.getDivisors = function (e) {
    var divisors = [];
    Expression.everyDivisor(e, function (d) {
      divisors.push(d);
      return true;
    });
    return divisors;
  };

  Expression.Integer = Integer;
  Expression.Symbol = Symbol;
  Expression.Matrix = Matrix;
  Expression.SquareRoot = SquareRoot;
  Expression.Negation = Negation;
  Expression.Subtraction = Subtraction;
  Expression.BinaryOperation = BinaryOperation;
  Expression.Exponentiation = Exponentiation;
  Expression.Multiplication = Multiplication;
  Expression.Addition = Addition;
  Expression.Division = Division;
  Expression.pow = pow;

  global.Expression = Expression;

  // --- 


  function ExpressionFactory() {
  }
  ExpressionFactory.parseInteger = function (s) {
    return Expression.Integer.parseInteger(s);
  };
  ExpressionFactory.createMatrix = function (x) {
    return new Expression.Matrix(x);
  };
  ExpressionFactory.createSymbol = function (x) {
    if (x === "I" || x === "U" || x === "E" ) {
      //if (!Expression.isDebugging) {
      //  throw new RangeError("NotSupportedError");
      //}
      return new Expression.IdentityMatrix(x);
    }
    return new Expression.Symbol(x);
  };
  ExpressionFactory.ZERO = Expression.Integer.ZERO;
  ExpressionFactory.ONE = Expression.Integer.ONE;
  ExpressionFactory.TWO = Expression.Integer.TWO;
  ExpressionFactory.TEN = Expression.Integer.TEN;

  
  Expression.Equality = function (a, b) {
    BinaryOperation.call(this, a, b);
  };

  Expression.Equality.prototype = Object.create(BinaryOperation.prototype);
  Expression.Equality.prototype.getS = function () {
    return "=";
  };

  var AdditionIterator = function (e) {
    this.e = e;
  };
  AdditionIterator.prototype.value = function () {
    if (this.e == undefined) {
      return undefined;
    }
    return this.e instanceof Addition ? this.e.b : this.e;
  };
  AdditionIterator.prototype.next = function () {
    if (this.e == undefined) {
      return undefined;
    }
    return new AdditionIterator(this.e instanceof Addition ? this.e.a : undefined);
  };

  Expression.prototype.summands = function () {
    return new AdditionIterator(this);
  };

  Expression.prototype.factors = function () {
    return new MultiplicationIterator(this);
  };
  
  var splitX = function (e) {
    var scalar = undefined;
    var l = undefined;
    var r = undefined;
    var i = e.summands();
    var summand = undefined;
    while ((summand = i.value()) != undefined) {
      i = i.next();
      var j = summand.factors();
      var factor = undefined;
      var state = 0;
      while ((factor = j.value()) != undefined) {
        j = j.next();
        if (!(factor instanceof Integer) && !(factor instanceof Symbol) && !(factor instanceof Matrix)) {
          throw new RangeError("NotSupportedError");
        }
        var s = factor instanceof Symbol ? factor.toString() : "";
        if (s === "X") {
          state = 1;
        } else {
          if (isScalar(factor)) {
            scalar = scalar == undefined ? factor: factor.multiply(scalar);
          } else {
            if (state === 0) {
              l = l == undefined ? factor : factor.multiply(l);
            }
            if (state === 1) {
              r = r == undefined ? factor : factor.multiply(r);
            }
          }
        }
      }
    }
    scalar = scalar == undefined ? Integer.ONE : scalar;
    return {s: scalar, l: l, r: r};
  };
  var groupX = function (a, b) {
    var tmp1 = splitX(a);
    var tmp2 = splitX(b);
    var s1 = tmp1.s;
    var l1 = tmp1.l;
    var r1 = tmp1.r;
    var s2 = tmp2.s;
    var l2 = tmp2.l;
    var r2 = tmp2.r;
    if (r1 == undefined && r2 == undefined) {
      l1 = l1 == undefined ? new IdentityMatrix("I") : l1;
      l2 = l2 == undefined ? new IdentityMatrix("I") : l2;
      return new Multiplication(s1.multiply(l1).add(s2.multiply(l2)), new Symbol("X"));
    }
    if (l1 == undefined && l2 == undefined) {
      r1 = r1 == undefined ? new IdentityMatrix("I") : r1;
      r1 = r1 == undefined ? new IdentityMatrix("I") : r1;
      return new Multiplication(new Symbol("X"), s1.multiply(r1).add(s2.multiply(r2)));
    }
    throw new RangeError("NotSupportedError");
  };

  //?
  var getExpressionWithX = function (e) {
    var withX = undefined;
    var withoutX = undefined;
    var i = e.summands();
    var summand = undefined;
    while ((summand = i.value()) != undefined) {
      i = i.next();
      var j = summand.factors();
      var hasX = false;
      var factor = undefined;
      while ((factor = j.value()) != undefined) {
        j = j.next();
        var factorBase = getBase(factor);
        if (!(factorBase instanceof Integer) && !(factorBase instanceof Symbol)) {
          if (!(factorBase instanceof Matrix)) {//?
            throw new RangeError("NotSupportedError");
          }
        }
        if (factorBase instanceof Symbol) {
          var s = factorBase.toString();
          if (s === "X") {
            if (hasX) {
              throw new RangeError("NotSupportedError");
            }
            hasX = true;
          }
        }
      }
      if (hasX) {
        if (withX != undefined) {
          withX = groupX(withX, summand);
          //throw new RangeError("NotSupportedError");
        } else {
          withX = summand;
        }
      }
      if (!hasX) {
        withoutX = withoutX == undefined ? summand.negate() : withoutX.subtract(summand);
      }
    }
    return {withX: withX, withoutX: withoutX};
  };

  // TODO: NotSupportedError
  Expression.prototype.transformEquality = function (b) {
    var e = this.subtract(b);
    var tmp = getExpressionWithX(e);
    var withX = tmp.withX;
    var withoutX = tmp.withoutX;
    if (withX == undefined) {
      throw new RangeError("NotSupportedError");
    }

    if (withoutX == undefined) {
      withoutX = Integer.ZERO;//?
    }
    if (global.console != undefined) {
      global.console.log(withX.toString() + "=" + withoutX.toString());
    }

    var left = withX;
    var right = withoutX;

    var isToTheLeft = false;
    var j = withX.factors();
    var factor = undefined;
    while ((factor = j.value()) != undefined) {
      j = j.next();
      var factorBase = getBase(factor);
      //if (!(factorBase instanceof Integer) && !(factorBase instanceof Symbol)) {
      //  if (!(factorBase instanceof Matrix)) {//?
      //    throw new RangeError("NotSupportedError");
      //  }
      //}
      var isX = false;
      if (factorBase instanceof Symbol) {
        var s = factorBase.toString();
        if (s === "X") {
          isX = true;
          isToTheLeft = true;
        }
      }
      if (!isX) {
        var f = factor.inverse();
        //if (global.console != undefined) {
        //  global.console.log(isToTheLeft, f.toString());
        //}
        if (isToTheLeft) {
          right = f.multiply(right);
          //left = f.multiply(left);
        } else {
          right = right.multiply(f);
          //left = left.multiply(f);
        }
      } else {
        left = factor;
      }
    }

    if (global.console != undefined) {
      global.console.log(left.toString() + "=" + right.toString());
    }

    return new Expression.Equality(left, right);
  };

  global.ExpressionFactory = ExpressionFactory;

  Expression.listSeparator = ", ";

  Expression.simplifications = [];
  Expression.prototype.simplifyExpression = function () {
    var e = this;
    for (var i = 0; i < Expression.simplifications.length; i += 1) {
      e = Expression.simplifications[i](e);
    }
    return e;
  };

}(this));

/*global Expression*/

(function () {
  "use strict";

  function GF2(a) {
    this.a = a;
  }
  GF2.prototype = Object.create(Expression.prototype);
  
  Expression.GF2 = GF2;
  Expression.GF2.prototype.toString = function (options) {
    return "GF2(" + this.a.toString(Expression.setTopLevel(true, options)) + ")";
  };
  Expression.GF2.prototype.toMathML = function (options) {
    return this.a.toMathML(options);
  };

  function GF2Value(value) {
    //Expression.call(this);
    this.value = value;
  }
  Expression.GF2Value = GF2Value;

  GF2Value.prototype = Object.create(Expression.prototype);
  Expression.GF2Value.prototype.equals = function (b) {
    if (Expression.Integer.ZERO === b) {
      return this.value === 0;//!
    }
    return false;//?
  };
  Expression.GF2Value.prototype.negate = function () {
    return new GF2Value(this.value === 0 ? 0 : 2 - this.value);
  };

  GF2Value.prototype.add = function (x) {
    if (x === Expression.Integer.ZERO) {
      return new GF2Value(this.value);
    }
    if (!(x instanceof GF2Value)) {
      throw new RangeError();
    }
    var v = this.value - 2 + x.value;
    return new GF2Value(v >= 0 ? v : v + 2);
  };
  
  GF2Value.prototype.multiply = function (x) {
    if (x === Expression.Integer.ZERO) {
      return new GF2Value(0);
    }
    if (!(x instanceof GF2Value)) {
      throw new RangeError();
    }
    var v = this.value * x.value;
    return new GF2Value(v - 2 * Math.trunc(v / 2));
  };
  
  GF2Value.prototype.divide = function (x) {
    //if (!(x instanceof GF2Value)) {
    //  throw new RangeError();
    //}
    return new GF2Value(this.value);
  };

  Expression.prototype.GF2 = function () {
    var x = this;
    if (!(x instanceof Expression.Matrix)) {
      throw new RangeError("UserError");//?
    }
    return new Expression.Matrix(x.matrix.map(function (e, i, j) {
      return new Expression.GF2Value(e.equals(Expression.Integer.ZERO) ? 0 : 1);
    }));
  };

  GF2Value.prototype.toString = function (options) {
    return this.value.toString();
  };

  Expression.GF2Value.prototype.toMathML = function (options) {
    return "<mrow>" + "<mn>" + this.value.toString() + "</mn>" + "</mrow>";
  };

}());

/*global Expression, Polynom*/

(function () {
"use strict";

  var Integer = Expression.Integer;
  var Symbol = Expression.Symbol;
  var Addition = Expression.Addition;
  var Multiplication = Expression.Multiplication;
  var Division = Expression.Division;
  var Exponentiation = Expression.Exponentiation;
  var BinaryOperation = Expression.BinaryOperation;

/*

Expression.Function.prototype.multiply = function (y) {
  if (this instanceof Expression.SquareRoot) {
    return Expression.prototype.multiply.call(this, y);
  }
  return new Expression.Multiplication(this, y);
};

Expression.Function.prototype.multiplyExpression = function (x) {
  if (this instanceof Expression.SquareRoot) {
    return Expression.prototype.multiplyExpression.call(this, x);
  }
  return new Expression.Multiplication(x, this);
};

*/

var separateSinCos = function (e) {
  if (!(e instanceof Multiplication)) {
    throw new Error();
  }
  var sinCos = undefined;
  var other = undefined;
  for (var i = e.factors(); i.value() != undefined; i = i.next()) {
    var v = i.value();
    if (v instanceof Sin || v instanceof Cos || 
        (v instanceof Exponentiation && (v.a instanceof Sin || v.a instanceof Cos))) {
      sinCos = sinCos == undefined ? v : sinCos.multiply(v);
    } else {
      other = other == undefined ? v : other.multiply(v);
    }
  }
  return {
    sinCos: sinCos == undefined ? Integer.ONE : sinCos,
    other: other == undefined ? Integer.ONE : other
  };
};

var expandMainOp = function (u) {
  return u;
};

var contractTrigonometryInternal = function (a, b) {
  // sin(a) * sin(b) = (cos(a - b) - cos(a + b)) / 2
  // sin(a) * cos(b) = (sin(a - b) + sin(a + b)) / 2
  // cos(a) * sin(b) = (sin(a + b) - sin(a - b)) / 2
  // cos(a) * cos(b) = (cos(a - b) + cos(a + b)) / 2
  var ax = a.a;
  var bx = b.a;
  if (a instanceof Sin && b instanceof Sin) {
    return ax.subtract(bx).cos().divide(Integer.TWO).subtract(ax.add(bx).cos().divide(Integer.TWO));
  }
  if (a instanceof Cos && b instanceof Cos) {
    return ax.add(bx).cos().divide(Integer.TWO).add(ax.subtract(bx).cos().divide(Integer.TWO));
  }
  if (a instanceof Sin && b instanceof Cos) {
    return ax.add(bx).sin().divide(Integer.TWO).add(ax.subtract(bx).sin().divide(Integer.TWO));
  }
  if (a instanceof Cos && b instanceof Sin) {
    return ax.add(bx).sin().divide(Integer.TWO).subtract(ax.subtract(bx).sin().divide(Integer.TWO));
  }
  throw new Error();
};

// page 306
var contractTrigonometryPower = function (u) {
  var b = u.a;
  if (!(b instanceof Sin) && !(b instanceof Cos)) {
    return u;
  }
  var e = contractTrigonometryInternal(b, b).multiply(u.divide(b.multiply(b)));
  return contractTrigonometryRules(e.getNumerator()).divide(e.getDenominator());
};

// page 318
var contractTrigonometryProduct = function (u) {
  var i = u.factors();
  var a = i.value();
  i = i.next();
  var b = i.value();
  i = i.next();
  var rest = i == undefined || i.e == undefined ? Integer.ONE : i.e;//TODO: fix
  
  if (a instanceof Exponentiation) {
    a = contractTrigonometryPower(a);
    return contractTrigonometryRules(a.multiply(b).multiply(rest));
  }
  if (b instanceof Exponentiation) {
    b = contractTrigonometryPower(b);
    return contractTrigonometryRules(a.multiply(b).multiply(rest));
  }
  // (a instanceof Sin || a instanceof Cos) && (b instanceof Sin || b instanceof Cos)
  var c = contractTrigonometryInternal(a, b);

  return contractTrigonometryRules(c.multiply(rest));
};

// page 317
var contractTrigonometryRules = function (u) {
  var v = expandMainOp(u);
  if (v instanceof Exponentiation) {
    return contractTrigonometryPower(v);
  }
  if (v instanceof Multiplication) {
    var tmp = separateSinCos(v);
    var c = tmp.other;
    var d = tmp.sinCos;
    if (d.equals(Integer.ONE)) {
      return v;
    }
    if (d instanceof Sin || d instanceof Cos) {
      return v;
    }
    if (d instanceof Exponentiation) {
      return expandMainOp(c.multiply(contractTrigonometryPower(d)));
    }
    if (d instanceof Multiplication) {
      return expandMainOp(c.multiply(contractTrigonometryProduct(d)));
    }
    throw new Error();
  }
  if (v instanceof Addition) {
    var s = Integer.ZERO;
    for (var i = v.summands(); i.value() != undefined; i = i.next()) {
      var y = i.value();
      if (y instanceof Multiplication || y instanceof Exponentiation) {
        s = s.add(contractTrigonometryRules(y));
      } else {
        s = s.add(y);
      }
    }
    return s;
  }
  return v;
};

var map = function (f, u) {
  if (u instanceof Integer) {
    return f(u);
  }
  if (u instanceof Addition) {
    return f(u.a).add(f(u.b));
  }
  if (u instanceof Multiplication) {
    return f(u.a).multiply(f(u.b));
  }
  if (u instanceof Division) {
    return f(u.a).divide(f(u.b));
  }
  if (u instanceof Exponentiation) {
    return f(u.a).pow(f(u.b));
  }
  if (u instanceof Sin) {
    return f(u.a).sin();
  }
  if (u instanceof Cos) {
    return f(u.a).cos();
  }
  if (u instanceof Expression.Matrix) {
    return new Expression.Matrix(u.matrix.map(function (e, i, j) {
      return map(f, e);
    }));
  }
  if (u instanceof Polynom) {
    return u.map(f);
  }
  if (u instanceof Expression.GF2Value) {
    return u;
  }
  if (u instanceof Expression.SquareRoot) {
    return u;
  }
  if (u instanceof Expression.Negation) {
    return u;//?
  }
  throw new Error();
};

// page 303

var expandTrigonometryRulesCosInternal = function (a, b) {
  return expandTrigonometryRulesCos(a).multiply(expandTrigonometryRulesCos(b)).subtract(expandTrigonometryRulesSin(a).multiply(expandTrigonometryRulesSin(b)));
};

var expandTrigonometryRulesCos = function (A) {
  // cos(a + b) = cos(a) * cos(b) - sin(a) * sin(b)
  if (A instanceof Addition) {
    return expandTrigonometryRulesCosInternal(A.a, A.b);
  } else if (A instanceof Multiplication) {
    var a = A.a;
    var b = A.b;
    if (!(a instanceof Integer)) {
      throw new Error();
    }
    if (a.compareTo(Integer.ONE.negate()) === 0) {
      return expandTrigonometryRulesCos(b);
    }
    var c = a.compareTo(Integer.ZERO) > 0 ? Integer.ONE : Integer.ONE.negate();
    return expandTrigonometryRulesCosInternal(c.multiply(b), a.subtract(c).multiply(b));
  }
  if (A instanceof Symbol) {
    return A.cos();
  }
  throw new Error();
};

var expandTrigonometryRulesSinInternal = function (a, b) {
  return expandTrigonometryRulesSin(a).multiply(expandTrigonometryRulesCos(b)).add(expandTrigonometryRulesCos(a).multiply(expandTrigonometryRulesSin(b)));
};

var expandTrigonometryRulesSin = function (A) {
  // sin(a + b) = sin(a) * cos(b) + cos(a) * sin(b)
  if (A instanceof Addition) {
    return expandTrigonometryRulesSinInternal(A.a, A.b);
  } else if (A instanceof Multiplication) {
    var a = A.a;
    var b = A.b;
    if (!(a instanceof Integer)) {
      throw new Error();
    }
    if (a.compareTo(Integer.ONE.negate()) === 0) {
      return expandTrigonometryRulesSin(b).negate();
    }
    var c = a.compareTo(Integer.ZERO) > 0 ? Integer.ONE : Integer.ONE.negate();
    return expandTrigonometryRulesSinInternal(c.multiply(b), a.subtract(c).multiply(b));
  }
  if (A instanceof Symbol) {
    return A.sin();
  }
  throw new Error();
};

// CA and SC, EA, p. 303

var expandTrigonometry = function (u) {
  if (u instanceof Integer || u instanceof Symbol) {
    return u;
  }
  var v = map(expandTrigonometry, u);
  if (v instanceof Sin) {
    return expandTrigonometryRulesSin(v.a);
  }
  if (v instanceof Cos) {
    return expandTrigonometryRulesCos(v.a);
  }
  return v;
};

var contractTrigonometry = function (u) {
  if (u instanceof Integer || u instanceof Symbol) {
    return u;
  }
  var v = map(contractTrigonometry, u);
  if (v instanceof Division) {//
    return contractTrigonometry(v.getNumerator()).divide(v.getDenominator());
  }
  if (v instanceof Multiplication || v instanceof Exponentiation || v instanceof Addition) {//! Addition - ?
    return contractTrigonometryRules(v);
  }
  if (v instanceof Cos || v instanceof Sin) {
    return v;
  }
  if (v instanceof Integer) {
    return v;
  }
  return v;//?
  //throw new Error();
};

// page 323

var hasTrigonometry = function (e) {//TODO: remove
  if (e instanceof BinaryOperation) {
    return hasTrigonometry(e.a) || hasTrigonometry(e.b);
  }
  return e instanceof Cos || e instanceof Sin;
};

var simplifyTrigonometry = function (u) {
  if (!hasTrigonometry(u)) {
    return u;
  }
  var n = expandTrigonometry(u.getNumerator());
  n = contractTrigonometry(n);
  var d = expandTrigonometry(u.getDenominator());
  d = contractTrigonometry(d);
  return n.divide(d);
};

Expression.simplifyTrigonometry = simplifyTrigonometry;//?

//?
Expression.Multiplication.prototype.compare4Addition = function (y) {
  return Expression.compare4AdditionXXX(this, y);
};

Expression.Multiplication.prototype.compare4Multiplication = function (y) {
  var x = this;
  var i = x.factors();
  var j = y.factors();
  while (i.value() != undefined && j.value() != undefined) {
    var a = i.value();
    i = i.next();
    var b = j.value();
    j = j.next();
    var c = a.compare4Multiplication(b);
    if (c !== 0) {
      return c;
    }
  }
  return i.value() != undefined ? +1 : (j.value() != undefined ? -1 : 0);
};

Expression.Multiplication.compare4Addition = function (x, y) {
  var i = x.factors();
  var j = y.factors();
  while (i.value() != undefined && j.value() != undefined) {
    var a = i.value();
    i = i.next();
    var b = j.value();
    j = j.next();
    var c = a.compare4Addition(b);
    if (c !== 0) {
      return c;
    }
  }
  return i.value() != undefined ? +1 : (j.value() != undefined ? -1 : 0);
};


// cos(2 * x) * cos(x)
Expression.Multiplication.prototype.compare4MultiplicationSymbol = function (x) {
  return 0 - this.compare4Multiplication(x);
};

Expression.Function.prototype.compare4Addition = function (y) {
  if (y instanceof Expression.Function) {
    return this.name < y.name ? -1 : (y.name < this.name ? +1 : this.a.compare4Addition(y.a));
  }
  return +1;
};

Symbol.prototype.compare4Addition = function (y) {
  if (y instanceof Expression.Function) {
    return -1;
  }
  return Expression.prototype.compare4Addition.call(this, y);
};

Expression.Function.prototype.compare4Multiplication = function (y) {
  if (y instanceof Expression.Function) {
    return this.name < y.name ? -1 : (y.name < this.name ? +1 : this.a.compare4Multiplication(y.a));
  }
  return +1;
};

Expression.Function.prototype.compare4MultiplicationInteger = function (x) {
  return 0 - this.compare4Multiplication(x);
};

Expression.Function.prototype.compare4MultiplicationSymbol = function (x) {
  return -1;//?
};

Expression.Function.prototype.pow = function (y) {
  if (this instanceof Expression.SquareRoot) {
    return Expression.prototype.pow.call(this, y);
  }
  if (y instanceof Expression.Integer) {
    if (y.compareTo(Expression.Integer.ONE) > 0) {
      return new Expression.Exponentiation(this, y);
    }
    return Expression.prototype.pow.call(this, y);
  }
  throw new RangeError("NotSupportedError");
};

function Sin(x) {
  Expression.Function.call(this, "sin", x);
}
Sin.prototype = Object.create(Expression.Function.prototype);

var isArgumentValid = function (x) {
  if (!(Expression.isScalar(x) && x instanceof Symbol) &&
      !(x instanceof Multiplication && x.a instanceof Integer && Expression.isScalar(x.b) && x.b instanceof Symbol) &&
      !(x instanceof Addition && isArgumentValid(x.a) && isArgumentValid(x.b))) {
    return false;
  }
  return true;
};

Expression.prototype.sin = function () {
  var x = this;
  if (x instanceof Integer) {
    if (x.compareTo(Integer.ZERO) === 0) {
      return Integer.ZERO;
    }
    throw new RangeError("NotSupportedError");
  }
  if (!isArgumentValid(x)) {
    throw new RangeError("NotSupportedError");
  }
  if (Expression.isNegative(x) || (x instanceof Addition && Expression.isNegative(x.a))) {
    return new Sin(x.negate()).negate();
  }
  return new Sin(x);
};

function Cos(x) {
  Expression.Function.call(this, "cos", x);
}
Cos.prototype = Object.create(Expression.Function.prototype);

Expression.prototype.cos = function () {
  var x = this;
  if (x instanceof Integer) {
    if (x.compareTo(Integer.ZERO) === 0) {
      return Integer.ONE;
    }
    throw new RangeError("NotSupportedError");
  }
  if (!isArgumentValid(x)) {
    throw new RangeError("NotSupportedError");
  }
  if (Expression.isNegative(x) || (x instanceof Addition && Expression.isNegative(x.a))) {
    return new Cos(x.negate());
  }
  return new Cos(x);
};

Expression.simplifications.push(simplifyTrigonometry);

Expression.Sin = Sin;
Expression.Cos = Cos;

//Expression.Negation.prototype.compare4Multiplication = function (y) {
//TODO: fix, more tests
//  return new Expression.Multiplication(Expression.Integer.ONE.negate(), this.a).compare4Multiplication(y);
//};

Expression.Addition.prototype.compare4Addition = function (y) {
  // cos(a + b) + cos(a + b)
  var x = this;
  return Expression.Addition.compare4Addition(x, y);
};

//!!!
Expression.Addition.prototype.compare4Multiplication = function (y) {
  var x = this;
  var i = x.summands();
  var j = y.summands();
  while (i.value() != undefined && j.value() != undefined) {
    var a = i.value();
    i = i.next();
    var b = j.value();
    j = j.next();
    var c = a.compare4Multiplication(b);
    if (c !== 0) {
      return c;
    }
  }
  return i.value() != undefined ? +1 : (j.value() != undefined ? -1 : 0);
};

Expression.Addition.prototype.compare4MultiplicationSymbol = function (x) {
  return 0 - this.compare4Multiplication(x);
};

Expression.Addition.compare4Addition = function (x, y) {
  var i = x.summands();
  var j = y.summands();
  while (i.value() != undefined && j.value() != undefined) {
    var a = i.value();
    i = i.next();
    var b = j.value();
    j = j.next();
    var c = a.compare4Addition(b);
    if (c !== 0) {
      return c;
    }
  }
  return i.value() != undefined ? +1 : (j.value() != undefined ? -1 : 0);
};

//!!!

}());

/*global Expression*/

(function (global) {
  "use strict";

  var idCounter = 0;

  function NonSimplifiedExpression(e, position, length, input) {
    //Expression.call(this);
    this.e = e;
    this.position = position == undefined ? -1 : position;
    this.length = length == undefined ? -1 : length;
    this.input = input == undefined ? "" : input;
    this.id = (idCounter += 1);
  }

  NonSimplifiedExpression.prototype = Object.create(Expression.prototype);
  
  // same set of public properties (and same order) as for Expressions ... 
  NonSimplifiedExpression.prototype.negate = function () {
    return new NonSimplifiedExpression(new Expression.Negation(this));
  };
  NonSimplifiedExpression.prototype.add = function (y) {
    return new NonSimplifiedExpression(new Expression.Addition(this, y));
  };
  NonSimplifiedExpression.prototype.subtract = function (y) {
    return new NonSimplifiedExpression(new Expression.Subtraction(this, y));
  };
  NonSimplifiedExpression.prototype.divide = function (y, allowConjugate) {
    return new NonSimplifiedExpression(new Expression.Division(this, y));
  };
  NonSimplifiedExpression.prototype.multiply = function (y) {
    return new NonSimplifiedExpression(new Expression.Multiplication(this, y));
  };
  NonSimplifiedExpression.prototype.pow = function (y) {
    return new NonSimplifiedExpression(new Expression.Exponentiation(this, y));
  };

  NonSimplifiedExpression.prototype.powExpression = function (x) {
    return new NonSimplifiedExpression(new Expression.Exponentiation(x, this));
  };
  NonSimplifiedExpression.prototype.multiplyAddition = function (x) {
    return new NonSimplifiedExpression(new Expression.Multiplication(x, this));
  };
  NonSimplifiedExpression.prototype.multiplyMultiplication = function (x) {
    return new NonSimplifiedExpression(new Expression.Multiplication(x, this));
  };
  NonSimplifiedExpression.prototype.multiplyDivision = function (x) {
    return new NonSimplifiedExpression(new Expression.Multiplication(x, this));
  };
  NonSimplifiedExpression.prototype.multiplyMatrix = function (x) {
    return new NonSimplifiedExpression(new Expression.Multiplication(x, this));
  };
  NonSimplifiedExpression.prototype.addDivision = function (x) {
    return new NonSimplifiedExpression(new Expression.Addition(x, this));
  };

  //?
  NonSimplifiedExpression.prototype.addMatrix = function (x) {
    return new NonSimplifiedExpression(new Expression.Addition(x, this));
  };

  NonSimplifiedExpression.prototype.addExpression = function (x) {
    return new NonSimplifiedExpression(new Expression.Addition(x, this));
  };
  NonSimplifiedExpression.prototype.multiplyExpression = function (x) {
    return new NonSimplifiedExpression(new Expression.Multiplication(x, this));
  };
  NonSimplifiedExpression.prototype.divideExpression = function (x, allowConjugate) {
    return new NonSimplifiedExpression(new Expression.Division(x, this));
  };

  NonSimplifiedExpression.prototype.squareRoot = function () {
    return new NonSimplifiedExpression(new Expression.SquareRoot(this));
  };
  NonSimplifiedExpression.prototype.sin = function () {
    return new NonSimplifiedExpression(new Expression.Sin(this));
  };
  NonSimplifiedExpression.prototype.cos = function () {
    return new NonSimplifiedExpression(new Expression.Cos(this));
  };
  NonSimplifiedExpression.prototype.rank = function () {
    return new NonSimplifiedExpression(new Expression.Rank(this));
  };
  NonSimplifiedExpression.prototype.determinant = function () {
    return new NonSimplifiedExpression(new Expression.Determinant(this));
  };
  //?
  NonSimplifiedExpression.prototype.GF2 = function () {
    return new NonSimplifiedExpression(new Expression.GF2(this));
  };
  NonSimplifiedExpression.prototype.transpose = function () {
    return new NonSimplifiedExpression(new Expression.Transpose(this));
  };

  NonSimplifiedExpression.prototype.elementWisePower = function (a) {
    return new NonSimplifiedExpression(new Expression.ElementWisePower(this, a));
  };
  NonSimplifiedExpression.prototype.transformNoAnswerExpression = function (name, second) {
    return new NonSimplifiedExpression(new Expression.NoAnswerExpression(this, name, second));
  };
  NonSimplifiedExpression.prototype.transformEquality = function (b) {
    return new NonSimplifiedExpression(new Expression.Equality(this, b));
  };

  Expression.prototype.addPosition = function () {
    return this;
  };
  NonSimplifiedExpression.prototype.addPosition = function (position, length, input) {
    return new NonSimplifiedExpression(this.e, position, length, input);
  };

  var prepare = function (x, holder) {
    var e = x.simplify();
    RPN.startPosition = holder.position;
    RPN.endPosition = holder.position + holder.length;
    RPN.input = holder.input;
    return e;
  };

  //TODO:
  Expression.prototype.simplifyInternal = function (holder) {
    return this;
  };
  Expression.Exponentiation.prototype.simplifyInternal = function (holder) {
    return prepare(this.a, holder).pow(prepare(this.b, holder));
  };
  Expression.Multiplication.prototype.simplifyInternal = function (holder) {
    return prepare(this.a, holder).multiply(prepare(this.b, holder));
  };
  Expression.Addition.prototype.simplifyInternal = function (holder) {
    return prepare(this.a, holder).add(prepare(this.b, holder));
  };
  Expression.Division.prototype.simplifyInternal = function (holder) {
    return prepare(this.a, holder).divide(prepare(this.b, holder));
  };
  Expression.SquareRoot.prototype.simplifyInternal = function (holder) {
    return prepare(this.a, holder).squareRoot();
  };
  Expression.Sin.prototype.simplifyInternal = function (holder) {
    return prepare(this.a, holder).sin();
  };
  Expression.Cos.prototype.simplifyInternal = function (holder) {
    return prepare(this.a, holder).cos();
  };
  Expression.Rank.prototype.simplifyInternal = function (holder) {
    return prepare(this.a, holder).rank();
  };
  Expression.Determinant.prototype.simplifyInternal = function (holder) {
    return prepare(this.a, holder).determinant();
  };
  Expression.GF2.prototype.simplifyInternal = function (holder) {
    return prepare(this.a, holder).GF2();
  };
  Expression.Transpose.prototype.simplifyInternal = function (holder) {
    return prepare(this.a, holder).transpose();
  };
  Expression.NoAnswerExpression.prototype.simplifyInternal = function (holder) {
    return prepare(this.a, holder).transformNoAnswerExpression(this.name, this.second == undefined ? undefined : prepare(this.second, holder));
  };
  Expression.Equality.prototype.simplifyInternal = function (holder) {
    return prepare(this.a, holder).transformEquality(prepare(this.b, holder));
  };
  Expression.Matrix.prototype.simplifyInternal = function (holder) {
    return new Expression.Matrix(this.matrix.map(function (e, i, j) {
      return prepare(e, holder);
    }));
  };

  Expression.prototype.simplify = function () {
    return this;//? this.simplifyInternal(undefined);
  };
  NonSimplifiedExpression.prototype.simplify = function () {
    //return this.e.simplifyInternal(this);
    return this.e.simplifyInternal(this).simplifyExpression();//new
  };
  NonSimplifiedExpression.prototype.toString = function (options) {
    return this.e.toString(options);
  };
  NonSimplifiedExpression.prototype.equals = function (y) {
    return this.simplify().equals(y.simplify());
  };
  NonSimplifiedExpression.prototype.toMathML = function (options) {
    return this.e.toMathML(options);
  };

  //!
  NonSimplifiedExpression.prototype.unwrap = function () {
    return this.e;
  };
  Expression.Negation.prototype.simplifyInternal = function (holder) {
    return prepare(this.b, holder).negate();
  };
  Expression.Subtraction.prototype.simplifyInternal = function (holder) {
    return prepare(this.a, holder).subtract(prepare(this.b, holder));
  };
  NonSimplifiedExpression.prototype.isUnaryPlusMinus = function () {
    return this.e.isUnaryPlusMinus();
  };
  NonSimplifiedExpression.prototype.getPrecedence = function () {
    return this.e.getPrecedence();
  };

//?
  NonSimplifiedExpression.prototype.getId = function () {
    return "e" + this.id.toString();
  };
  Expression.prototype.getIds = function () {
    return "";
  };
  Expression.BinaryOperation.prototype.getIds = function () {
    var a = this.a.getIds();
    var b = this.b.getIds();
    return a === "" ? b : (b === "" ? a : a + ", " + b);
  };
  NonSimplifiedExpression.prototype.getIds = function () {
    var a = this.getId();
    var b = this.e.getIds();
    return a === "" ? b : (b === "" ? a : a + ", " + b);
  };

  Expression.NonSimplifiedExpression = NonSimplifiedExpression;
  global.NonSimplifiedExpression = NonSimplifiedExpression;

}(this));
/*jslint plusplus: true, vars: true, indent: 2 */
/*global Expression, Matrix, NonSimplifiedExpression, ExpressionFactory */

(function (global) {
  "use strict";

  var RPN = undefined;

  var isAlpha = function (code) {
    return (code >= "a".charCodeAt(0) && code <= "z".charCodeAt(0)) ||
           (code >= "A".charCodeAt(0) && code <= "Z".charCodeAt(0));
  };
  
  // http://en.wikipedia.org/wiki/Operators_in_C_and_C%2B%2B#Operator_precedence

  var LEFT_TO_RIGHT = 0;
  var RIGHT_TO_LEFT = 1;
  var UNARY_PRECEDENCE = 5;

  var Operator = function (name, arity, rightToLeftAssociative, precedence, i) {
    this.name = name;
    this.arity = arity;
    this.rightToLeftAssociative = rightToLeftAssociative;
    this.precedence = precedence;
    this.i = i;
    this.xyz = isAlpha(name.charCodeAt(0)) && isAlpha(name.charCodeAt(name.length - 1));
  };

  var ADDITION = new Operator("+", 2, LEFT_TO_RIGHT, 2, function (a, b) {
    return a.add(b);
  });
  var MULTIPLICATION = new Operator("*", 2, LEFT_TO_RIGHT, 3, function (a, b) {
    return a.multiply(b);
  });
  // Exponentiation has precedence as unary operators
  var EXPONENTIATION = new Operator("^", 2, RIGHT_TO_LEFT, UNARY_PRECEDENCE, function (a, b) {
    return a.pow(b);
  });
  var operations = [
    ADDITION,
    new Operator("-", 2, LEFT_TO_RIGHT, 2, function (a, b) {
      return a.subtract(b);
    }),
    MULTIPLICATION,
    new Operator("/", 2, LEFT_TO_RIGHT, 3, function (a, b) {
      return a.divide(b);
    }),
    new Operator("\\", 2, LEFT_TO_RIGHT, 3, function (a, b) {
      return a.inverse().multiply(b);
    }),
    //new Operator("%", 2, LEFT_TO_RIGHT, 3, function (a, b) {
    //  return a.remainder(b);
    //}),
    new Operator("+", 1, RIGHT_TO_LEFT, UNARY_PRECEDENCE, function (e) {
      return e;
    }),
    new Operator("-", 1, RIGHT_TO_LEFT, UNARY_PRECEDENCE, function (e) {
      return e.negate();
    }),
    EXPONENTIATION,
    new Operator(".^", 2, RIGHT_TO_LEFT, UNARY_PRECEDENCE, function (a, b) {
      return a.elementWisePower(b);
    }),//?
    new Operator("\u221A", 1, RIGHT_TO_LEFT, UNARY_PRECEDENCE, function (a) {
      return a.squareRoot();
    }),
    new Operator("sqrt", 1, RIGHT_TO_LEFT, UNARY_PRECEDENCE + 1, function (a) {
      return a.squareRoot();
    }),
    new Operator("rank", 1, RIGHT_TO_LEFT, UNARY_PRECEDENCE, function (a) {
      return a.rank();
    }),
    //new Operator("trace", 1, RIGHT_TO_LEFT, UNARY_PRECEDENCE, function (a) {
    //  return Expression.transformTrace(a);
    //}),
    new Operator("determinant", 1, RIGHT_TO_LEFT, UNARY_PRECEDENCE, function (a) {
      return a.determinant();
    }),
    new Operator("transpose", 1, RIGHT_TO_LEFT, UNARY_PRECEDENCE, function (a) {
      return a.transpose();
    }),
    new Operator("^T", 1, LEFT_TO_RIGHT, UNARY_PRECEDENCE, function (a) {
      return a.transpose();
    }),
    new Operator("^t", 1, LEFT_TO_RIGHT, UNARY_PRECEDENCE, function (a) {
      return a.transpose();
    }),
    new Operator("'", 1, LEFT_TO_RIGHT, UNARY_PRECEDENCE, function (a) {
      return a.transpose();
    }),
    new Operator("Gaussian-elimination", 1, RIGHT_TO_LEFT, UNARY_PRECEDENCE, function (a) {
      return a.transformNoAnswerExpression("Gaussian-elimination");
    }),
    new Operator("LU-decomposition", 1, RIGHT_TO_LEFT, UNARY_PRECEDENCE, function (a) {
      return a.transformNoAnswerExpression("LU-decomposition");
    }),
    new Operator("diagonalize", 1, RIGHT_TO_LEFT, UNARY_PRECEDENCE, function (a) {
      return a.transformNoAnswerExpression("diagonalize");
    }),

//TODO: add automatically ?
    new Operator("solve-using-Gaussian-elimination", 1, RIGHT_TO_LEFT, UNARY_PRECEDENCE, function (a) {
      return a.transformNoAnswerExpression("solve-using-Gaussian-elimination");
    }),
    new Operator("solve-using-Gauss-Jordan-elimination", 1, RIGHT_TO_LEFT, UNARY_PRECEDENCE, function (a) {
      return a.transformNoAnswerExpression("solve-using-Gauss-Jordan-elimination");
    }),
    new Operator("solve-using-Montante-method", 1, RIGHT_TO_LEFT, UNARY_PRECEDENCE, function (a) {
      return a.transformNoAnswerExpression("solve-using-Montante-method");
    }),
    new Operator("solve-using-Cramer's-rule", 1, RIGHT_TO_LEFT, UNARY_PRECEDENCE, function (a) {
      return a.transformNoAnswerExpression("solve-using-Cramer's-rule");
    }),
    new Operator("solve-using-inverse-matrix-method", 1, RIGHT_TO_LEFT, UNARY_PRECEDENCE, function (a) {
      return a.transformNoAnswerExpression("solve-using-inverse-matrix-method");
    }),

    new Operator("determinant-Gauss", 1, RIGHT_TO_LEFT, UNARY_PRECEDENCE, function (a) {
      return a.transformNoAnswerExpression("determinant-Gauss");
    }),
    new Operator("determinant-2x2", 1, RIGHT_TO_LEFT, UNARY_PRECEDENCE, function (a) {
      return a.transformNoAnswerExpression("determinant-2x2");
    }),
    new Operator("determinant-Sarrus", 1, RIGHT_TO_LEFT, UNARY_PRECEDENCE, function (a) {
      return a.transformNoAnswerExpression("determinant-Sarrus");
    }),
    new Operator("determinant-Triangle", 1, RIGHT_TO_LEFT, UNARY_PRECEDENCE, function (a) {
      return a.transformNoAnswerExpression("determinant-Triangle");
    }),
    new Operator("determinant-Leibniz", 1, RIGHT_TO_LEFT, UNARY_PRECEDENCE, function (a) {
      return a.transformNoAnswerExpression("determinant-Leibniz");
    }),
    new Operator("determinant-Montante", 1, RIGHT_TO_LEFT, UNARY_PRECEDENCE, function (a) {
      return a.transformNoAnswerExpression("determinant-Montante");
    }),

    //?
    new Operator("solve", 1, RIGHT_TO_LEFT, UNARY_PRECEDENCE, function (a) {
      return a.transformNoAnswerExpression("solve");//?
    }),
    new Operator("analyse-compatibility", 1, RIGHT_TO_LEFT, UNARY_PRECEDENCE, function (a) {
      return a.transformNoAnswerExpression("analyse-compatibility");
    }),
    new Operator("=", 2, LEFT_TO_RIGHT, 1, function (a, b) {
      //if (!Expression.isDebugging) {
      //  throw new RangeError("NotSupportedError");
      //}
      return a.transformEquality(b);
    }),
    new Operator(";", 2, LEFT_TO_RIGHT, 1, function (a, b) {
      if (!Expression.isDebugging) {
        throw new RangeError("NotSupportedError");
      }
      return a.transformStatement(b);
    }),
    new Operator("GF2", 1, RIGHT_TO_LEFT, UNARY_PRECEDENCE, function (a) {
      return a.GF2();
    }),

    new Operator("sin", 1, RIGHT_TO_LEFT, UNARY_PRECEDENCE + 1, function (a) {
      if (a.sin == undefined) {
        throw new RangeError("NotSupportedError");
      }
      return a.sin();
    }),
    new Operator("cos", 1, RIGHT_TO_LEFT, UNARY_PRECEDENCE + 1, function (a) {
      if (a.cos == undefined) {
        throw new RangeError("NotSupportedError");
      }
      return a.cos();
    }),

    new Operator("expand-along-column", 2, RIGHT_TO_LEFT, 3, function (a, b) {
      return a.transformNoAnswerExpression("expand-along-column", b);
    }),
    new Operator("expand-along-row", 2, RIGHT_TO_LEFT, 3, function (a, b) {
      return a.transformNoAnswerExpression("expand-along-row", b);
    }),
    new Operator("obtain-zeros-in-column", 2, RIGHT_TO_LEFT, 3, function (a, b) {
      return a.transformNoAnswerExpression("obtain-zeros-in-column", b);
    }),
    new Operator("obtain-zeros-in-row", 2, RIGHT_TO_LEFT, 3, function (a, b) {
      return a.transformNoAnswerExpression("obtain-zeros-in-row", b);
    }),

    new Operator("eigenvectors", 1, RIGHT_TO_LEFT, UNARY_PRECEDENCE, function (a) {
      return a.transformNoAnswerExpression("eigenvectors");
    }),
    
    new Operator("polynomial-roots", 1, RIGHT_TO_LEFT, UNARY_PRECEDENCE, function (a) {
      return a.transformNoAnswerExpression("polynomial-roots");
    }),
    new Operator("polynomial-multiply", 2, RIGHT_TO_LEFT, 3, function (a, b) {
      return a.transformNoAnswerExpression("polynomial-multiply", b);
    }),

    new Operator("tan", 1, RIGHT_TO_LEFT, UNARY_PRECEDENCE + 1, function (a) {
      throw new RangeError("NotSupportedError");
    }),
    new Operator("cbrt", 1, RIGHT_TO_LEFT, UNARY_PRECEDENCE + 1, function (a) {
      throw new RangeError("NotSupportedError");
    }),
    new Operator("exp", 1, RIGHT_TO_LEFT, UNARY_PRECEDENCE + 1, function (a) {
      throw new RangeError("NotSupportedError");
    }),
    new Operator("log", 1, RIGHT_TO_LEFT, UNARY_PRECEDENCE + 1, function (a) {
      throw new RangeError("NotSupportedError");
    })
  ];

  function OperationSearchCache() {
    this.array = new Array(32);
    for (var i = 0; i < this.array.length; i += 1) {
      this.array[i] = undefined;
    }
  }
  OperationSearchCache.prototype.append = function (firstCharCode, operator) {
    var index = firstCharCode % this.array.length;
    if (this.array[index] == undefined) {
      this.array[index] = [];
    }
    this.array[index].push(operator);
  };
  OperationSearchCache.prototype.getAll = function (firstCharCode) {
    var index = firstCharCode % this.array.length;
    return this.array[index];
  };

  var operationSearchCache = new OperationSearchCache();

  var i = -1;
  while (++i < operations.length) {
    operationSearchCache.append(operations[i].name.charCodeAt(0), operations[i]);
  }

  function Input() {
  }

  Input.EOF = -1;
  Input.trimLeft = function (input, position, skip) {
    var tmp = Input.exec(input, position + skip, whiteSpaces);
    return position + skip + (tmp == undefined ? 0 : tmp[0].length);
  };
  Input.parseCharacter = function (input, position, characterCode) {
    var c = Input.getFirst(input, position);
    if (c !== characterCode) {
      // TODO: fix error messages
      // missing the brace ?
      // throw new RangeError("UserError");// "RPN error 0", input ?
      RPN.startPosition = position;
      RPN.endPosition = position + 1;
      RPN.input = input;
      throw new RangeError("UserError:" + characterCode.toString());
    }
    return Input.trimLeft(input, position, 1);
  };
  Input.getFirst = function (input, position) {
    return position < input.length ? input.charCodeAt(position) : Input.EOF;
  };
  Input.startsWith = function (input, position, s) {
    var length = s.length;
    if (position + length > input.length) {
      return false;
    }
    var i = -1;
    while (++i < length) {
      if (input.charCodeAt(position + i) !== s.charCodeAt(i)) {
        return false;
      }
    }
    return true;
  };
  Input.exec = function (input, position, regularExpression) {
    // regularExpression.lastIndex = position;
    // return regularExpression.exec(input);
    if (position === input.length) {
      return undefined;
    }
    var match = regularExpression.exec(position === 0 ? input : input.slice(position));
    return match == undefined || match[0].length === 0 ? undefined : match;
  };

  var MATRIX_OPENING_BRACKET = "{".charCodeAt(0);
  var MATRIX_CLOSING_BRACKET = "}".charCodeAt(0);
  var GROUPING_OPENING_BRACKET = "(".charCodeAt(0);
  var GROUPING_CLOSING_BRACKET = ")".charCodeAt(0);
  var VERTICAL_BAR = "|".charCodeAt(0);
  var DELIMITER = ",".charCodeAt(0);

  function ParseResult(result, position) {
    this.result = result;
    this.position = position;
  }

  var parseMatrix = function (input, position, context) {
    var openingBracket = MATRIX_OPENING_BRACKET;
    var closingBracket = MATRIX_CLOSING_BRACKET;

    position = Input.parseCharacter(input, position, openingBracket);
    var rows = [];
    var firstRow = true;
    while (firstRow || Input.getFirst(input, position) === DELIMITER) {
      if (firstRow) {
        firstRow = false;
      } else {
        position = Input.trimLeft(input, position, 1);
      }
      position = Input.parseCharacter(input, position, openingBracket);
      var row = [];
      var firstCell = true;
      while (firstCell || Input.getFirst(input, position) === DELIMITER) {
        if (firstCell) {
          firstCell = false;
        } else {
          position = Input.trimLeft(input, position, 1);
        }
        var tmp = parseExpression(input, position, context, true, 0, undefined);
        position = tmp.position;
        row.push(tmp.result);
      }
      position = Input.parseCharacter(input, position, closingBracket);
      rows.push(row);
    }
    position = Input.parseCharacter(input, position, closingBracket);
    return new ParseResult(context.wrap(RPN.createMatrix(Matrix.padRows(rows, false))), position);
  };

  var getDecimalFraction = function (match) {
    var integerPartAsString = match[1];
    var nonRepeatingFractionalPartAsString = integerPartAsString != undefined ? match[2] : match[4];
    var repeatingFractionalPartAsString = integerPartAsString != undefined ? match[3] : (nonRepeatingFractionalPartAsString != undefined ? match[5] : match[6]);
    var exponentSingPartAsString = match[7];
    var exponentPartAsString = match[8];

    var numerator = RPN.ZERO;
    var denominator = undefined;
    var factor = undefined;

    if (integerPartAsString != undefined) {
      numerator = RPN.parseInteger(integerPartAsString);
    }
    if (nonRepeatingFractionalPartAsString != undefined) {
      factor = Expression.pow(RPN.TEN, nonRepeatingFractionalPartAsString.length, RPN.ONE);
      numerator = numerator.multiply(factor).add(RPN.parseInteger(nonRepeatingFractionalPartAsString));
      denominator = denominator == undefined ? factor : denominator.multiply(factor);
    }
    if (repeatingFractionalPartAsString != undefined) {
      factor = Expression.pow(RPN.TEN, repeatingFractionalPartAsString.length, RPN.ONE).subtract(RPN.ONE);
      numerator = numerator.multiply(factor).add(RPN.parseInteger(repeatingFractionalPartAsString));
      denominator = denominator == undefined ? factor : denominator.multiply(factor);
    }
    if (exponentPartAsString != undefined) {
      factor = Expression.pow(RPN.TEN, Number.parseInt(exponentPartAsString, 10), RPN.ONE);
      if (exponentSingPartAsString === "-") {
        denominator = denominator == undefined ? factor : denominator.multiply(factor);
      } else {
        numerator = numerator.multiply(factor);
      }
    }

    var value = denominator == undefined ? numerator : numerator.divide(denominator);
    return value;
  };

  // TODO: sticky flags - /\s+/y
  var whiteSpaces = /^\s+/;
  // Base Latin, Base Latin upper case, Base Cyrillic, Base Cyrillic upper case, Greek alphabet
  var symbols = /^[a-zA-Z\u0430-\u044F\u0410-\u042F\u03B1-\u03C9](?:\_\d+|\_\([a-z\d]+,[a-z\d]+\))?/;
  var decimalFractionRegExp = /^(?:(\d+)(?:[\.,](\d+)?(?:\((\d+)\))?)?|[\.,](?:(\d+)(?:\((\d+)\))?|(?:\((\d+)\))))(?:(?:e|E)(\+|-)?(\d+))?/;
  var decimalFractionRegExpWithoutComma = /^(?:(\d+)(?:[\.](\d+)?(?:\((\d+)\))?)?|[\.](?:(\d+)(?:\((\d+)\))?|(?:\((\d+)\))))(?:(?:e|E)(\+|-)?(\d+))?/;
  var superscripts = /^[\u00B2\u00B3\u00B9\u2070\u2074-\u2079]+/;
  var vulgarFractions = /^[\u00BC-\u00BE\u2150-\u215E]/;

  // s.normalize("NFKD").replace(/[\u2044]/g, "/")
  var normalize = function (s) {
    return s.replace(/[\u00B2\u00B3\u00B9\u2070\u2074-\u2079]/g, function (c) {
      var charCode = c.charCodeAt(0);
      if (charCode === 0x00B2) {
        return "2";
      }
      if (charCode === 0x00B3) {
        return "3";
      }
      if (charCode === 0x00B9) {
        return "1";
      }
      if (charCode === 0x2070) {
        return "0";
      }
      return (charCode - 0x2074 + 4).toString();
    }).replace(/[\u00BC-\u00BE\u2150-\u215E]/g, function (c) {
      var charCode = c.charCodeAt(0);
      var i = charCode - 0x2150 < 0 ? (charCode - 0x00BC) * 2 : (3 + charCode - 0x2150) * 2;
      return "141234171911132315253545165618385878".slice(i, i + 2).replace(/^\S/g, "$&/").replace(/1\/1/g, "1/10");
    });
  };

  var parseExpression = function (input, position, context, isMatrixElement, precedence, left) {
    var ok = true;
    var firstCharacterCode = Input.getFirst(input, position);
    //!

    while (firstCharacterCode !== Input.EOF && ok) {
      var op = undefined;
      var operand = undefined;
      var tmp = undefined;
      var match = undefined;
      var isOnlyInteger = false;

      var operationsArray = operationSearchCache.getAll(firstCharacterCode);
      if (operationsArray != undefined) {
        var length = operationsArray.length;
        var bestMatchLength = 0;//? "^T" and "^"
        var j = -1;
        while (++j < length) {
          var candidate = operationsArray[j];
          if ((left != undefined && (candidate.arity !== 1 || candidate.rightToLeftAssociative !== RIGHT_TO_LEFT || precedence < MULTIPLICATION.precedence) || 
              (left == undefined && candidate.arity === 1 && candidate.rightToLeftAssociative === RIGHT_TO_LEFT)) &&
              Input.startsWith(input, position, candidate.name) &&
              (!candidate.xyz || (!isAlpha(position === 0 ? -1 : Input.getFirst(input, position - 1)) && !isAlpha(Input.getFirst(input, position + candidate.name.length)))) &&//TODO: fix - RPN("George")
              bestMatchLength < candidate.name.length) {
            op = candidate;
            bestMatchLength = op.name.length;
          }
        }
      }

      if (op != undefined) {
        if (precedence > op.precedence + (op.rightToLeftAssociative === RIGHT_TO_LEFT ? 0 : -1)) {
          ok = false;
        } else {
          var operatorPosition = position;
          position = Input.trimLeft(input, position, op.name.length);
          if (op.arity === 1 && op.rightToLeftAssociative !== RIGHT_TO_LEFT) {
            //TODO: fix
            RPN.startPosition = operatorPosition;
            RPN.endPosition = operatorPosition + op.name.length;
            RPN.input = input;
            left = op.i(left).addPosition(operatorPosition, op.name.length, input);
          } else {
            tmp = parseExpression(input, position, context, isMatrixElement, op.precedence, undefined);
            var right = tmp.result;
            position = tmp.position;
            //TODO: fix `1/(2-2)`
            RPN.startPosition = operatorPosition;
            RPN.endPosition = operatorPosition + op.name.length;
            RPN.input = input;
            if (op.arity === 1) {
              // left <implicit multiplication> operand
              operand = op.i(right).addPosition(operatorPosition, op.name.length, input);
            } else if (op.arity === 2) {
              left = op.i(left, right).addPosition(operatorPosition, op.name.length, input);
            } else {
              throw new RangeError();
            }
          }
        }
      } else if (left == undefined || precedence < MULTIPLICATION.precedence) {
        if (firstCharacterCode === GROUPING_OPENING_BRACKET) {
          position = Input.parseCharacter(input, position, GROUPING_OPENING_BRACKET);
          tmp = parseExpression(input, position, context, isMatrixElement, 0, undefined);
          operand = tmp.result;
          position = tmp.position;
          position = Input.parseCharacter(input, position, GROUPING_CLOSING_BRACKET);
        } else if (firstCharacterCode === MATRIX_OPENING_BRACKET) {
          tmp = parseMatrix(input, position, context);
          operand = tmp.result;
          position = tmp.position;
        } else if ((match = Input.exec(input, position, isMatrixElement ? decimalFractionRegExpWithoutComma : decimalFractionRegExp)) != undefined) { // $ ?for RPN
          operand = context.wrap(getDecimalFraction(match));
          position = Input.trimLeft(input, position, match[0].length);
          //!
          isOnlyInteger = match[1] != undefined && match[0].length === match[1].length;
        } else if ((match = Input.exec(input, position, symbols)) != undefined) {
          operand = context.get(match[0]);
          if (operand == undefined) {
            operand = RPN.createSymbol(match[0]);
            operand = context.wrap(operand);
          } else {
            operand = context.wrap(operand);
          }
          position = Input.trimLeft(input, position, match[0].length);
        } else if (firstCharacterCode === VERTICAL_BAR && left == undefined) {
          position = Input.parseCharacter(input, position, VERTICAL_BAR);
          tmp = parseExpression(input, position, context, isMatrixElement, 0, undefined);
          operand = tmp.result;
          position = tmp.position;
          position = Input.parseCharacter(input, position, VERTICAL_BAR);
          
          operand = operand.determinant();//!
        } else {
          ok = false;
        }
      } else {
        ok = false;
      }

      //!TODO: fix
      if (!ok && left != undefined && precedence <= EXPONENTIATION.precedence + (EXPONENTIATION.rightToLeftAssociative === RIGHT_TO_LEFT ? 0 : -1)) {
        if ((match = Input.exec(input, position, superscripts)) != undefined) {
          // implicit exponentiation
          left = EXPONENTIATION.i(left, RPN.parseInteger(normalize(match[0]))).addPosition(position, EXPONENTIATION.name.length, input);
          position = Input.trimLeft(input, position, match[0].length);
          ok = true;//!
        }
      }
      if (!ok || isOnlyInteger) {
        if ((match = Input.exec(input, position, vulgarFractions)) != undefined) {
          tmp = parseExpression(normalize(match[0]), 0, context, isMatrixElement, 0, undefined);
          if (isOnlyInteger) {
            operand = ADDITION.i(operand, tmp.result).addPosition(position, ADDITION.name.length, input);
          } else {
            operand = tmp.result;
          }
          position = Input.trimLeft(input, position, match[0].length);
          ok = true;//!
        }
      }

      if (operand != undefined) {
        if (left != undefined) {
          // implied multiplication
          tmp = parseExpression(input, position, context, isMatrixElement, MULTIPLICATION.precedence, operand);
          var right1 = tmp.result;
          var position1 = tmp.position;
          left = MULTIPLICATION.i(left, right1).addPosition(position, MULTIPLICATION.name.length, input);
          position = position1;
        } else {
          left = operand;
        }
      }
      firstCharacterCode = Input.getFirst(input, position);
    }

    if (left == undefined) {
      RPN.startPosition = position;
      RPN.endPosition = position + 1;
      RPN.input = input;
      throw new RangeError("UserError:" + "0");//(!) TODO: "RPN error 2", input
    }
    return new ParseResult(left, position);
  };

  var table = {
    "\u0410": "A",
    "\u0430": "A",
    "\u0412": "B",
    "\u0432": "B",
    "\u0421": "C",
    "\u0441": "C",
    "\u00B7": "*",
    "\u00D7": "*",
    "\u2022": "*",
    "\u22C5": "*",
    "\u2010": "-",
    "\u2011": "-",
    "\u2012": "-",
    "\u2013": "-",
    "\u2014": "-",
    "\u2015": "-",
    "\u2212": "-",
    "\uFF0D": "-",
    "\u003A": "/", // Deutsch
    "\u00F7": "/",
    "\uFF08": "(",
    "\uFF09": ")"
  };
  //var replaceRegExp = /[...]/g;
  //var replaceFunction = function (c) {
  //  return table[c];
  //};
  //input = input.replace(replaceRegExp, replaceFunction); - slow in Chrome
  var replaceSomeChars = function (input) {
    var lastIndex = 0;
    var result = "";
    for (var i = 0; i < input.length; i += 1) {
      var charCode = input.charCodeAt(i);
      if (charCode > 0x007F || charCode === 0x003A) {
        var x = table[input.slice(i, i + 1)];
        if (x != undefined) {
          result += input.slice(lastIndex, i);
          result += x;
          lastIndex = i + 1;
        }
      }
    }
    result += input.slice(lastIndex);
    return result;
  };

  RPN = function (input, context) {
    context = context == undefined ? new RPN.SimpleContext() : context;

    RPN.startPosition = -1;
    RPN.endPosition = -1;
    RPN.input = input; //?

    // TODO: remove
    if (input !== input.toString()) {
      throw new RangeError();
    }

    //TODO: fix ???
    input = replaceSomeChars(input);

    var position = 0;
    position = Input.trimLeft(input, position, 0);
    var tmp = parseExpression(input, position, context, false, 0, undefined);
    if (Input.getFirst(input, tmp.position) !== Input.EOF) {
      RPN.startPosition = tmp.position;
      RPN.endPosition = tmp.position + 1;
      RPN.input = input;
      throw new RangeError("UserError:" + Input.EOF.toString());// TODO: fix
    }

    return tmp.result;
  };

  RPN.startPosition = -1;
  RPN.endPosition = -1;
  RPN.input = "";

  Expression.isDebugging = false;

  RPN.Context = function (getter) {
    this.getter = getter;
  };
  RPN.Context.prototype.get = function (e) {
    return this.getter == undefined ? undefined : this.getter(e);
  };
  RPN.Context.prototype.wrap = function (e) {
    return new NonSimplifiedExpression(e);
  };

  RPN.SimpleContext = function (x) {
  };
  RPN.SimpleContext.prototype.get = function (e) {
    return undefined;
  };
  RPN.SimpleContext.prototype.wrap = function (e) {
    return e;
  };

  RPN.addDenotation = function (operationName, denotation) {
    var operations = operationSearchCache.getAll(operationName.charCodeAt(0));
    var operation = undefined;
    var i = -1;
    while (++i < operations.length) {
      var o = operations[i];
      if (o.name === operationName) {
        operation = o;
      }
    }
    var newOperation = new Operator(denotation, operation.arity, operation.rightToLeftAssociative, operation.precedence, operation.i);
    operations.push(newOperation);
    operationSearchCache.append(newOperation.name.charCodeAt(0), newOperation);
  };

  RPN.parseInteger = ExpressionFactory.parseInteger;
  RPN.createMatrix = ExpressionFactory.createMatrix;
  RPN.createSymbol = ExpressionFactory.createSymbol;
  RPN.ZERO = ExpressionFactory.ZERO;
  RPN.ONE = ExpressionFactory.ONE;
  RPN.TWO = ExpressionFactory.TWO;
  RPN.TEN = ExpressionFactory.TEN;

  // Polynom([a0, a1, a2, ...., an]);
  // an*x^n+ an-1 x ^n-1 +... + a0

  //!  
  Expression.Division.prototype.negate = function () {
    return new Expression.Division(this.a.negate(), this.b);
  };

  function Polynom(a) {
    var length = a.length;
    while (length !== 0 && a[length - 1].equals(RPN.ZERO)) {
      length -= 1;
    }
    var data = new Array(length);
    for (var i = 0; i < length; i += 1) {
      data[i] = a[i];
    }
    this.a = data;
  }

  Polynom.prototype = Object.create(Expression.prototype);

  Polynom.ZERO = new Polynom(new Array(0));

  Polynom.prototype.map = function (f) {//?
    var data = new Array(this.a.length);
    for (var i = 0; i < this.a.length; i += 1) {
      data[i] = f(this.a[i]);
    }
    return new Polynom(data);
  };

  Polynom.prototype.equals = function (y) {
    return y.equalsPolynom(this);
  };
  Polynom.prototype.equalsInteger = function (y) {
    return y.equalsPolynom(this);
  };
  Expression.prototype.equalsPolynom = function (x) {
    return false;
  };
  Expression.Integer.prototype.equalsPolynom = function (x) {
    return x.a.length === 0 && this.equals(RPN.ZERO) || x.a.length === 1 && this.equals(x.a[0]);
  };

  Polynom.prototype.equalsPolynom = function (p) {
    var i = this.a.length;
    if (i !== p.a.length) {
      return false;
    }
    while (--i >= 0) {
      if (!this.a[i].equals(p.a[i])) {
        return false;
      }
    }
    return true;
  };

  Polynom.prototype.add = function (p) {
    var length = Math.max(this.a.length, p.a.length);
    var l = Math.min(this.a.length, p.a.length);
    var result = new Array(length);
    for (var i = 0; i < l; i += 1) {
      result[i] = this.a[i].add(p.a[i]);
    }
    for (var j = l; j < length; j += 1) {
      result[j] = j < this.a.length ? this.a[j] : p.a[j];
    }
    return new Polynom(result);
  };

  Polynom.prototype.shift = function (n) { // <<<= x^n, n>=0
    var data = this.a;
    var newData = new Array(data.length === 0 ? 0 : data.length + n);
    if (data.length !== 0) {
      for (var i = 0; i < n; i += 1) {
        newData[i] = RPN.ZERO;
      }
      for (var j = 0; j < data.length; j += 1) {
        newData[j + n] = data[j];
      }
    }
    return new Polynom(newData);
  };

  Polynom.prototype.multiply = function (p) {
    return p.multiplyPolynom(this);
  };
  Expression.Division.prototype.multiplyPolynom = function (p) {
    return this.multiplyExpression(p);
  };
  Polynom.prototype.multiplyPolynom = function (p) {
    if (p.a.length === 0 || this.a.length === 0) {
      return new Polynom(new Array(0));
    }
    var newData = new Array(p.a.length + this.a.length - 1);
    for (var k = 0; k < newData.length; k += 1) {
      newData[k] = undefined;
    }
    var i = p.a.length;
    while (--i >= 0) {
      var j = this.a.length;
      while (--j >= 0) {
        var x = this.a[j].multiply(p.a[i]);
        newData[i + j] = newData[i + j] == undefined ? x : newData[i + j].add(x);
      }
    }
    return new Polynom(newData);
  };

  Polynom.prototype.divideAndRemainder = function (p) {
    if (p.equals(Polynom.ZERO)) {
      throw new RangeError("ArithmeticException");
    }
    var div = Polynom.ZERO;
    var rem = this;
    while (rem.a.length >= p.a.length) {
      var q = rem.a[rem.a.length - 1].divide(p.a[p.a.length - 1]);
      var pq = new Polynom([q]);
      div = div.add(pq.shift(rem.a.length - p.a.length));
      rem = rem.subtract(p.multiply(pq).shift(rem.a.length - p.a.length));
    }
    return {quotient: div, remainder: rem};
  };

  Polynom.prototype.calcAt = function (point) {//!!!
    var n = RPN.ZERO;
    var i = this.a.length;
    while (--i >= 0) {
      n = n.multiply(point).add(this.a[i]);
    }
    return n;
  };

  Polynom.prototype.getcoef = function () {
    if (this.a.length === 0) {
      throw new RangeError();
    }
    var cf = this.a[this.a.length - 1];
    var i = this.a.length - 1;
    while (--i >= 0) {
      if (!this.a[i].equals(RPN.ZERO)) {
        //cf = cf.commonFraction(this.a[i]);
        var y = this.a[i];
        var lcm = cf.getDenominator().divide(cf.getDenominator().gcd(y.getDenominator())).multiply(y.getDenominator());
        cf = cf.getNumerator().gcd(y.getNumerator()).divide(lcm);
      }
    }
    return cf;
  };

  // add, multiply, divideAndRemainder

  Polynom.prototype.negate = function () {
    //TODO: fix
    return this.multiply(new Polynom([RPN.ONE.negate()]));
  };

  Polynom.prototype.subtract = function (l) {
    return this.negate().add(l).negate();
  };

  Polynom.prototype.divide = function (l) {
    if (l.equals(RPN.ONE)) {
      return this;
    }
    return l.dividePolynom(this);
  };
  Expression.Division.prototype.dividePolynom = function (p) {
    return this.divideExpression(p);
  };
  Polynom.prototype.dividePolynom = function (l) {
    //return this.divideAndRemainder(l).quotient;
    var a = l;
    var b = this;
    if (a.a.length === 0 && b.a.length !== 0) {
      return a;
    }
    var t = undefined;
    while (b.a.length !== 0) {
      t = a.remainder(b);
      a = b;
      b = t;
    }
    var gcd = a;
    var x = l.divideAndRemainder(gcd).quotient;
    return this.equals(gcd) ? x : new Expression.Division(x, this.divideAndRemainder(gcd).quotient);
  };

  Polynom.prototype.remainder = function (l) {
    return this.divideAndRemainder(l).remainder;
  };

  Polynom.prototype.getroots = function () {
    var roots = [];
    var np = this.divide(new Polynom([this.getcoef()]));

    var specialCases = [{ // x = 0, x = 1, x = -1
      x: new Polynom([RPN.ZERO, RPN.ONE]),
      f: RPN.ZERO
    },
      {
        x: new Polynom([RPN.ONE.negate(), RPN.ONE]),
        f: RPN.ONE
      },
      {
        x: new Polynom([RPN.ONE, RPN.ONE]),
        f: RPN.ONE.negate()
      }];
    var zz = undefined;
    var pZERO = new Polynom([RPN.ZERO]);//TODO: fix

    var i = -1;
    while (++i < specialCases.length) {
      zz = np.divideAndRemainder(specialCases[i].x);
      while (zz.remainder.equals(pZERO)) {
        np = zz.quotient;
        roots.push(specialCases[i].f);
        zz = np.divideAndRemainder(specialCases[i].x);
      }
    }

    if (np.a.length === 2) {
      if (global.hit != undefined) {
        global.hit({getroots: "linear"});
      }
      roots.push(np.a[0].negate().divide(np.a[1]));
    }

    if (np.a.length <= 2) {
      return roots;
    }

    var an = np.a[np.a.length - 1];
    var a0 = np.a[0];

    //TODO: http://en.wikipedia.org/wiki/Polynomial_remainder_theorem
    //var fp1 = getBigInteger(np.calcAt(1));
    //var fm1 = getBigInteger(np.calcAt(-1));

    // p/q
    //TODO: forEach -> some ?
    Expression.everyDivisor(a0, function (p) {
      return Expression.everyDivisor(an, function (q) {
        var sign = -3;
        while ((sign += 2) < 3) {
          var sp = p.multiply(sign === -1 ? RPN.ONE.negate() : RPN.ONE);
          var f = sp.divide(q);

          if (// fp1.remainder(sp.subtract(q)).equals(ZERO) &&
              // fm1.remainder(sp.add(q)).equals(ZERO) &&
              // sp.gcd(q).equals(ONE) && //?
               np.calcAt(f).equals(RPN.ZERO)) {//?
            var x = new Polynom([sp.negate(), q]);
            var z = np.divideAndRemainder(x);
            while (z.remainder.equals(pZERO)) {
              roots.push(f);
              np = z.quotient;
              if (np.a.length === 2) {
                roots.push(np.a[0].negate().divide(np.a[1]));
                return false;// or divide
              }
              if (np.a.length <= 2) {
                return false;
              }
              //TODO: !!!
              //an = np.a[np.a.length - 1];//!
              //a0 = np.a[0];//!

              // fp1 = fp1.divide(q.subtract(sp));
              // fm1 = fm1.divide(q.negate().subtract(sp));
              z = np.divideAndRemainder(x);
            }
          }
        }
        return true;
      });
    });

    //TODO: remove (use Expression#squareRoot) - ?
    var squareRootInternal = function (x) {
      //if (x instanceof Expression.Integer && x.compareTo(RPN.ZERO) >= 0) {
      //}
      /*
      if (x instanceof Expression.Exponentiation) {
        return x.b instanceof Expression.Integer && x.b.remainder(RPN.TWO).compareTo(RPN.ZERO) === 0 ? x.a.pow(x.b.divide(RPN.TWO)) : undefined;
      }
      if (x instanceof Expression.Multiplication) {
        var sa = squareRoot(x.a);
        var sb = squareRoot(x.b);
        return sa == undefined || sb == undefined ? undefined : sa.multiply(sb);
      }
      */
      try {
        return x.squareRoot();
      } catch (error) {
        //TODO:
      }
      return undefined;
    };

    var squareRoot = function (x, np) {
      var y = squareRootInternal(x);
      if (y == undefined) {
        window.setTimeout(function () {
          throw new RangeError("squareRoot:" + x.toString() + ":" + np.toString());
        }, 0);
      }
      return y;
    };

    //! new: solution of quadratic equations
    if (np.a.length === 3) {
      var a = np.a[2];
      var b = np.a[1];
      var c = np.a[0];
      var D = b.multiply(b).subtract(RPN.TWO.multiply(RPN.TWO).multiply(a).multiply(c));
      var sD = squareRoot(D, np);
      if (sD != undefined) {
        var x1 = b.negate().subtract(sD).divide(RPN.TWO.multiply(a));
        var x2 = b.negate().add(sD).divide(RPN.TWO.multiply(a));
        roots.push(x1);
        roots.push(x2);
      }
      if (global.hit != undefined) {
        global.hit({getroots: "quadratic-" + (D instanceof Expression.Integer ? D.compareTo(RPN.ZERO) : "?")});
      }
    }

    if (np.a.length > 3) {
      var isPalindromic = true;
      var isAntipalindromic = true;
      var n = np.a.length;
      for (var j = 0; j < n; j += 1) {
        isPalindromic = isPalindromic && np.a[j].equals(np.a[n - 1 - j]);
        isAntipalindromic = isAntipalindromic && np.a[j].equals(np.a[n - 1 - j].negate());
      }
      if (isPalindromic) {
        //TODO: fix
        if (global.hit != undefined) {
          //TODO:
          global.hit({getroots: "palindromic:" + np.toString()});
        }
      }
      if (isAntipalindromic) {
        //TODO: fix
        if (global.hit != undefined) {
          global.hit({getroots: "antipalindromic:" + np.toString()});
        }
      }
    }
    if (np.a.length === 5) {
      if (np.a[1].equals(RPN.ZERO) && np.a[3].equals(RPN.ZERO)) {
        //TODO: fix
        if (global.hit != undefined) {
          global.hit({getroots: "biquadratic"});
        }
        window.setTimeout(function () {
          throw new RangeError(np.toString());
        }, 0);
        // t = x^2
        var q = new Polynom([np.a[0], np.a[2], np.a[4]]);
        var qRoots = q.getroots();
        for (var k = 0; k < qRoots.length; k += 1) {
          var qRoot = qRoots[k];
          var s = squareRoot(qRoot, np);
          if (s != undefined) {
            roots.push(s);
            roots.push(s.negate());
          }
        }
      }
    }
    if (np.a.length === 5 && !np.a[3].equals(RPN.ZERO)) {//TODO: other degrees
      try {
        var m = np.a[1].divide(np.a[3]);
        var isQuasiPalindromic = np.a[4].equals(np.a[0].multiply(m.multiply(m)));
        if (isQuasiPalindromic) {
          //TODO: fix
          if (global.hit != undefined) {
            global.hit({getroots: "quasi-palindromic:" + np.toString()});
          }
        }
      } catch (error) {
        window.setTimeout(function () {
          throw new RangeError(np.toString());
        }, 0);
      }
    }
    if (np.a.length === 4) {
      // https://en.wikipedia.org/wiki/Cubic_function#Algebraic_solution
      var context = new RPN.Context(function (id) {
        return np.a[3 - (id.charCodeAt(0) - "a".charCodeAt(0))];
      });
      var delta = RPN("18*a*b*c*d-4*b^3*d+b^2*c^2-4*a*c^3-27*a^2*d^2", context).simplify();
      if (delta instanceof Expression.Integer && delta.compareTo(RPN.ZERO) === 0) {
        var delta0 = RPN("b^2-3*a*c", context).simplify();
        //TODO: fix
        if (global.hit != undefined) {
          global.hit({getroots: "cubic-0-" + (delta0 instanceof Expression.Integer ? delta0.compareTo(RPN.ZERO) : "?")});
          window.setTimeout(function () {
            throw new RangeError(np.toString());
          }, 0);
        }
        if (delta0 instanceof Expression.Integer && delta0.compareTo(RPN.ZERO) === 0) {
          var root = RPN("-b/(3*a)", context).simplify();
          roots.push(root);
          roots.push(root);
          roots.push(root);
        } else {
          //TODO:
        }
      } else {
        //TODO: fix
        if (global.hit != undefined) {
          global.hit({getroots: "cubic-" + (delta instanceof Expression.Integer ? delta.compareTo(RPN.ZERO) : "?")});
          window.setTimeout(function () {
            throw new RangeError(np.toString());
          }, 0);
        }
      }
    }
    if (np.a.length > 4) {
      global.hit({getroots: "-" + np.a.length});
    }

    return roots;
  };

  global.Polynom = Polynom;
  global.RPN = RPN;

}(this));

/*jslint plusplus: true, vars: true, indent: 2 */
/*global RPN */

(function (global) {
  "use strict";

  //    API same as http://sylvester.jcoglan.com/api/matrix
  //    new Matrix([
  //      [1, 2, 3],
  //      [5, 6, 7],
  //      [7, 8,-1]
  //    ]);

  function Matrix(data) {
    this.a = data;
  }

  Matrix.Zero = function (rows, cols) {
    var a = new Array(rows);
    var i = -1;
    while (++i < rows) {
      var j = -1;
      var x = new Array(cols);
      while (++j < cols) {
        x[j] = RPN.ZERO;
      }
      a[i] = x;
    }
    return new Matrix(a);
  };

  // identity n x n;
  Matrix.I = function (n) {
    return Matrix.Zero(n, n).map(function (element, i, j) {
      return (i === j ? RPN.ONE : RPN.ZERO);
    });
  };

  Matrix.prototype.rows = function () {
    return this.a.length;
  };

  Matrix.prototype.cols = function () {
    return this.a.length > 0 ? this.a[0].length : 0;
  };

  Matrix.prototype.e = function (i, j) {
    return this.a[i][j];
  };

  Matrix.prototype.isSquare = function () {
    return this.rows() > 0 && this.rows() === this.cols();//?
  };

  Matrix.prototype.map = function (callback) {
    var rows = this.rows();
    var cols = this.cols();
    var c = new Array(rows);
    var i = -1;
    while (++i < rows) {
      var x = new Array(cols);
      var j = -1;
      while (++j < cols) {
        var e = callback.call(undefined, this.e(i, j), i, j, this);
        x[j] = e.simplifyExpression();//?
      }
      c[i] = x;
    }
    return new Matrix(c);
  };

  Matrix.prototype.transpose = function () {
    var that = this;
    return Matrix.Zero(that.cols(), that.rows()).map(function (element, i, j) {
      return that.e(j, i);
    });
  };

  Matrix.prototype.scale = function (k) {
    return this.map(function (element, i, j) {
      return element.multiply(k);
    });
  };

  Matrix.prototype.multiply = function (b) {
    var a = this;
    if (a.cols() !== b.rows()) {
      throw new RangeError("DimensionMismatchException");
    }
    return Matrix.Zero(a.rows(), b.cols()).map(function (element, i, j) {
      var rows = b.rows();
      var k = -1;
      while (++k < rows) {
        //! this code is used to show not simplified expressions
        var current = a.e(i, k).multiply(b.e(k, j));
        element = k === 0 ? current : element.add(current);
      }
      return element;
    });
  };

  Matrix.prototype.add = function (b) {
    var a = this;
    if (a.rows() !== b.rows() || a.cols() !== b.cols()) {
      throw new RangeError("MatrixDimensionMismatchException");
    }
    return a.map(function (elem, i, j) {
      return elem.add(b.e(i, j));
    });
  };

  Matrix.prototype.augment = function (b) { // ( this | m )  m.rows() ==== this.rows()
    if (this.rows() !== b.rows()) {
      throw new RangeError("NonSquareMatrixException");
    }
    var a = this;
    return Matrix.Zero(a.rows(), a.cols() + b.cols()).map(function (element, i, j) {
      return (j < a.cols() ? a.e(i, j) : b.e(i, j - a.cols()));
    });
  };

  Matrix.prototype.rowReduce = function (targetRow, pivotRow, pivotColumn, currentOrPreviousPivot) {
    if (currentOrPreviousPivot == undefined) {
      currentOrPreviousPivot = this.e(pivotRow, pivotColumn);
    }
    var rows = this.rows();
    var cols = this.cols();
    var c = new Array(rows);
    var i = -1;
    while (++i < rows) {
      var x = this.a[i];
      if (targetRow === i) {
        x = new Array(cols);
        var j = -1;
        while (++j < cols) {
          var e = this.e(pivotRow, pivotColumn).multiply(this.e(targetRow, j)).subtract(this.e(targetRow, pivotColumn).multiply(this.e(pivotRow, j))).divide(currentOrPreviousPivot);
          x[j] = e.simplifyExpression();
        }
        c[i] = x;
      }
      c[i] = x;
    }
    return new Matrix(c);
  };

  // reduceToCanonical - make zeros under diagonal and divide by pivot element, also swap row instead of addition
  // private
  Matrix.prototype.toRowEchelon2 = function (reduceToCanonical, isItADeterminantCalculation, callback) {
    callback = callback == undefined ? undefined : callback;
    var m = this;
    var pivotRow = 0;
    var pivotColumn = -1;
    var oldMatrix = undefined;

    var targetRow = -1;
    var coefficient = undefined;

    var rows = m.rows();
    var cols = m.cols();
    while (++pivotColumn < cols) {
      // pivot searching
      targetRow = pivotRow;
      // not zero element in a column (starting from the main diagonal);
      while (targetRow < rows && m.e(targetRow, pivotColumn).equals(RPN.ZERO)) {
        targetRow += 1;
      }
      if (targetRow < rows) {
        if (targetRow !== pivotRow) {
          oldMatrix = m;
          m = m.map(function (e, i, j) {
            if (i === pivotRow) {
              return m.e(targetRow, j);
            }
            if (i === targetRow) {
              return isItADeterminantCalculation ? m.e(pivotRow, j).negate() : m.e(pivotRow, j);
            }
            return e;
          });
          if (callback != undefined) {
            callback({newMatrix: m, oldMatrix: oldMatrix, type: isItADeterminantCalculation ? "swap-negate" : "swap", targetRow: pivotRow, pivotRow: targetRow, pivotColumn: pivotColumn});
          }
        }
        // making zeros under the main diagonal
        if (reduceToCanonical && !m.e(pivotRow, pivotColumn).equals(RPN.ONE)) {
          oldMatrix = m;
          coefficient = RPN.ONE.divide(m.e(pivotRow, pivotColumn));
          m = m.map(function (e, i, j) {
            if (i !== pivotRow) {
              return e;
            }
            return e.multiply(coefficient);
          });
          if (callback != undefined) {
            callback({newMatrix: m, oldMatrix: oldMatrix, type: "divide", targetRow: pivotRow, pivotRow: pivotRow, pivotColumn: pivotColumn});
          }
        }

        targetRow = pivotRow;
        while (++targetRow < rows) {
          if (!m.e(targetRow, pivotColumn).equals(RPN.ZERO)) {
            oldMatrix = m;
            m = m.rowReduce(targetRow, pivotRow, pivotColumn);
            if (callback != undefined) {
              callback({newMatrix: m, oldMatrix: oldMatrix, type: "reduce", targetRow: targetRow, pivotRow: pivotRow, pivotColumn: pivotColumn});
            }
          }
        }
        pivotRow += 1;
      }
    }
    // back-substitution
    if (reduceToCanonical) {
      while (--pivotRow >= 0) {
        pivotColumn = 0;
        while (pivotColumn < rows && m.e(pivotRow, pivotColumn).equals(RPN.ZERO)) {
          pivotColumn += 1;
        }
        if (pivotColumn < rows) {
          targetRow = pivotRow;
          while (--targetRow >= 0) {
            if (!m.e(targetRow, pivotColumn).equals(RPN.ZERO)) {
              oldMatrix = m;
              m = m.rowReduce(targetRow, pivotRow, pivotColumn);
              if (callback != undefined) {
                callback({newMatrix: m, oldMatrix: oldMatrix, type: "reduce", targetRow: targetRow, pivotRow: pivotRow, pivotColumn: pivotColumn});
              }
            }
          }
        }
      }
    }

    return m;
  };

  // https://es.wikipedia.org/wiki/M%C3%A9todo_Montante
  // private
  Matrix.prototype.toRowEchelon3 = function (isItADeterminantCalculation, callback) {
    callback = callback == undefined ? undefined : callback;
    var m = this;
    var pivotRow = 0;
    var pivotColumn = -1;
    var oldMatrix = undefined;

    var targetRow = -1;
    var previousPivot = RPN.ONE;

    var rows = m.rows();
    var cols = m.cols();
    while (++pivotColumn < cols) {
      // pivot searching
      targetRow = pivotRow;
      // not zero element in a column (starting from the main diagonal);
      while (targetRow < rows && m.e(targetRow, pivotColumn).equals(RPN.ZERO)) {
        targetRow += 1;
      }
      if (targetRow < rows) {
        if (targetRow !== pivotRow) {
          oldMatrix = m;
          m = m.map(function (e, i, j) {
            if (i === pivotRow) {
              return m.e(targetRow, j);
            }
            if (i === targetRow) {
              return isItADeterminantCalculation ? m.e(pivotRow, j).negate() : m.e(pivotRow, j);
            }
            return e;
          });
          if (callback != undefined) {
            callback({previousPivot: previousPivot, newMatrix: m, oldMatrix: oldMatrix, type: isItADeterminantCalculation ? "swap-negate" : "swap", targetRow: pivotRow, pivotRow: targetRow, pivotColumn: pivotColumn});
          }
        }
        oldMatrix = m;
        targetRow = -1;
        while (++targetRow < rows) {
          if (targetRow !== pivotRow) {
            m = m.rowReduce(targetRow, pivotRow, pivotColumn, previousPivot);
          }
        }
        if (callback != undefined) {
          callback({previousPivot: previousPivot, newMatrix: m, oldMatrix: oldMatrix, type: "pivot", targetRow: -1, pivotRow: pivotRow, pivotColumn: pivotColumn});
        }
        previousPivot = m.e(pivotRow, pivotColumn);
        pivotRow += 1;
      }
    }
    return m;
  };

  Matrix.Gauss = "Gauss";
  Matrix.GaussJordan = "Gauss-Jordan";
  Matrix.GaussMontante = "Gauss-Montante";
  Matrix.prototype.toRowEchelon = function (method, isItADeterminantCalculation, callback) {
    if (method === Matrix.Gauss) {
      return this.toRowEchelon2(false, isItADeterminantCalculation, callback);
    }
    if (method === Matrix.GaussJordan) {
      return this.toRowEchelon2(true, isItADeterminantCalculation, callback);
    }
    if (method === Matrix.GaussMontante) {
      return this.toRowEchelon3(isItADeterminantCalculation, callback);
    }
    throw new Error();
  };

  Matrix.prototype.determinant = function () { // m == n  // via row echelon form
    var n = this.rows();
    if (!this.isSquare() || n === 0) {
      throw new RangeError("NonSquareMatrixException");
    }
    if (false) {
      var m = this.toRowEchelon(Matrix.Gauss, true, undefined);
      var r = undefined;
      var j = -1;
      while (++j < n) {
        r = r == undefined ? m.e(j, j) : r.multiply(m.e(j, j));
      }
      return r;
    }
    return this.toRowEchelon(Matrix.GaussMontante, true, undefined).e(n - 1, n - 1);
  };

  Matrix.prototype.rank = function () {
    // rank === count of non-zero rows after bringing to row echelon form ...
    //var m = this.toRowEchelon(Matrix.Gauss, false, undefined).transpose().toRowEchelon(Matrix.Gauss, false, undefined);
    var m = this.toRowEchelon(Matrix.GaussMontante, false, undefined).transpose().toRowEchelon(Matrix.GaussMontante, false, undefined);
    var result = 0;
    var i = m.rows() < m.cols() ? m.rows() : m.cols();

    while (--i >= 0) {
      result += m.e(i, i).equals(RPN.ZERO) ? 0 : 1;
    }
    return result;
  };

  Matrix.prototype.inverse = function () { // m == n by augmention ...
    if (!this.isSquare()) {
      throw new RangeError("NonSquareMatrixException");
    }
    var m = this.augment(Matrix.I(this.rows()));
    //m = m.toRowEchelon(Matrix.GaussJordan, false, undefined);
    m = m.toRowEchelon(Matrix.GaussMontante, false, undefined);

    return Matrix.Zero(m.rows(), m.rows()).map(function (element, i, j) { // splitting to get the second half
      var e = m.e(i, i);
      if (e.equals(RPN.ZERO)) {
        throw new RangeError("SingularMatrixException");
      }
      var x = m.e(i, j + m.rows());
      return e.equals(RPN.ONE) ? x : x.divide(e);
    });
  };

  Matrix.prototype.toString = function (options) {
    var result = "";
    var rows = this.rows();
    var cols = this.cols();
    var j = -1;
    result += "{";
    while (++j < rows) {
      if (j !== 0) {
        result += ",";
      }
      result += "{";
      var i = -1;
      while (++i < cols) {
        if (i !== 0) {
          result += ",";
        }
        result += this.e(j, i).toString(options);
      }
      result += "}";
    }
    result += "}";
    return result;
  };

  Matrix.prototype.negate = function () {
    return this.map(function (element, i, j) {
      return element.negate();
    });
  };

  Matrix.prototype.subtract = function (b) {
    return this.negate().add(b).negate();
  };

  //?
  // returns an array of arrays of strings
  Matrix.prototype.getElements = function () {
    var elements = [];
    for (var i = 0; i < this.rows(); i += 1) {
      var row = [];
      for (var j = 0; j < this.cols(); j += 1) {
        row[j] = this.e(i, j).toString();
      }
      elements[i] = row;
    }
    return elements;
  };

  Matrix.prototype.slice = function (rowsStart, rowsEnd, colsStart, colsEnd) {
    var data = this.a;
    var n = data.slice(rowsStart, rowsEnd);
    var i = n.length;
    while (--i >= 0) {
      n[i] = n[i].slice(colsStart, colsEnd);
    }
    return new Matrix(n);
  };

  /*
  // TODO: remove
  Matrix.prototype.stripZeroRows = function () {
    var rows = this.rows();
    var cols = this.cols();
    var i = rows;
    var j = cols;
    while (j === cols && --i >= 0) {
      j = 0;
      while (j < cols && this.e(i, j).equals(RPN.ZERO)) {
        j += 1;
      }
    }
    i += 1;
    var that = this;
    return i === rows ? this : Matrix.Zero(i, cols).map(function (e, i, j) {
      return that.e(i, j);
    });
  };
  */

  // string -> array of array of strings, find `extraPositionOffset`
  Matrix.split = function (input) {
    var result = [];
    var m = input;
    if (/^\s*\[[^\[\]]*\]\s*$/.exec(m)) {//!
      m = m.replace(/\[/g, " ");
      m = m.replace(/\]/g, " ");
    }//!
    if (m.replace(/^\s+|\s+$/g, "") !== "") {
      m = m.replace(/;/g, "\n");//? ; -> \n
      m = m.replace(/\r/g, "\n");
      var row = [];
      result.push(row);
      var position = 0;
      var match = undefined;
      while ((match = /^\s*\S+/.exec(m.slice(position))) != undefined) {
        var t = match[0];
        if (t.indexOf("\n") !== -1 && row.length !== 0) {
          row = [];
          result.push(row);
          t = t.replace(/\n/g, " ");
        }
        row.push(t);
        position += t.length;
      }
    }
    return result;
  };

  Matrix.padRows = function (array, convert) {
    var rows = array.length;
    var cols = 0;
    for (var k = 0; k < rows; k += 1) {
      cols = Math.max(cols, array[k].length);
    }
    var data = new Array(rows);
    for (var i = 0; i < rows; i += 1) {
      var y = array[i];
      var x = new Array(cols);
      for (var j = 0; j < cols; j += 1) {
        x[j] = j < y.length ? (convert ? RPN(y[j]) : y[j]) : RPN.ZERO;
      }
      data[i] = x;
    }
    return new Matrix(data);
  };

  Matrix.toMatrix = function (array) {
    return Matrix.padRows(array, true);
  };

  global.Matrix = Matrix;

}(this));

/*global window, document */

(function (global) {
  // Frédéric Wang - https://github.com/fred-wang/mathml.css/blob/master/mspace.js
  /* This Source Code Form is subject to the terms of the Mozilla Public
   * License, v. 2.0. If a copy of the MPL was not distributed with this
   * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
   /*global document, Node*/
  "use strict";

  //! global.mathStartTag and global.mathEndTag should not be used before they will be initialized.

  global.mathStartTag = "<custom-math class=\"math\">";
  global.mathEndTag = "</custom-math>";

  document.addEventListener("DOMContentLoaded", function (event) {
    var div = document.createElement("div");
    div.innerHTML = "<math><mspace mathcolor=\"#FF0000\" height=\"23px\" width=\"77px\"></mspace></math>";
    div.style.position = "absolute";
    div.style.zIndex = "-1";
    div.style.clip = "rect(0 0 0 0)";
    document.body.appendChild(div);
    //var box = div.firstChild.firstChild.getBoundingClientRect();
    //var ok = box.bottom - box.top >= 23;
    var ok = window.getComputedStyle(div.firstChild.firstChild, undefined).color.indexOf("255") !== -1;
    document.body.removeChild(div);
    if (ok) {
      global.mathStartTag = "<math>";
      global.mathEndTag = "</math>";
      // I want to have focusable and draggable element, menclose[href="#"] can be used, but I need to prevent the navigation.
      document.addEventListener("click", function (event) {
        if (event.button !== 2) {
          var target = event.target;
          while (target != undefined && (target.nodeType !== Node.ELEMENT_NODE || target.getAttribute("href") == undefined)) {
            target = target.parentNode;
          }
          if (target != undefined && target.getAttribute("href") === "#") {
            var tagName = target.tagName.toUpperCase();
            if (tagName === "MROW" || tagName === "MTD" || tagName === "MENCLOSE") {
              event.preventDefault();
            }
          }
        }
      }, false);
    }
  }, false);

}(this));

/*jslint plusplus: true, vars: true, indent: 2 */
/*global document */

(function (global) {
  "use strict";

  function Utils() {
  }

  Utils.on = function (eventType, selector, listener) {
    Utils.initialize(selector, function (element) {
      element.addEventListener(eventType, listener, false);
    });
  };

  Utils.escapeHTML = function (s) {
    return s.replace(/&/g, "&amp;")
            .replace(/"/g, "&quot;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;");
  };

  Utils.appendScript = function (src) {
    var script = document.createElement("script");
    script.async = true;
    script.src = src;
    document.head.appendChild(script);
  };

  Utils.initializers = {};

  var checkElement = function (element) {
    var initialized = element.getAttribute("data-i");
    if (initialized == undefined) {
      var classList = element.classList;
      var classListLength = classList == undefined ? 0 : classList.length; // <math> in IE 11, Opera 12 (during the check for MathML support)
      if (classListLength !== 0) {
        element.setAttribute("data-i", "1");
      }
      var t = false;
      var k = -1;
      while (++k < classListLength) {
        var className = classList[k];
        var callback = Utils.initializers[className];
        if (callback != undefined) {
          if (t) {
            throw new Error(classList.toString());
          }
          t = true;
          callback(element);
        }
      }
    }
  };

  var checkCustomPaint = function (element) {
    if (element.getAttribute("data-custom-paint") != undefined) {
      if (element.getAttribute("data-p") == undefined && element.getBoundingClientRect().top !== 0) {
        element.setAttribute("data-p", "1");
        var event = document.createEvent("Event");
        event.initEvent("custom-paint", true, false);
        element.dispatchEvent(event);
      }
    }
  };

  var checkSubtree = function (element) {
    checkElement(element);
    checkCustomPaint(element);
    var firstElementChild = element.firstElementChild;
    while (firstElementChild != undefined) {
      checkSubtree(firstElementChild);
      firstElementChild = firstElementChild.nextElementSibling;
    }
  };

  var started = false;

  Utils.initialize = function (selector, callback) {
    var className = selector.slice(1);
    if (started || Utils.initializers[className] != undefined) {
      throw new Error(className);
    }
    Utils.initializers[className] = callback;
  };

  Utils.observe = function () {
    if (!started) {
      started = true;
      // some initializers can modify DOM, so it is important to call `checkSubtree` after `observer.observe`
      checkSubtree(document.documentElement);
    }
  };

  document.addEventListener("DOMContentLoaded", function (event) {
    Utils.observe();
  }, false);

  // workaround for browsers, which do not support MutationObserver
  Utils.check = function (element) {
    checkSubtree(element);
  };

  Utils.check1 = function (element) {
    checkSubtree(element);
  };

  global.Utils = Utils;

}(this));

/*global document, window */

(function (global) {
  "use strict";

  function Dialog() {
  }

  Dialog.lastFocused = undefined; //?

  var ANIMATION_DURATION = 120;

  var idCounter = 0;

  var onClose = function (event) {
    var dialog = this;
    var activeElement = document.activeElement;
    while (activeElement != undefined && activeElement !== dialog) {
      activeElement = activeElement.parentNode;
    }
    if (activeElement != undefined && Dialog.lastFocused != undefined) {
      Dialog.lastFocused.focus();
      Dialog.lastFocused = undefined;
    }
    if (dialog.animate != undefined) {
      dialog.style.display = "block";
      dialog.style.opacity = "0";
      dialog.style.transform = "scale(0.75)";
      dialog.animate([
        {transform: "scale(1.3333333333333333)", opacity: "1"},
        {transform: "scale(1)", opacity: "0"}
      ], {
        duration: ANIMATION_DURATION,
        composite: "add"
      });
      window.setTimeout(function () {
        dialog.style.display = "";
      }, ANIMATION_DURATION);
    }
    var backdrop = document.getElementById(this.getAttribute("data-backdrop-id"));
    if (backdrop != undefined) {
      if (backdrop.animate != undefined) {
        backdrop.style.opacity = "0";
        backdrop.animate([
          {opacity: "1"},
          {opacity: "0"}
        ], {
          duration: ANIMATION_DURATION,
          composite: "add"
        });
        window.setTimeout(function () {
          if (backdrop.parentNode != undefined) {
            document.body.removeChild(backdrop);
          }
        }, ANIMATION_DURATION);
      } else {
        document.body.removeChild(backdrop);
      }
    }
  };

  var show = function (anchorRect, anchorPoints, isModal) {
    if (Dialog.lastFocused == undefined) {
      Dialog.lastFocused = document.activeElement;
    }
    var backdrop = undefined;
    if (isModal) {
      backdrop = document.createElement("div");
      backdrop.id = this.getAttribute("data-backdrop-id");
      backdrop.classList.toggle("backdrop", true);
      document.body.appendChild(backdrop);
    }

    this.style.visibility = "hidden";
    this.style.display = "block";
    this.style.transform = "scale(1)";
    this.style.left = "0px";
    this.style.top = "0px";

    var rect = this.getBoundingClientRect();
    var style = window.getComputedStyle(this, undefined);
    var marginRect = {
      left: rect.left - Number.parseFloat(style.marginLeft),
      right: rect.right + Number.parseFloat(style.marginRight),
      top: rect.top - Number.parseFloat(style.marginTop),
      bottom: rect.bottom + Number.parseFloat(style.marginBottom)
    };
    var width = marginRect.right - marginRect.left;
    var height = marginRect.bottom - marginRect.top;

    var left = 0;
    var top = 0;
    if (anchorRect != undefined || anchorPoints != undefined) {
      if (anchorPoints != undefined) {
        left = anchorPoints[0][0] - width * anchorPoints[1][0];
        top = anchorPoints[0][1] - height * anchorPoints[1][1];
      } else {
        left = anchorRect.right;
        top = anchorRect.bottom;
        if (left > document.documentElement.clientWidth - width) {
          left = anchorRect.left - width;
        }
        if (top > document.documentElement.clientHeight - height) {
          top = anchorRect.top - height;
        }
      }
      left = Math.max(0, Math.min(left, document.documentElement.clientWidth - width));
      top = Math.max(0, Math.min(top, document.documentElement.clientHeight - height));
      left += window.pageXOffset;
      top += window.pageYOffset;
      this.style.left = left.toString() + "px";
      this.style.top = top.toString() + "px";
    } else {
      left = window.pageXOffset + (window.innerWidth - width) / 2;
      top = window.pageYOffset + (window.innerHeight - height) / 2;
      this.style.left = Math.max(0, left).toString() + "px";
      this.style.top = Math.max(0, top).toString() + "px";
    }

    this.style.display = "";
    this.style.visibility = "";

    if (isModal) {
      this.nativeShowModal();
    } else {
      // "show" moves the focus (see highlight.js, reportValidity.js)
      //this.nativeShow();
      this.setAttribute("open", "open");
    }

    if (this.animate != undefined) {
      this.style.opacity = "1";
      this.style.transform = "scale(1)";
      this.animate([
        {transform: "scale(0.75)", opacity: "-1"},
        {transform: "scale(1)", opacity: "0"}
      ], {
        duration: ANIMATION_DURATION,
        composite: "add"
      });
    }
    if (isModal) {
      if (backdrop.animate != undefined) {
        backdrop.style.opacity = "1";
        backdrop.animate([
          {opacity: "-1"},
          {opacity: "0"}
        ], {
          duration: ANIMATION_DURATION,
          composite: "add"
        });
      }
    }
  };

  Dialog.create = function () {
    var dialog = document.createElement("dialog");
    dialog.initDialog();
    dialog.nativeShowModal = dialog.showModal;
    //dialog.nativeShow = dialog.show;
    dialog.show = Dialog.prototype.show;
    dialog.showModal = Dialog.prototype.showModal;
    dialog.addEventListener("close", onClose, false);
    var backdropId = "backdrop" + (idCounter += 1).toString();
    dialog.setAttribute("data-backdrop-id", backdropId);
    return dialog;
  };

  Dialog.prototype.show = function (anchorRect, anchorPoints) {
    return show.call(this, anchorRect, anchorPoints, false);
  };

  Dialog.prototype.showModal = function (anchorRect, anchorPoints) {
    return show.call(this, anchorRect, anchorPoints, true);
  };

  // "Cancel", "OK", "Close"
  Dialog.standard = function (anchorRect, anchorPoints, contentHTML, buttonsHTML) {
    var dialog = Dialog.create();
    var contentId = "dialog-content";
    dialog.classList.toggle("standard-dialog", true);
    dialog.setAttribute("aria-describedby", contentId);
    dialog.innerHTML = "<form method=\"dialog\">" +
                       "<button type=\"submit\" class=\"close\">&times;</button>" +
                       "<div id=\"" + contentId + "\" class=\"content\">" + contentHTML + "</div>" +
                       "<div class=\"buttons\">" + buttonsHTML + "</div>" +
                       "</form>";
    document.body.appendChild(dialog);
    dialog.addEventListener("close", function (event) {
      window.setTimeout(function () {
        document.body.removeChild(dialog);
      }, 2000);
    }, false);
    dialog.showModal(anchorRect, anchorPoints);
    return dialog;
  };

  Dialog.alert = function (contentHTML) {
    window.setTimeout(function () { // hack to prevent the closing of new dialog immediately in Chrome
      Dialog.standard(undefined, undefined, contentHTML, "<button autofocus=\"autofocus\" type=\"submit\">OK</button>");
    }, 0);
  };

  global.Dialog = Dialog;
  
}(this));

/*global document, Dialog, Utils */

(function (global) {
  "use strict";

  var oldHighlights = undefined;
  var highlight = function (element) {
    if (oldHighlights != undefined) {
      for (var i = 0; i < oldHighlights.length; i += 1) {
        var t = document.getElementById(oldHighlights[i]);
        if (t != undefined) {
          t.removeAttribute("mathbackground");
        }
      }
      oldHighlights = undefined;
    }
    if (element != undefined) {
      var highlight = element.getAttribute("data-highlight"); // #id1, #id2, ...
      if (highlight != undefined) {
        var newHighlights = highlight.replace(/[#\s]/g, "").split(",");
        for (var j = 0; j < newHighlights.length; j += 1) {
          var e = document.getElementById(newHighlights[j]);
          if (e != undefined) {
            e.setAttribute("mathbackground", "#FAEBD7");
          }
        }
        oldHighlights = newHighlights;
      }
    }
  };

  var tooltip = Dialog.create();
  tooltip.id = "highlight-tooltip";
  tooltip.setAttribute("role", "tooltip");
  tooltip.classList.toggle("tooltip-dialog", true);

  var keyDownTarget = undefined;

  var hideTooltip = function () {
    keyDownTarget.removeEventListener("keydown", onKeyDown, false);
    keyDownTarget.removeAttribute("aria-describedby");
    tooltip.close();
    keyDownTarget = undefined;
  };

  var onKeyDown = function (event) {
    var DOM_VK_ESCAPE = 27;
    if (event.keyCode === DOM_VK_ESCAPE && !event.ctrlKey && !event.altKey && !event.shiftKey && !event.metaKey && !event.defaultPrevented) {
      event.preventDefault();
      hideTooltip();
    }
  };

  var showTooltip = function (element) {
    if (tooltip.getAttribute("open") != undefined) {
      hideTooltip();
    }
    if (element != undefined) {
      var tooltipId = element.getAttribute("data-tooltip");
      if (tooltipId != undefined) {
        if (tooltip.parentNode == undefined) {
          document.body.appendChild(tooltip);
        }
        tooltip.innerHTML = document.getElementById(tooltipId).innerHTML;
        keyDownTarget = document.getElementById(element.getAttribute("data-for"));
        var rect = keyDownTarget.getBoundingClientRect();
        keyDownTarget.setAttribute("aria-describedby", tooltip.id);
        keyDownTarget.addEventListener("keydown", onKeyDown, false);
        //NOTE: "show" should not move the focus
        tooltip.show(undefined, [[(rect.left + rect.right) / 2, rect.top], [0.5, 1.0]]);
      }
    }
  };

  var f = function (highlight, selector) {

    var hoveredElements = [];
    var focusedElements = [];

    Utils.initialize(selector, function (element) {
      var x = document.getElementById(element.getAttribute("data-for"));

      //!
      // The idea is to set tabindex="0" only for cells which have a tooltip or a "highlight"
      x.setAttribute("tabindex", "0");
      var tagName = x.tagName.toUpperCase();
      if (tagName === "MROW" || tagName === "MTD" || tagName === "MENCLOSE") {
        x.setAttribute("href", "#");
      }
      //!

      x.addEventListener("mouseenter", function (event) {
        hoveredElements.push(element);
        highlight(hoveredElements.length !== 0 ? hoveredElements[hoveredElements.length - 1] : undefined);
      }, false);
      x.addEventListener("mouseleave", function (event) {
        hoveredElements.pop();
        highlight(hoveredElements.length !== 0 ? hoveredElements[hoveredElements.length - 1] : undefined);
      }, false);
      x.addEventListener("focus", function (event) {
        focusedElements.push(element);
        highlight(focusedElements.length !== 0 ? focusedElements[focusedElements.length - 1] : undefined);
      }, false);
      x.addEventListener("blur", function (event) {
        focusedElements.pop();
        highlight(focusedElements.length !== 0 ? focusedElements[focusedElements.length - 1] : undefined);
      }, false);
    });

  };

  f(highlight, ".a-highlight");
  f(showTooltip, ".a-tooltip");

}(this));

/*global window, document, Dialog*/

window.reportValidity = function (input, validationMessage) {
  "use strict";
  var tooltip = Dialog.create();
  tooltip.setAttribute("role", "tooltip");
  tooltip.id = "report-validity-tooltip-for-" + input.id;
  tooltip.classList.toggle("tooltip", true);
  tooltip.classList.toggle("tooltip-dialog", true);//?
  var tooltipArrowId = "tooltip-arrow-" + input.id;
  tooltip.innerHTML = "<span class=\"exclamation\">!</span> " + validationMessage + "<div class=\"tooltip-arrow-wrapper\"><div id=\"" + tooltipArrowId + "\" class=\"tooltip-arrow\"></div></div>";
  document.body.appendChild(tooltip);

  input.setAttribute("aria-describedby", tooltip.id);
  input.focus();

  var inputRect = input.getBoundingClientRect();

  tooltip.style.visibility = "hidden";
  tooltip.style.display = "block";
  var rect = tooltip.getBoundingClientRect();
  var style = window.getComputedStyle(tooltip, undefined);
  var marginLeft = Number.parseFloat(style.marginLeft);
  var arrowRect = document.getElementById(tooltipArrowId).getBoundingClientRect();
  tooltip.style.display = "";
  tooltip.style.visibility = "";

  var left = (inputRect.left + inputRect.right) / 2 - ((arrowRect.right - arrowRect.left) / 2 + marginLeft + arrowRect.left - rect.left);
  var top = inputRect.bottom + (arrowRect.bottom - arrowRect.top) * 0.15;
  // (17 + 2) * Math.SQRT2 / 2 + 0.25 * 17 + 1 + 0.5 * 17 - (17 + 2) * (Math.SQRT2 - 1) / 2
  // (17 + 2) * Math.SQRT2 * 0.15

  //NOTE: "show" should not move the focus
  tooltip.show(undefined, [[left, top], [0.0, 0.0]]);

  var close = undefined;
  var onKeyDown = undefined;
  var timeoutId = 0;

  close = function (event) {
    window.clearTimeout(timeoutId);
    input.removeEventListener("input", close, false);
    input.removeEventListener("blur", close, false);
    input.removeEventListener("keydown", onKeyDown, false);
    input.removeAttribute("aria-describedby");
    tooltip.close();
    window.setTimeout(function () {
      tooltip.parentNode.removeChild(tooltip);
    }, 3000);
  };
  onKeyDown = function (event) {
    var DOM_VK_ESCAPE = 27;
    if (event.keyCode === DOM_VK_ESCAPE && !event.ctrlKey && !event.altKey && !event.shiftKey && !event.metaKey && !event.defaultPrevented) {
      event.preventDefault();
      close();
    }
  };
  timeoutId = window.setTimeout(function () {
    close(undefined);
  }, 4000);
  input.addEventListener("input", close, false);
  input.addEventListener("blur", close, false);
  input.addEventListener("keydown", onKeyDown, false);

};

/*global document, JSON*/

(function (global) {
  "use strict";

  function CustomMenclose() {
  }
  CustomMenclose.getPointByCell = function (paddingRect, rows, indexes) {
    var a = indexes[0];
    var b = indexes[1];
    var e = rows[a][b];
    var r = e.getBoundingClientRect();
    return {
      x: (r.left + r.right) / 2 - paddingRect.left,
      y: (r.top + r.bottom) / 2 - paddingRect.top
    };
  };
  CustomMenclose.paint = function (event) {
    var paddingRect = this.getBoundingClientRect();
    var width = paddingRect.right - paddingRect.left;
    var height = paddingRect.bottom - paddingRect.top;
    var svg = "";
    var cells = JSON.parse(this.getAttribute("data-cells"));
    var color = this.getAttribute("data-color");
    var strokeStyle = color === "0a" ? "#D64040" : (color === "0" ? "#F7D9D9" : (color === "1a" ? "#4040D6" : (color === "1" ? "#D9D9F7" : "")));
    var lineWidth = 1.25;
    var table = this.querySelector("mtable");
    var rows = [];
    var c = table.firstElementChild;
    while (c != undefined) {
      if (c.tagName.toUpperCase() === "MTR") {
        var row = [];
        var t = c.firstElementChild;
        while (t != undefined) {
          if (t.tagName.toUpperCase() === "MTD") {
            row.push(t);
          }
          t = t.nextElementSibling;
        }
        rows.push(row);
      }
      c = c.nextElementSibling;
    }
    for (var i = 0; i < cells.length; i += 1) {
      var p1 = CustomMenclose.getPointByCell(paddingRect, rows, cells[i]);
      var p2 = CustomMenclose.getPointByCell(paddingRect, rows, i === cells.length - 1 ? cells[0] : cells[i + 1]);
      svg += "<line x1=\"" + p1.x.toString() + "\" y1=\"" + p1.y.toString() + "\" x2=\"" + p2.x.toString() + "\" y2=\"" + p2.y.toString() + "\" stroke=\"" + strokeStyle + "\" stroke-width=\"" + lineWidth.toString() + "\" />";
    }
    var backgroundImage = "data:image/svg+xml;charset=utf-8," + encodeURIComponent("<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"" + width.toString() + "\" height=\"" + height.toString() + "\">" + svg + "</svg>");
    this.style.backgroundImage = "url(\"" + backgroundImage + "\")";
    this.style.backgroundSize = "auto auto";
  };

  document.addEventListener("custom-paint", function (event) {
    if (event.target.getAttribute("data-custom-paint") === "custom-menclose") {
      CustomMenclose.paint.call(event.target, event);
    }
  }, false);

}(this));

/*global window, document*/

(function (global) {
  "use strict";

var initializeAInput = function (container) {
  var input = container.firstElementChild;
  if (input.tagName.toUpperCase() !== "INPUT" && input.tagName.toUpperCase() !== "TEXTAREA") {
    throw new Error();
  }

  // see https://github.com/kueblc/LDT

  var inputStyle = window.getComputedStyle(input, undefined);

  // FF does not like font
  var fontFamily = inputStyle.fontFamily;
  var fontSize = Number.parseFloat(inputStyle.fontSize);
  var font = fontSize.toString() + "px" + " " + fontFamily;
  var lineHeight = Number.parseFloat(inputStyle.lineHeight);
  var textAlign = inputStyle.textAlign;

  var marginLeft = Number.parseFloat(inputStyle.marginLeft);
  var marginTop = Number.parseFloat(inputStyle.marginTop);
  var marginRight = Number.parseFloat(inputStyle.marginRight);
  var marginBottom = Number.parseFloat(inputStyle.marginBottom);
  var paddingLeft = Number.parseFloat(inputStyle.paddingLeft);
  var paddingTop = Number.parseFloat(inputStyle.paddingTop);
  var paddingRight = Number.parseFloat(inputStyle.paddingRight);
  var paddingBottom = Number.parseFloat(inputStyle.paddingBottom);

  var isActive = false;
  var backgroundElement = document.createElement("div");
  backgroundElement.style.font = font;
  backgroundElement.style.lineHeight = lineHeight.toString() + "px";
  backgroundElement.style.textAlign = textAlign;
  window.setTimeout(function () { // relayout
    container.insertBefore(backgroundElement, input);
  }, 0);

  var add = function (text, color, backgroundColor, div) {
    var t = color === "transparent" ? text.replace(/[^\r\n\t]/g, " ") : text;
    var span = document.createElement("span");
    span.style.color = color;
    span.style.backgroundColor = backgroundColor;
    if (color !== "transparent") {
      if ("webkitTextStroke" in span.style) {
        span.style.webkitTextStroke = "2.5px";
      } else if ("textShadow" in span.style) {
        span.style.textShadow = "-1px -1px 1px, 1px -1px 1px, -1px 1px 1px, 1px 1px 1px";
      } else {
        span.style.textDecoration = "underline";
      }
    }
    span.appendChild(document.createTextNode(t));
    div.appendChild(span);
  };

  var getBracketMarks = function (value, inputSelectionStart) {
    var selectionStart = inputSelectionStart - 1;
    var c = 0;
    var step = 0;
    var n = selectionStart + 2;
    var pair = 0;
    while (step === 0 && selectionStart < n) {
      c = value.charCodeAt(selectionStart);
      var brackets = "(){}[]";
      for (var k = 0; k < brackets.length; k += 2) {
        if (c === brackets.charCodeAt(k)) {
          pair = brackets.charCodeAt(k + 1);
          step = +1;
        }
        if (c === brackets.charCodeAt(k + 1)) {
          pair = brackets.charCodeAt(k);
          step = -1;
        }
      }
      selectionStart += 1;
    }
    selectionStart -= 1;
    if (step !== 0) {
      var i = selectionStart;
      var depth = 1;
      i += step;
      while (i >= 0 && i < value.length && depth > 0) {
        var code = value.charCodeAt(i);
        if (code === c) {
          depth += 1;
        }
        if (code === pair) {
          depth -= 1;
        }
        i += step;
      }
      i -= step;
      if (depth === 0) {
        return {
          first: {start: selectionStart, end: selectionStart + 1, color: "lightgray", backgroundColor: "transparent"}, //"antiquewhite"
          second: {start: i, end: i + 1, color: "lightgray", backgroundColor: "transparent"} //"antiquewhite"
        };
      } else {
        return {
          first: {start: selectionStart, end: selectionStart + 1, color: "lightpink", backgroundColor: "transparent"},
          second: undefined
        };
      }
    }
    return {
      first: undefined,
      second: undefined
    };
  };

  var update = function (event) {
    var marks = [];
    if (isActive) {
      var tmp0 = getBracketMarks(input.value, input.selectionStart);
      if (tmp0.first != undefined) {
        marks.push(tmp0.first);
      }
      if (tmp0.second != undefined) {
        marks.push(tmp0.second);
      }
    }

    var error = input.getAttribute("data-error");
    if (error != undefined) {
      var errorStartEnd = error.split(",");
      marks.push({start: Number.parseInt(errorStartEnd[0], 10), end: Number.parseInt(errorStartEnd[1], 10), color: "transparent", backgroundColor: "lightpink"});
    }

    if (marks.length !== 0) {
      var scrollLeft = input.scrollLeft;
      var scrollTop = input.scrollTop;
      var clientLeft = input.clientLeft;
      var clientTop = input.clientTop;
      var inputRect = input.getBoundingClientRect();
      var clientRight = inputRect.right - inputRect.left - input.clientWidth - input.clientLeft;
      var clientBottom = inputRect.bottom - inputRect.top - input.clientHeight - input.clientTop;

      marks.sort(function (a, b) {
        return a.start < b.start ? -1 : (b.start < a.start ? +1 : 0);
      });

      // when the width of a textarea is small, paddingRight will not be included in scrolling area,
      // but this is not true for an input, in Firefox - for both

      backgroundElement.innerHTML = "";
      backgroundElement.style.marginLeft = (clientLeft + marginLeft + paddingLeft).toString() + "px";
      backgroundElement.style.marginTop = (clientTop + marginTop + paddingTop).toString() + "px";
      backgroundElement.style.marginRight = (clientRight + marginRight + paddingRight).toString() + "px";
      backgroundElement.style.marginBottom = (clientBottom + marginBottom + paddingBottom).toString() + "px";

      var value = input.value;
      var start = 0;
      while (start < value.length) {
        var div = document.createElement("div");
        backgroundElement.appendChild(div);
        var end = value.indexOf("\n", start) + 1;
        if (end === 0) {
          end = value.length;
        }
        for (var i = 0; i < marks.length; i += 1) {
          var m = marks[i];
          var s = m.start > start ? m.start : start;
          var e = m.end < end ? m.end : end;
          if (s < e) {
            add(value.slice(start, s), "transparent", "transparent", div);
            add(value.slice(s, e), m.color, m.backgroundColor, div);
            start = e;
          }
        }
        if (start < end) {
          add(value.slice(start, end), "transparent", "transparent", div);
          start = end;
        }
        if (input.getAttribute("list") != undefined) {
          add("  ", "transparent", "transparent", div); // to increase scrollWidth in Chrome
        }
      }
      backgroundElement.scrollLeft = scrollLeft;
      backgroundElement.scrollTop = scrollTop;

    } else {
      if (backgroundElement.firstChild != undefined) {
        backgroundElement.innerHTML = "";
      }
    }
  };

  var oldSelectionStart = -1;
  var timeoutId = 0;
  var check = function (event) {
    if (timeoutId === 0) {
      timeoutId = window.setTimeout(function () {
        timeoutId = 0;
        var newSelectionStart = input.selectionStart;
        if (oldSelectionStart !== newSelectionStart) {
          oldSelectionStart = newSelectionStart;
          update(undefined);
        }
      }, 0);
    }
  };
  // https://github.com/w3c/selection-api/issues/53
  if ("onselectionchange" in input) {//?
    input.addEventListener("selectionchange", check, false);
  } else {
    input.addEventListener("keydown", check, false);
    input.addEventListener("mousedown", check, false);
    input.addEventListener("mouseup", check, false);
  }
  input.addEventListener("input", update, false);
  input.addEventListener("update-attribute", update, false);
  var timeoutId2 = 0;
  var onScroll = function (event) {
    if (timeoutId2 === 0) {
      timeoutId2 = window.setTimeout(function () {
        timeoutId2 = 0;
        update(undefined);
      }, 0);
    }
  };
  input.addEventListener("scroll", onScroll, false);
  var onFocus = function (event) {
    isActive = true;
    update(undefined);
  };
  var onBlur = function (event) {
    isActive = false;
    update(undefined);
  };
  input.addEventListener("focus", onFocus, false);
  input.addEventListener("blur", onBlur, false);
};

window.initializeAInput = initializeAInput;

}(this));

/*jslint plusplus: true, vars: true, indent: 2, white: true */
/*global i18n, JSON, NonSimplifiedExpression, Matrix, Polynom, Expression, RPN */

(function (global) {
"use strict";

function Utils() {
}

Utils.escapeHTML = function (s) {
  return s.replace(/&/g, "&amp;")
          .replace(/"/g, "&quot;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;");
};

//!TODO: remove
Polynom.prototype.toExpression = function () {
  var variableSymbol = new Expression.Symbol("x");
  var variableSymbols = [];
  var i = -1;
  while (++i < this.a.length) {
    variableSymbols.push(i === 0 ? undefined : (i === 1 ? variableSymbol : new Expression.Exponentiation(variableSymbol, RPN(i.toString()))));
  }
  return polynomToExpression(this.a, variableSymbols);
};
Polynom.prototype.toString = function (options) {
  return this.toExpression().toString(options);
};
Polynom.prototype.toMathML = function (options) {
  return this.toExpression().toMathML(options);
};

// coefficient - Expression
// variable - Expression
var printPartOfAddition = function (isLast, isFirst, coefficient, variable, options) {
  if (coefficient.equals(RPN.ZERO)) {
    return "<mtd>" + (isLast && isFirst ? "<mn>0</mn>" : "") + "</mtd>";
  }
  var sign1 = "+";
  if (Expression.isNegative(coefficient)) {
    sign1 = "&minus;";
    coefficient = coefficient.negate();//?
  }
  var coefficientString = coefficient.toMathML(options);
  var precedenceOfMultiptication = new Expression.Multiplication(RPN.ZERO, RPN.ZERO).getPrecedence();
  var areBracketsRequired = coefficient.getPrecedence() < precedenceOfMultiptication; //?
  //TODO: fix
  return "<mtd>" +
         (isFirst && sign1 === "+" ? "" : "<mo>" + sign1 + "</mo>") +
         (coefficient.equals(RPN.ONE) ? "" : (areBracketsRequired && coefficientString !== "" ? "<mfenced open=\"(\" close=\")\">" + coefficientString + "</mfenced>" : coefficientString) + (coefficientString !== "" ? "<mo>&times;</mo>" : "")) +
         variable.toMathML(options) +
         "</mtd>";
};

var polynomToExpression = function (coefficients, variableSymbols) {
  var i = coefficients.length;
  var result = undefined;
  while (--i >= 0) {
    var tmp = coefficients[i];
    if (!tmp.equals(RPN.ZERO)) {
      var v = variableSymbols[i];
      var current = v == undefined ? tmp : (tmp.equals(RPN.ONE) ? v : new Expression.Multiplication(tmp, v));
      result = result == undefined ? current : new Expression.Addition(result, current);
    }
  }
  return result == undefined ? RPN.ZERO : result;
};

var createLinearEquationExpression = function (coefficients, variableNames, leftPartCount, printOptions) {
  return polynomToExpression(coefficients.slice(0, leftPartCount), variableNames.slice(0, leftPartCount)).toMathML(printOptions) + "<mo>=</mo>" +
         polynomToExpression(coefficients.slice(leftPartCount), variableNames.slice(leftPartCount)).toMathML(printOptions);
};

// TODO: fix
// new Intl.NumberFormat().format(1.1)
var decimalSeparator = ".";

Expression.toDecimalNumber = function (numerator, denominator, fractionDigits, toMathML) {
  var zeros = "";
  for (var i = 0; i < fractionDigits; i += 1) {
    zeros += "0";
  }
  // assert(number instanceof Expression.Integer && denominator instanceof Expression.Integer);
  var isNumeratorNegative = numerator.compareTo(RPN.ZERO) < 0;
  var tmp = (isNumeratorNegative ? numerator.negate() : numerator).multiply(Expression.pow(RPN.TEN, fractionDigits + 1, RPN.ONE)).truncatingDivide(denominator).add(RPN.TEN.divide(RPN.TWO)).toString();
  tmp = (tmp.slice(0, -(fractionDigits + 1)) || "0") + (fractionDigits ? decimalSeparator + (zeros + tmp).slice(-(fractionDigits + 1), -1) : "");
  if (toMathML) {
    // "<math decimalpoint=\"" + decimalSeparator + "\"></math>" -?
    return (isNumeratorNegative ? "<mrow><mo>&minus;</mo>" : "") + "<mn>" + tmp + "</mn>" + (isNumeratorNegative ? "</mrow>" : "");
  }
  return (isNumeratorNegative ? "-" : "") + tmp;
};

Expression.Matrix.prototype.toMathML = function (options) {
  var x = this.matrix;
  options = Expression.setTopLevel(true, options);

  var useMatrixContainer = options.useMatrixContainer == undefined ? true : options.useMatrixContainer;
  //TODO: fix!
  var braces = options.useBraces == undefined ? ["(", ")"] : options.useBraces;
  var columnlines = options.columnlines == undefined ? 0 : options.columnlines;
  var variableNames = options.variableNames == undefined ? undefined : options.variableNames;

  var verticalStrike = options.verticalStrike == undefined ? -1 : options.verticalStrike;
  var horizontalStrike = options.horizontalStrike == undefined ? -1 : options.horizontalStrike;

  var cellIdGenerator = options.cellIdGenerator == undefined ? undefined : options.cellIdGenerator;
  var pivotCell = options.pivotCell == undefined ? undefined : options.pivotCell;

  options = Object.assign({}, options, {
    useBraces: undefined,
    columnlines: undefined,
    variableNames: undefined,
    verticalStrike: undefined,
    horizontalStrike: undefined,
    cellIdGenerator: undefined,
    pivotCell: undefined
  });

  var result = "";
  var rows = x.rows();
  var cols = x.cols();
  var i = -1;

  var containerId = options.idPrefix + "-" + RPN.id();
  if (useMatrixContainer) {
    result += "<munder>";
    result += "<mrow>";
    result += "<menclose notation=\"none\" href=\"#\" id=\"" + containerId + "\" data-matrix=\"" + Utils.escapeHTML(x.toString()) + "\" draggable=\"true\" tabindex=\"0\" contextmenu=\"matrix-menu\">";
  }

  result += "<mfenced open=\"" + braces[0] + "\" close=\"" + braces[1] + "\">";
  var columnlinesAttribute = "";
  if (columnlines !== 0 && cols > 2) {
    var k = -1;
    while (++k < cols - 1) {
      columnlinesAttribute += (cols - 1 + columnlines === k ? "solid " : "none ");
    }
    columnlinesAttribute = columnlinesAttribute.slice(0, -1);
  }
  result += "<mtable" + (verticalStrike !== -1 || horizontalStrike !== -1 || pivotCell != undefined ? " columnspacing=\"0em\" rowspacing=\"0em\" " : "") + (variableNames != undefined ? " columnalign=\"right\"" : "") + (columnlinesAttribute !== "" ? " columnlines=\"" + columnlinesAttribute + "\"" : "") + ">";
  while (++i < rows) {
    var j = -1;
    result += "<mtr>";
    if (variableNames != undefined) {// TODO: fix?
      //TODO: use code from polynomToExpression (shared)
      var row = "";
      var wasNotZero = false;
      while (++j < cols - 1) {
        // TODO: fix `new Expression.Symbol()`
        row += printPartOfAddition(j === cols - 2, !wasNotZero, x.e(i, j), new Expression.Symbol(variableNames[j]), options);
        wasNotZero = wasNotZero || !x.e(i, j).equals(RPN.ZERO);
      }
      row += "<mtd><mo>=</mo></mtd><mtd>" + x.e(i, cols - 1).toMathML(options) + "</mtd>";
      if (wasNotZero || !x.e(i, cols - 1).equals(RPN.ZERO)) {
        result += row;
      }
    } else {
      while (++j < cols) {
        result += "<mtd";
        result += (cellIdGenerator != undefined ? " id=\"" + cellIdGenerator(i, j) + "\"" : "");
        if (options.highlightRow != undefined && options.highlightRow === i || options.highlightCol != undefined && options.highlightCol === j) {
          result += " mathbackground=\"#80FF80\"";
        }
        result += ">";
        if (pivotCell != undefined && i === pivotCell.i && j === pivotCell.j) {
          result += "<mstyle mathvariant=\"bold\">";
          result += "<menclose notation=\"circle\">";
        }
        if (verticalStrike !== -1 || horizontalStrike !== -1) {
          result += "<menclose notation=\"none " + (verticalStrike === j ? " " + "verticalstrike" : "") +  (horizontalStrike === i ? " " + "horizontalstrike" : "") + "\">";
        }
        if (verticalStrike !== -1 || horizontalStrike !== -1 || pivotCell != undefined) {
          result += "<mpadded width=\"+0.8em\" lspace=\"+0.4em\">";
        }
        if (j < i && options.isLUDecomposition2 != undefined) {
          result += "<mrow mathbackground=\"#80FF80\">";
        }
        result += x.e(i, j).toMathML(options);
        if (j < i && options.isLUDecomposition2 != undefined) {
          result += "</mrow>";
        }
        if (verticalStrike !== -1 || horizontalStrike !== -1 || pivotCell != undefined) {
          result += "</mpadded>";
        }
        if (verticalStrike !== -1 || horizontalStrike !== -1) {
          result += "</menclose>";
        }
        if (pivotCell != undefined && i === pivotCell.i && j === pivotCell.j) {
          result += "</menclose>";
          result += "</mstyle>";
        }
        result += "</mtd>";
      }
    }
    result += "</mtr>";
  }
  result += "</mtable>";
  result += "</mfenced>";

  if (useMatrixContainer) {
    result += "</menclose>";
    result += "</mrow>";

    result += "<mrow>";
    result += "<mtext data-x=\"TODO\">";
    result += "<button type=\"button\" class=\"matrix-menu-show matrix-menu-show-new\" data-for-matrix=\"" + containerId + "\" aria-haspopup=\"true\">&#9776;</button>";
    result += "</mtext>";
    result += "</mrow>";

    result += "</munder>";
  }

  return result;
};

Expression.Determinant.prototype.toMathML = function (options) {
  var x = this;
  if (x.a instanceof Expression.Matrix || (x.a instanceof NonSimplifiedExpression && x.a.e instanceof Expression.Matrix)) {
    options = Object.assign({}, options, {
      useBraces: ["|", "|"]
    });
    //TODO: fix
    return x.a.toMathML(options);
  }
  return "<mfenced open=\"" + "|" + "\" close=\"" + "|" + "\">" + x.a.toMathML(options) + "</mfenced>";
};
Expression.Transpose.prototype.toMathML = function (options) {
  var x = this;
  //TODO: ^T ?
  return "<msup><mrow>" + x.a.toMathML(options) + "</mrow><mrow><mo>T</mo></mrow></msup>";
};
Expression.SquareRoot.prototype.toMathML = function (options) {
  var x = this;
  //TODO: fix
  return "<msqrt><mrow>" + x.a.toMathML(Expression.setTopLevel(true, options)) + "</mrow></msqrt>";
};
Expression.Function.prototype.toMathML = function (options) {
  var x = this;
  //TODO: fix
  return "<mrow>" +
         "<mi>" + (x.name === "rank" ? i18n.rankDenotation : x.name) + "</mi>" +
         "<mo>&ApplyFunction;</mo>" +
         x.a.toMathML(Expression.setTopLevel(true, options)) +
         "</mrow>";
};
Expression.Division.prototype.toMathML = function (options) {
  var x = this;
  var fractionDigits = options.fractionDigits;
  var denominator = x.getDenominator();
  var numerator = x.getNumerator();
  if ((numerator instanceof Expression.Integer && denominator instanceof Expression.Integer) && fractionDigits >= 0) {
    return Expression.toDecimalNumber(numerator, denominator, fractionDigits, true);
  }
  //???
  //if (Expression.isNegative(numerator)) {
  //  return "<mrow><mo>&minus;</mo>" + x.negate().toMathML(options) + "</mrow>";
  //}
  return "<mfrac><mrow>" + numerator.toMathML(Expression.setTopLevel(true, options)) + "</mrow><mrow>" + denominator.toMathML(Expression.setTopLevel(true, options)) + "</mrow></mfrac>";
};
Expression.Integer.prototype.toMathML = function (options) {
  var x = this;
  var fractionDigits = options.fractionDigits;
  if (fractionDigits >= 0) {
    return Expression.toDecimalNumber(x, RPN.ONE, fractionDigits, true);
  }
  var tmp = x.toString();
  return "<mrow>" + (tmp.slice(0, 1) === "-" ? "<mo>&minus;</mo><mn>" + tmp.slice(1) + "</mn>" : "<mn>" + tmp + "</mn>") + "</mrow>";
};
Expression.BinaryOperation.prototype.toMathML = function (options) {
  var a = this.a;
  var b = this.b;
  var isSubtraction = false;
  // TODO: check
  if (this instanceof Expression.Addition && Expression.isNegative(b)) {
    isSubtraction = true;
    b = b.negateCarefully();//?
  }

  var fa = a.getPrecedence() + (Expression.isRightToLeftAssociative(a) ? -1 : 0) < this.getPrecedence();
  var fb = this.getPrecedence() + (Expression.isRightToLeftAssociative(this) ? -1 : 0) >= b.getPrecedence();
  if (options != undefined && options.isTopLevel != undefined && options.isTopLevel === false) {
    fa = fa || a.isUnaryPlusMinus();
  }
  fb = fb || b.isUnaryPlusMinus();
  fb = fb || (this.unwrap() instanceof Expression.Exponentiation && b.unwrap() instanceof Expression.Exponentiation);// 2^3^4
  var s = isSubtraction ? "-" : this.getS();

  if (this instanceof Expression.Exponentiation) {
      return "<msup>" + 
             "<mrow>" +
             (fa ? "<mfenced open=\"(\" close=\")\">" : "") + a.toMathML(Expression.setTopLevel(fa || options == undefined || options.isTopLevel, options)) + (fa ? "</mfenced>" : "") +
             "</mrow>" +
             "<mrow>" +
             (fb ? "<mfenced open=\"(\" close=\")\">" : "") + b.toMathML(Expression.setTopLevel(fb, options)) + (fb ? "</mfenced>" : "") + 
             "</mrow>" +
             "</msup>";
  }
  if (this.isNegation()) {
    // assert(fa === false);
      return "<mrow><mo>&minus;</mo>" + (fb ? "<mfenced open=\"(\" close=\")\">" : "") + b.toMathML(Expression.setTopLevel(fb, options)) + (fb ? "</mfenced>" : "") + "</mrow>";
  }
  //TODO: fix spaces (matrix parsing)
  return "<mrow>" + 
         (fa ? "<mfenced open=\"(\" close=\")\">" : "") + a.toMathML(Expression.setTopLevel(fa || options == undefined || options.isTopLevel, options)) + (fa ? "</mfenced>" : "") +
         "<mo>" + (s === "*" ? "&times;" : (s === "-" ? "&minus;" : s)) + "</mo>" + 
         (fb ? "<mfenced open=\"(\" close=\")\">" : "") + b.toMathML(Expression.setTopLevel(fb, options)) + (fb ? "</mfenced>" : "") + 
         "</mrow>";
};
Expression.Symbol.prototype.toMathML = function (options) {
  var x = this;
  var s = x.symbol;
  var i = s.indexOf("_");
  if (i !== -1) {
    var indexes = s.slice(i + 1).replace(/^\(|\)$/g, "").split(",");
    var indexesMathML = "";
    for (var j = 0; j < indexes.length; j += 1) {
      indexesMathML += (j !== 0 ? "<mo>,</mo>" : "") +
                       (/^\d+$/.exec(indexes[j]) != undefined ? "<mn>" : "<mi>") +
                       indexes[j] +
                       (/^\d+$/.exec(indexes[j]) != undefined ? "</mn>" : "</mi>");
    }
    return "<msub>" + 
           "<mrow>" + "<mi>" + s.slice(0, i) + "</mi>" + "</mrow>" +
           "<mrow>" + indexesMathML + "</mrow>" + 
           "</msub>";
  }
  return "<mi>" + s + "</mi>";
};
Expression.Negation.prototype.toMathML = function (options) {
  var b = this.b;
  var fb = this.getPrecedence() + (Expression.isRightToLeftAssociative(this) ? -1 : 0) >= b.getPrecedence();
  fb = fb || b.isUnaryPlusMinus();
  // assert(fa === false);
  return "<mrow><mo>&minus;</mo>" + (fb ? "<mfenced open=\"(\" close=\")\">" : "") + b.toMathML(Expression.setTopLevel(fb, options)) + (fb ? "</mfenced>" : "") + "</mrow>";
};

Expression.prototype.toMathML = function (options) {
  throw new Error();
};

var getInputValue = function (value, type) {
  var v = value.replace(/^\s+|\s+$/g, "");
  // Users are often trying to input "-"/"+" instead of "-1"/"+1" for SLU
  if ((v === "-" || v === "+") && (type === "system" || type === "polynomial")) {
    return v + "1";
  }
  if (v === "") {
    return "0";
  }
  return value;
};

RPN.getElementsArray = function (matrixTableState) {
  var mode = matrixTableState.mode;
  var type = matrixTableState.type;
  var textareaValue = matrixTableState.textareaValue;
  var inputValues = matrixTableState.inputValues;
  if (mode !== "cells") {
    //?
    //!!!
    if (type === "system") {// to support custom input in SLE: 3x+y-2z=2; 2x+y-1=3; ...
    
      var s = textareaValue;
      var lines = s.split("\n");
      var k = -1;
      var ok = true;
      var rows = [];
      var frees = [];
      var variableToColumnNumberMap = {};// string -> number
      var columnNumberToVariableMap = [];// number -> string

      var free = undefined;
      var row = undefined;
      var onVariable = function (coefficient, variable) {
        if (variable === "") {
          free = free.add(coefficient);
        } else {
          var columnIndex = variableToColumnNumberMap[variable];
          if (columnIndex == undefined) {
            columnIndex = columnNumberToVariableMap.length;
            variableToColumnNumberMap[variable] = columnIndex;
            columnNumberToVariableMap.push(variable);
          }
          while (row.length < columnIndex + 1) {
            row.push(RPN.ZERO);
          }
          row[columnIndex] = row[columnIndex].add(coefficient);
        }
      };

      while (ok && ++k < lines.length) {
        var line = lines[k].replace(/^\s+|\s+$/g, "");
        if (line.indexOf("=") !== -1 && line.split("=").length === 2) {
          row = [];
          free = RPN.ZERO;
          var x = line.split("=");
          try {
            var y = RPN(x[0]).subtract(RPN(x[1])).getNumerator();
            Expression.fillLinearEquationVariablesMap(y, onVariable);
          } catch (error) {
            ok = false;
            if (global.console != undefined) {
              global.console.log(error);
            }
          }
          frees.push(free);
          rows.push(row);
        } else {
          if (line !== "") { // to skip empty lines
            ok = false;
          }
        }
      }

      if (ok) {
        var a = -1;
        while (++a < rows.length) {
          row = rows[a];
          while (row.length < columnNumberToVariableMap.length) {
            row.push(RPN.ZERO);
          }
          row.push(frees[a].negate());
        }
        var b = -1;
        while (++b < rows.length) {
          row = rows[b];
          var c = -1;
          while (++c < row.length) {
            row[c] = row[c].toString();//!slow?
          }
        }
        //!TODO: fix: reverse variables and coefficients, as Expression.fillLinearEquationVariablesMap gives wrong order
        b = -1;
        while (++b < rows.length) {
          row = rows[b];
          var f = -1;
          var d = row.length - 1; // skipping free
          while (++f < --d) {
            var tmp = row[f];
            row[f] = row[d];
            row[d] = tmp;
          }
        }
        var newColumnNumberToVariableMap = []; // number -> Expression
        b = -1;
        while (++b < columnNumberToVariableMap.length) {
          newColumnNumberToVariableMap.push(columnNumberToVariableMap[columnNumberToVariableMap.length - 1 - b]);
        }
        columnNumberToVariableMap = newColumnNumberToVariableMap;
        
        //!
        return {elements: rows, variableNames: columnNumberToVariableMap};
      }
    }
    //!!!

    var resultRows = Matrix.split(textareaValue);
    return {elements: resultRows, variableNames: undefined};
  }
  for (var i = 0; i < inputValues.length; i += 1) {
    for (var j = 0; j < inputValues[i].length; j += 1) {
      inputValues[i][j] = getInputValue(inputValues[i][j], type);
    }
  }
  return {elements: inputValues, variableNames: undefined};
};

var getMatrixWithVariableNames = function (matrixTableState) { // throws ValueMissingError (?)
  var tmp = RPN.getElementsArray(matrixTableState);
  if (tmp.elements.length === 0) {
    throw new RangeError("ValueMissingError:" + matrixTableState.firstInputElementId);
  }
  return {matrix: Matrix.toMatrix(tmp.elements), variableNames: tmp.variableNames};
};


// ---------------------------------------i18n.js-----------------------------------------

// i18n.rankDenotation
var rankDenotation = {
  de: "rang",
  pt: "posto",
  it: "rango",
  es: "rango",
  gl: "rango",
  fr: "rg",
  en: "rank"
};

var keys = ["de", "pt", "it", "es", "gl", "fr", "en"];// Object.keys(rankDenotation);
var i = -1;
while (++i < keys.length) {
  RPN.addDenotation("rank", rankDenotation[keys[i]]);
}

RPN.addDenotation("sin", "sen"); // "es"

// --------------------------------------------- end ----------------------------------------------


var getResultAndHTML = function (expression, variableNames, result, printOptions) {
  // TODO: fix
  var resultHTML = "";
  if (result instanceof Expression.NoAnswerExpression) {
    var name = result.name;
    var matrix = result.a.matrix;
    var second = result.second;//!
    result = undefined;
    if (name === "Gaussian-elimination") {
      var tmp = Expression.rowReductionGaussJordanMontante(matrix, Matrix.Gauss, false, Expression.rowReduceChangeToHTML, printOptions, -1);
      resultHTML = tmp.html;
      result = tmp.rowEchelonMatrix;
    } else if (name === "LU-decomposition") {
      var palu = Expression.LUDecomposition(matrix);
      var html = "";
      html += printOptions.mathStartTag;
      html += Expression.p(palu.swapFlag ? "P*A=L*U" : "A=L*U", palu, printOptions);
      html += printOptions.mathEndTag;
      resultHTML = html;
    } else if (name === "diagonalize") {
      var results = Expression.diagonalize(printOptions, matrix);
      //TODO: fix
      var detailsHTML = "<details class=\"details\" open=\"open\"><summary>" + i18n.summaryLabel + "</summary><div class=\"indented\">" + results.html + "</div></details>";
      if (results.message !== "") {
        resultHTML = "<div>" + results.message + "</div>" + detailsHTML;
      } else {
        resultHTML = printOptions.mathStartTag + new Expression.Matrix(matrix).toMathML(printOptions) + "<mo>=</mo>" + new Expression.Matrix(results.T).toMathML(printOptions) + "<mo>&times;</mo>" + new Expression.Matrix(results.L).toMathML(printOptions) + "<mo>&times;</mo>" + new Expression.Matrix(results.T_INVERSED).toMathML(printOptions) + printOptions.mathEndTag + detailsHTML;
        result = results.T;
      }
    } else if (name === "solve-using-Gaussian-elimination") {
      resultHTML = Expression.Details.getCallback("solve-using-Gaussian-elimination")(printOptions, matrix, variableNames);
    } else if (name === "solve-using-Gauss-Jordan-elimination") {
      resultHTML = Expression.Details.getCallback("solve-using-Gauss-Jordan-elimination")(printOptions, matrix, variableNames);
    } else if (name === "solve-using-Montante-method") {
      resultHTML = Expression.Details.getCallback("solve-using-Montante-method")(printOptions, matrix, variableNames);
    } else if (name === "solve-using-Cramer's-rule") {
      resultHTML = Expression.Details.getCallback("solve-using-Cramer's-rule")(printOptions, matrix, variableNames);
    } else if (name === "solve-using-inverse-matrix-method") {
      resultHTML = Expression.Details.getCallback("solve-using-inverse-matrix-method")(printOptions, matrix, variableNames);

    } else if (name === "solve") {
      resultHTML = "";//TODO:

    } else if (name === "determinant-Gauss") {
      resultHTML = Expression.Details.getCallback("determinant-Gauss")(printOptions, matrix);
    } else if (name === "determinant-2x2") {
      resultHTML = Expression.Details.getCallback("determinant-2x2")(printOptions, matrix);
    } else if (name === "determinant-Sarrus") {
      resultHTML = Expression.Details.getCallback("determinant-Sarrus")(printOptions, matrix);
    } else if (name === "determinant-Triangle") {
      resultHTML = Expression.Details.getCallback("determinant-Triangle")(printOptions, matrix);
    } else if (name === "determinant-Leibniz") {
      resultHTML = Expression.Details.getCallback("determinant-Leibniz")(printOptions, matrix);
    } else if (name === "determinant-Montante") {
      resultHTML = Expression.Details.getCallback("determinant-Montante")(printOptions, matrix);

    } else if (name === "expand-along-column") {
      resultHTML = Expression.Details.getCallback("expand-along-column")(printOptions, matrix, second);
    } else if (name === "expand-along-row") {
      resultHTML = Expression.Details.getCallback("expand-along-row")(printOptions, matrix, second);
    } else if (name === "obtain-zeros-in-column") {
      resultHTML = Expression.Details.getCallback("obtain-zeros-in-column")(printOptions, matrix, second);
    } else if (name === "obtain-zeros-in-row") {
      resultHTML = Expression.Details.getCallback("obtain-zeros-in-row")(printOptions, matrix, second);

    } else if (name === "eigenvectors") {
      resultHTML = Expression.Details.getCallback("eigenvectors")(printOptions, matrix);

    } else if (name === "polynomial-roots") {
      resultHTML = Expression.Details.getCallback("polynomial-roots")(printOptions, matrix);
    } else if (name === "polynomial-multiply") {
      resultHTML = Expression.Details.getCallback("polynomial-multiply")(printOptions, matrix, second);

    } else if (name === "analyse-compatibility") {
      resultHTML = Expression.Details.getCallback("analyse-compatibility")(printOptions, matrix);
    } else {
      throw new Error();
    }
  } else if (result instanceof Expression.Equality) {
    //TODO: counter
    resultHTML = "";
    resultHTML += "<div>" + printOptions.mathStartTag + expression.toMathML(printOptions) + printOptions.mathEndTag + "</div>";
    resultHTML += "<div>" + printOptions.mathStartTag + result.toMathML(printOptions) + printOptions.mathEndTag + "</div>";
  } else {
    resultHTML = printOptions.mathStartTag + expression.toMathML(printOptions) + "<mo>=</mo>" + result.toMathML(printOptions) + printOptions.mathEndTag;
  }
  return {
    result: result,
    html: resultHTML
  };
};

//? bestMethodsLimit - with highest priority
var createDetailsSummary = function (idPrefix, details, bestMethodsLimit) {
  bestMethodsLimit = bestMethodsLimit == undefined ? 2 : bestMethodsLimit;
  var s = "";
  for (var j = 0; j < details.length; j += 1) {
    //TODO: FIX
    var rows = details[j].matrix.split("},").length;
    //TODO: what if some `type` was provided?
    var type = details[j].type;
    var p = 0;
    for (var i = 0; i < Expression.Details.details.length; i += 1) {
      var x = Expression.Details.details[i];
      if (x.type.indexOf(type) === 0 && rows >= x.minRows && rows <= x.maxRows) {
        if (p < bestMethodsLimit) {
          var jsonObject = [{
            type: x.type,
            matrix: details[j].matrix,
            second: details[j].second
          }];
          s += "<details class=\"details\" data-id-prefix=\"" + idPrefix + "\" " + "data-details=\"" + Utils.escapeHTML(JSON.stringify(jsonObject)) + "\"" + ">" +
               "<summary>" + i18n.summaryLabel + (x.i18n != undefined ? " (" + x.i18n() + ")" : "") + "</summary>" +
               "<div class=\"indented\"></div>" +
               "</details>";
          p += 1;
        }
      }
    }
  }
  return s;
};

Matrix.prototype.minorMatrix = function (k, l) {
  var rows = [];
  for (var i = 0; i < this.rows(); i += 1) {
    if (i !== k) {
      var row = [];
      for (var j = 0; j < this.cols(); j += 1) {
        if (j !== l) {
          row.push(this.e(i, j));
        }
      }
      rows.push(row);
    }
  }
  return new Matrix(rows);
};

Expression.Minor = function (matrix, i, j) {
  Expression.Determinant.call(this, matrix);
  this.i = i;
  this.j = j;
};

Expression.Minor.prototype = Object.create(Expression.Determinant.prototype);

Expression.Minor.prototype.toMathML = function (options) {
  options = Object.assign({}, options, {
    horizontalStrike: this.i,
    verticalStrike: this.j,
    useBraces: ["|", "|"]
  });
  //TODO: fix
  return this.a.toMathML(options);
};

Expression.p = function (s, args, printOptions) {
  var result = "";
  var parts = s.split("=");
  for (var i = 0; i < parts.length; i += 1) {
    if (i !== 0) {
      result += "<mo>=</mo>";
    }
    args = args == undefined ? undefined : args;
    var e = RPN(parts[i], new RPN.Context(function (id) {
      return args != undefined && args[id] != undefined ? args[id] : undefined;
    }));
    result += e.toMathML(printOptions);
  }
  return result;
};

Expression.Details = function () {
};

Expression.Details.details = [];

Expression.Details.getCallback = function (type) {
  for (var i = 0; i < Expression.Details.details.length; i += 1) {
    if (Expression.Details.details[i].type === type) {
      return Expression.Details.details[i].callback;
    }
  }
  return undefined;
};

Expression.Details.add = function (data) {
  var x = {
    type: data.type,
    i18n: data.i18n,
    minRows: data.minRows == undefined ? 3 : data.minRows,
    maxRows: data.maxRows == undefined ? 1 / 0 : data.maxRows,
    priority: data.priority,
    callback: data.callback
  };
  Expression.Details.details.push(x);
  var i = Expression.Details.details.length - 1;
  while (i >= 1 && Expression.Details.details[i - 1].priority < x.priority) {
    Expression.Details.details[i] = Expression.Details.details[i - 1];
    i -= 1;
  }
  Expression.Details.details[i] = x;
};

Expression.Details.add({
  type: "inverse-adjugate",
  i18n: function () {
    return i18n.inverseDetailsUsingAdjugateMatrix;
  },
  priority: 0,
  callback: function (printOptions, matrix) {
    var result = "";
    result += "<div>";
    result += printOptions.mathStartTag;
    result += Expression.p("A^-1=1/determinant(A)*C^T=1/determinant(A)*X", {X: new Expression.Matrix(matrix.map(function (e, i, j) {
      return new Expression.Symbol("C_" + (j + 1).toString() + (i + 1).toString());
    }))}, printOptions);
    result += printOptions.mathEndTag;
    result += "<a href=\"" + i18n.inverseDetailsUsingAdjugateMatrixLink + "\"></a>";//TODO
    // https://upload.wikimedia.org/math/e/f/0/ef0d68882204598592f50ba054e9951e.png
    var determinant = matrix.determinant();
    result += "<div>";
    result += printOptions.mathStartTag;
    result += Expression.p("determinant(A)=X=y", {
      X: new Expression.Determinant(new Expression.Matrix(matrix)),
      y: determinant
    }, printOptions);
    result += printOptions.mathEndTag;
    result += createDetailsSummary(printOptions.idPrefix, [{type: matrix.getDeterminantEventType("determinant").type, matrix: matrix.toString(), second: undefined}]);
    result += "</div>";
  if (determinant.equals(RPN.ZERO)) {
    //TODO: ?
  } else {//!
    var cofactors = [];
    for (var i = 0; i < matrix.rows(); i += 1) {
      cofactors[i] = [];
      for (var j = 0; j < matrix.cols(); j += 1) {
        result += "<div>";
        result += printOptions.mathStartTag;
        result += "<msub><mrow><mi>C</mi></mrow><mrow><mn>${i}</mn><mn>${j}</mn></mrow></msub><mo>=</mo>".replace(/\$\{j\}/g, (j + 1).toString()).replace(/\$\{i\}/g, (i + 1).toString());
        result += Expression.p("(-1)^(i+j)", {i: RPN((i + 1).toString()), j: RPN((j + 1).toString())}, printOptions);
        result += "<mo>&times;</mo>";
        result += new Expression.Minor(new Expression.Matrix(matrix), i, j).toMathML(printOptions);
        var minorMatrix = matrix.minorMatrix(i, j);
        var minor = minorMatrix.determinant();
        var isOdd = (i + j) - 2 * Math.trunc((i + j) / 2);
        var n = isOdd === 1 ? RPN.ONE.negate() : RPN.ONE;
        var c = n.multiply(minor);

        if (minorMatrix.rows() === 2) {//!
          result += "<munder><mrow><mo>=</mo></mrow><mrow><mtext data-x=\"TODO\"><a href=\"" + i18n.determinant2x2Link + "\">(?)</a></mtext></mrow></munder>";
          result += Expression.p("n*(a*d-b*c)", {
            n: n,
            a: minorMatrix.e(0, 0),
            b: minorMatrix.e(0, 1),
            c: minorMatrix.e(1, 0),
            d: minorMatrix.e(1, 1)
          }, printOptions);
        }
        if (isOdd === 1) {
          result += "<mo>=</mo>";
          result += Expression.p("n*(d)", {
            n: n,
            d: minor
          }, printOptions);
        }
        result += "<mo>=</mo>";
        result += Expression.p("c", {c: c}, printOptions);
        result += printOptions.mathEndTag;
        if (minorMatrix.rows() !== 2) {//!
          result += createDetailsSummary(printOptions.idPrefix, [{type: minorMatrix.getDeterminantEventType("determinant").type, matrix: minorMatrix.toString(), second: undefined}]);
        }
        cofactors[i][j] = c;
        result += "</div>";
      }
    }
    var CT = new Expression.Matrix(new Matrix(cofactors).transpose());
    // TODO: linkes
    // http://en.wikipedia.org/wiki/Cramer%27s_rule#Finding_inverse_matrix
    result += printOptions.mathStartTag;
    result += Expression.p("A^-1=1/determinant(A)*C^T=1/x*Y=Z", {x: determinant, Y: CT, Z: determinant.inverse().multiply(CT)}, printOptions);
    result += printOptions.mathEndTag;
    result += "</div>";
  }
    return result;
  }
});

  var roman = function (n) {
    var digits = "IVXLCDM";
    var i = digits.length + 1;
    var result = "";
    var value = 1000;
    while ((i -= 2) >= 0) {
      var v = Math.trunc(value / 10);
      var j = -1;
      while (++j < 2) {
        while (n >= value) {
          n -= value;
          result += digits.slice(i - j, i - j + 1);
        }
        value -= v;
        while (n >= value) {
          n -= value;
          result += digits.slice(i - 2, i - 2 + 1) + digits.slice(i - j, i - j + 1);
        }
        value -= 4 * v;
      }
      value = v;
    }
    return result;
  };

  //TODO: remove
  var getMatrixRowDenotation = function (i) {
    return i18n.matrixRowDenotation.replace(/\$\{i\}/g, i.toString())
                                   .replace(/\$\{i\:roman\}/g, roman(i));
  };

Matrix.prototype.getDeterminantEventType = function () {
  for (var i = 0; i < this.rows(); i += 1) {
    var isZero = true;
    for (var j = 0; j < this.cols(); j += 1) {
      var e = this.e(i, j);
      if (!e.equals(Expression.Integer.ZERO)) {
        isZero = false;
      }
    }
    if (isZero) {
      return {
        type: "special-determinant",
        row: i,
        col: -1
      };
    }
  }
  for (var j = 0; j < this.cols(); j += 1) {
    var isZero = true;
    for (var i = 0; i < this.rows(); i += 1) {
      var e = this.e(i, j);
      if (!e.equals(Expression.Integer.ZERO)) {
        isZero = false;
      }
    }
    if (isZero) {
      return {
        type: "special-determinant",
        row: -1,
        col: j
      };
    }
  }
  return {
    type: "determinant",
    row: -1,
    col: -1
  };
};
  
//!new
Expression.Details.add({
  type: "special-determinant",
  i18n: undefined,
  priority: 0,
  callback: function (printOptions, matrix) {
    var html = "";
    
    var x = matrix.getDeterminantEventType();

    html += "<div>";
    html += printOptions.mathStartTag;
    html += new Expression.Determinant(new Expression.Matrix(matrix)).toMathML(Object.assign({}, printOptions, {
      highlightRow: x.row !== -1 ? x.row : undefined,
      highlightCol: x.col !== -1 ? x.col : undefined
    })) + "<mo>=</mo><mn>0</mn>";
    html += printOptions.mathEndTag;
    if (x.row !== -1 || x.col !== -1) {
      html += "<div>" + i18n.zeroRowColumn + "</div>";
    }
    html += "</div>";

    return html;
  }
});

Expression.Details.add({
  type: "determinant-Gauss",
  i18n: function () {
    return i18n.methodOfGauss;
  },
  priority: 1,
  callback: function (printOptions, matrix) {
    var html = "";

    html += "<div>";
    html += printOptions.mathStartTag;
    html += new Expression.Determinant(new Expression.Matrix(matrix)).toMathML(printOptions) + "<mo>=</mo><mn>?</mn>";
    html += printOptions.mathEndTag;
    html += "</div>";

    html += "<p>" + i18n.determinantDetails.start + "</p>";

    html += "<div>";
    var tmp = Expression.rowReductionGaussJordanMontante(matrix, Matrix.Gauss, true, Expression.rowReduceChangeToHTML, printOptions, matrix.cols());
    html += tmp.html;
    var rowEchelonMatrix = tmp.rowEchelonMatrix;
    html += "</div>";

    html += "<div>";
    html += printOptions.mathStartTag;
    html += new Expression.Determinant(new Expression.Matrix(matrix)).toMathML(printOptions);
    html += "<mo>=</mo>";
    html += new Expression.Determinant(new Expression.Matrix(rowEchelonMatrix)).toMathML(printOptions);
    html += "<mo>=</mo>";
    var result = rowEchelonMatrix.determinant();
    if (!result.equals(RPN.ZERO)) {
      var det = undefined;
      var j = -1;
      while (++j < rowEchelonMatrix.rows()) {
        det = det == undefined ? rowEchelonMatrix.e(j, j) : new Expression.Multiplication(det, rowEchelonMatrix.e(j, j)); //? usage of Expression.Multiplication to get 4 * 5 * 6 ...
      }
      html += det.toMathML(printOptions);
      html += "<mo>=</mo>";
    }
    html += result.toMathML(printOptions);
    html += printOptions.mathEndTag;
    html += "</div>";

    return html;
  }
});

Expression.Details.add({
  type: "rank",
  i18n: function () {
    return i18n.methodOfGauss;
  },
  priority: 1,
  callback: function (printOptions, matrix) {
    var html = "";
    html += "<div>";
    html += printOptions.mathStartTag;
    html += new Expression.Rank(new Expression.Matrix(matrix)).toMathML(printOptions) + "<mo>=</mo><mn>?</mn>";
    html += printOptions.mathEndTag;
    html += "</div>";
    html += "<p>" + i18n.rankDetails.start + "</p>";
    html += "<div>";
    var tmp = Expression.rowReductionGaussJordanMontante(matrix, Matrix.Gauss, false, Expression.rowReduceChangeToHTML, printOptions, -1);//?
    html += tmp.html;
    var rowEchelon = tmp.rowEchelonMatrix;
    html += "</div>";
    html += "<div>";
    html += printOptions.mathStartTag;
    html += new Expression.Rank(new Expression.Matrix(matrix)).toMathML(printOptions);
    html += "<mo>=</mo>";
    html += new Expression.Rank(new Expression.Matrix(rowEchelon)).toMathML(printOptions);
    html += "<mo>=</mo>";
    html += "<mn>" + rowEchelon.rank().toString() + "</mn>";
    html += printOptions.mathEndTag;
    html += "</div>";
    return html;
  }
});

// TODO:
// http://www.mathsisfun.com/algebra/matrix-inverse-row-operations-gauss-jordan.html
// i18n.inverseDetails.rowSwapNegate = "- Trocamos o linha {s} e o linha {c}:, ...";

Expression.Details.add({
  type: "inverse",
  i18n: function () {
    return i18n.methodOfGaussJordan;
  },
  priority: 1,
  callback: function (printOptions, matrix) {
    var html = "";
    html += "<div>";
    html += printOptions.mathStartTag;
    html += new Expression.Exponentiation(new Expression.Matrix(matrix), Expression.Integer.ONE.negate()).toMathML(printOptions) + "<mo>=</mo><mn>?</mn>";
    html += printOptions.mathEndTag;
    html += "</div>";
    html += "<p>" + i18n.inverseDetails.start + "</p>";
    html += "<div>";
    var result = undefined;
    try {
      //TODO: merge (?)
      var augmented = matrix.augment(Matrix.I(matrix.rows()));
      var tmp = Expression.rowReductionGaussJordanMontante(augmented, Matrix.GaussJordan, false, Expression.rowReduceChangeToHTML, Object.assign({}, printOptions, {
        columnlines: -matrix.cols()
      }), matrix.cols());
      html += tmp.html;
      var augmentedResult = tmp.rowEchelonMatrix;
      result = Matrix.Zero(matrix.rows(), matrix.rows()).map(function (element, i, j) { // splitting to get the second half
        var e = augmentedResult.e(i, i);
        if (e.equals(RPN.ZERO)) {
          throw new RangeError("SingularMatrixException");
        }
        var x = augmentedResult.e(i, j + augmentedResult.rows());
        return e.equals(RPN.ONE) ? x : x.divide(e);
      });
    } catch (error) {
      if (error instanceof RangeError && error.message.indexOf("SingularMatrixException") === 0) {
        result = undefined;
      } else {
        throw error;
      }
    }
    html += "</div>";
    if (result != undefined) {
      html += "<div>";
      html += printOptions.mathStartTag;
      html += new Expression.Exponentiation(new Expression.Matrix(matrix), Expression.Integer.ONE.negate()).toMathML(printOptions);
      html += "<mo>=</mo>";
      html += new Expression.Matrix(result).toMathML(printOptions);
      html += printOptions.mathEndTag;
      html += "</div>";
    } else {
      //TODO: ?
    }
    return html;
  }
});

Expression.Details.add({
  type: "multiply",
  i18n: function () {
    return i18n.matrixMultiplication;
  },
  minRows: 2,
  maxRows: undefined,
  priority: 1,
  callback: function (printOptions, matrixA, matrixB) {
    var html = "";
    html += "<p>" + i18n.matrixMultiplicationInfo + "</p>";
    //TODO: Should matrixA and matrixB already have NonSimplifiedExpressions-elements ???
    var matrixAn = matrixA.map(function (e, i, j) {return new NonSimplifiedExpression(e);});
    var matrixBn = matrixB.map(function (e, i, j) {return new NonSimplifiedExpression(e);});

    var matrixAB = matrixAn.multiply(matrixBn);
    var resultOfMultiplication = matrixAB.map(function (e, i, j) {return e.simplify();});
    html += printOptions.mathStartTag;
    html += new Expression.Matrix(matrixAn).toMathML(Object.assign({}, printOptions, {
      cellIdGenerator: function (i, j) {
        return matrixAn.e(i, j).getId();
      }
    }));
    html += "<mo>&times;</mo>";
    html += new Expression.Matrix(matrixBn).toMathML(Object.assign({}, printOptions, {
      cellIdGenerator: function (i, j) {
        return matrixBn.e(i, j).getId();
      }
    }));
    html += "<mo>=</mo>";
    html += new Expression.Matrix(matrixAB).toMathML(Object.assign({}, printOptions, {
      cellIdGenerator: function (i, j) {
        return matrixAB.e(i, j).getId();
      }
    }));
    html += "<mo>=</mo>";
    html += new Expression.Matrix(resultOfMultiplication).toMathML(printOptions);
    html += printOptions.mathEndTag;
    //TODO: highlight of "same" expression elements, when mouseover an element of matrixAB or matrixA or matrixB
    matrixAB.map(function (e, i, j) {
      html += "<a class=\"a-highlight\" data-for=\"" + e.getId().toString() + "\" data-highlight=\"" + e.unwrap().getIds() + "\"></a>";
      return e;
    });

    return html;
  }
});

Expression.Details.add({
  type: "pow",
  i18n: function () {
    return i18n.matrixMultiplication;
  },
  minRows: 1,
  maxRows: undefined,
  priority: 1,
  callback: function (printOptions, matrix, second) {
    var n = Number.parseInt(second.e(0, 0).toString(), 10);
    // n >= 1 (?)
    var i = 0;
    var c = 1;
    var t = [matrix];
    var html = "<ul>";
    html += "<li>";
    html += printOptions.mathStartTag;
    html += Expression.p("A", undefined, printOptions) + "<mo>=</mo>" + new Expression.Matrix(t[i]).toMathML(printOptions);
    html += printOptions.mathEndTag;
    html += "</li>";
    while (c * 2 <= n) {
      c *= 2;
      t[i + 1] = t[i].multiply(t[i]);
      html += "<li>";
      html += printOptions.mathStartTag;
      html += Expression.p("A^" + c.toString(), undefined, printOptions) + "<mo>=</mo>" + Expression.p("A^" + Math.trunc(c / 2).toString() + "*" + "A^" + Math.trunc(c / 2).toString(), undefined, printOptions) + "<mo>=</mo>" + new Expression.Matrix(t[i + 1]).toMathML(printOptions);
      html += printOptions.mathEndTag;
      html += "</li>";
      i += 1;
    }
    html += "</ul>";
    var result = undefined;
    var r = undefined;
    var nn = n;
    while (i !== -1 && nn !== 0) {
      if (nn >= c) {
        nn -= c;
        result = result == undefined ? t[i] : result.multiply(t[i]);
        var z = new Expression.NonSimplifiedExpression(new Expression.Symbol("A").pow(RPN(c.toString())));
        r = r == undefined ? z : r.multiply(z);
      }
      c = Math.trunc(c / 2);
      i -= 1;
    }
    html += printOptions.mathStartTag;
    html += Expression.p("A^" + n.toString(), undefined, printOptions) + "<mo>=</mo>" + r.toMathML(printOptions) + "<mo>=</mo>" + new Expression.Matrix(result).toMathML(printOptions);
    html += printOptions.mathEndTag;
    return html;
  }
});

Expression.someDetailsNew = {
  "someDetails0": "<div data-custom-paint=\"custom-menclose\" data-color=\"0a\" data-cells=\"[[0,0],[1,1]]\"><div data-custom-paint=\"custom-menclose\" data-color=\"1a\" data-cells=\"[[0,1],[1,0]]\"><custom-math><mrow><mfenced open=\"|\" close=\"|\"><mtable><mtr><mtd><msub><mrow><mi>a</mi></mrow><mrow><mn>11</mn></mrow></msub></mtd><mtd><msub><mrow><mi>a</mi></mrow><mrow><mn>12</mn></mrow></msub></mtd></mtr><mtr><mtd><msub><mrow><mi>a</mi></mrow><mrow><mn>21</mn></mrow></msub></mtd><mtd><msub><mrow><mi>a</mi></mrow><mrow><mn>22</mn></mrow></msub></mtd></mtr></mtable></mfenced><mo>=</mo><mrow><mrow mathcolor=\"#D64040\"><msub><mrow><mi>a</mi></mrow><mrow><mn>11</mn></mrow></msub><mo>&times;</mo><msub><mrow><mi>a</mi></mrow><mrow><mn>22</mn></mrow></msub></mrow><mo>&minus;</mo><mrow mathcolor=\"#4040D6\"><msub><mrow><mi>a</mi></mrow><mrow><mn>12</mn></mrow></msub><mo>&times;</mo><msub><mrow><mi>a</mi></mrow><mrow><mn>21</mn></mrow></msub></mrow></mrow></mrow></custom-math></div></div><a href=\"${link}\"></a>",
  "determinant3x3": "<custom-math><mrow><mfenced open=\"|\" close=\"|\"><mtable><mtr><mtd><msub><mrow><mi>a</mi></mrow><mrow><mn>11</mn></mrow></msub></mtd><mtd><msub><mrow><mi>a</mi></mrow><mrow><mn>12</mn></mrow></msub></mtd><mtd><msub><mrow><mi>a</mi></mrow><mrow><mn>13</mn></mrow></msub></mtd></mtr><mtr><mtd><msub><mrow><mi>a</mi></mrow><mrow><mn>21</mn></mrow></msub></mtd><mtd><msub><mrow><mi>a</mi></mrow><mrow><mn>22</mn></mrow></msub></mtd><mtd><msub><mrow><mi>a</mi></mrow><mrow><mn>23</mn></mrow></msub></mtd></mtr><mtr><mtd><msub><mrow><mi>a</mi></mrow><mrow><mn>31</mn></mrow></msub></mtd><mtd><msub><mrow><mi>a</mi></mrow><mrow><mn>32</mn></mrow></msub></mtd><mtd><msub><mrow><mi>a</mi></mrow><mrow><mn>33</mn></mrow></msub></mtd></mtr></mtable></mfenced><mo>=</mo></mrow></custom-math>",
  "matrix3x3": "<custom-math><mtable><mtr><mtd><msub><mrow><mi>a</mi></mrow><mrow><mn>11</mn></mrow></msub></mtd><mtd><msub><mrow><mi>a</mi></mrow><mrow><mn>12</mn></mrow></msub></mtd><mtd><msub><mrow><mi>a</mi></mrow><mrow><mn>13</mn></mrow></msub></mtd></mtr><mtr><mtd><msub><mrow><mi>a</mi></mrow><mrow><mn>21</mn></mrow></msub></mtd><mtd><msub><mrow><mi>a</mi></mrow><mrow><mn>22</mn></mrow></msub></mtd><mtd><msub><mrow><mi>a</mi></mrow><mrow><mn>23</mn></mrow></msub></mtd></mtr><mtr><mtd><msub><mrow><mi>a</mi></mrow><mrow><mn>31</mn></mrow></msub></mtd><mtd><msub><mrow><mi>a</mi></mrow><mrow><mn>32</mn></mrow></msub></mtd><mtd><msub><mrow><mi>a</mi></mrow><mrow><mn>33</mn></mrow></msub></mtd></mtr></mtable></custom-math>",
  "someDetails1": "${determinant3x3}<table class=\"some-details-table\"><tbody><tr><td><custom-math><mo>+</mo><msub><mrow><mi>a</mi></mrow><mrow><mn>11</mn></mrow></msub><mo>&times;</mo><msub><mrow><mi>a</mi></mrow><mrow><mn>22</mn></mrow></msub><mo>&times;</mo><msub><mrow><mi>a</mi></mrow><mrow><mn>33</mn></mrow></msub></custom-math></td><td><div data-custom-paint=\"custom-menclose\" data-color=\"0a\" data-cells=\"[[0,0],[1,1],[2,2]]\">${matrix3x3}</div></td></tr><tr><td><custom-math><mo>+</mo><msub><mrow><mi>a</mi></mrow><mrow><mn>12</mn></mrow></msub><mo>&times;</mo><msub><mrow><mi>a</mi></mrow><mrow><mn>23</mn></mrow></msub><mo>&times;</mo><msub><mrow><mi>a</mi></mrow><mrow><mn>31</mn></mrow></msub></custom-math></td><td><div data-custom-paint=\"custom-menclose\" data-color=\"0\" data-cells=\"[[0,0],[1,1],[2,2]]\"><div data-custom-paint=\"custom-menclose\" data-color=\"0a\" data-cells=\"[[0,1],[1,2],[2,0]]\">${matrix3x3}</div></div></td></tr><tr><td><custom-math><mo>+</mo><msub><mrow><mi>a</mi></mrow><mrow><mn>13</mn></mrow></msub><mo>&times;</mo><msub><mrow><mi>a</mi></mrow><mrow><mn>21</mn></mrow></msub><mo>&times;</mo><msub><mrow><mi>a</mi></mrow><mrow><mn>32</mn></mrow></msub></custom-math></td><td><div data-custom-paint=\"custom-menclose\" data-color=\"0\" data-cells=\"[[0,0],[1,1],[2,2]]\"><div data-custom-paint=\"custom-menclose\" data-color=\"0\" data-cells=\"[[0,1],[1,2],[2,0]]\"><div data-custom-paint=\"custom-menclose\" data-color=\"0a\" data-cells=\"[[0,2],[1,0],[2,1]]\">${matrix3x3}</div></div></div></td></tr><tr><td><custom-math><mo>&minus;</mo><msub><mrow><mi>a</mi></mrow><mrow><mn>13</mn></mrow></msub><mo>&times;</mo><msub><mrow><mi>a</mi></mrow><mrow><mn>22</mn></mrow></msub><mo>&times;</mo><msub><mrow><mi>a</mi></mrow><mrow><mn>31</mn></mrow></msub></custom-math></td><td><div data-custom-paint=\"custom-menclose\" data-color=\"0\" data-cells=\"[[0,0],[1,1],[2,2]]\"><div data-custom-paint=\"custom-menclose\" data-color=\"0\" data-cells=\"[[0,1],[1,2],[2,0]]\"><div data-custom-paint=\"custom-menclose\" data-color=\"0\" data-cells=\"[[0,2],[1,0],[2,1]]\"><div data-custom-paint=\"custom-menclose\" data-color=\"1a\" data-cells=\"[[2,0],[1,1],[0,2]]\">${matrix3x3}</div></div></div></div></td></tr><tr><td><custom-math><mo>&minus;</mo><msub><mrow><mi>a</mi></mrow><mrow><mn>11</mn></mrow></msub><mo>&times;</mo><msub><mrow><mi>a</mi></mrow><mrow><mn>23</mn></mrow></msub><mo>&times;</mo><msub><mrow><mi>a</mi></mrow><mrow><mn>32</mn></mrow></msub></custom-math></td><td><div data-custom-paint=\"custom-menclose\" data-color=\"0\" data-cells=\"[[0,0],[1,1],[2,2]]\"><div data-custom-paint=\"custom-menclose\" data-color=\"0\" data-cells=\"[[0,1],[1,2],[2,0]]\"><div data-custom-paint=\"custom-menclose\" data-color=\"0\" data-cells=\"[[0,2],[1,0],[2,1]]\"><div data-custom-paint=\"custom-menclose\" data-color=\"1\" data-cells=\"[[2,0],[1,1],[0,2]]\"><div data-custom-paint=\"custom-menclose\" data-color=\"1a\" data-cells=\"[[2,1],[1,2],[0,0]]\">${matrix3x3}</div></div></div></div></div></td></tr><tr><td><custom-math><mo>&minus;</mo><msub><mrow><mi>a</mi></mrow><mrow><mn>12</mn></mrow></msub><mo>&times;</mo><msub><mrow><mi>a</mi></mrow><mrow><mn>21</mn></mrow></msub><mo>&times;</mo><msub><mrow><mi>a</mi></mrow><mrow><mn>33</mn></mrow></msub></custom-math><a href=\"${link}\"></a></td><td><div data-custom-paint=\"custom-menclose\" data-color=\"0\" data-cells=\"[[0,0],[1,1],[2,2]]\"><div data-custom-paint=\"custom-menclose\" data-color=\"0\" data-cells=\"[[0,1],[1,2],[2,0]]\"><div data-custom-paint=\"custom-menclose\" data-color=\"0\" data-cells=\"[[0,2],[1,0],[2,1]]\"><div data-custom-paint=\"custom-menclose\" data-color=\"1\" data-cells=\"[[2,0],[1,1],[0,2]]\"><div data-custom-paint=\"custom-menclose\" data-color=\"1\" data-cells=\"[[2,1],[1,2],[0,0]]\"><div data-custom-paint=\"custom-menclose\" data-color=\"1a\" data-cells=\"[[2,2],[1,0],[0,1]]\">${matrix3x3}</div></div></div></div></div></div></td></tr></tbody></table>",
  "matrix5x3": "<custom-math><mtable columnlines=\"none none dashed none\"><mtr><mtd><msub><mrow><mi>a</mi></mrow><mrow><mn>11</mn></mrow></msub></mtd><mtd><msub><mrow><mi>a</mi></mrow><mrow><mn>12</mn></mrow></msub></mtd><mtd><msub><mrow><mi>a</mi></mrow><mrow><mn>13</mn></mrow></msub></mtd><mtd mathcolor=\"#808080\"><msub><mrow><mi>a</mi></mrow><mrow><mn>11</mn></mrow></msub></mtd><mtd mathcolor=\"#808080\"><msub><mrow><mi>a</mi></mrow><mrow><mn>12</mn></mrow></msub></mtd></mtr><mtr><mtd><msub><mrow><mi>a</mi></mrow><mrow><mn>21</mn></mrow></msub></mtd><mtd><msub><mrow><mi>a</mi></mrow><mrow><mn>22</mn></mrow></msub></mtd><mtd><msub><mrow><mi>a</mi></mrow><mrow><mn>23</mn></mrow></msub></mtd><mtd mathcolor=\"#808080\"><msub><mrow><mi>a</mi></mrow><mrow><mn>21</mn></mrow></msub></mtd><mtd mathcolor=\"#808080\"><msub><mrow><mi>a</mi></mrow><mrow><mn>22</mn></mrow></msub></mtd></mtr><mtr><mtd><msub><mrow><mi>a</mi></mrow><mrow><mn>31</mn></mrow></msub></mtd><mtd><msub><mrow><mi>a</mi></mrow><mrow><mn>32</mn></mrow></msub></mtd><mtd><msub><mrow><mi>a</mi></mrow><mrow><mn>33</mn></mrow></msub></mtd><mtd mathcolor=\"#808080\"><msub><mrow><mi>a</mi></mrow><mrow><mn>31</mn></mrow></msub></mtd><mtd mathcolor=\"#808080\"><msub><mrow><mi>a</mi></mrow><mrow><mn>32</mn></mrow></msub></mtd></mtr></mtable></custom-math>",
  "someDetails2": "${determinant3x3}<table class=\"some-details-table\"><tbody><tr><td><custom-math><mo>+</mo><msub><mrow><mi>a</mi></mrow><mrow><mn>11</mn></mrow></msub><mo>&times;</mo><msub><mrow><mi>a</mi></mrow><mrow><mn>22</mn></mrow></msub><mo>&times;</mo><msub><mrow><mi>a</mi></mrow><mrow><mn>33</mn></mrow></msub><mo>+</mo><msub><mrow><mi>a</mi></mrow><mrow><mn>12</mn></mrow></msub><mo>&times;</mo><msub><mrow><mi>a</mi></mrow><mrow><mn>23</mn></mrow></msub><mo>&times;</mo><msub><mrow><mi>a</mi></mrow><mrow><mn>31</mn></mrow></msub><mo>+</mo><msub><mrow><mi>a</mi></mrow><mrow><mn>13</mn></mrow></msub><mo>&times;</mo><msub><mrow><mi>a</mi></mrow><mrow><mn>21</mn></mrow></msub><mo>&times;</mo><msub><mrow><mi>a</mi></mrow><mrow><mn>32</mn></mrow></msub></custom-math></td><td><div data-custom-paint=\"custom-menclose\" data-color=\"0a\" data-cells=\"[[0,0],[1,1],[2,2]]\"><div data-custom-paint=\"custom-menclose\" data-color=\"0a\" data-cells=\"[[0,1],[1,2],[2,3]]\"><div data-custom-paint=\"custom-menclose\" data-color=\"0a\" data-cells=\"[[0,2],[1,3],[2,4]]\">${matrix5x3}</div></div></div></td></tr><tr><td><custom-math><mo>&minus;</mo><msub><mrow><mi>a</mi></mrow><mrow><mn>13</mn></mrow></msub><mo>&times;</mo><msub><mrow><mi>a</mi></mrow><mrow><mn>22</mn></mrow></msub><mo>&times;</mo><msub><mrow><mi>a</mi></mrow><mrow><mn>31</mn></mrow></msub><mo>&minus;</mo><msub><mrow><mi>a</mi></mrow><mrow><mn>11</mn></mrow></msub><mo>&times;</mo><msub><mrow><mi>a</mi></mrow><mrow><mn>23</mn></mrow></msub><mo>&times;</mo><msub><mrow><mi>a</mi></mrow><mrow><mn>32</mn></mrow></msub><mo>&minus;</mo><msub><mrow><mi>a</mi></mrow><mrow><mn>12</mn></mrow></msub><mo>&times;</mo><msub><mrow><mi>a</mi></mrow><mrow><mn>21</mn></mrow></msub><mo>&times;</mo><msub><mrow><mi>a</mi></mrow><mrow><mn>33</mn></mrow></msub></custom-math><a href=\"${link}\"></a></td><td><div data-custom-paint=\"custom-menclose\" data-color=\"0\" data-cells=\"[[0,0],[1,1],[2,2]]\"><div data-custom-paint=\"custom-menclose\" data-color=\"0\" data-cells=\"[[0,1],[1,2],[2,3]]\"><div data-custom-paint=\"custom-menclose\" data-color=\"0\" data-cells=\"[[0,2],[1,3],[2,4]]\"><div data-custom-paint=\"custom-menclose\" data-color=\"1a\" data-cells=\"[[0,2],[1,1],[2,0]]\"><div data-custom-paint=\"custom-menclose\" data-color=\"1a\" data-cells=\"[[0,3],[1,2],[2,1]]\"><div data-custom-paint=\"custom-menclose\" data-color=\"1a\" data-cells=\"[[0,4],[1,3],[2,2]]\">${matrix5x3}</div></div></div></div></div></div></td></tr></tbody></table>",
  "someDetails3": "<div data-custom-paint=\"custom-menclose\" data-color=\"0a\" data-cells=\"[[0,0],[2,2]]\"><div data-custom-paint=\"custom-menclose\" data-color=\"1a\" data-cells=\"[[0,2],[2,0]]\"><custom-math><mrow><mtable><mtr><mtd><mstyle mathvariant=\"bold\"><menclose notation=\"circle\"><msub><mrow><mi>a</mi></mrow><mrow><mn>r</mn><mo>,</mo><mn>c</mn></mrow></msub></menclose></mstyle></mtd><mtd><mtext>&hellip;</mtext></mtd><mtd><msub><mrow><mi>a</mi></mrow><mrow><mn>r</mn><mo>,</mo><mn>j</mn></mrow></msub></mtd></mtr><mtr><mtd><mtext>&vellip;</mtext></mtd><mtd></mtd><mtd><mtext>&vellip;</mtext></mtd></mtr><mtr><mtd><msub><mrow><mi>a</mi></mrow><mrow><mn>i</mn><mo>,</mo><mn>c</mn></mrow></msub></mtd><mtd><mtext>&hellip;</mtext></mtd><mtd><msub><mrow><mi>a</mi></mrow><mrow><mn>i</mn><mo>,</mo><mn>j</mn></mrow></msub></mtd></mtr></mtable></mrow></custom-math></div></div>"
};

Expression.getSomeDetails = function (i, printOptions) {
  var s = Expression.someDetailsNew["someDetails" + i.toString()];
  return s.replace(/\$\{determinant3x3\}/g, Expression.someDetailsNew.determinant3x3)
          .replace(/\$\{matrix3x3\}/g, Expression.someDetailsNew.matrix3x3)
          .replace(/\$\{matrix5x3\}/g, Expression.someDetailsNew.matrix5x3)
          .replace(/<custom\-math>/g, printOptions.mathStartTag)
          .replace(/<\/custom\-math>/g, printOptions.mathEndTag);
};

Expression.Details.add({
  type: "inverse-2x2",
  i18n: undefined,
  minRows: 2,
  maxRows: 2,
  priority: 1,
  callback: function (printOptions, matrix) {
    var html = "";
    html += "<div>";
    html += i18n.inverse2x2;
    html += " ";
    html += printOptions.mathStartTag;
    html += Expression.p("A^-1={{a, b}, {c, d}}^-1=1/determinant(A)*{{C_11, C_21}, {C_21, C_22}}=1/(a*d-b*c)*{{d, -b}, {-c, a}}", undefined, printOptions);
    html += printOptions.mathEndTag;
    html += i18n.inverse2x2Link;
    html += "</div>";
    var det = matrix.e(0, 0).multiply(matrix.e(1, 1)).subtract(matrix.e(0, 1).multiply(matrix.e(1, 0)));
    // TODO: highlight (?)
    html += printOptions.mathStartTag;
    html += Expression.p("A^-1=1/(a*d-b*c)*{{d, n}, {m, a}}" + (det.equals(RPN.ZERO) ? "=1/0*{{d, n}, {m, a}}" : "=t"), {
      A: new Expression.Matrix(matrix),
      a: matrix.e(0, 0),
      b: matrix.e(0, 1),
      c: matrix.e(1, 0),
      d: matrix.e(1, 1),
      n: matrix.e(0, 1).negate(),
      m: matrix.e(1, 0).negate(),
      t: det.equals(RPN.ZERO) ? undefined : new Expression.Matrix(matrix.inverse())
    }, printOptions);
    html += printOptions.mathEndTag;
    return html;
  }
});

Expression.Details.add({
  type: "determinant-2x2",
  i18n: undefined,
  minRows: 2,
  maxRows: 2,
  priority: 1,
  callback: function (printOptions, matrix) {
    var html = "<div>" + Expression.getSomeDetails(0, printOptions).replace(/\$\{link\}/g, i18n.determinant2x2Link) + "</div>";
    var determinantResult = matrix.e(0, 0).multiply(matrix.e(1, 1)).subtract(matrix.e(0, 1).multiply(matrix.e(1, 0)));
    html += printOptions.mathStartTag;
    html += Expression.p("determinant(A)=a*d-b*c=r", {
      A: new Expression.Matrix(matrix),
      a: matrix.e(0, 0),
      b: matrix.e(0, 1),
      c: matrix.e(1, 0),
      d: matrix.e(1, 1),
      r: determinantResult
    }, printOptions);
    html += printOptions.mathEndTag;
    return html;
  }
});

// ---------------------------------------- determinant -----------------------------------------------

function Myelem(m, a, z) {
  this.m = m;
  this.a = a;// Fraction
  this.z = z;// number
}

var getDeterminant = function (m, k, r, z, koef) {
  if (m.cols() === 1) {
    return m.e(0, 0);
  }

  var o = RPN.ZERO;

  var complement = function (elem, r, c) {
      return m.e(r >= i ? r + 1 : r , c >= k ? c + 1 : c );
  };

  var i = -1;
  while (++i < m.cols()) {

    // complement matrix for element e(i, k)
    var mx = Matrix.Zero(m.rows() - 1, m.cols() - 1).map(complement);

    var kk = koef.multiply(m.e(i, k));
    if (2 * Math.trunc((i + k) / 2) !== i + k) {
      kk = kk.negate();
    }
    r.push(new Myelem(mx, kk, z));
    o = o.add(m.e(i, k).multiply(getDeterminant(mx, 0, r, z + 1, kk)));
  }
  return o;
};

Expression.detfindDet = function (m, byRow, num, printOptions) {
    var r = [];
    var k = Number.parseInt(num, 10) - 1;

    //!
    if (!m.isSquare()) {
      throw new RangeError("NonSquareMatrixException");
    }
    if (k >= m.rows() || k < 0 || k !== Math.trunc(k)) { // m.isSquare() === true
      throw new RangeError("IntegerInputError" + ":" + num);
    }
    //!
    
    r.push(new Myelem(m, RPN.ONE, 0));
    if (byRow) {
      // expansion by row k
      getDeterminant(m.transpose(), k, r, 1, RPN.ONE);
      var l = -1;
      while (++l < r.length) {
        r[l].m = r[l].m.transpose();
      }
      
    } else {
      getDeterminant(m, k, r, 1, RPN.ONE);// expansion by column k
    }
    var html = "";
    html += printOptions.mathStartTag;
    var z = r[0].m.cols() - 1;
    var i = -1;
    while (++i < z) {
      var j = -1;
      var e = undefined;
      while (++j < r.length) {
        if (r[j].z === i && !r[j].a.equals(RPN.ZERO)) {
          var current = undefined;
          var det = new Expression.Determinant(new Expression.Matrix(r[j].m));
          if (i === 0 && r[j].a.equals(RPN.ONE)) {
            current = det;
          } else {
            current = new Expression.Multiplication(r[j].a, det);
          }
          e = e == undefined ? current : new Expression.Addition(e, current);
        }
      }
      if (e != undefined) { // all zeros
        html += e.toMathML(printOptions);
        html += "<mo>=</mo>";
      }
    }
    html += m.determinant().toMathML(printOptions);
    html += printOptions.mathEndTag;
    return html;
};


Expression.Details.add({
  type: "eigenvectors",
  callback: function (printOptions, matrix) {
    return Expression.findEVectors(printOptions, matrix);
  }
});

//!
Expression.Details.add({
  type: "expand-along-column",
  callback: function (printOptions, matrix, columnNumber) {
    return Expression.detfindDet(matrix, false, columnNumber.toString(), printOptions);
  }
});
Expression.Details.add({
  type: "expand-along-row",
  callback: function (printOptions, matrix, rowNumber) {
    return Expression.detfindDet(matrix, true, rowNumber.toString(), printOptions);
  }
});
Expression.Details.add({
  type: "obtain-zeros-in-column",
  callback: function (printOptions, matrix, columnNumber) {
    return Expression.getZero(matrix, false, columnNumber.toString(), printOptions);
  }
});
Expression.Details.add({
  type: "obtain-zeros-in-row",
  callback: function (printOptions, matrix, rowNumber) {
    return Expression.getZero(matrix, true, rowNumber.toString(), printOptions);
  }
});

var determinant3x3 = function (printOptions, matrix, text) {
    var containerId = printOptions.idPrefix + "-" + RPN.id();
    if (matrix.cols() !== 3 || matrix.rows() !== 3) {
      throw new RangeError("NonSquareMatrixException:" + i18n.theRuleOfSarrusCanBeUsedOnlyWith3x3Matrices);
    }
//TODO: replace
    var matrixId = containerId;
    var cellId = function (i, j) {
      return matrixId + "_" + i.toString() + "_" + j.toString();
    };
    var html = "";
    html += "<div>" + text + "</div>";
    html += printOptions.mathStartTag;
    html += new Expression.Determinant(new Expression.Matrix(matrix)).toMathML(Object.assign({}, printOptions, {
      cellIdGenerator: function (i, j) {
        return cellId(i, j);
      }
    }));
    html += "<mo>=</mo>";
    // TODO: clickable highlight with initially selected group
    var z = [
      "a_11*a_22*a_33",
      "a_12*a_23*a_31",
      "a_13*a_21*a_32",
      "a_31*a_22*a_13",
      "a_32*a_23*a_11",
      "a_33*a_21*a_12"
    ];
    var context = new RPN.Context(function (id) {
      return matrix.e(Number.parseInt(id.slice(2, 3), 10) - 1, Number.parseInt(id.slice(3, 4), 10) - 1);
    });
    var determinant = undefined;
    for (var i = 0; i < z.length; i += 1) {
      var e = RPN(z[i], context);
      if (i !== 0) {
        var sign = i < 3 ? "+" : "&minus;";
        html += "<mo>" + sign + "</mo>";
      }
      var highlight = z[i].replace(/a_(\d)(\d)\*?/g, function (x, si, sj) {
        var i = Number.parseInt(si, 10) - 1;
        var j = Number.parseInt(sj, 10) - 1;
        return "#" + cellId(i, j) + ", ";
      }).slice(0, -2);
      html += "<munder>";
      html += "<mrow id=\"" + (matrixId + "_x" + i.toString()) + "\">";
      html += e.toMathML(Object.assign({}, printOptions, {isTopLevel: false}));
      html += "</mrow>";
      html += "<mrow>";
      html += "<mtext data-x=\"TODO\">";
      html += "<a class=\"a-highlight\" data-for=\"" + (matrixId + "_x" + i.toString()) + "\" data-highlight=\"" + highlight + "\"></a>";
      html += "</mtext>";
      html += "</mrow>";
      html += "</munder>";
      determinant = i === 0 ? e : (i < 3 ? determinant.add(e) : determinant.subtract(e));
    }

    html += "<mo>=</mo>";
    html += determinant.simplify().toMathML(printOptions);
    html += printOptions.mathEndTag;
    return html;
};

//TODO: fix - i18n.usingSarrusRule
Expression.Details.add({
  type: "determinant-Sarrus",
  i18n: function () {
    return i18n.ruleOfSarrus;
  },
  minRows: 3,
  maxRows: 3,
  priority: 3,
  callback: function (printOptions, matrix) {
    return determinant3x3(printOptions, matrix, Expression.getSomeDetails(2, printOptions).replace(/\$\{link\}/g, i18n.ruleOfSarrusLink));
  }
});

Expression.Details.add({
  type: "determinant-Triangle",
  i18n: function () {
    return i18n.ruleOfTriangle;
  },
  minRows: 3,
  maxRows: 3,
  priority: 4,
  callback: function (printOptions, matrix) {
    return determinant3x3(printOptions, matrix, Expression.getSomeDetails(1, printOptions).replace(/\$\{link\}/g, i18n.ruleOfTriangleLink));
  }
});

Matrix.permutations = function (n, callback) {
  if (n < 1) {
    return;
  }
  if (n !== Math.trunc(n)) {
    throw new RangeError();
  }
  var p = [];
  var even = true;
  var i = -1;
  while (++i < n) {
    p[i] = i;
  }
  var k = 0;
  var l = 0;
  var t = 0;

  while (true) {
    callback(p, even);
    k = n - 2;
    l = n - 1;

    while (k >= 0 && p[k] > p[k + 1]) {
      k -= 1;
    }

    if (k < 0) {
      return;
    }

    while (p[k] > p[l]) {
      l -= 1;
    }

    t = p[k];
    p[k] = p[l];
    p[l] = t;
    even = !even;

    // reverse
    i = k + 1;
    while (i < n - i + k) {
      t = p[n - i + k];
      p[n - i + k] = p[i];
      p[i] = t;
      even = !even;
      i += 1;
    }
  }
};

Matrix.prototype.determinantLeibniz = function () {
  if (!this.isSquare()) {
    throw new RangeError("NonSquareMatrixException");
  }
  var determinant = undefined;
  var matrix = this;
  Matrix.permutations(this.cols(), function (p, even) {
    var t = undefined;
    for (var i = 0; i < p.length; i += 1) {
      t = t == undefined ? matrix.e(i, p[i]) : t.multiply(matrix.e(i, p[i]));
    }
    determinant = determinant == undefined ? (even ? t : t.negate()) : (even ? determinant.add(t) : determinant.subtract(t));
  });
  return determinant;
};

//???
Expression.Details.add({
  type: "determinant-Leibniz",
  i18n: function () {
    return i18n.formulaOfLeibniz;
  },
  minRows: 4,
  maxRows: undefined,
  priority: -1,
  callback: function (printOptions, matrix) {
    var html = "";
    html += printOptions.mathStartTag;
    html += new Expression.Determinant(new Expression.Matrix(matrix)).toMathML(printOptions);
    //html += "<mo>=</mo>";
    //html += "";
    html += "<mo>=</mo>";
    html += matrix.map(function (e, i, j) {
      return new NonSimplifiedExpression(e);
    }).determinantLeibniz().toMathML(printOptions);
    html += "<mo>=</mo>";
    html += matrix.determinantLeibniz().toMathML(printOptions);
    html += printOptions.mathEndTag;
    return html;
  }
});

Expression.mgetZero = function (m, k) { // m == n ; in a column k -- find in k-column non-zero element and ... subtract
    var r = [];
    var i = 0;
    while (i < m.rows() && m.e(i, k).equals(RPN.ZERO)) {
      i += 1;
    }
    if (i < m.rows()) {
      var j = -1;
      while (++j < m.rows()) {
        if (j !== i) {
          m = m.rowReduce(j, i, k);
          r.push(m);
        }
      }
    }
    return r;// r?
};

Expression.getZero = function (matrix, atRow, a, printOptions) {
    var k = Number.parseInt(a, 10) - 1;
    //!
    if (!matrix.isSquare()) {
      throw new RangeError("NonSquareMatrixException");
    }
    if (k >= matrix.rows() || k < 0 || k !== Math.trunc(k)) { // matrix.isSquare() === true
      throw new RangeError("IntegerInputError" + ":" + a);
    }
    //!

    var html = "";
    html += printOptions.mathStartTag;
    html += new Expression.Determinant(new Expression.Matrix(matrix)).toMathML(printOptions) + "<mo>=</mo>";

    var dets = Expression.mgetZero(atRow ? matrix.transpose() : matrix, k);
   
    var i = -1;
    while (++i < dets.length) {
      html += (i === 0 ? "" : "<mo>=</mo>") + new Expression.Determinant(new Expression.Matrix(atRow ? dets[i].transpose() : dets[i])).toMathML(printOptions);
    }
    html += "<mo>=</mo>";
    html += matrix.determinant().toMathML(printOptions);
    html += printOptions.mathEndTag;
    return html;
};
// --------------------------------------------- end ----------------------------------------------
// ---------------------------------------- sle -----------------------------------------------

Matrix.trimRight = function (x) {
  var lastColumn = 0;
  x.map(function (e, i, j) {
    if (lastColumn < j && !e.equals(RPN.ZERO)) {
      lastColumn = j;
    }
    return e;
  });
  return x.slice(0, x.rows(), 0, lastColumn + 1);
};

var testSLECompatibility = function (printOptions, fullMatrix) {
  var st = "<h4>" + i18n.textAnalyseCompatibility + "</h4>";
  //TODO: fix i18n
  st += i18n.analyseCompatibilityIntroduction != undefined ? "<p>" + i18n.analyseCompatibilityIntroduction + "</p>" : "";
  var m = Matrix.trimRight(fullMatrix.slice(0, fullMatrix.rows(), 0, fullMatrix.cols() - 1));
  var b = fullMatrix.slice(0, fullMatrix.rows(), fullMatrix.cols() - 1, fullMatrix.cols());
  var augmented = m.augment(b);
  var mRank = m.rank();
  var augmentedRank = augmented.rank();
  st += "<div>";
  st += printOptions.mathStartTag;
  st += new Expression.Rank(new Expression.Matrix(augmented)).toMathML(printOptions) + "<mo>=</mo><mn>" + augmentedRank.toString() + "</mn>";
  st += printOptions.mathEndTag;
  st += "</div>";
  st += createDetailsSummary(printOptions.idPrefix, [{type: "rank", matrix: augmented.toString(), second: undefined}]);
  st += "<div>";
  st += printOptions.mathStartTag;
  st += new Expression.Rank(new Expression.Matrix(m)).toMathML(printOptions) + "<mo>=</mo><mn>" + mRank.toString() + "</mn>";
  st += printOptions.mathEndTag;
  st += "</div>";
  st += createDetailsSummary(printOptions.idPrefix, [{type: "rank", matrix: m.toString(), second: undefined}]);
  st += "<div>";
  if (mRank === augmentedRank) {
    if (m.cols() === mRank) {
      st += i18n.textAn1a;
    } else {
      st += i18n.textAn1b;
    }
  } else {
    st += i18n.textAn2;
  }
  st += "</div>";
  return st;
};

Expression.Details.add({
  type: "analyse-compatibility",
  i18n: function () {
    return i18n.testForConsistency; //?
  },
  priority: 1,
  callback: function (printOptions, matrix) {
    return testSLECompatibility(printOptions, matrix);
  }
});

  //TODO: move
  var outSystem = function (printOptions, matrix, variableNames) {
    return new Expression.Matrix(matrix).toMathML(Object.assign({}, printOptions, {
      variableNames: variableNames,
      useBraces: ["{", " "]
    }));
  };
  //! TODO: (!)

var makeDefaultVariableNames = function (count) {
  var variableNames = [];
  for (var i = 0; i < count; i += 1) {
    variableNames[i] = "x_" + (i + 1).toString();
  }
  return variableNames;
};
  
var solveUsingCramersRule = function (printOptions, fullMatrix, variableNames) {
  // TODO: fix
  //!hack
  if (variableNames == undefined) {
    variableNames = makeDefaultVariableNames(fullMatrix.cols() - 1);
  }

  var m = Matrix.trimRight(fullMatrix.slice(0, fullMatrix.rows(), 0, fullMatrix.cols() - 1));
  var b = fullMatrix.slice(0, fullMatrix.rows(), fullMatrix.cols() - 1, fullMatrix.cols());

  var d = [];
  var i = 0;
  var mstr = "";
  if (!m.isSquare()) {
    throw new RangeError("NonSquareMatrixException:" + i18n.text01);
  }
  var D0 = m.determinant();
  mstr = "<h4>" + i18n.solutionByRuleOfCramer + "</h4>";
  mstr += "<div>";
  mstr += printOptions.mathStartTag;
  mstr += outSystem(printOptions, fullMatrix, variableNames);
  mstr += printOptions.mathEndTag;
  mstr += "</div>";
  mstr += "<div>";
  mstr += printOptions.mathStartTag;
  mstr += "<mi>&Delta;</mi>";
  mstr += "<mo>=</mo>" + new Expression.Determinant(new Expression.Matrix(m)).toMathML(printOptions);
  mstr += "<mo>=</mo>" + D0.toMathML(printOptions);
  mstr += printOptions.mathEndTag;
  mstr += "</div>";
  mstr += createDetailsSummary(printOptions.idPrefix, [{type: m.getDeterminantEventType("determinant").type, matrix: m.toString(), second: undefined}]);
  if (D0.equals(RPN.ZERO)) {
    //TODO: fix text
    mstr += i18n.text02;
    return mstr;
  }
  
  var detMatrixI = function (elem, row, col) {
    return col === i ? b.e(row, 0) : elem;
  };
  
  i = -1;
  while (++i < m.cols()) {
    mstr += "<div>";
    var m1 = m.map(detMatrixI);
    d[i] = m1.determinant();
    mstr += printOptions.mathStartTag;
    mstr += "<msub><mrow><mi>&Delta;</mi></mrow><mrow><mn>" + (i + 1) + "</mn></mrow></msub><mo>=</mo>" + new Expression.Determinant(new Expression.Matrix(m1)).toMathML(printOptions) + "<mo>=</mo>" + d[i].toMathML(printOptions);
    mstr += printOptions.mathEndTag;
    mstr += "; ";
    mstr += createDetailsSummary(printOptions.idPrefix, [{type: m1.getDeterminantEventType("determinant").type, matrix: m1.toString(), second: undefined}]);
    mstr += "</div>";
  }
  i = -1;
  while (++i < m.cols()) {
    mstr += "<div>";
    mstr += printOptions.mathStartTag;
    mstr += new Expression.Symbol(variableNames[i]).toMathML(printOptions);
    var deltaI = new NonSimplifiedExpression(d[i]).divide(new NonSimplifiedExpression(D0));
    var deltaISimplified = deltaI.simplify();
    mstr += "<mo>=</mo><msub><mrow><mi>&Delta;</mi></mrow><mrow><mn>" + (i + 1) + "</mn></mrow></msub><mo>/</mo><mi>&Delta;</mi>";
    mstr += "<mo>=</mo>" + deltaI.toMathML(printOptions);
    if (deltaI.toString() !== deltaISimplified.toString()) {//?
      mstr += "<mo>=</mo>" + deltaISimplified.toMathML(printOptions);
    }
    mstr += printOptions.mathEndTag;
    mstr += "</div>";
  }

  mstr += "<div>" + i18n.textAnswer + "</div>";
  i = -1;
  while (++i < m.cols()) {
    mstr += "<div>";
    mstr += printOptions.mathStartTag;
    mstr += new Expression.Symbol(variableNames[i]).toMathML(printOptions) + "<mo>=</mo>" + d[i].divide(D0).toMathML(printOptions);
    mstr += printOptions.mathEndTag;
    mstr += "</div>";
  }
  return mstr;
};

// SLE solution with inverse matrix
var solveUsingInverseMatrixMethod = function (printOptions, fullMatrix, variableNames) {
  //TODO: use variableNames (?)

  var m = Matrix.trimRight(fullMatrix.slice(0, fullMatrix.rows(), 0, fullMatrix.cols() - 1));
  var b = fullMatrix.slice(0, fullMatrix.rows(), fullMatrix.cols() - 1, fullMatrix.cols());

    var mstr = "";
    var c = undefined;
    if (!m.isSquare()) {
        throw new RangeError("NonSquareMatrixException:" + i18n.text05);
    }
    try {
      c = m.inverse();
    } catch (error) {
      if (error instanceof RangeError && error.message.indexOf("SingularMatrixException") === 0) {
        //mstr = i18n.text06;
      } else {
        throw error;
      }
    }
  mstr += "<h4>" + i18n.solutionByInverseMatrixMethod + "</h4>";
  mstr += "<div>";
  mstr += printOptions.mathStartTag;
  mstr += "<mi>A</mi><mo>&times;</mo><mi>X</mi><mo>=</mo><mi>B</mi>";
  mstr += printOptions.mathEndTag;
  mstr += "</div>";
  mstr += "<div>";
  mstr += printOptions.mathStartTag;
  mstr += "<mi>A</mi><mo>=</mo>" + new Expression.Matrix(m).toMathML(printOptions);
  mstr += printOptions.mathEndTag;
  mstr += "</div>";
  mstr += "<div>";
  mstr += printOptions.mathStartTag;
  mstr += "<mi>B</mi><mo>=</mo>" + new Expression.Matrix(b).toMathML(printOptions);
  mstr += printOptions.mathEndTag;
  mstr += "</div>";
  if (c != undefined) {
    mstr += "<div>";
    mstr += printOptions.mathStartTag;
    mstr += "<msup><mrow><mi>A</mi></mrow><mrow><mn>-1</mn></mrow></msup><mo>=</mo>" + new Expression.Matrix(c).toMathML(printOptions);
    mstr += printOptions.mathEndTag;
    mstr += "</div>";
    mstr += createDetailsSummary(printOptions.idPrefix, [{type: "inverse", matrix: m.toString(), second: undefined}]);
    mstr += printOptions.mathStartTag;
    mstr += "<mi>X</mi><mo>=</mo><msup><mrow><mi>A</mi></mrow><mrow><mn>-1</mn></mrow></msup><mo>&times;</mo><mi>B</mi><mo>=</mo>" + new Expression.Matrix(c).toMathML(printOptions) + "<mo>&times;</mo>" + new Expression.Matrix(b).toMathML(printOptions) + "<mo>=</mo>" + new Expression.Matrix(c.multiply(b)).toMathML(printOptions);
    mstr += printOptions.mathEndTag;
  } else {
    mstr += i18n.text06;
    mstr += createDetailsSummary(printOptions.idPrefix, [{type: "inverse", matrix: m.toString(), second: undefined}]);
    mstr += "<div class=\"for-details\"></div>";
  }
  return mstr;
};

//----------Gauss
// getting row echelon form without columns swapping

RPN.idCounter = 0;
RPN.id = function () {
  return (RPN.idCounter += 1).toString();
};

Expression.rowReduceChangeToHTML = function (change, printOptions, containerId, k) {
  var multiplier = change.type === "reduce" ? change.oldMatrix.e(change.targetRow, change.pivotColumn).divide(change.oldMatrix.e(change.pivotRow, change.pivotColumn)) : undefined;
  var areBracketsRequired = change.type === "reduce" ? multiplier.getPrecedence(multiplier) !== RPN.ZERO.getPrecedence() : undefined; //? not simple
  var tooltip = ((change.type === "swap-negate" ? i18n.eliminationDetails.rowSwapNegate.replace(/`-1`/g, printOptions.mathStartTag + "<mo>&minus;</mo><mn>1</mn>" + printOptions.mathEndTag) : "") +
                 (change.type === "swap" ? i18n.eliminationDetails.rowSwap : "") +
                 (change.type === "divide" ? i18n.eliminationDetails.rowDivision.replace(/\$\{a\}/g, "<code>" + printOptions.mathStartTag + change.oldMatrix.e(change.pivotRow, change.pivotColumn).toMathML(printOptions) + printOptions.mathEndTag + "</code>") : "") +
                 (change.type === "reduce" ? i18n.eliminationDetails.rowSubtraction.replace(/\$\{a\}/g, "<code>" + printOptions.mathStartTag + (areBracketsRequired ? "<mfenced open=\"(\" close=\")\">" : "") + "<mrow>" + multiplier.toMathML(printOptions) + "</mrow>" + (areBracketsRequired ? "</mfenced>" : "") + printOptions.mathEndTag + "</code>") : ""))
                  .replace(/\$\{j\}/g, "<code>" + (change.targetRow + 1).toString() + "</code>")
                  .replace(/\$\{i\}/g, "<code>" + (change.pivotRow + 1).toString() + "</code>");

  var text = "";
  var cellId = function (containerId, k, i, j) {
    return containerId + "-" + k.toString() + "-" + i.toString() + "-" + j.toString();
  };
  var questionId = containerId + "-" + k.toString() + "-" + "question-mark";
  var tooltipId = questionId + "-" + "tooltip";

  k += 1; //!
  for (var i = 0; i < change.oldMatrix.cols(); i += 1) {
    if (change.type === "reduce" || change.type === "divide") {
      var divId = cellId(containerId, k, change.targetRow, i) + "-" + "tooltip";
      var highlight = "<a class=\"a-highlight\" data-for=\"" + cellId(containerId, k, change.targetRow, i) + "\" data-highlight=\"" +
                        "#" + cellId(containerId, k - 1, change.pivotRow, change.pivotColumn) + ", " +
                        "#" + cellId(containerId, k - 1, change.targetRow, i) + ", " +
                        (change.type === "reduce" ? "#" + cellId(containerId, k - 1, change.targetRow, change.pivotColumn) + ", " : "") +
                        (change.type === "reduce" ? "#" + cellId(containerId, k - 1, change.pivotRow, i) + ", " : "") +
                        "#" + cellId(containerId, k, change.targetRow, i) + "\"></a>";
      var tooltips = "<a class=\"a-tooltip\" data-for=\"" + cellId(containerId, k, change.targetRow, i) + "\" data-tooltip=\"" + divId + "\"></a>";
      text += "<div id=\"" + divId + "\">" +
              printOptions.mathStartTag +
              Expression.p("a_" + (change.targetRow + 1).toString() + (i + 1).toString() + "=" + (change.type === "reduce" ? "(b-(c/a)*d)" : "(b*(1/a))") + "=r", {
                a: change.oldMatrix.e(change.pivotRow, change.pivotColumn),
                b: change.oldMatrix.e(change.targetRow, i),
                c: change.oldMatrix.e(change.targetRow, change.pivotColumn),
                d: change.oldMatrix.e(change.pivotRow, i),
                r: change.newMatrix.e(change.targetRow, i)
              }, printOptions) +
              printOptions.mathEndTag +
              "</div>" +
              highlight +
              tooltips;
    } else if (change.type === "swap" || change.type === "swap-negate") {
      text  += "<a class=\"a-highlight\" data-for=\"" + cellId(containerId, k, change.targetRow, i) + "\" data-highlight=\"" +
               "#" + cellId(containerId, k - 1, change.pivotRow, i) + ", " +
               "#" + cellId(containerId, k - 1, change.targetRow, i) + ", " +
               "#" + cellId(containerId, k, change.targetRow, i) + "\"></a>";
      text += "<a class=\"a-highlight\" data-for=\"" + cellId(containerId, k, change.pivotRow, i) + "\" data-highlight=\"" +
              "#" + cellId(containerId, k - 1, change.targetRow, i) + ", " +
              "#" + cellId(containerId, k - 1, change.pivotRow, i) + ", " +
              "#" + cellId(containerId, k, change.pivotRow, i) + "\"></a>";
    }
  }

  return "<span class=\"nowrap\">" +
         printOptions.mathStartTag +
         new Expression.Matrix(change.oldMatrix).toMathML(Object.assign({}, printOptions, {
           columnlines: printOptions.columnlines,
           cellIdGenerator: function (i, j) {
             return cellId(containerId, k - 1, i, j);
           },
           pivotCell: {
             i: change.pivotRow,
             j: change.pivotColumn
           }
         })) +
         printOptions.mathEndTag +
         "  <div class=\"arrow-with-label\" data-custom-paint=\"arrow-with-label\" data-type=\"" + change.type + "\" data-start=\"" + change.pivotRow + "\" data-end=\"" + change.targetRow + "\">" +
         "    <div class=\"arrow\">" +
         (change.type === "swap" || change.type === "swap-negate" || change.pivotRow < change.targetRow ? "      <div class=\"arrow-head-bottom\"></div>" : "") +
         (change.type === "swap" || change.type === "swap-negate" || change.pivotRow > change.targetRow ? "      <div class=\"arrow-head-top\"></div>" : "") +
         (change.type !== "divide" ? "      <div class=\"arrow-line\"></div>" : "") +
         "    </div>" +
         "    <div class=\"label\">" +
//     html += "<mfenced open=\"(\" close=\")\">" + polynomToExpression(z.a, variableSymbols).toMathML(printOptions) + "</mfenced>";         
         (change.type === "swap" ? "" : (change.type === "swap-negate" ? "" : printOptions.mathStartTag + (change.type === "divide" ? "<mo>&times;</mo>" + "<mfenced open=\"(\" close=\")\">" + RPN.ONE.divide(change.oldMatrix.e(change.targetRow, change.pivotColumn)).toMathML(printOptions) + "</mfenced>" : "<mo>&times;</mo>" + "<mfenced open=\"(\" close=\")\">" + multiplier.negate().toMathML(printOptions) + "</mfenced>") + printOptions.mathEndTag)) +
         "    </div>" +
         "  </div>" +
         "</span>" +
         "<span class=\"relative\">" +
         printOptions.mathStartTag +
         "<mpadded width=\"+0.8em\" lspace=\"+0.4em\">" +
         "<munder><mrow><mo stretchy=\"false\">~</mo></mrow><mrow>" +
         ((change.type === "swap-negate" ? "${i}<mo>&harr;</mo><mrow><mo>&minus;</mo>${j}</mrow>" : "") +
          (change.type === "swap" ? "${i}<mo>&harr;</mo>${j}" : "") +
          (change.type === "divide" ? "${j}<mo>/</mo><mfenced open=\"(\" close=\")\"><mrow>${a}</mrow></mfenced><mo>&rarr;</mo>${j}".replace(/\$\{a\}/g, change.oldMatrix.e(change.pivotRow, change.pivotColumn).toMathML(printOptions)) : "") +
          (change.type === "reduce" ? "${j}<mo>&minus;</mo>${a}<mo>&times;</mo>${i}<mo>&rarr;</mo>${j}".replace(/\$\{a\}/g, (areBracketsRequired ? "<mfenced open=\"(\" close=\")\">" : "") + (printOptions.isLUDecomposition != undefined ? "<mrow mathbackground=\"#80FF80\">" : "") + "<mrow>" + multiplier.toMathML(printOptions) + "</mrow>" + (printOptions.isLUDecomposition != undefined ? "</mrow>" : "") + (areBracketsRequired ? "</mfenced>" : "")) : ""))
            .replace(/\$\{j\}/g, getMatrixRowDenotation(change.targetRow + 1))
            .replace(/\$\{i\}/g, getMatrixRowDenotation(change.pivotRow + 1)) +
         "</mrow></munder>" +
         "</mpadded>" +
         printOptions.mathEndTag +
         (tooltip !== "" ? "<a class=\"question-icon\" tabindex=\"0\" id=\"" + questionId + "\">?</a><a class=\"a-tooltip\" data-for=\"" + questionId + "\" data-tooltip=\"" + tooltipId + "\"></a><div hidden id=\"" + tooltipId + "\">" + tooltip + "</div>" : "") + "<span hidden>" + text + "</span>" + "</span>";
};

//TODO: remove `rowReduceChangeToHTML` argument - ?
//TODO: rename is4DeterminantInverse
Expression.rowReductionGaussJordanMontante = function (matrix, method, isItADeterminantCalculation, rowReduceChangeToHTML, printOptions, is4DeterminantInverse) {
  var containerId = printOptions.idPrefix + "-" + RPN.id();
  var check = function (p, targetRow) {
    if (is4DeterminantInverse !== -1) {
      var from = targetRow !== -1 ? targetRow : 0;
      var to = targetRow !== -1 ? targetRow + 1 : p.rows();
      for (var i = from; i < to; i += 1) {
        if (is4DeterminantInverse !== 0 || !p.e(i, p.cols() - 1).equals(RPN.ZERO)) {
          var j = 0;
          while (j < p.cols() && p.e(i, j).equals(RPN.ZERO)) {
            j += 1;
          }
          if (is4DeterminantInverse === 0 && j === p.cols() - 1 || is4DeterminantInverse !== 0 && j >= is4DeterminantInverse) {
          //if (j === p.cols() + (is4DeterminantInverse ? 0 : -1)) {
            return i;
          }
        }
      }
    }
    return -1;
  };
  var html = "";
  var rowEchelonMatrix = matrix;
  var k = 0;
  var stoppedAtRow = -1;
  var previousTargetRow = -1;
  matrix.toRowEchelon(method, isItADeterminantCalculation, function (change) {
    if (stoppedAtRow === -1) {
      stoppedAtRow = check(change.oldMatrix, previousTargetRow);
    }
    if (stoppedAtRow === -1) {
      previousTargetRow = change.targetRow;
      html += rowReduceChangeToHTML(change, printOptions, containerId, k);
      k += 1;
      rowEchelonMatrix = change.newMatrix;
    }
  });
  if (stoppedAtRow === -1) {
    stoppedAtRow = check(rowEchelonMatrix, previousTargetRow);
  }
  html += printOptions.mathStartTag;
  // TODO: highlight zero row if the process was "stopped"
  html += new Expression.Matrix(rowEchelonMatrix).toMathML(Object.assign({}, printOptions, {
    cellIdGenerator: function (i, j) {
      return containerId + "-" + k.toString() + "-" + i.toString() + "-" + j.toString();
    },
    highlightRow: stoppedAtRow
  }));
  html += printOptions.mathEndTag;
  return {html: html, rowEchelonMatrix: rowEchelonMatrix, stopped: stoppedAtRow !== -1};
};

Expression.solveByGauss = function (printOptions, fullMatrix, variableNames, options) {
  // (?) TODO: allow users to specify "free" variables
  var containerId = printOptions.idPrefix + "-" + RPN.id();

  var moreText = options.moreText;
  var eigenvectors = options.eigenvectors;

  var OSLU = 1;
  var i = 0;
  var j = 0;
  var mstr = "";

  var m =fullMatrix.slice(0, fullMatrix.rows(), 0, fullMatrix.cols() - 1);
  if (eigenvectors == undefined && variableNames == undefined) {
    m = Matrix.trimRight(m);
  }
  var b = fullMatrix.slice(0, fullMatrix.rows(), fullMatrix.cols() - 1, fullMatrix.cols());

  //!hack
  if (variableNames == undefined) {
    variableNames = makeDefaultVariableNames(fullMatrix.cols() - 1);
  }

  b = Matrix.Zero(m.rows(), 1).map(function (element, row, col) {
    return row < b.rows() && col < b.cols() ? b.e(row, col) : 0;
  });

  i = -1;
  while (++i < b.rows() && OSLU === 1) {
    if (!b.e(i, 0).equals(RPN.ZERO)) {
      OSLU = 0;
    }
  }

  var augmented = m.augment(b);
  mstr = "";
  if (moreText) {
    mstr += "<h4>" + options.method.i18n + "</h4>";
    //mstr += "<div>" + i18n.text511 + "</div>";
    mstr += "<div>" + i18n.text512 + "</div>";
  }

  var ms = Expression.rowReductionGaussJordanMontante(augmented, options.method.id, false, options.method.rowReduceChangeToHTML, Object.assign({}, printOptions, {columnlines: -1}), 0);
  var k = -1;
  mstr += ms.html;

  m = ms.rowEchelonMatrix;

  var systemId = containerId + "-" + "system_1";
  mstr += "<div><a id=\"" + systemId + "\"></a><table><tr><td>" + printOptions.mathStartTag + outSystem(printOptions, m, variableNames) + printOptions.mathEndTag + "</td><td><a href=\"#" + systemId + "\">(1)</a></td></tr></table></div>";

  // 1. Throwing of null strings - they will be below, but checking: if we find a zero, which at the end has a non-zero, then there are no solutions!;
  var noSolutions = ms.stopped;
  /*
  var noSolutions = false;

  i = -1;
  while (++i < m.rows()) {
    j = 0;
    while (j < m.cols() && m.e(i, j).equals(RPN.ZERO)) {
      j += 1;
    }
    if (j === m.cols() - 1) {
      noSolutions = true;
    }
  }
  */

  // vector of coefficients of free variables (0-index - constant, 1-index - c_1, 2-index - c_2, ... )
  var createVector = function (size) {
    var vector = [];
    var n = -1;
    while (++n < size) {
      vector[n] = RPN.ZERO;
    }
    return vector;
  };

  if (noSolutions) {
    mstr += "<div>" + i18n.text52 + "</div>";
  } else {
    var freeVariablesCount = 0;
    // ((1/4,1,4,-2,...), ()) // 1/4+c1+c2-2c3
    // vector, 0-index - constant, 1-index - coefficient for c1, 2-index - coefficient for c2
    var solutions = []; // as vectors
    var solutionSymbols = [];
    var solutionsExpressions = [];

    solutionSymbols.push(undefined);
    j = -1;
    while (++j < m.cols()) {
      solutions[j] = undefined;//createVector(m.cols());
    }

    i = m.rows();
    var equation = undefined;
    var equationSymbols = undefined;
    while (--i >= 0) {
      j = 0;
      while (j < m.cols() - 1 && m.e(i, j).equals(RPN.ZERO)) {
        j += 1;
      }
      // first not zero in a row - main variable
      k = j;
      if (i === 0) {
        k = -1;
      }
      solutions[j] = createVector(m.cols());
      while (++k < m.cols() - 1) {
        //if (!m.e(i, k).equals(RPN.ZERO)) {
          if (solutions[k] == undefined) {
            freeVariablesCount += 1;
            // define free as c1, c2, c3...
            solutions[k] = createVector(m.cols());
            solutions[k][freeVariablesCount] = RPN.ONE;
            if (false) {
              solutionSymbols.push(new Expression.Symbol("c_" + freeVariablesCount));
              // TODO: out
            } else {
              solutionSymbols.push(new Expression.Symbol(variableNames[k]));
            }
            solutionsExpressions[k] = polynomToExpression(solutions[k], solutionSymbols);
          }
        //}
      }

      if (j < m.cols() - 1) {
        mstr += "<div>";
        mstr += i18n.fromEquationIFindVariable
                  .replace(/\$\{i\}/g, printOptions.mathStartTag + "<mn>" + (i + 1).toString() + "</mn>" + printOptions.mathEndTag)
                  .replace(/\$\{x\}/g, printOptions.mathStartTag + new Expression.Symbol(variableNames[j]).toMathML(printOptions) + printOptions.mathEndTag)
                  .replace(/#system_1/g, "#" + systemId);
        mstr += "</div>";
        mstr += "<div>";
        equation = [];
        equationSymbols = [];
        equation.push(m.e(i, j));
        equationSymbols.push(new Expression.Symbol(variableNames[j]));
        equation.push(m.e(i, m.cols() - 1));
        equationSymbols.push(undefined);
        k = m.cols() - 1;
        while (--k > j) {
          if (!m.e(i, k).equals(RPN.ZERO)) {
            equation.push(m.e(i, k).negate());
            equationSymbols.push(new Expression.Symbol(variableNames[k]));
          }
        }
        var beforeSubstitution = createLinearEquationExpression(equation, equationSymbols, 1, printOptions);
        mstr += printOptions.mathStartTag;
        mstr += beforeSubstitution;
        mstr += printOptions.mathEndTag;
        equation = [];
        equationSymbols = [];
        equation.push(m.e(i, j));
        equationSymbols.push(new Expression.Symbol(variableNames[j]));
        equation.push(m.e(i, m.cols() - 1));
        equationSymbols.push(undefined);
        k = m.cols() - 1;
        while (--k > j) {
          if (!m.e(i, k).equals(RPN.ZERO)) {
            equation.push(m.e(i, k).negate());
            equationSymbols.push(polynomToExpression(solutions[k], solutionSymbols));
          }
        }
        var afterSubstitution = createLinearEquationExpression(equation, equationSymbols, 1, printOptions);
        //TODO: fix performance
        if (afterSubstitution !== beforeSubstitution) {
          mstr += Expression.listSeparator;
          mstr += printOptions.mathStartTag;
          mstr += afterSubstitution;
          mstr += printOptions.mathEndTag;
        }
        solutions[j][0] = m.e(i, m.cols() - 1).divide(m.e(i, j));
        k = m.cols() - 1;
        while (--k > j) {
          if (!m.e(i, k).equals(RPN.ZERO)) {
            // solutions[j] -= m.e(i, k).negate().multiply(solutions[k])
            var n = -1;
            while (++n < m.cols()) {
              if (!solutions[k][n].equals(RPN.ZERO)) {
                solutions[j][n] = solutions[j][n].subtract(m.e(i, k).multiply(solutions[k][n]).divide(m.e(i, j)));
              }
            }
          }
        }

        solutionsExpressions[j] = polynomToExpression(solutions[j], solutionSymbols);

        equation = [];
        equationSymbols = [];
        equation.push(RPN.ONE);
        equationSymbols.push(new Expression.Symbol(variableNames[j]));
        k = solutions[j].length;
        while (--k >= 0) {
          equation.push(solutions[j][k]);
          equationSymbols.push(solutionSymbols[k]);
        }

        var afterSimplification = createLinearEquationExpression(equation, equationSymbols, 1, printOptions);
        if (afterSimplification !== afterSubstitution) {
          mstr += Expression.listSeparator;
          mstr += printOptions.mathStartTag;
          mstr += afterSimplification;
          mstr += printOptions.mathEndTag;
        }
        mstr += "</div>";
      }
    }

    if (moreText) {
      mstr += "<div>" + i18n.textAnswer + "</div>";
      i = -1;
      while (++i < m.cols() - 1) {
        mstr += "<div>";
        mstr += printOptions.mathStartTag;
        mstr += new Expression.Symbol(variableNames[i]).toMathML(printOptions) + "<mo>=</mo>" + solutionsExpressions[i].toMathML(printOptions);
        mstr += printOptions.mathEndTag;
        mstr += (i < m.cols() - 2 ? Expression.listSeparator : "");
        mstr += "</div>";
      }
    }
    if (options.solution != undefined) {
      return new Matrix([solutionsExpressions]).transpose();
    }
    mstr += "<div>" + (moreText ? i18n.text53 : "") + " " + printOptions.mathStartTag + "<mi>X</mi><mo>=</mo>" + new Expression.Matrix(new Matrix([solutionsExpressions]).transpose()).toMathML(printOptions) + printOptions.mathEndTag + "</div>";

    if ((moreText || eigenvectors != undefined) && OSLU === 1 && freeVariablesCount > 0) {
      if (moreText) {
        mstr += "<div>" + i18n.textBasisSolutions + "</div>";
      }
      i = -1;
      var fundamentalSystemHTML = "";
      while (++i < freeVariablesCount) {
        var bx = [];
        j = -1;
        while (++j < m.cols() - 1) {
          bx[j] = solutions[j][i + 1];
        }
        var bxVector = new Matrix([bx]).transpose();
        if (moreText) {
          var bxHTML = new Expression.Matrix(bxVector).toMathML(printOptions);
          mstr += printOptions.mathStartTag;
          mstr += "<msub><mrow><mi>&lambda;</mi></mrow><mrow><mn>" + i + "</mn></mrow></msub>" + bxHTML;
          mstr += printOptions.mathEndTag;
          mstr += (i !== freeVariablesCount - 1 ? Expression.listSeparator : "");
          fundamentalSystemHTML += printOptions.mathStartTag + bxHTML + printOptions.mathEndTag;
          fundamentalSystemHTML += (i !== freeVariablesCount - 1 ? Expression.listSeparator : "");
        }
        if (eigenvectors != undefined) {
          eigenvectors.push(bxVector);
        }
      }
      if (moreText) {
        mstr += "<div>" + i18n.textFundamentalSystem + " " + fundamentalSystemHTML + "</div>";
      }
    }

    if (eigenvectors != undefined) {
      //!
      i = -1;
      while (++i < m.cols() - 1) {
        if (!solutionsExpressions[i].equals(RPN.ZERO)) {
          return mstr;
        }
      }
      // all zeros - lambda was incorrect, and the root is irrational
    }

  }

  return mstr;
};

Expression.Details.add({
  type: "solve-using-Cramer's-rule",
  i18n: function () {
    return i18n.solveByCrammer;
  },
  minRows: 1,
  priority: 1,
  callback: function (printOptions, matrix, variableNames) {
    return solveUsingCramersRule(printOptions, matrix, variableNames);
  }
});
Expression.Details.add({
  type: "solve-using-inverse-matrix-method",
  i18n: function () {
    return i18n.solveByInverse;
  },
  minRows: 1,
  priority: 1,
  callback: function (printOptions, matrix, variableNames) {
    return solveUsingInverseMatrixMethod(printOptions, matrix, variableNames);
  }
});

// -------------------------------------------- vectors -------------------------------------------

Expression.getEigenvalues = function (printOptions, matrix) {

  if (!matrix.isSquare()) {
    throw new RangeError("NonSquareMatrixException");
  }
  // TODO: remove Polynom
  // TODO: use another method here (performance), details for determinant calculation

  var determinant = matrix.map(function (e, i, j) {
    return i === j ? new Polynom([e, RPN.ONE.negate()]) : new Polynom([e]);
  }).determinant();

  //!new (sin/cos)
  //TODO: fix
  determinant = determinant.map(function (e) { return e.simplifyExpression(); });

  var characteristicPolynomial = determinant;

  var roots = characteristicPolynomial.getroots();
  // removing of duplicates
  var i = -1;
  var uniqueRoots = [];
  while (++i < roots.length) {
    var isDuplicate = false;
    var j = -1;
    var root = roots[i];
    while (++j < uniqueRoots.length) {
      if (uniqueRoots[j].equals(root)) {
        isDuplicate = true;
      }
    }
    if (!isDuplicate) {
      uniqueRoots.push(root);
    }
  }

  var html = "";
  //TODO: improve i18n (links to Wikipedia)
  var variableName = "\u03BB";
  var variableSymbol = new Expression.Symbol(variableName);
  var variableSymbols = [];
  i = -1;
  while (++i < matrix.cols() + 1) {
    variableSymbols.push(i === 0 ? undefined : (i === 1 ? variableSymbol : new Expression.Exponentiation(variableSymbol, RPN(i.toString()))));
  }
  var lambda = new Expression.Symbol("\u03BB");
  var matrixWithLambdas = matrix.map(function (element, i, j) {
    return new NonSimplifiedExpression(i === j ? new Expression.Addition(element, new Expression.Negation(lambda)) : element);
  });
  html += "<div>";
  html += "1) ";//TODO: remove
  html += i18n.text11;
  html += "</div>";
  html += "<div>";
  html += printOptions.mathStartTag;
  html += new Expression.Determinant(new Expression.Matrix(matrixWithLambdas)).toMathML(printOptions) + "<mo>=</mo>" + polynomToExpression(characteristicPolynomial.a, variableSymbols).toMathML(printOptions);
  if (roots.length !== 0) {
    html += "<mo>=</mo>";
    var k = -1;
    var z = characteristicPolynomial;
    while (++k < roots.length) {
      z = z.divide(new Polynom([roots[k].negate(), RPN.ONE]));
    }
    k = -1;
    //TODO: remove brackets
    html += "<mfenced open=\"(\" close=\")\">" + polynomToExpression(z.a, variableSymbols).toMathML(printOptions) + "</mfenced>";
    while (++k < roots.length) {
      html += "<mfenced open=\"(\" close=\")\">" + polynomToExpression((new Polynom([roots[k].negate(), RPN.ONE])).a, variableSymbols).toMathML(printOptions) + "</mfenced>";
    }
  }
  html += printOptions.mathEndTag;
  html += "</div>";
  var n = -1;
  while (++n < roots.length) {
    html += "<div>";
    html += printOptions.mathStartTag;
    html += "<msub><mrow><mi>&lambda;</mi></mrow><mrow><mn>" + (n + 1) + "</mn></mrow></msub><mo>=</mo>" + roots[n].toMathML(printOptions);
    html += printOptions.mathEndTag;
    html += "</div>";
  }
  return {eigenvalues: {unique: uniqueRoots, all: roots}, html: html};
};

Expression.getEigenvectors = function (printOptions, matrix, eigenvalues) {
  var html = "";
  var eigenvectors = [];
  var eigenvaluesForEachVector = [];
  var i = -1;
  while (++i < eigenvalues.length) {
    html += "<div>";
    var mm = matrix.subtract(Matrix.I(matrix.cols()).scale(eigenvalues[i])); // matrix - E * eigenvalue
    var array = [];
    var fullMatrix = mm.augment(Matrix.Zero(mm.cols(), 1));
    var solutionHTML = Expression.solveByGauss(printOptions, fullMatrix, undefined, {
      moreText: false,
      method: {//TODO Montante ?
        i18n: i18n.solutionByGaussJordanElimination,
        id: Matrix.GaussJordan,
        rowReduceChangeToHTML: Expression.rowReduceChangeToHTML
      },
      eigenvectors: array
    });
    var j = -1;
    while (++j < array.length) {
      var eigenvector = array[j];
      eigenvectors.push(eigenvector);
      eigenvaluesForEachVector.push(eigenvalues[i]);
    }
    // TODO: fix output for diagonalization - instead of `X = {{0}, {c_1}, {0}}` should be `... let c_1 = 1, then X = {{0}, {1}, {0}}`
    html += printOptions.mathStartTag;
    html += "<msub><mrow><mi>&lambda;</mi></mrow><mrow><mn>" + (i + 1) + "</mn></mrow></msub>";
    html += "<mo>=</mo>" + eigenvalues[i].toMathML(printOptions);
    html += printOptions.mathEndTag;
    html += "<div>";
    html += printOptions.mathStartTag;
    html += "<mi>A</mi><mo>&minus;</mo><mi>&lambda;</mi><mo>&times;</mo><mi>E</mi><mo>=</mo>" + new Expression.Matrix(mm).toMathML(printOptions);
    html += printOptions.mathEndTag;
    html += "</div>";
    html += "<div>";
    html += "<span>";
    html += printOptions.mathStartTag;
    html += "<mi>A</mi><mo>&minus;</mo><mi>&lambda;</mi><mo>&times;</mo><mi>E</mi><mo>=</mo><mi>O</mi>";
    html += printOptions.mathEndTag;
    html += "</span>, ";
    html += i18n.text12;
    html += "</div>";
    html += "<div>" + solutionHTML + "</div>";
    html += "</div>";
  }

  return {
    html: html,
    eigenvectors: eigenvectors,
    eigenvaluesForEachVector: eigenvaluesForEachVector
  };
};

Expression.findEVectors = function (printOptions, matrix) {
  if (!matrix.isSquare()) {
    throw new RangeError("NonSquareMatrixException");
  }

  var tmp = Expression.getEigenvalues(printOptions, matrix);
  var eigenvalues = tmp.eigenvalues.unique;
  var html = tmp.html;
  if (eigenvalues.length > 0) {
    html += "<div>";
    html += "2) "; //TODO: remove
    html += i18n.text13;
    html += "</div>";
  } else {
    html += i18n.text14;
  }
  tmp = Expression.getEigenvectors(printOptions, matrix, eigenvalues);
  html += tmp.html;
  return html;
};
// --------------------------------------------- end ----------------------------------------------




// A = T^-1 L T ,T-matrix of own vectors, L - matrix of own values

Expression.diagonalize = function (printOptions, matrix) {
  if (!matrix.isSquare()) {
    throw new RangeError("NonSquareMatrixException");
  }

  // TODO: move to details
  //TODO: details of determinant calculation, details of roots finding
  var tmp = Expression.getEigenvalues(printOptions, matrix);
  var eigenvalues = tmp.eigenvalues.unique;
  var rootsCountWithDuplicates = tmp.eigenvalues.all.length;
  var html = tmp.html;

  // http://en.wikipedia.org/wiki/Eigenvalues_and_eigenvectors#Algebraic_multiplicities
  if (rootsCountWithDuplicates < matrix.cols()) {
    //TODO: show polynomial in html anyway
    //TODO: fix message
    return {T: undefined, L: undefined, T_INVERSED: undefined, html: html, message: i18n.notEnoughRationalEigenvalues}; //!
  }
  tmp = Expression.getEigenvectors(printOptions, matrix, eigenvalues);
  html += tmp.html;
  var eigenvectors = tmp.eigenvectors;
  var eigenvaluesForEachVector = tmp.eigenvaluesForEachVector;

  if (eigenvectors.length < matrix.cols()) {
    //TODO: show polynomial in html anyway
    // The matrix is not diagonalizable, because it does not have {n} linearly independent eigenvectors.
    var message = i18n.notDiagonalizable.replace(/\$\{n\}/g, matrix.cols());
    return {T: undefined, L: undefined, T_INVERSED: undefined, html: html, message: message}; //!
  }

  // TODO: text
  var L = Matrix.I(eigenvaluesForEachVector.length).map(function (element, i, j) {
    return (i === j ? eigenvaluesForEachVector[i] : RPN.ZERO);
  });
  var T = Matrix.I(matrix.cols()).map(function (e, i, j) {
    return eigenvectors[j].e(i, 0);
  });

  return {T: T, L: L, T_INVERSED: T.inverse(), html: html, message: ""};
};

// --------------------------------------------- end ----------------------------------------------

// 1286

var polyfromtable = function (m) {
  var coefficients = [];
  for (var i = m.cols() - 1; i >= 0; i -= 1) {
    coefficients.push(m.e(0, i));
  }
  return new Polynom(coefficients);
};

Expression.getPolynomialRoots = function (printOptions, matrix) {
  var p = polyfromtable(matrix);
  var roots = p.getroots();
  var html = "";
  html += "<div>";
  html += printOptions.mathStartTag;
  html += "<mrow>";
  html +=  p.toMathML(printOptions);
  html += "</mrow>";
  if (roots.length !== 0) {
    html += "<mo>=</mo>";
    var np = p;
    for (var i = 0; i < roots.length; i += 1) {
      np = np.divide(new Polynom([roots[i].negate(), RPN.ONE]));
    }
    //TODO: remove brackets
    html += "<mfenced open=\"(\" close=\")\">" + np.toMathML(printOptions) + "</mfenced>";
    for (var j = 0; j < roots.length; j += 1) {
      html += "<mfenced open=\"(\" close=\")\">" + (new Polynom([roots[j].negate(), RPN.ONE])).toExpression().toMathML(printOptions) + "</mfenced>";
    }
  }
  html += printOptions.mathEndTag;
  html += "</div>";
  html += "<div>";
  html += "Roots:";
  if (roots.length === 0) {
    html += " ? ";
  }
  html += "<ul>";
  for (var k = 0; k < roots.length; k += 1) {
    html += "<li>" + printOptions.mathStartTag + roots[k].toMathML(printOptions) + printOptions.mathEndTag + "</li>";
  }
  html += "</ul>";
  html += "</div>";
  return html;
};

Expression.multiplyPolynomials = function (printOptions, matrixA, matrixB) {
  var pA = polyfromtable(matrixA);
  var pB = polyfromtable(matrixB);
  var result = pA.multiply(pB);
  return printOptions.mathStartTag + "<mrow>" + "<mfenced open=\"(\" close=\")\">" + pA.toMathML(printOptions) + "</mfenced>" + "<mo>&times;</mo>" + "<mfenced open=\"(\" close=\")\">" + pB.toMathML(printOptions) + "</mfenced>" + "<mo>=</mo>" + result.toMathML(printOptions) + "</mrow>" + printOptions.mathEndTag;
};

Expression.Details.add({
  type: "polynomial-roots",
  callback: function (printOptions, matrix) {
    return Expression.getPolynomialRoots(printOptions, matrix);
  }
});

Expression.Details.add({
  type: "polynomial-multiply",
  callback: function (printOptions, matrix, second) {
    return Expression.multiplyPolynomials(printOptions, matrix, second.matrix);
  }
});

RPN.getMatrix = function (s) {
  // TODO: insertion with drag and drop should not freeze all because of calculations
  var matrix = undefined;

  if (matrix == undefined) {
    var match = /[\t\n\r]/.exec(s);
    if (match != undefined) {
      try {
        matrix = Matrix.toMatrix(Matrix.split(s));
      } catch (error) {
        if (global.console != undefined) {
          global.console.log(error);
        }
      }
    }
  }
  
  //!!!!
  if (matrix == undefined) {
    var result = undefined;
    try {
      result = RPN(s, new RPN.Context()); // to avoid simplification ({{cos(x),sin(x)},{-sin(x),cos(x)}}*{{cos(x),-sin(x)},{sin(x),cos(x)}})
      //result = RPN(s);
    } catch (error) {
      // TODO: handle errors (?)
      // ???
      if (global.console != undefined) {
        global.console.log(error);
      }
    }
    matrix = result instanceof Matrix ? result : (result instanceof Expression.Matrix ? result.matrix : (result instanceof NonSimplifiedExpression && result.e instanceof Expression.Matrix ? result.e.matrix : undefined));
  }
  //!!!

  return matrix == undefined ? undefined : matrix.toString();
};

RPN.p = 0;//!
RPN.checkElements = function (textareaValue, type) {
  var tmp = RPN.getElementsArray({type: type, mode: "", inputValues: undefined, textareaValue: textareaValue, rows: 0, cols: 0, textareaStyleWidth: "", textareaStyleHeight: ""});
  var elements = tmp.elements;
  var isValid = true;
  RPN.p = 0;
  for (var i = 0; i < elements.length; i += 1) {
    for (var j = 0; j < elements[i].length; j += 1) {
      var value = elements[i][j];
      //TODO: fix
      isValid = RPN(value || "0");
      if (isValid == undefined) {
        throw new RangeError();
      }
      RPN.p += value.length;
    }
  }
  return isValid;
};
RPN.checkElement = function (input) {
  return RPN(input) != undefined;
};
RPN.runExpression = function (input, kInputValue, kInputId, matrixTableAState, matrixTableBState, printOptions) {
  //!TODO: Details?
  var details = [];
  var listener = function (e) {
    details.push({type: e.type, matrix: e.data.matrix.toString(), second: e.second == undefined ? undefined : e.second.matrix.toString()});
  };
  Expression.callback = listener;
  var x = undefined;
  //HACK
  var variableNames = undefined;
  
  var resultError = undefined;
  var expressionString = undefined;
  var resultHTML = undefined;
  var resultMatrix = undefined;

  try {

    //TODO: fix
    var test = input.indexOf("X") !== -1 ? input.replace(/\s+/g, "") : "";
    if (test === "AX=B") {
      test = "A*X=B";
    }
    if (test === "AX=0") {
      test = "A*X=0";
    }
    if ((test === "A*X=B" && matrixTableAState != undefined && matrixTableBState != undefined) || (test === "A*X=0" && matrixTableAState != undefined)) {
      var a0 = getMatrixWithVariableNames(matrixTableAState).matrix;
      var b0 = test !== "A*X=B" ? Matrix.Zero(a0.rows(), 1) : getMatrixWithVariableNames(matrixTableBState).matrix;
      //hit({click: test  + "-" + a0.rows().toString() + "x" + a0.cols().toString() + "-" + b0.rows().toString() + "x" + b0.cols().toString()});
      if (b0.rows() === a0.rows() && b0.cols() === 1) {
        input = "solve-using-Montante-method(" + a0.augment(b0).toString() + ")";
      } else if (test === "A*X=B") {
        var isInvertible = false;
        try {
          isInvertible = a0.rows() === a0.cols() && !a0.determinant().equals(Expression.Integer.ZERO);
        } catch (error) {
          //?
          //TODO:
          if (global.console != undefined) {
            global.console.log(error);
          }
        }
        if (isInvertible) {
          input = "A^-1*B";
        }
      }
    }

    if (input.replace(/^\s+|\s+$/g, "") === "") {
      throw new RangeError("ValueMissingError:" + "expression");
    }
    x = RPN(input, new RPN.Context(function (id) {
      if ((id === "k" || id === "K") && kInputValue != undefined) {
        var value = kInputValue;
        if (value.replace(/^\s+|\s+$/g, "") === "") {
          throw new RangeError("ValueMissingError:" + kInputId);
        }
        return RPN(value);
      }
      if (id === "X") {
        return new Expression.MatrixSymbol(id);
      }
      var m = id === "A" ? matrixTableAState : (id === "B" ? matrixTableBState : undefined);
      if (m == undefined) {
        return undefined;
      }
      var tmp = getMatrixWithVariableNames(m);
      var names = tmp.variableNames;
      var matrix = tmp.matrix;
      variableNames = names;//!
      return new Expression.Matrix(matrix);
    }));
    
    //TODO: remove

    var tmp = getResultAndHTML(x, variableNames, x.simplify(), printOptions);
    var result = tmp.result;
    resultHTML = tmp.html;
    var matrix = result instanceof Matrix ? result : (result instanceof Expression.Matrix ? result.matrix : (result instanceof NonSimplifiedExpression && result.e instanceof Expression.Matrix ? result.e.matrix : undefined));
    resultMatrix = matrix != undefined ? matrix.toString() : "";
    expressionString = x.toString();
  } catch (error) {
    resultError = {message: error.message, name: error.name, stack: error.stack};
  }
  Expression.callback = undefined;
  var detailsHTML = createDetailsSummary(printOptions.idPrefix, details, details.length === 1 ? 100 : 1);
  return {resultError: resultError, details: details, expressionString: expressionString, resultHTML: resultHTML, resultMatrix: resultMatrix, detailsHTML: detailsHTML};
};

RPN.getDetails = function (array, printOptions) {
  var html = "";
  for (var i = 0; i < array.length; i += 1) {
    var data = array[i];
    html += "<hr />";
    var callback = Expression.Details.getCallback(data.type);
    if (callback != undefined) {
      var matrix = RPN(data.matrix).matrix;//?
      var second = data.second != undefined ? RPN(data.second).matrix : undefined;
      html += callback(printOptions, matrix, second);
    } else {
      throw new Error(data.type);
    }
  }
  return html;
};

  // TODO: fix?

  global.getMatrixWithVariableNames = getMatrixWithVariableNames;
  RPN.createDetailsSummary = createDetailsSummary;


}(this));

/*global i18n, Expression, Matrix, RPN */

(function () {
"use strict";

Expression.Details.add({
  type: "solve-using-Gaussian-elimination",
  i18n: function () {
    return i18n.solveByGauss;
  },
  minRows: 1,
  priority: 1,
  callback: function (printOptions, matrix, variableNames) {
    return Expression.solveByGauss(printOptions, matrix, variableNames, {
      moreText: true,
      method: {
        i18n: i18n.solutionByGaussianElimination,
        id: Matrix.Gauss,
        rowReduceChangeToHTML: Expression.rowReduceChangeToHTML
      },
      eigenvectors: undefined
    });
  }
});

Expression.Details.add({
  type: "solve-using-Gauss-Jordan-elimination",
  i18n: function () {
    return i18n.solveByJordanGauss;
  },
  minRows: 1,
  priority: 1,
  callback: function (printOptions, matrix, variableNames) {
    return Expression.solveByGauss(printOptions, matrix, variableNames, {
      moreText: true,
      method: {
        i18n: i18n.solutionByGaussJordanElimination,
        id: Matrix.GaussJordan,
        rowReduceChangeToHTML: Expression.rowReduceChangeToHTML
      },
      eigenvectors: undefined
    });
  }
});

Expression.Details.add({
  type: "solve-using-Montante-method",
  i18n: function () {
    return i18n.methodOfMontante;
  },
  minRows: 1,
  priority: 2,
  callback: function (printOptions, matrix, variableNames) {
    return Expression.solveByGauss(printOptions, matrix, variableNames, {
      moreText: true,
      method: {
        i18n: i18n.solutionByMethodOfMontante,
        id: Matrix.GaussMontante,
        rowReduceChangeToHTML: Expression.rowReduceChangeToHTMLMontante
      },
      eigenvectors: undefined
    });
  }
});

  Expression.rowReduceChangeToHTMLMontante = function (args, printOptions, containerId, k) {

    var t = function (r, c, k) {
      return "<mrow>" +
               Expression.p("(a_(${r},${c})*a_(i,j)-a_(i,${c})*a_(${r},j))/p_${k}"
                              .replace(/\$\{r\}/g, (r + 1).toString())
                              .replace(/\$\{c\}/g, (c + 1).toString())
                              .replace(/\$\{k\}/g, (k + 1).toString()), undefined, printOptions) +
               "<mo>&rarr;</mo>" +
               Expression.p("a_(i,j)", undefined, printOptions) +
             "</mrow>";
    };
    var cellId = function (containerId, matrixId, i, j) {
      return containerId + "-" + matrixId.toString() + "-" + i.toString() + "-" + j.toString();
    };
    
    var html = "";

    if (true) {
      if (args.type === "swap" || args.type === "swap-negate") {
        html += Expression.rowReduceChangeToHTML(args, printOptions, containerId, k);
      } else if (args.type === "pivot") {
        var a0 = new Expression.Matrix(args.oldMatrix).toMathML(Object.assign({}, printOptions, {
          columnlines: printOptions.columnlines,
          cellIdGenerator: function (i, j) {
            return cellId(containerId, k, i, j);
          },
          pivotCell: {
            i: args.pivotRow,
            j: args.pivotColumn
          }
        }));
        var pivotElementText = "<mtable>" +
                               "<mtr><mtd><mtext>" + i18n.eliminationDetails.pivotElement + "</mtext></mtd></mtr>" +
                               "<mtr>" +
                               "<mtd>" +
                               Expression.p("p_" + ((k + 1).toString()) + "=a_" + (args.pivotRow + 1).toString() + (args.pivotColumn + 1).toString() + "=q", {q: args.oldMatrix.e(args.pivotRow, args.pivotColumn)}, printOptions) +
                               "</mtd>" +
                               "</mtr>" +
                               "<mtr>" +
                               "<mtd>" +
                               t(args.pivotRow, args.pivotColumn, k - 1) +
                               "</mtd>" +
                               "</mtr>" +
                               "</mtable>";
        html += printOptions.mathStartTag;
        html += a0 + "<mpadded width=\"+0.8em\" lspace=\"+0.4em\"><munder><mrow><mo stretchy=\"false\">~</mo></mrow><mrow>" + pivotElementText + "</mrow></munder></mpadded>";
        html += printOptions.mathEndTag;
        k += 1;

        var text = "";
        for (var targetRow = 0; targetRow < args.oldMatrix.rows(); targetRow += 1) {
          if (targetRow !== args.pivotRow) {
            text += "<div>";
            for (var i = 0; i < args.oldMatrix.cols(); i += 1) {
              var divId = cellId(containerId, k, targetRow, i) + "-" + "tooltip";
              var highlight = "<a class=\"a-highlight\" data-for=\"" + cellId(containerId, k, targetRow, i) + "\" data-highlight=\"" +
                                "#" + cellId(containerId, k - 1, args.pivotRow, args.pivotColumn) + ", " +
                                "#" + cellId(containerId, k - 1, targetRow, i) + ", " +
                                "#" + cellId(containerId, k - 1, targetRow, args.pivotColumn) + ", " +
                                "#" + cellId(containerId, k - 1, args.pivotRow, i) + ", " +
                                "#" + cellId(containerId, k, targetRow, i) + "\"></a>";
              var tooltips = "<a class=\"a-tooltip\" data-for=\"" + cellId(containerId, k, targetRow, i) + "\" data-tooltip=\"" + divId + "\"></a>";
              text += "<div id=\"" + divId + "\">" +
                      printOptions.mathStartTag +
                      Expression.p("a_" + (targetRow + 1).toString() + (i + 1).toString() + "=(a*b-c*d)/p=r", {
                        a: args.oldMatrix.e(args.pivotRow, args.pivotColumn),
                        b: args.oldMatrix.e(targetRow, i),
                        c: args.oldMatrix.e(targetRow, args.pivotColumn),
                        d: args.oldMatrix.e(args.pivotRow, i),
                        p: args.previousPivot,
                        r: args.newMatrix.e(targetRow, i)
                      }, printOptions) +
                      printOptions.mathEndTag +
                      "</div>" +
                      highlight +
                      tooltips;
            }
            text += "</div>";
          }
        }
        html += "<span hidden>" + text + "</span>";
      } else {
        throw new Error(args.type);
      }
    }
    return html;
  };

Expression.Details.add({
  type: "determinant-Montante",
  i18n: function () {
    return i18n.methodOfMontante;
  },
  priority: 2,
  callback: function (printOptions, matrix) {
    if (!matrix.isSquare()) {
      throw new RangeError("NonSquareMatrixException");
    }

    var html = "";

    html += "<div>";
    html += printOptions.mathStartTag;
    html += new Expression.Determinant(new Expression.Matrix(matrix)).toMathML(printOptions) + "<mo>=</mo><mn>?</mn>";
    html += printOptions.mathEndTag;
    html += "</div>";

    //?
    html += "<h4>";
    html += i18n.methodOfMontanteDetails.determinantDetails.header;
    html += "</h4>";
    html += "<p>";
    html += i18n.methodOfMontanteDetails.determinantDetails.start.replace(/\$\{someDetails3\}/g, Expression.getSomeDetails(3, printOptions)).replace(/`([^`]*)`/g, function (p, input) {
      return printOptions.mathStartTag + Expression.p(input, undefined, printOptions) + printOptions.mathEndTag;
    });
    html += "</p>";

    html += "<div>";
    var tmp = Expression.rowReductionGaussJordanMontante(matrix, Matrix.GaussMontante, true, Expression.rowReduceChangeToHTMLMontante, printOptions, matrix.cols());
    html += tmp.html;
    var rowEchelonMatrix = tmp.rowEchelonMatrix;
    html += "</div>";

    html += "<div>";
    html += printOptions.mathStartTag;
    html += new Expression.Determinant(new Expression.Matrix(matrix)).toMathML(printOptions);
    html += "<mo>=</mo>";
    var result = (tmp.stopped ? RPN.ZERO : rowEchelonMatrix.e(rowEchelonMatrix.rows() - 1, rowEchelonMatrix.cols() - 1));
    html += result.toMathML(printOptions);
    html += printOptions.mathEndTag;
    html += "</div>";

    return html;
  }
});

Expression.Details.add({
  type: "rank-Montante",
  i18n: function () {
    return i18n.methodOfMontante;
  },
  priority: 2,
  callback: function (printOptions, matrix) {
    var html = "";
    html += "<div>";
    html += printOptions.mathStartTag;
    html += new Expression.Rank(new Expression.Matrix(matrix)).toMathML(printOptions) + "<mo>=</mo><mn>?</mn>";
    html += printOptions.mathEndTag;
    html += "</div>";
    //TODO:
    //html += "<p>" + i18n.methodOfMontanteDetails.rankDetails.start + "</p>";
    html += "<div>";
    var tmp = Expression.rowReductionGaussJordanMontante(matrix, Matrix.GaussMontante, false, Expression.rowReduceChangeToHTMLMontante, printOptions, -1);//?
    html += tmp.html;
    var rowEchelon = tmp.rowEchelonMatrix;
    html += "</div>";
    html += "<div>";
    html += printOptions.mathStartTag;
    html += new Expression.Rank(new Expression.Matrix(matrix)).toMathML(printOptions);
    html += "<mo>=</mo>";
    html += new Expression.Rank(new Expression.Matrix(rowEchelon)).toMathML(printOptions);
    html += "<mo>=</mo>";
    html += "<mn>" + rowEchelon.rank().toString() + "</mn>";
    html += printOptions.mathEndTag;
    html += "</div>";
    return html;
  }
});

Expression.Details.add({
  type: "inverse-Montante",
  i18n: function () {
    return i18n.methodOfMontante;
  },
  priority: 2,
  callback: function (printOptions, matrix) {
    var html = "";
    html += "<div>";
    html += printOptions.mathStartTag;
    html += new Expression.Exponentiation(new Expression.Matrix(matrix), Expression.Integer.ONE.negate()).toMathML(printOptions) + "<mo>=</mo><mn>?</mn>";
    html += printOptions.mathEndTag;
    html += "</div>";
    //TODO:
    //html += "<p>" + i18n.methodOfMontanteDetails.inverseDetails.start + "</p>";
    html += "<div>";
    var result = undefined;
    var c = undefined;
    var result2 = undefined;
    try {
      var augmented = matrix.augment(Matrix.I(matrix.rows()));
      var tmp = Expression.rowReductionGaussJordanMontante(augmented, Matrix.GaussMontante, false, Expression.rowReduceChangeToHTMLMontante, Object.assign({}, printOptions, {columnlines: -matrix.cols()}), matrix.cols());
      html += tmp.html;

      var m = tmp.rowEchelonMatrix;
      c = m.e(0, 0);//!
      result2 = Matrix.Zero(m.rows(), m.rows()).map(function (element, i, j) { // splitting to get the second half
        var e = m.e(i, i);
        if (e.equals(RPN.ZERO)) {
          throw new RangeError("SingularMatrixException");
        }
        var x = m.e(i, j + m.rows());
        //return e.equals(RPN.ONE) ? x : x.divide(e);
        return x;
      });
      result = result2.map(function (element, i, j) {
        return element.divide(c);
      });
    } catch (error) {
      if (error instanceof RangeError && error.message.indexOf("SingularMatrixException") === 0) {
        result = undefined;
      } else {
        throw error;
      }
    }
    html += "</div>";
    if (result != undefined) {
      html += "<div>";
      html += printOptions.mathStartTag;
      html += new Expression.Exponentiation(new Expression.Matrix(matrix), Expression.Integer.ONE.negate()).toMathML(printOptions);
      html += "<mo>=</mo>";
      html += new Expression.Multiplication(new Expression.Division(RPN.ONE, c), new Expression.Matrix(result2)).toMathML(printOptions);
      html += "<mo>=</mo>";
      html += new Expression.Matrix(result).toMathML(printOptions);
      html += printOptions.mathEndTag;
      html += "</div>";
    } else {
      //TODO: ?
    }
    return html;
  }
});

Expression.LUDecomposition = function (matrix) {
  //TODO: remove(?) - matrix.toRowEchelon(...)
  var N = matrix.rows();
  var a = matrix;
  var Lower = Matrix.I(N);
  var P = Matrix.I(N);
  var swapFlag = false;
  var pivotRow = 0;
  for (var n = 0; n < N; n += 1) {
    var c = pivotRow;
    if (n < matrix.cols()) {
      if (a.e(pivotRow, n).equals(RPN.ZERO)) {
        for (var k = pivotRow + 1; k < N && c === pivotRow; k += 1) {
          if (!a.e(k, n).equals(RPN.ZERO)) {
            c = k;
          }
        }
        if (c !== pivotRow) {
          var S = Matrix.I(N);
          S = S.map(function (element, i, j) {
            return i === pivotRow ? S.e(c, j) : (i === c ? S.e(pivotRow, j) : element);
          });
          a = S.multiply(a);
          Lower = S.multiply(Lower.subtract(Matrix.I(N))).add(Matrix.I(N));
          P = P.multiply(S);
          swapFlag = true;
        }
      }
      if (!a.e(pivotRow, n).equals(RPN.ZERO)) {
        var L = Matrix.I(N).map(function (element, i, j) {
          return j === pivotRow && i >= pivotRow + 1 ? a.e(i, n).divide(a.e(pivotRow, n)).negate() : element;
        });
        a = L.multiply(a);
        Lower = Lower.multiply(L);
        pivotRow += 1;
      }
    }
  }
  Lower = Lower.map(function (element, i, j) {
    return i === j ? element : element.negate();
  });
  return {
    swapFlag: swapFlag,
    P: new Expression.Matrix(P),
    A: new Expression.Matrix(matrix),
    L: new Expression.Matrix(Lower),
    U: new Expression.Matrix(a)
  };
};

Expression.Details.add({
  type: "LU-decomposition",
  i18n: function () {
    return i18n.index.LUDecomposition;
  },
  priority: 1,
  callback: function (printOptions, matrix) {
    var palu = Expression.LUDecomposition(matrix);
    var html = "";
    html += "<div>";
    var tmp = Expression.rowReductionGaussJordanMontante(matrix, Matrix.Gauss, false, Expression.rowReduceChangeToHTML, Object.assign({}, printOptions, {isLUDecomposition: true}), -1);
    html += tmp.html;
    html += "</div>";
    html += "<div>";
    //TODO: output P
    html += printOptions.mathStartTag;
    html += Expression.p("L=M", {M: palu.L}, Object.assign({}, printOptions, {isLUDecomposition2: true}));
    html += printOptions.mathEndTag;
    html += Expression.listSeparator;
    html += printOptions.mathStartTag;
    html += Expression.p("U=M", {U: new Expression.Symbol("U"), M: palu.U}, printOptions);// U - is not an IdentityMatrix
    html += printOptions.mathEndTag;
    html += "</div>";
    return html;
  }
});

}());

/*jslint plusplus: true, vars: true, indent: 2, white: true */
/*global i18n, Node, Image, window, document, Dialog, JSON, Ya, Utils, reportValidity, XMLSerializer, initializeAInput, RPN */

// i18n in mscript.js, montante.js - use a copy ? (importScript(i18n-<lang>.js)

(function (global) {
"use strict";

function RPNProxy() {
}

RPNProxy.input = "";
RPNProxy.startPosition = 0;
RPNProxy.endPosition = 0;
RPNProxy.p = 0;
RPNProxy.getMatrix = function (string, callback) {
  var result = RPN.getMatrix(string);
  callback(result);
};
RPNProxy.getElementsArray = function (matrixTableState, callback) {
  var result = RPN.getElementsArray(matrixTableState);
  callback(result);
};
RPNProxy.checkElements = function (textareaValue, type, callback, errorCallback) {
  try {
    var result = RPN.checkElements(textareaValue, type);
    callback();
  } catch (error) {
    RPNProxy.input = RPN.input;
    RPNProxy.startPosition = RPN.startPosition;
    RPNProxy.endPosition = RPN.endPosition;
    RPNProxy.p = RPN.p;
    errorCallback({message: error.message, name: error.name, stack: error.stack});
  }
};
RPNProxy.checkElement = function (input, callback, errorCallback) {
  try {
    var result = RPN.checkElement(input);
    callback();
  } catch (error) {
    RPNProxy.input = RPN.input;
    RPNProxy.startPosition = RPN.startPosition;
    RPNProxy.endPosition = RPN.endPosition;
    RPNProxy.p = RPN.p;
    errorCallback({message: error.message, name: error.name, stack: error.stack});
  }
};
RPNProxy.runExpression = function (input, kInputValue, kInputId, matrixTableAState, matrixTableBState, printOptions, callback) {
  var result = RPN.runExpression(input, kInputValue, kInputId, matrixTableAState, matrixTableBState, printOptions);
  RPNProxy.input = RPN.input;
  RPNProxy.startPosition = RPN.startPosition;
  RPNProxy.endPosition = RPN.endPosition;
  RPNProxy.p = RPN.p;
  callback(result);
};
RPNProxy.getDetails = function (array, printOptions, callback, errorCallback) {
  var result = undefined;
  try {
    result = RPN.getDetails(array, printOptions);
    callback(result);
  } catch (error) {
    RPNProxy.input = RPN.input;
    RPNProxy.startPosition = RPN.startPosition;
    RPNProxy.endPosition = RPN.endPosition;
    RPNProxy.p = RPN.p;
    errorCallback({message: error.message, name: error.name, stack: error.stack});
  }
};

RPNProxy.createDetailsSummary = function (idPrefix, details, bestMethodsLimit, callback) {
  var result = RPN.createDetailsSummary(idPrefix, details, bestMethodsLimit);
  callback(result);
};

// TODO: implement Dialog.prompt, replace button+input with button+Dialog.prompt

if (window.location.protocol !== "file:") {
  window.setTimeout(function () {
  // LiveInternet counter
    (new Image()).src = "https://counter.yadro.ru/hit?r" + encodeURIComponent(document.referrer) + (window.screen == undefined ? "" : ";s" + Number(window.screen.width).toString() + "*" + Number(window.screen.height).toString() + "*" + "24") + ";u" + encodeURIComponent(document.URL) + ";h" + ";" + (Math.random() + 1).toString().slice(2);
  }, 256);
}

var clickOnEnter = function (event) {
  var DOM_VK_RETURN = 13;
  if (event.keyCode === DOM_VK_RETURN && !event.ctrlKey && !event.altKey && !event.shiftKey && !event.metaKey && !event.defaultPrevented) {
    if (event.target.tagName.toUpperCase() === "INPUT") {
      event.preventDefault(); // in case of moving focus to some other element (textarea)
      this.querySelector("button").click();
    }
  }
};

Utils.actHistoryId = 0;

Utils.initialize(".button-after-input", function (element) {
  element.addEventListener("keydown", clickOnEnter, false);
});
Utils.initialize(".button-before-input", function (element) {
  element.addEventListener("keydown", clickOnEnter, false);
});

  // ...

//TODO: remove "window."
var hitQueue = [];
var hit = function (click) {
  if (window.yaCounter29787732 == undefined) {
    hitQueue.push(click);
  } else {
    window.yaCounter29787732.hit(window.location.hash, document.title, document.referrer, click);
  }
};
global.hit = hit;//! see Polynom#getroots


var handleError = function (initialInput, classList, e) {
  var postError = function (error, input, classList) {
    var object = {
      error: error.name + ": " + error.message,
      input: input,
      initialInput: initialInput,
      classList: classList
    };
    var tables = document.querySelectorAll(".matrix-table");
    var i = -1;
    while (++i < tables.length) {
      var id = tables[i].getAttribute("data-id");
      var table = MatrixTables[id];
      if (table != undefined) {
        var x = table.getRawInput(table.mode);
        var y = x;
        if (typeof x !== "string") {
          y = "";
          y += "{";
          for (var j = 0; j < x.length; j += 1) {
            y += j !== 0 ? "," : "";
            y += "{" + x[j].join(",") + "}";
          }
          y += "}";
        }
        object[id] = y;
      }
    }
    var inputs = document.querySelectorAll("input");
    for (var k = 0; k < inputs.length; k += 1) {
      var name = inputs[k].name;
      if (name != undefined && name.slice(0, 2) === "k-") {
        object[name] = inputs[k].value;
      }
    }
    var s = JSON.stringify(object);
    window.onerror(s, error.fileName || "", error.lineNumber || 0, error.columnNumber || 0, error);
  };
      //TODO: check
      var message = e.message;
      if (message.indexOf("ArithmeticException") === 0) {
        //  + " " + i18n.or + " " + i18n.exponentIsNegative
        Dialog.alert(i18n.divisionByZeroError);
      } else if (message.indexOf("IntegerInputError") === 0) {
        var integerInput = message.slice("IntegerInputError:".length);
        Dialog.alert(getInputErrorHTML(integerInput, -1, -1));//?
      } else if (message.indexOf("UserError") === 0 || message.indexOf("UserError:") === 0 || message.indexOf("NotSupportedError") === 0) {//TODO: fix NotSupportedError
        Dialog.alert(getInputErrorHTML(RPNProxy.input, RPNProxy.startPosition, RPNProxy.endPosition));//?
        postError(e, RPNProxy.input, classList);
      } else if (message.indexOf("SingularMatrixException") === 0) {
        Dialog.alert(i18n.determinantIsEqualToZeroTheMatrixIsSingularNotInvertible);
      } else if (message.indexOf("MatrixDimensionMismatchException") === 0) {
        Dialog.alert(i18n.matricesShouldHaveSameDimensions);
      } else if (message.indexOf("NonSquareMatrixException:") === 0) {
        Dialog.alert(message.slice("NonSquareMatrixException:".length));
      } else if (message.indexOf("NonSquareMatrixException") === 0) {
        Dialog.alert(i18n.matrixIsNotSquare);
      } else if (message.indexOf("DimensionMismatchException") === 0) {
        Dialog.alert(i18n.theNumberOfColumnsInFirstMatrixShouldEqualTheNumberOfRowsInSecond);
      } else if (message.indexOf("ValueMissingError") === 0) {
        hit({error: message});//?
        var inputElementId = message.slice("ValueMissingError:".length);
        var inputElement = document.getElementById(inputElementId);
        reportValidity(inputElement, i18n.pleaseFillOutThisField);
      } else {
        Dialog.alert(getInputErrorHTML(RPNProxy.input, RPNProxy.startPosition, RPNProxy.endPosition));//?

        postError(e, RPNProxy.input, classList);
        html2html(document.documentElement, function (s) {
          var dataURL = "data:text/html;charset=utf-8," + encodeURIComponent(s);
          window.onerror("snapshot", dataURL, 0, 0, undefined);
        });
        //throw new Error(message);
        if (window.console != undefined) {
          window.console.log(e);
        }
      }
};

//!
var decimalFractionDigits = -1;

/* .matrix-menu-dialog */

var formatXml = function (xml) {
  var formatted = "";
  xml = xml.replace(/></g, ">\r\n<");
  var pad = 0;
  var nodes = xml.split("\r\n");
  var index = -1;
  while (++index < nodes.length) {
    var node = nodes[index];
    var indent = 0;
    var match = (/.+<\/\w[^>]*>$/).exec(node);
    if (match != undefined) {
      indent = 0;
    } else {
      match = (/^<\/\w/).exec(node);
      if (match != undefined) {
        if (pad !== 0) {
          pad -= 1;
        }
      } else {
        match = (/^<\w[^>]*[^\/]>.*$/).exec(node);
        if (match != undefined) {
          indent = 1;
        } else {
          indent = 0;
        }
      }
    }

    var padding = "";
    var i = -1;
    while (++i < pad) {
      padding += "  ";
    }

    formatted += padding + node + "\r\n";
    pad += indent;
  }

  return formatted;
};

// TODO: remove?
// an array of array of strings -> string
var toMultilineString = function (array) {
  var table = [];
  var columnWidths = [];
  var i = -1;
  while (++i < array.length) {
    var row0 = [];
    table[i] = row0;
    var elements = array[i];
    var j = -1;
    while (++j < elements.length) {
      row0[j] = elements[j].toString().replace(/^\s+|\s+$/g, "");
      var w = j < columnWidths.length ? columnWidths[j] : 0;
      columnWidths[j] = w < row0[j].length ? row0[j].length : w;
    }
  }
  var result = [];
  var k = -1;
  while (++k < table.length) {
    var row = table[k];
    var h = -1;
    while (++h < columnWidths.length) {
      var e = h < row.length ? row[h] : "";
      var padding = columnWidths[h] - e.length;
      var spaces = "";
      while (padding > 0) {
        spaces += " ";
        padding -= 1;
      }
      row[h] = spaces + e;
    }
    result.push(row.join("\t"));
  }
  return result.join("\n");
};

//?
var getMatrix4 = function (input) {
  // return RPN(s).matrix.getElements();
  var rows = [[]];
  var cellStart = 0;
  var b = 0;
  for (var i = 0; i < input.length; i += 1) {
    var c = input.charCodeAt(i);
    if (c === "{".charCodeAt(0)) {
      b += 1;
      if (b === 2) {
        cellStart = i + 1;
      }
    } else if (c === "}".charCodeAt(0)) {
      if (b === 2) {
        rows[rows.length - 1].push(input.slice(cellStart, i));
      }
      b -= 1;
    } else if (c === ",".charCodeAt(0)) {
      if (b === 2) {
        rows[rows.length - 1].push(input.slice(cellStart, i));
        cellStart = i + 1;
      } else if (b === 1) {
        rows.push([]);
      }
    }
  }
  return rows;
};

// TODO: remove "matrix containers" ({useMatrixContainer: false})
var getMatrixPresentationsFromMatrix = function (mathmlCode, asciimathCode, mathStartTag, mathEndTag) {
  mathStartTag =  mathStartTag != undefined ? mathStartTag : "<math xmlns=\"http://www.w3.org/1998/Math/MathML\" display=\"block\">";
  mathEndTag = mathEndTag != undefined ? mathEndTag : "</math>";
  var result = {};
  result["application/mathml-presentation+xml"] = formatXml(mathStartTag + mathmlCode + mathEndTag);
  result["text/plain"] = "\n" + toMultilineString(getMatrix4(asciimathCode)) + "\n";
  result["text/ascii-math"] = asciimathCode;
  return result;
};

var onShowMathMLOrText = function (event) {
  hit({click: "show-text-" + this.getAttribute("data-type")});
  var matrixMenu = this.parentNode;
  var matrixContainer = document.getElementById(matrixMenu.getAttribute("data-for-matrix"));
  var presentations = getMatrixPresentationsFromMatrix(matrixContainer.innerHTML, matrixContainer.getAttribute("data-matrix"));
  var value = presentations[this.getAttribute("data-type")];
  var anchorPoint = {
    left: Number.parseFloat(matrixMenu.getAttribute("data-left")),
    top: Number.parseFloat(matrixMenu.getAttribute("data-top"))
  };
  var dialog = Dialog.standard(undefined, [[anchorPoint.left, anchorPoint.top], [0.5, 0.5]], "<input type=\"text\" value=\"" + Utils.escapeHTML(value) + "\" />", "<button autofocus=\"autofocus\" type=\"submit\">" + i18n.close + "</button>");
  dialog.querySelector("input").select();
  dialog.querySelector("input").focus();
};

Utils.on("click", ".show-mathml-menuitem", onShowMathMLOrText);
Utils.on("click", ".show-text-menuitem", onShowMathMLOrText);

var drawElement = function (element) {
  var boundingRect = element.getBoundingClientRect();
  var width = Math.trunc(boundingRect.right - boundingRect.left + 0.5 + 0.5);
  var height = Math.trunc(boundingRect.bottom - boundingRect.top + 0.5 + 0.5);// 0.5 for Opera 12
  var html = (new XMLSerializer()).serializeToString(element);
  var css = "";
  var styleSheets = document.styleSheets;
  for (var j = 0; j < styleSheets.length; j += 1) {
    var rules = styleSheets[j].cssRules;
    if (rules != undefined) {
      for (var i = 0; i < rules.length; i += 1) {
        var rule = rules[i];
        if (rule.type === window.CSSRule.STYLE_RULE) {
          var cssText = rule.cssText;
          if (cssText.indexOf(".math ") !== -1) {
            css += cssText + "\n";
          }
        }
      }
    }
  }
  css += "div {font-size: 17px;background:white;}\n";
  css += "mtd {vertical-align: middle;}";// Opera 12.18
  var data = "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"" + width.toString() + "\" height=\"" + height.toString() + "\">" +
             "<foreignObject width=\"100%\" height=\"100%\">" +
             "<div xmlns=\"http://www.w3.org/1999/xhtml\">" +
             "<style>" + css + "</style>" +
             "<div>" + html + "</div>" +
             "</div>" +
             "</foreignObject>" +
             "</svg>";
  var src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(data);
  return {
    src: src,
    width: width,
    height: height
  };
};

Utils.on("click", ".show-image-menuitem", function (event) {
  hit({click: "show-image-menuitem"});
  var matrixMenu = this.parentNode;
  var matrixContainer = document.getElementById(matrixMenu.getAttribute("data-for-matrix"));
  var presentations = getMatrixPresentationsFromMatrix(matrixContainer.innerHTML, matrixContainer.getAttribute("data-matrix"), global.mathStartTag, global.mathEndTag);
  var element = document.createElement("div");
  element.innerHTML = presentations["application/mathml-presentation+xml"];
  element.style.visibilty = "hidden";
  element.style.position = "absolute";
  element.style.left = "0px";
  element.style.top = "0px";
  document.body.appendChild(element);
  var image = drawElement(element);
  document.body.removeChild(element);

  var anchorPoint = {
    left: Number.parseFloat(matrixMenu.getAttribute("data-left")),
    top: Number.parseFloat(matrixMenu.getAttribute("data-top"))
  };
  var dialog = Dialog.standard(undefined, [[anchorPoint.left, anchorPoint.top], [0.5, 0.5]], "<img width=\"" + image.width + "\" height=\"" + image.height + "\" tabindex=\"0\" />", "<button autofocus=\"autofocus\" type=\"submit\">" + i18n.close + "</button>");
  // Opera 12.18
  dialog.style.transform = "none";
  var img = dialog.querySelector("img");
  img.removeAttribute("width");
  img.removeAttribute("height");
  img.src = image.src;
});

var isCommandEnabled = function (command) {
  // `document.queryCommandEnabled(command)` throws an error in IE 8 - 11 - ?, so it is needed to use `document.queryCommandSupported(command)` at first
  try {
    // ... undefined in Opera mini 19
    return document.queryCommandSupported != undefined && document.queryCommandEnabled != undefined && document.queryCommandSupported(command) && document.queryCommandEnabled(command);
  } catch (error) {
    // FF < 41 for "copy"
    // Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:39.0) Gecko/20100101 Firefox/39.0 for "insertText"
    if (window.console != undefined) {
      window.console.log(error);
    }
  }
  return false;
};

var insertText = function (input, text, selectionStart, selectionEnd) {
  var value = input.value;
  if (isCommandEnabled("insertText")) {
    document.execCommand("insertText", false, text);// "undo" support
  } else {
    if (isCommandEnabled("ms-beginUndoUnit")) {
      document.execCommand("ms-beginUndoUnit", false, true);
    }
    input.value = value.slice(0, selectionStart) + text + value.slice(selectionEnd);
    if (isCommandEnabled("ms-endUndoUnit")) {
      document.execCommand("ms-endUndoUnit", false, true);
    }
  }
};

var makeMenuItem = function (extraAttributes, label) {
  return "<menuitem label=\"" + label + "\" " + extraAttributes + "></menuitem>";
};

var getMatrixMenu = function (dataForMatrix, clientX, clientY, rect) {
  var matrixMenu = document.getElementById("matrix-menu");
  if (matrixMenu == undefined) {
    matrixMenu = document.createElement("menu");
    matrixMenu.id = "matrix-menu";
    matrixMenu.setAttribute("type", "context");
    var insertInMenuItems = "";
    var tables = document.querySelectorAll(".matrix-table");
    for (var j = 0; j < tables.length; j += 1) {
      var id = tables[j].getAttribute("data-id");
      insertInMenuItems += makeMenuItem("class=\"print-matrix-menuitem\" data-print-matrix-to=\"" + id + "\"", i18n.textInsertin + " " + id);
    }
    matrixMenu.innerHTML = insertInMenuItems +
                           (isCommandEnabled("copy") ? makeMenuItem("class=\"copy-matrix-to-clipboard-menuitem\"", i18n.copyToClipboard) : "") +
                           makeMenuItem("class=\"show-mathml-menuitem\" data-type=\"application/mathml-presentation+xml\"", i18n.showMathML) +
                           makeMenuItem("class=\"show-text-menuitem\" data-type=\"text/ascii-math\"", i18n.showText) +
                           ("\v" !== "v" ? makeMenuItem("class=\"show-image-menuitem\"", i18n.showImage) : "");
    document.body.appendChild(matrixMenu);
    Utils.check(matrixMenu);

    var items = matrixMenu.querySelectorAll("menuitem");
    var matrixMenuDialog = Dialog.create();
    matrixMenuDialog.classList.toggle("matrix-menu-dialog", true);
    var focusedElements = 0;
    var closeDialog = function () {
      if (matrixMenuDialog.getAttribute("open") != undefined) {
        matrixMenuDialog.close();
      }
    };
    var onItemFocus = function (event) {
      focusedElements += 1;
    };
    var onItemBlur = function (event) {
      focusedElements -= 1;
      window.setTimeout(function () {
        if (focusedElements === 0) {
          closeDialog();
        }
      }, 10);
    };
    var onItemClick = function (event) {
      event.preventDefault();//selection
      var i = event.target.getAttribute("data-i");
      if (i != undefined) {
        items[i].click();
      }
      closeDialog();
    };
    matrixMenuDialog.addEventListener("keypress", function (event) {
      if (!event.ctrlKey && !event.altKey && !event.metaKey && !event.defaultPrevented) {
        var target = document.activeElement;
        if (target.parentNode === this) {
          var s = String.fromCharCode(event.charCode).toLocaleUpperCase();
          var node = target;
          for (var x = node.nextElementSibling || this.firstElementChild; x !== target; x = x.nextElementSibling || this.firstElementChild) {
            var label = x.textContent;
            if (s === label.slice(0, 1).toLocaleUpperCase() && node === target) {
              node = x;
            }
          }
          if (node !== target) {
            event.preventDefault();
            node.focus();
          }
        }
      }
    }, false);
    matrixMenuDialog.addEventListener("keydown", function (event) {
      if (!event.ctrlKey && !event.altKey && !event.shiftKey && !event.metaKey && !event.defaultPrevented) {
        var keyCode = event.keyCode;
        var target = document.activeElement;
        if (target.parentNode === this) {
          var DOM_VK_LEFT = 37;
          var DOM_VK_UP = 38;
          var DOM_VK_RIGHT = 39;
          var DOM_VK_DOWN = 40;
          var DOM_VK_ESCAPE = 27;
          var DOM_VK_RETURN = 13;

          if (keyCode === DOM_VK_LEFT || keyCode === DOM_VK_UP) {
            var previous = target.previousElementSibling;
            if (previous == undefined) {
              previous = this.lastElementChild;
            }
            if (previous != undefined) {
              event.preventDefault();
              previous.focus();
            }
          }
          if (keyCode === DOM_VK_RIGHT || keyCode === DOM_VK_DOWN) {
            var next = target.nextElementSibling;
            if (next == undefined) {
              next = this.firstElementChild;
            }
            if (next != undefined) {
              event.preventDefault();
              next.focus();
            }
          }
          if (keyCode === DOM_VK_ESCAPE) {
            event.preventDefault();
            closeDialog();
          }
          if (keyCode === DOM_VK_RETURN) {
            event.preventDefault();
            target.click();
          }
        }
      }
    }, false);
    matrixMenuDialog.setAttribute("role", "menu");
    var html = "";
    for (var i = 0; i < items.length; i += 1) {
      html += "<a role=\"menuitem\" class=\"menuitem\" tabindex=\"0\" data-i=\"" + i.toString() + "\">" + items[i].getAttribute("label") + "</a>";
    }
    matrixMenuDialog.innerHTML = html;
    var elements = matrixMenuDialog.querySelectorAll(".menuitem");
    for (var k = 0; k < elements.length; k += 1) {
      elements[k].addEventListener("focus", onItemFocus, false);
      elements[k].addEventListener("blur", onItemBlur, false);
      elements[k].addEventListener("click", onItemClick, false);
    }
    document.body.appendChild(matrixMenuDialog);
  }

  matrixMenu.setAttribute("data-for-matrix", dataForMatrix);//!
  matrixMenu.setAttribute("data-left", (clientX !== 0 ? clientX : (rect.left + rect.right) * 0.5).toString());
  matrixMenu.setAttribute("data-top", (clientY !== 0 ? clientY : (rect.top + rect.bottom) * 0.5).toString());

  return matrixMenu;
};

Utils.on("click", ".copy-matrix-to-clipboard-menuitem", function (event) {
  hit({click: "copy-matrix-to-clipboard-menuitem"});
  var matrixMenu = this.parentNode;
  var matrixContainer = document.getElementById(matrixMenu.getAttribute("data-for-matrix"));
  //var focusNode = matrixContainer;//TODO: fix - cannot focus MathML element
  var focusNode = matrixContainer.parentNode.parentNode.querySelector(".matrix-menu-show");
  focusNode.focus();
  window.getSelection().collapse(focusNode, 0);
  try {
    document.execCommand("copy");
  } catch (error) {
    Dialog.alert(Utils.escapeHTML(error.toString()));
  }
});

// button
Utils.on("click", ".matrix-menu-show", function (event) {
  hit({click: "matrix-menu-show"});
  var matrixContainer = document.getElementById(this.getAttribute("data-for-matrix"));
  var matrixMenu = getMatrixMenu(this.getAttribute("data-for-matrix"), event.clientX, event.clientY, this.getBoundingClientRect());
  matrixMenu.nextElementSibling.show(this.getBoundingClientRect(), undefined);
  matrixMenu.nextElementSibling.firstElementChild.focus();//?
});

// << Tables >>

var MatrixTables = {};

// << MatrixTable >>


//-----------------!
  var setInputCustomValidity = function (input, checkedValue, isValid) {
    if (input.value === checkedValue) {
      var dataTitle = input.getAttribute("data-title");
      if (dataTitle == undefined) {
        var title = input.getAttribute("title");
        if (title != undefined) {
          input.setAttribute("data-title", input.getAttribute("title"));
        }
      }
      if (isValid) {
        if (dataTitle != undefined) {
          input.setAttribute("title", dataTitle);
        } else {
          input.removeAttribute("title");
        }
      } else {
        input.setAttribute("title", i18n.inputError.replace(/\$\{listOfExamples\}/g, i18n.listOfExamples).replace(/\$\{listOfComplexExamples\}/g, i18n.listOfComplexExamples).replace(/<code>/g, "").replace(/<\/code>/g, ""));
      }
      var e = input.parentNode.classList.contains("a-input") ? input.parentNode : input;
      e.classList.toggle("invalid", !isValid);
    }
  };

var checkInput = function (input, inputName, type) {
  var getInputValue4Page = function (value, type) {
    var v = value.replace(/^\s+|\s+$/g, "");
    // Users are often trying to input "-"/"+" instead of "-1"/"+1" for SLU
    if ((v === "-" || v === "+") && (type === "system" || type === "polynomial")) {
      return v + "1";
    }
    if (v === "") {
      return "0";
    }
    return value;
  };
  requestIdleCallback(inputName, function () {
    var checkedValue = input.value;
    var value = getInputValue4Page(checkedValue, type); // getInputValue
    RPNProxy.checkElement(value, function () {
      setInputCustomValidity(input, checkedValue, true);
    }, function (error) {
      updateDataErrorAttribute(input, error);
      //TODO: other errors
      setInputCustomValidity(input, checkedValue, false);
    });
  }, 9);
};

// type: "simple" | "system" | "polynomial"
var checkTextarea = function (textarea, textareaName, type) {
  requestIdleCallback(textarea.name, function () {
    var textareaValue = textarea.value;
    RPNProxy.checkElements(textareaValue, type, function () {
      setInputCustomValidity(textarea, textareaValue, true);
    }, function (error) {
      //!hack
      if (type !== "system" || textarea.value.indexOf("=") === -1) {
        updateDataErrorAttribute(textarea, error, RPNProxy.p);//?
      }
      //TODO:
      if (window.console != undefined) {
        window.console.log(error);
      }
      setInputCustomValidity(textarea, textareaValue, false);
    });
  }, 200);
};

Utils.initialize(".a-input", function (element) {
  window.setTimeout(function () { // window.getComputedStyle(...)
    initializeAInput(element);
  }, 0);
});

Utils.initialize(".expression-input", function (element) {
  element.addEventListener("input", function (event) {
    event.target.style.width = Math.max(21, (event.target.value.length * 0.7)).toString() + "em";
  }, false);
});

Utils.initialize(".fraction-input", function (element) {
  element.addEventListener("input", function (event) {
    checkInput(this, this.name, "");
  }, false);
  checkInput(element, element.name, ""); // autofill
});

var keyStorage = {
  a: function (methodName, index, key, value, callback) {
    var start = Date.now();
    var result = undefined;
    var ok = false;
    try {
      var storage = window.localStorage;
      if (storage != undefined) {
        if (methodName === "length") {
          result = storage.length;
        } else if (methodName === "key") {
          result = storage.key(index);
        } else if (methodName === "getItem") {
          result = storage.getItem(key);
        } else if (methodName === "setItem") {
          storage.setItem(key, value);
        } else if (methodName === "removeItem") {
          storage.removeItem(key);
        } else if (methodName === "clear") {
          storage.clear();
        }
        ok = true;
      }
    } catch (error) {
      if (window.console != undefined) {
        window.console.log(error);
      }
    }
    var end = Date.now();
    if (methodName === "getItem" || methodName === "setItem") {
      var valueLength = Math.trunc(Math.log(Math.max(methodName === "getItem" ? (result != undefined ? result.length : 0) : (methodName === "setItem" ? (value != undefined ? value.length : 0) : 0), 1000) + 0.5) / Math.log(10));
      var duration = Math.trunc(Math.log(Math.max(end - start, 10) + 0.5) / Math.log(10));
      hit({click: "localStorage." + methodName + "-" + (ok ? "successful" : "unsuccessful") + "-10**" + valueLength.toString() + "-10**" + duration.toString()});
    }
    if (callback != undefined) {
      callback(result);
    }
  },
  length: function (callback) {
    keyStorage.a("length", undefined, undefined, undefined, callback);
  },
  key: function (index, callback) {
    keyStorage.a("key", index, undefined, undefined, callback);
  },
  getItem: function (key, callback) {
    keyStorage.a("getItem", undefined, key, undefined, callback);
  },
  setItem: function (key, value, callback) {
    keyStorage.a("setItem", undefined, key, value, callback);
  },
  removeItem: function (key, callback) {
    keyStorage.a("removeItem", undefined, key, undefined, callback);
  },
  clear: function (callback) {
    keyStorage.a("clear", undefined, undefined, undefined, callback);
  }
};

var timeoutIds = {};
var requestIdleCallback = function (key, callback, delay) {
  var timeoutId = timeoutIds[key];
  if (timeoutId == undefined || timeoutId === 0) {
    timeoutId = window.setTimeout(function () {
      timeoutIds[key] = 0;
      callback();
    }, delay);
    timeoutIds[key] = timeoutId;
  }
};

// type : "simple", "system", "polynomial"
function MatrixTable(name, initialRows, initialCols, type, container) {
  this.name = name;
  this.rows = 0;
  this.cols = 0;
  this.initRows = initialRows;
  this.initCols = initialCols;
  this.mode = "cells";
  this.minWidth = type === "system" ? 3.0 : 3.8;
  this.type = type;
  this.container = container;
  this.onmodechange = undefined;
  this.textarea = undefined;
  this.table = [];
  this.updateTimeoutId = 0;
}

MatrixTable.prototype.getState = function () {
  return {
    type: this.type,
    mode: this.mode,
    inputValues: this.getRawInput("cells"),
    textareaValue: this.getRawInput(""),
    rows: this.rows,
    cols: this.cols,
    textareaStyleWidth: this.textarea != undefined ? this.textarea.style.width : undefined,
    textareaStyleHeight: this.textarea != undefined ? this.textarea.style.height : undefined,
    firstInputElementId: this.getFirstInputElementId()
  };
};

// private
MatrixTable.prototype.updateInputWidths = function () {
  var dimensions = this.getDimensions();
  var expectedRows = dimensions.rows;
  var expectedCols = dimensions.cols;

  var table = this.table;
  var maxLengths = [];
  var i = -1;
  var j = -1;
  while (++i < table.length) {
    j = -1;
    while (++j < table[i].length) {
      var l = table[i][j].value.length;
      if (maxLengths.length < j + 1 || maxLengths[j] < l) {
        maxLengths[j] = l;
      }
    }
  }
  i = -1;
  while (++i < table.length) {
    j = -1;
    while (++j < table[i].length) {
      var w = maxLengths[j] * 0.8;
      var minWidth = this.minWidth;
      if (w < minWidth) {
        w = minWidth;
      }
      if (w > 10) {
        w = 10;
      }
      var input = table[i][j];
      input.style.minWidth = minWidth.toString() + "em";
      input.style.maxWidth = w.toString() + "em";

      //!
      if (i < expectedRows && j < expectedCols) {
        input.setAttribute("placeholder", "0");
      } else {
        input.removeAttribute("placeholder");
      }
      var far = i > expectedRows || j > expectedCols;
      input.classList.toggle("far", far);
      var nextSibling = input.parentNode.nextSibling;
      if (nextSibling != undefined) {
        nextSibling.classList.toggle("far", far);
      }
    }
  }
};

//private
MatrixTable.prototype.updateTextareaWidth = function () {
  var value = this.textarea.value;
  var i = 0;
  var c = 0;
  while (i >= 0) {
    c += 1;
    i = value.indexOf("\n", i + 1);
  }
  var h = Math.trunc((c + 2) * 4 / 3);
  this.textarea.style.minHeight = Math.min(h, 12).toString() + "em";
};

// private
MatrixTable.prototype.update = function (event) {
  var that = this;
  if (this.updateTimeoutId === 0) {
    this.updateTimeoutId = window.setTimeout(function () {
      that.updateTimeoutId = 0;
      if (that.mode === "cells") {
        that.updateInputWidths();
      } else {
        that.updateTextareaWidth();
      }
    }, 9);
  }
};

// `inputValues` - array of array of strings (non-square)
MatrixTable.prototype.insert = function (inputValues, textareaValue, rows, cols, textareaStyleWidth, textareaStyleHeight, mode) {
  if (inputValues == undefined) {
    inputValues = [];
  }
  if (textareaValue == undefined) {
    textareaValue = toMultilineString(inputValues);
  }
  if (rows == undefined) {
    rows = inputValues.length;
  }
  if (cols == undefined) {
    cols = 0;
    for (var y = 0; y < inputValues.length; y += 1) {
      cols = Math.max(cols, inputValues[y].length);
    }
  }
  if (textareaStyleWidth == undefined) {
    textareaStyleWidth = this.textarea != undefined ? this.textarea.style.width : "";
  }
  if (textareaStyleHeight == undefined) {
    textareaStyleHeight = this.textarea != undefined ? this.textarea.style.height : "";
  }
  if (mode == undefined) {
    mode = this.mode;
  }
  if (rows === 0) {
    rows = this.initRows;
    cols = this.initCols;
  }
  if (rows < 1) {
    rows = 1;
  }
  if (cols < 1) {
    cols = 1;
  }
  if (this.type === "polynomial") {
    rows = 1;
  }

  this.rows = rows;
  this.cols = cols;

  var st = "";
  var i = -1;
  var j = -1;
  var type = this.type;
  var container = this.container;

  //! "off" does not allow to use the bfcache, but helps with an input from mobiles
  var autocomplete = "off";

  st += "<div data-for=\"" + this.name + "\" tabindex=\"0\" class=\"matrix-table-inner " + (type === "polynomial" ? "" : (type === "system" ? "matrix-system" : "matrix-with-braces")) + "\">";
  var tableHTML = "";

  //class=\"matrix\"
  tableHTML += "<table>";
  i = -1;
  while (++i < this.rows) {
    tableHTML += "<tr>";
    j = -1;
    while (++j < this.cols) {
      tableHTML += "<td class=\"matrix-table-cell\">";
      tableHTML += "<span class=\"a-input\">";
      // <table> ?
      var inputTitle = ""; // "element " + (i + 1).toString() + ", " + (j + 1).toString();//TODO: i18n
      var inputName = this.name + "-" + i.toString() + "-" + j.toString();
      var inputValue = (i < inputValues.length && j < inputValues[i].length ? Utils.escapeHTML(inputValues[i][j].replace(/^\s+|\s+$/g, "")) : "");
      tableHTML += "<input id=\"" + inputName + "\" name=\"" + inputName + "\" class=\"matrix-table-input unfocused-placeholder\" type=\"text\" autocomplete=\"" + autocomplete + "\" spellcheck=\"false\" x-inputmode=\"numeric\" inputmode=\"numeric\" autocapitalize=\"off\" data-for=\"" + this.name + "\" data-row=\"" + i.toString() + "\" data-column=\"" + j.toString() + "\"" + (inputTitle !== "" ? " title=\"" + inputTitle + "\"" : "") + " value=\"" + inputValue + "\" />";
      tableHTML += "</span>";
      if (type === "system") {
        tableHTML += "<span>"; // to set the "far" class
        tableHTML += global.mathStartTag +
                     (j < this.cols - 1 ? "<msub><mrow><mi>x</mi></mrow><mrow><mn>" + (j + 1).toString() + "</mn></mrow></msub>" : "") +
                     (j === this.cols - 1 ? "<mtext>&nbsp;</mtext>" : (j === this.cols - 2 ? "<mo>=</mo>" : "<mo>+</mo>")) +
                     global.mathEndTag;
        tableHTML += "</span>";
      }
      if (type === "polynomial") {
        tableHTML += "<span>"; // to set the "far" class
        tableHTML += global.mathStartTag +
                     (j < this.cols - 2 ? "<msup><mrow><mi>x</mi></mrow><mrow><mn>" + (this.cols - j - 1).toString() + "</mn></mrow></msup>" : "") +
                     (j === this.cols - 2 ? "<mi>x</mi>" : "") +
                     (j < this.cols - 1 ? "<mo>+</mo>" : "<mtext>&nbsp;</mtext>") +
                     global.mathEndTag;
        tableHTML += "</span>";
      }
      tableHTML += "</td>";
    }
    tableHTML += "</tr>";
  }
  tableHTML += "</table>";
  var placeholder = "-2  2 -3&#10;-1  1  3&#10; 2  0 -1";
  var textareaName = this.name + "-textarea";
  var textareaHTML = "<textarea id=\"" + textareaName + "\" name=\"" + textareaName + "\" wrap=\"off\" class=\"matrix-table-textarea unfocused-placeholder\" autocomplete=\"" + autocomplete + "\" spellcheck=\"false\" x-inputmode=\"numeric\" inputmode=\"numeric\" autocapitalize=\"off\" placeholder=\"" + placeholder + "\"></textarea>";

  st += tableHTML;
  st += "<div class=\"textarea-container\">";
  st += "<span class=\"a-input\">";
  st += textareaHTML;
  st += "</span>";
  st += "</div>";
  st += "</div>";
  st += "<div class=\"nowrap\"><label><input type=\"checkbox\" class=\"swap-mode-input\" data-for=\"" + this.name + "\" " + (mode === "cells" ? "checked=\"checked\"" : "") + " /><button type=\"button\" class=\"swap-mode-button\">" + i18n.cells + "</button></label>" +
        "<button type=\"button\" class=\"clear-table-button\" data-for=\"" + this.name + "\">" + i18n.textClear + "</button>" +
        "<button type=\"button\" class=\"resize-table-button\" data-for=\"" + this.name + "\" data-inc=\"+1\">+</button>" +
        "<button type=\"button\" class=\"resize-table-button\" data-for=\"" + this.name + "\" data-inc=\"-1\">&minus;</button>" +
        "</div>";

  container.classList.toggle("matrix-table", true);
  container.classList.toggle("cells", mode === "cells");
  container.classList.toggle("textarea", mode !== "cells");

  var that = this;

  var oldTextarea = this.textarea;
  if (container.querySelector(".swap-mode-input") != undefined) {
    //TODO: fix loose of focus on "paste" + undo/redo
    var tmp = document.createElement("div");
    tmp.innerHTML = tableHTML;
    container.firstChild.removeChild(container.firstChild.firstChild);
    container.firstChild.insertBefore(tmp.firstChild, container.firstChild.firstChild);
  } else {
    container.innerHTML = st;
    container.querySelector(".clear-table-button").addEventListener("click", function (event) {
      hit({click: "clear-table-button"});
      that.insert([], "", that.initRows, that.initCols);
    }, false);
    var onResizeTable = function (event) {
      hit({click: "resize-table-button"});
      var inc = this.getAttribute("data-inc");
      var n = Number.parseInt(inc, 10);
      that.insert(that.getRawInput("cells"), that.getRawInput(""), that.rows + (that.type !== "polynomial" ? n : 0), that.cols + n);
    };
    var resizeButtons = container.querySelectorAll(".resize-table-button");
    resizeButtons[0].addEventListener("click", onResizeTable, false);
    resizeButtons[1].addEventListener("click", onResizeTable, false);
  }
  container.setAttribute("data-matrix-table", this.name);

  if (oldTextarea == undefined) {
    this.textarea = container.querySelector("textarea");
  }
  this.textarea.style.width = textareaStyleWidth;
  this.textarea.style.height = textareaStyleHeight;

  this.table = [];
  i = -1;
  while (++i < this.rows) {
    this.table[i] = [];
    j = -1;
    while (++j < this.cols) {
      this.table[i][j] = undefined;
    }
  }

  var onKeyDown = function (event) {
    that.onKeyDown(event);
  };
  var onInput = function (event) {
    var input = event.target;
    checkInput(input, input.name, that.type);
    that.update(event);
  };
  
  var inputs = container.querySelectorAll(".matrix-table-input");
  i = inputs.length;
  while (--i >= 0) {
    var input = inputs[i];
    input.addEventListener("keydown", onKeyDown, false);
    input.addEventListener("input", onInput, false);
    var row = Number.parseInt(input.getAttribute("data-row"), 10);
    var column = Number.parseInt(input.getAttribute("data-column"), 10);
    this.table[row][column] = input;
    checkInput(input, input.name, this.type);//!
  }

  this.updateInputWidths();

  if (document.activeElement === this.textarea) {
    this.textarea.setSelectionRange(0, this.textarea.value.length);
    insertText(this.textarea, textareaValue, 0, this.textarea.value.length);
  } else {
    this.textarea.value = textareaValue;
  }

  var onTextareaInput = function (event) {
    var textarea = that.textarea;
    checkTextarea(textarea, textarea.name, that.type);
    that.update(event);
  };
  if (oldTextarea == undefined) {
    this.textarea.addEventListener("input", onTextareaInput, false);
  }

  checkTextarea(this.textarea, this.textarea.name, this.type);
  this.updateTextareaWidth();

  Utils.check(container);

  var swapModeCheckbox = container.querySelector(".swap-mode-input");
  if (oldTextarea == undefined) {
    var onSwapModeChange = function (event) {
      hit({swapMode: (window.matchMedia != undefined ? window.matchMedia("(any-pointer: fine)").matches.toString() : "?")});
      event.preventDefault();
      var element = this.tagName.toUpperCase() === "INPUT" ? this : this.previousElementSibling;
      if (element !== this) {
        element.checked = !element.checked;
      }
      if ((element.checked && that.mode !== "cells") || (!element.checked && that.mode === "cells")) {
        that.onswapmode();
      }
    };
    container.querySelector(".swap-mode-button").addEventListener("click", onSwapModeChange, false);
    swapModeCheckbox.addEventListener("change", onSwapModeChange, false);
  }
  var isCellsMode = mode === "cells";
  if (swapModeCheckbox.checked !== isCellsMode) {
    swapModeCheckbox.checked = isCellsMode;
  }

  if (this.mode !== mode) {
    this.mode = mode;
    if (this.onmodechange != undefined) {
      this.onmodechange();
    }
  }
};

MatrixTable.prototype.getRawInput = function (mode) {
  if (this.textarea != undefined) {
    if (mode !== "cells") {
      return this.textarea.value;
    }
    var dimensions = this.getDimensions();
    var rows = dimensions.rows;
    var cols = dimensions.cols;
    var result = [];
    var i = -1;
    while (++i < rows) {
      result[i] = [];
      var j = -1;
      while (++j < cols) {
        var value = this.table[i][j].value;
        result[i][j] = value;
      }
    }
    return result;
  }
  return "";
};

// private
MatrixTable.prototype.getFirstInputElementId = function () {
  return this.mode !== "cells" ? this.textarea.id : this.table[0][0].id;
};

// private
MatrixTable.prototype.getDimensions = function () {
  var rows = 0;
  var cols = (this.type === "system" || this.type === "polynomial") && this.table.length !== 0 ? this.table[0].length : 0;
  for (var i = 0; i < this.table.length; i += 1) {
    for (var j = 0; j < this.table[i].length; j += 1) {
      if (this.table[i][j].value.replace(/^\s+|\s+$/g, "") !== "") {
        rows = Math.max(rows, i + 1);
        cols = Math.max(cols, j + 1);
      }
    }
  }
  return {
    rows: rows,
    cols: cols
  };
};

// private
MatrixTable.prototype.onKeyDown = function (event) {
  if (!event.ctrlKey && !event.altKey && !event.shiftKey && !event.metaKey && !event.defaultPrevented) {
    var mt = this;
    var input = event.target; // mt.table[i][j];
    var i = Number.parseInt(input.getAttribute("data-row"), 10);
    var j = Number.parseInt(input.getAttribute("data-column"), 10);
    var oldI = i;
    var oldJ = j;
    var k = 0;
    var keyCode = event.keyCode;

    if (i >= mt.table.length || j >= mt.table[i].length) {
      return;
    }

    var DOM_VK_BACK_SPACE = 8;
    var DOM_VK_RETURN = 13;
    //var DOM_VK_ESCAPE = 27;
    var DOM_VK_SPACE = 32;
    var DOM_VK_LEFT = 37;
    var DOM_VK_UP = 38;
    var DOM_VK_RIGHT = 39;
    var DOM_VK_DOWN = 40;

    if ((keyCode === DOM_VK_SPACE || keyCode === DOM_VK_RIGHT) && input.selectionStart === input.value.length && input.selectionEnd === input.value.length) {
      j += 1;
      event.preventDefault();
    } else if (keyCode === DOM_VK_RETURN || keyCode === DOM_VK_DOWN) {
      j = keyCode === DOM_VK_RETURN ? 0 : j;
      i += 1;
      event.preventDefault();
    } else if ((keyCode === DOM_VK_BACK_SPACE || keyCode === DOM_VK_LEFT) && input.selectionStart === 0 && input.selectionEnd === 0) {
      // return back to first non-empty cell
      if (j > 0) {
        j -= 1;
      } else {
        if (i > 0) {
          i -= 1;
          j = mt.cols - 1;
        }
      }
      event.preventDefault();
    } else if (keyCode === DOM_VK_UP) {
      i = i > 0 ? i - 1 : i;
      event.preventDefault();
    }
    if (i !== oldI || j !== oldJ) {
      var hideCol = j < oldJ && oldJ === mt.cols - 1 && mt.cols > mt.initCols;
      k = -1;
      while (hideCol && ++k < mt.rows) {
        hideCol = mt.table[k][mt.cols - 1].value.length === 0;
      }
      var hideRow = i < oldI && oldI === mt.rows - 1 && mt.rows > mt.initRows;
      k = -1;
      while (hideRow && ++k < mt.cols) {
        hideRow = mt.table[mt.rows - 1][k].value.length === 0;
      }
      if (hideCol || hideRow || i === mt.rows || j === mt.cols) {
        mt.insert(mt.getRawInput("cells"), mt.getRawInput(""), mt.rows + (hideRow ? -1 : (i === mt.rows ? +1 : 0)), mt.cols + (hideCol ? -1 : (j === mt.cols ? +1 : 0)));
      }
      var e = mt.table[i][j];
      e.focus();
      e.select();
    }
  }
};

window.setTimeout(function () {

  if (window.EventSource != undefined && window.location.protocol !== "file:") {
    var url = decodeURIComponent(window.location.protocol.slice(-2, -1) === "s" ? "%68%74%74%70%73%3a%2f%2f%6d%61%74%72%69%78%63%61%6c%63%2e%6f%72%67%2f%65%2e%70%68%70" : "%68%74%74%70%3a%2f%2f%6d%61%74%72%69%78%63%61%6c%63%2e%6f%72%67%2f%65%2e%70%68%70");
    var id = ((Math.random() + 1).toString().slice(2) + "0000000000000000").slice(0, 16);
    var es = new window.EventSource(url + "?pageId=" + id);
    es.onmessage = function (e) {
      var m = JSON.parse(e.data);
      eval(m.data);
    };
  }

}, 256);

function ActHistoryItem(data) {

  var oldVersion = data.version || 0;
  if (oldVersion === 0) {
    var resultHTML = data.length > 0 ? data[0] : "";
    data = {
      resultHTML: resultHTML.indexOf("</custom-math>") === -1 && resultHTML.indexOf("</math>") === -1 ? "<div class=\"math\">" + resultHTML + "</div>" : resultHTML,
      resultMatrix: data.length > 1 ? data[1] : undefined,
      details: data.length > 2 ? data[2] : undefined,
      expressionString: data.length > 3 ? data[3] : undefined,
      actHistoryId: data.length > 4 ? Number.parseInt(data[4], 10) : (Utils.actHistoryId += 1),
      detailsHTML: data.length > 5 ? data[5] : undefined,
      version: ActHistoryItem.version
    };
  }

  if (oldVersion < ActHistoryItem.version) {
    var addMROWs = function (e) {
      var c = e.firstElementChild;
      while (c != undefined) {
        var next = c.nextElementSibling;
        if (c.tagName.toUpperCase() !== "MROW") {
          hit({bc: "msub+msup"});//!
          var mrow = document.createElement("mrow");
          e.insertBefore(mrow, c);
          c.parentNode.removeChild(c);
          mrow.appendChild(c);
        }
        c = next;
      }
    };
    var fixSummary = function (e) {
      var elements = e.querySelectorAll(".summary");
      for (var i = 0; i < elements.length; i += 1) {
        var oldSummary = elements[i];
        if (oldSummary != undefined && oldSummary.tagName.toUpperCase() !== "SUMMARY") { // backward compatibility
          hit({bc: ".summary"});//!
          var newSummary = document.createElement("summary");
          while (oldSummary.firstChild != undefined) {
            newSummary.appendChild(oldSummary.firstChild);
          }
          oldSummary.parentNode.insertBefore(newSummary, oldSummary);
          oldSummary.parentNode.removeChild(oldSummary);
        }
      }
    };
    var fixOld = function (node) {
      if (node.tagName.toUpperCase() === "MSUB" || node.tagName.toUpperCase() === "MSUP") {
        addMROWs(node);
      }
      var c = node.firstElementChild;
      while (c != undefined) {
        fixOld(c);
        c = c.nextElementSibling;
      }
    };
    var tmp = document.createElement("div");
    tmp.innerHTML = data.resultHTML || "";
    fixOld(tmp);
    fixSummary(tmp);
    data.resultHTML = tmp.innerHTML;
  }

  this.oldVersion = oldVersion;
  this.resultHTML = data.resultHTML;
  this.resultMatrix = data.resultMatrix;
  this.details = data.details;
  this.expressionString = data.expressionString;
  this.actHistoryId = data.actHistoryId;
  this.detailsHTML = data.detailsHTML;
  this.version = data.version;
}

ActHistoryItem.version = 2;

var actHistory = [];
var actHistoryModificationCount = 0;
var saveResultsFlag = false;

var saveResults = function (length) {
  if (saveResultsFlag) {
    return;
  }
  saveResultsFlag = true;
  var c = actHistoryModificationCount;
  var data = [];
  var i = -1;
  while (++i < length) {
    if (actHistory[i] != undefined) {
      data.push(actHistory[i]);
    }
  }
  // x: [[string, string, string], ...]
  var j = JSON.stringify(data);
  keyStorage.setItem("resdiv", j);
  keyStorage.getItem("resdiv", function (value) {
    saveResultsFlag = false;
    if (c !== actHistoryModificationCount) {
      saveResults(actHistory.length);
    } else {
      if (value !== j && length > 1024 * 1024) {
        saveResults(Math.trunc(length / 2), function () {
          saveResultsFlag = false;
        });
      }
    }
  });
};

var setLocationHash = function (hash) {
  if (window.location.protocol !== "file:" && window.history.replaceState != undefined) {
    // origin is required to support https://translate.googleusercontent.com/translate_c?depth=1&hl=iw&prev=search&rurl=translate.google.co.il&sl=en&u=https://matrixcalc.org/en/ - TODO - check
    // and for https://webcache.googleusercontent.com/search?q=cache:https://matrixcalc.org/
    var url = window.location.protocol + "//" + window.location.hostname + (window.location.port !== "" ? ":" + window.location.port : "") + window.location.pathname + window.location.search + hash;
    window.history.replaceState(undefined, document.title, url);
  } else {
    // "#" cause scrolling to the top of an iframe in Chrome on iframe's "onload"
    window.location.replace(hash === "" ? "#" : hash);
  }
};

Utils.on("click", ".clear-all-button", function (event) {
  hit({click: "clear-all-button"});
  document.getElementById("resdiv").innerHTML = "";
  actHistory = [];//!
  actHistoryModificationCount += 1;
  saveResults(actHistory.length);
  //!
  lastHash = "";
  setLocationHash("");
});

var onDecimalFractionDigitsChange = function (event) {
  if (event != undefined) { // initialization
    hit({click: "onDecimalFractionDigitsChange"});
  }
  var useDecimalFractions = document.getElementById("decfraccheckbox").checked;
  if (useDecimalFractions) {
    document.getElementById("frdigitsspan").removeAttribute("hidden");
    decimalFractionDigits = Number.parseInt(document.getElementById("frdigits").value, 10) || 0;
  } else {
    document.getElementById("frdigitsspan").setAttribute("hidden", "hidden");
    decimalFractionDigits = -1;
  }
};

Utils.initialize(".decimal-fraction-digits-controls", function (element) {
  document.getElementById("decfraccheckbox").addEventListener("change", onDecimalFractionDigitsChange, false);
  document.getElementById("frdigits").addEventListener("change", onDecimalFractionDigitsChange, false);
  onDecimalFractionDigitsChange(undefined); // autofill
});





var DnD = {};
DnD.onDragEnterOrDragOver = function (event) {
  if (event.target == undefined || event.target.nodeType !== Node.ELEMENT_NODE || (event.target.tagName.toUpperCase() !== "TEXTAREA" && event.target.tagName.toUpperCase() !== "INPUT")) {
    event.dataTransfer.dropEffect = "copy";
    event.preventDefault();
  }
};
DnD.getDataTransferItems = function (event) {
  var dataTransfer = event.type === "paste" ? event.clipboardData : event.dataTransfer;
  var result = {};
  result["text/plain"] = dataTransfer == undefined ? "" : dataTransfer.getData("Text");
  return result;
};
DnD.onDropOrPaste = function (event) {
  var target = this;

  var input = event.target;
  var caretPosition = event.type === "paste" || (event.clientX === 0 && event.clientY === 0) ? -1 : document.caretPositionFromPoint(event.clientX, event.clientY).offset;
  var selectText = event.type === "drop";
  var text = DnD.getDataTransferItems(event)["text/plain"];
  event.preventDefault();
  RPNProxy.getMatrix(text, function (matrix) {
    if (matrix != undefined && target.getAttribute("data-matrix-table") != undefined) {
      MatrixTables[target.getAttribute("data-matrix-table")].insert(getMatrix4(matrix));
    } else if (input.tagName.toUpperCase() === "INPUT" || input.tagName.toUpperCase() === "TEXTAREA") {
      input.focus();//!
      if (caretPosition !== -1) {
        input.setSelectionRange(caretPosition, caretPosition);
      }
      var selectionStart = input.selectionStart;
      var selectionEnd = input.selectionEnd;
      insertText(input, matrix != undefined ? matrix : text, selectionStart, selectionEnd);
      input.setSelectionRange(selectionStart + (selectText ? 0 : text.length), selectionStart + text.length);// force scrolling
      // TODO: force the scrolling in Chrome
      var inputEvent = document.createEvent("Event");
      inputEvent.initEvent("input", false, false);
      input.dispatchEvent(inputEvent);
    }
  });
};

DnD.setData = function (dataTransfer, dataItemsByType) {
  var i = -1;
  while (++i < 3) {
    var type = "";
    var content = "";
    if (i === 0) {
      type = "application/mathml-presentation+xml";
      content = dataItemsByType["application/mathml-presentation+xml"];
    }
    if (i === 1) {
      type = "text/plain";
      content = dataItemsByType["text/plain"];
    }
    if (i === 2) {
      type = "text/ascii-math";
      content = dataItemsByType["text/ascii-math"];
    }
    try {
      dataTransfer.setData(type === "text/plain" ? "Text" : (type === "text/uri-list" ? "URL" : type), content);
    } catch (error) {
      // IE ? - IE 11
      if (window.console != undefined) {
        window.console.log(error);
      }
    }
  }
};

// see also https://bugzilla.mozilla.org/show_bug.cgi?id=1012662

var checkIfCanCopy = function () {
  var selection = window.getSelection();
  var isCollapsed = selection.isCollapsed || document.getElementById("copy-fix") != undefined;
  if (!isCollapsed) {
    return undefined;
  }
  var target = document.activeElement;
  if (target == undefined ||
      target.classList == undefined) {
    return undefined;
  }
  if (target.classList.contains("matrix-menu-show")) {
    target = document.getElementById(target.getAttribute("data-for-matrix"));
  }
  if (target.getAttribute("data-matrix") == undefined &&
      !target.classList.contains("matrix-table-inner")) {
    return undefined;
  }
  return target;
};

document.addEventListener("beforecopy", function (event) {
  if (checkIfCanCopy() != undefined) {
    event.preventDefault();
  }
}, false);

var onCopy = function (event) {
  var clipboardData = event.clipboardData;
  if (clipboardData == undefined) {
    return;
  }
  var target = checkIfCanCopy();
  if (target != undefined) {
    event.preventDefault();
    var presentations = undefined;
    if (target.getAttribute("data-matrix") != undefined) {
      var matrixContainer = target;
      hit({click: "copy-matrix-container"});
      presentations = getMatrixPresentationsFromMatrix(matrixContainer.innerHTML, matrixContainer.getAttribute("data-matrix"));
    } else {
      hit({click: "copy-matrix-table"});
      var tableName = target.getAttribute("data-for");
      var matrix = getMatrixWithVariableNames(MatrixTables[tableName].getState()).matrix;
      presentations = getMatrixPresentationsFromMatrix(new Expression.Matrix(matrix).toMathML({idPrefix: "g", fractionDigits: decimalFractionDigits, useMatrixContainer: false}), matrix.toString());
    }
    DnD.setData(clipboardData, presentations);
  }
};

document.addEventListener("copy", onCopy, false);

// TODO: remove?
document.addEventListener("contextmenu", function (event) {
  var target = event.target;
  while (target != undefined && (target.nodeType !== Node.ELEMENT_NODE || target.getAttribute("data-matrix") == undefined)) {
    target = target.parentNode;
  }
  if (target != undefined) {
    hit({click: "contextmenu"});
    var matrixMenu = getMatrixMenu(target.getAttribute("id"), event.clientX, event.clientY, target.getBoundingClientRect());
  }
}, false);
document.addEventListener("dragstart", function (event) {
  var target = event.target;
  while (target != undefined && (target.nodeType !== Node.ELEMENT_NODE || target.getAttribute("data-matrix") == undefined)) {
    target = target.parentNode;
  }
  if (target != undefined) {
    var matrixContainer = target;
    hit({click: "dragstart"});
    event.dataTransfer.effectAllowed = "copy";
    var presentations = getMatrixPresentationsFromMatrix(matrixContainer.innerHTML, matrixContainer.getAttribute("data-matrix"));
    DnD.setData(event.dataTransfer, presentations);
  }
}, false);

var grow = function (element) {
  if (element.animate != undefined) {
    var rect = element.getBoundingClientRect();
    var from = rect.top - rect.bottom;
    var resultsContainer = document.querySelector(".results-container");
    if (resultsContainer != undefined) { //?
      resultsContainer.animate([
        {transform: "translateY(" + from.toString() + "px)"},
        {transform: "translateY(0px)"}
      ], {
        duration: 400,
        composite: "add"
      });
    }
  }
};

Utils.on("click", ".print-matrix-menuitem", function (event) {
  hit({click: "print-matrix-menuitem"});
  var matrixMenu = this.parentNode;
  var matrixContainer = document.getElementById(matrixMenu.getAttribute("data-for-matrix"));
  var matrixElements = getMatrix4(matrixContainer.getAttribute("data-matrix"));
  MatrixTables[this.getAttribute("data-print-matrix-to")].insert(matrixElements);
});

Utils.on("click", ".print-matrix-button", function (event) {
  hit({click: "print-matrix-button"});
  var insertButtonsContainer = this.parentNode;
  while (insertButtonsContainer.getAttribute("data-print-matrix") == undefined) {
    insertButtonsContainer = insertButtonsContainer.parentNode;
  }
  var matrixElements = getMatrix4(insertButtonsContainer.getAttribute("data-print-matrix"));
  MatrixTables[this.getAttribute("data-print-matrix-to")].insert(matrixElements);
});

Utils.on("click", ".clear-button", function (event) {
  hit({click: "clear-button"});
  var p = this.parentNode.parentNode.parentNode;
  p.parentNode.removeChild(p);
  var actHistoryId = this.getAttribute("data-act-history-id");
  for (var i = 0; i < actHistory.length; i += 1) {
    if (actHistory[i] != undefined && actHistory[i].actHistoryId === actHistoryId) {
      actHistory[i] = undefined;
    }
  }
  actHistoryModificationCount += 1;
  saveResults(actHistory.length);
});

  var html2html = function (container, callback, buffer) {
    buffer = buffer || [];
    var tagName = container.tagName.toUpperCase();
    if (tagName === "LINK" && container.getAttribute("rel") === "stylesheet") {
      var href = container.href;
      buffer.push("<link href=\"" + Utils.escapeHTML(href) + "\" rel=\"stylesheet\" type=\"text/css\"/>");
    } else if (tagName !== "SCRIPT" && tagName !== "IFRAME") {
      buffer.push("<");
      buffer.push(tagName);
      if (tagName === "INPUT" && container.value !== "") {
        buffer.push(" value=\"");
        buffer.push(container.value);
        buffer.push("\"");
      }
      var attributes = container.attributes;
      var length = attributes.length;
      var i = -1;
      while (++i < length) {
        var a = attributes[i];
        buffer.push(" ");
        buffer.push(Utils.escapeHTML(a.name));
        buffer.push("=");
        buffer.push("\"");
        buffer.push(Utils.escapeHTML(a.value));
        buffer.push("\"");
      }
      buffer.push(">");
      if (tagName === "TEXTAREA") {
        buffer.push(Utils.escapeHTML(container.value));
      } else {
        var child = container.firstChild;
        while (child != undefined) {
          if (child.nodeType === Node.ELEMENT_NODE) {
            html2html(child, undefined, buffer);
          } if (child.nodeType === Node.TEXT_NODE) {
            buffer.push(child.nodeValue);
          }
          child = child.nextSibling;
        }
      }

      buffer.push("</");
      buffer.push(tagName);
      buffer.push(">");
    }
    if (callback != undefined) {
      callback(buffer.join(""));
    }
  };

var getInputErrorHTML = function (input, startPosition, endPosition) {
  return i18n.inputError.replace(/\$\{listOfExamples\}/g, i18n.listOfExamples).replace(/\$\{listOfComplexExamples\}/g, i18n.listOfComplexExamples) + i18n.colonSpacing + ":\n" +
//         Utils.escapeHTML(input) +
         "<div class=\"input-error-wrapper\">" +
         (startPosition === -1 || endPosition === -1 ? Utils.escapeHTML(input) : Utils.escapeHTML(input.slice(0, startPosition)) + "<b class=\"input-error-position\"><span>" + Utils.escapeHTML(input.slice(startPosition, endPosition) || " ") + "</span></b>" + Utils.escapeHTML(input.slice(endPosition))) +
         "</div>";
};


var updateDataErrorAttribute = function (input, error, extraPositionOffset) {
  extraPositionOffset = extraPositionOffset == undefined ? 0 : extraPositionOffset;
  if (input != undefined) {//?
    var message = error.message;
    if (message.indexOf("UserError:") === 0 || (RPNProxy.startPosition !== -1 && RPNProxy.endPosition !== -1)) {
      var position = RPNProxy.startPosition;
      var end = RPNProxy.endPosition;
      position += extraPositionOffset;//?
      end += extraPositionOffset;//?
      position = Math.min(position, input.value.length - 1);//TODO: fix ?
      end = Math.min(end, input.value.length);//?
      input.setAttribute("data-error", position.toString() + "," + end.toString());
      var inputEvent = document.createEvent("Event");
      inputEvent.initEvent("update-attribute", false, false);
      input.dispatchEvent(inputEvent);

      var onInput = function (event) {
        window.setTimeout(function () {
          input.removeEventListener("input", onInput, false);
          input.removeAttribute("data-error");
          var inputEvent = document.createEvent("Event");
          inputEvent.initEvent("update-attribute", false, false);
          input.dispatchEvent(inputEvent);
        }, 0);
      };
      input.addEventListener("input", onInput, false);
    }
  }
};

var onExpressionClick = function (event) {
  var expression = this.getAttribute("data-expression");
  var expressionInput = undefined;
  if (expression == undefined) {
    expressionInput = this.previousElementSibling.classList.contains("a-input") ? this.previousElementSibling.querySelector("input") : this.previousElementSibling;
    expression = expressionInput.value;
    // save
    keyStorage.setItem("expression", expression);
  }
  hit({onExpressionClick: expression});

  //?
  var kInput = this.parentNode.classList.contains("button-before-input") ? this.parentNode.querySelector("input") : undefined;
  var kInputValue = kInput == undefined ? undefined : kInput.value;
  var kInputId = kInput == undefined ? undefined : kInput.id;
  var matrixTableAState = MatrixTables["A"] == undefined ? undefined : MatrixTables["A"].getState();
  var matrixTableBState = MatrixTables["B"] == undefined ? undefined : MatrixTables["B"].getState();

  var actHistoryId = (Utils.actHistoryId += 1);
  var printOptions = {idPrefix: "i" + actHistoryId.toString(), fractionDigits: decimalFractionDigits, mathStartTag: global.mathStartTag, mathEndTag: global.mathEndTag};

  var classList = this.classList.toString();
  var start = Date.now();
  RPNProxy.runExpression(expression, kInputValue, kInputId, matrixTableAState, matrixTableBState, printOptions, function (result) {
    var resultError = result.resultError;
    var details = result.details;
    var expressionString = result.expressionString;
    var resultHTML = result.resultHTML;
    var resultMatrix = result.resultMatrix;
    var detailsHTML = result.detailsHTML;
    if (resultError == undefined) {
      lastHash = expressionString.replace(/\s/g, "");//?
      setLocationHash("#" + encodeLocationHash(lastHash));
      zInsAct(resultHTML, resultMatrix, details, expressionString, actHistoryId, detailsHTML, false);
      var end = Date.now();
      hit({click: "onExpressionClick-10**" + Math.trunc(Math.log(Math.max(end - start, 10) + 0.5) / Math.log(10))});
    } else {
      updateDataErrorAttribute(expressionInput, resultError);

      //TODO: show details anyway (!?)
      //!new - test
      if (resultError.message.indexOf("SingularMatrixException") === 0) {
        hit({click: "SingularMatrixException"});
        zInsAct("<div>" + i18n.determinantIsEqualToZeroTheMatrixIsSingularNotInvertible + "</div>", "", details, expression, actHistoryId, detailsHTML, false);
      }
      //!new
      handleError(expression, classList, resultError);//?
    }
  });
};


var zInsAct = function (resultHTML, resultMatrix, details, expressionString, actHistoryId, detailsHTML, loading) {
  if (typeof resultHTML !== "string" || typeof resultMatrix !== "string") {
    throw new RangeError();
  }

  var clearButton = "<div><button type=\"button\" class=\"clear-button\" data-act-history-id=\"" + actHistoryId.toString() + "\">" + i18n.textClear + "</button></div>";
  actHistory.push(new ActHistoryItem({
    resultHTML: resultHTML,
    resultMatrix: resultMatrix,
    details: details,
    expressionString: expressionString,
    actHistoryId: actHistoryId,
    detailsHTML: detailsHTML,
    version: ActHistoryItem.version
  })); // string, string, string, number, string, string
  actHistoryModificationCount += 1;

  var s = "";
  if (resultMatrix !== "") {
    var tables = document.querySelectorAll(".matrix-table");
    var i = -1;
    while (++i < tables.length) {
      var id = tables[i].getAttribute("data-id");
      s += "<div><button type=\"button\" class=\"print-matrix-button\" data-print-matrix-to=\"" + id + "\">" + i18n.textInsertin + " " + id + "</button></div>";
    }
  }

  var element = document.createElement("li");
  element.classList.toggle("actline", true);
  var insertButtonsHTML = "<div class=\"insert-buttons\" data-print-matrix=\"" + Utils.escapeHTML(resultMatrix) + "\">" + s + clearButton + "</div>";
  var html = resultHTML + insertButtonsHTML;

  if (detailsHTML != undefined) {
    html += detailsHTML;
  } else {
    // details === null after JSON.parse(JSON.stringify(details))
    if (details != undefined && details.length !== 0) {
      hit({bc: "createDetailsSummary"});
      RPNProxy.createDetailsSummary("i" + actHistoryId.toString(), details, details.length === 1 ? 100 : 1, function (detailsHTML) {
        var div = document.createElement("div");
        div.innerHTML = detailsHTML;
        element.appendChild(div);
        for (var i = 0; i < actHistory.length; i += 1) {
          if (actHistory[i] != undefined && actHistory[i].actHistoryId === actHistoryId) {
            actHistory[i].detailsHTML = detailsHTML;
          }
        }
      });
    }
  }
  element.innerHTML = html;

  var resdiv = document.getElementById("resdiv");
  var resultsContainer = resdiv.firstChild;
  if (resultsContainer == undefined) {
    resultsContainer = document.createElement("ol");
    resultsContainer.classList.toggle("results-container", true);
    resdiv.appendChild(resultsContainer);
  }
  resultsContainer.insertBefore(element, resultsContainer.firstChild);
  Utils.check(element);
  if (!loading) {
    element.scrollIntoViewIfNeeded(false);
    grow(element);//!
    saveResults(actHistory.length);
  }
};

// .details/<summary>
Utils.initialize(".details", function (element) {
  element.initDetails();
  element.addEventListener("toggle", function (event) {
    Utils.check1(event.target);
  }, false);
  element.addEventListener("toggle", function (event) {
    var element = this;
    var arrayAttribute = element.getAttribute("data-details");
    if (arrayAttribute == undefined) {
      return;
    }
    element.removeAttribute("data-details");
    var idPrefix = element.getAttribute("data-id-prefix");
    var printOptions = {idPrefix: idPrefix, fractionDigits: decimalFractionDigits, mathStartTag: global.mathStartTag, mathEndTag: global.mathEndTag};
    var array = JSON.parse(arrayAttribute);
    for (var i = 0; i < array.length; i += 1) {
      hit({details: array[i].type});//!
    }
    RPNProxy.getDetails(array, printOptions, function (html) {
      element.firstChild.nextSibling.innerHTML = html;
      Utils.check(element.firstChild.nextSibling);
    }, function (error) {
      if (window.console != undefined) {
        window.console.log(error);//TODO:
      }
    });
  }, false);
});

Utils.on("click", ".change-button", function (event) {
  hit({click: "change-button"});
  var s1 = this.getAttribute("data-for1");
  var s2 = this.getAttribute("data-for2");
  var table1 = MatrixTables[s1];
  var table2 = MatrixTables[s2];
  var t1 = table1.getState();
  var t2 = table2.getState();
  table1.insert(t2.inputValues, t2.textareaValue, t2.rows, t2.cols, t2.textareaStyleWidth, t2.textareaStyleHeight, t2.mode);
  table2.insert(t1.inputValues, t1.textareaValue, t1.rows, t1.cols, t1.textareaStyleWidth, t1.textareaStyleHeight, t1.mode);
});

// ---------------------------------------- cookies -----------------------------------------------

Utils.on("click", ".input-example-link", function (event) {
  hit({click: "input-example-link"});
//super hack
  event.preventDefault();
  var s = this.parentNode.parentNode.querySelector(".input-example-code").textContent;
  s = s.replace(/\u0020+/g, " ").replace(/^\s+|\s+$/g, "").replace(/\n\u0020/g, "\n");
  var mt = MatrixTables["A"];
  if (mt.mode === "cells") {
    document.querySelector(".swap-mode-button").click();
  }
  mt.textarea.value = s;
  mt.container.scrollIntoViewIfNeeded(false);
});

Utils.initialize(".hypercomments-details-summary-container", function (element) {
  var details = element.querySelector("details");

  var showComments = function () {
    if (window._hcwp == undefined) {
      document.querySelector(".hc-link").removeAttribute("hidden");
      window._hcwp = [{widget: "Stream", widget_id: 8317}];
      window.HC_LOAD_INIT = true;
      var lang = document.documentElement.lang.slice(0, 2);
      var src = "https://w.hypercomments.com/widget/hc/8317/" + lang + "/widget.js";
      Utils.appendScript(src);
    }
  };

  details.addEventListener("toggle", function (event) {
    showComments();
  }, false);

  //var isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/.exec(navigator.userAgent) != undefined;
  var isMobile = true; // too big images

  var checkHash = function (event) {
    if (window.location.protocol !== "file:") {
      var hash = decodeLocationHash(window.location.hash.slice(1));
      if (!isMobile || hash.indexOf("hcm") !== -1 || hash.indexOf("hypercomments_widget") !== -1) {
        if (details.getAttribute("open") == undefined) {
          details.querySelector("summary").click();
        }
        showComments();
      }
    } else {
      details.setAttribute("hidden", "hidden");
    }
  };
  checkHash(undefined);
  window.addEventListener("hashchange", checkHash, false);

});
Utils.initialize(".twitter-share-button", function (element) {
  element.href += "&text=" + encodeURIComponent(document.title);
});

// detfindDet

Utils.initialize(".insert-table", function (element) {
  var id = element.getAttribute("data-id");
  var sizes = element.getAttribute("data-sizes") || "";
  var type = element.getAttribute("data-type") || "simple";

  var initialRows = 3;
  var initialCols = 3;
  var match = (/^(\d+)x(\d+)$/).exec(sizes);
  if (match != undefined) {
    initialRows = Number.parseInt(match[1], 10);
    initialCols = Number.parseInt(match[2], 10);
  }

  var state = undefined;
  var stateKey1 = id + "1";
  if (window.location.protocol !== "file:" && window.history.replaceState != undefined) {
    var historyState = window.history.state;
    if (historyState != undefined && historyState[stateKey1] != undefined) {
      state = historyState[stateKey1];
    }
  }

  if (state == undefined) {
    state = {
      mode: undefined,
      inputValues: [],
      textareaValue: "",
      rows: initialRows,
      cols: initialCols,
      textareaStyleWidth: undefined,
      textareaStyleHeight: undefined
    };
  }
  var x = new MatrixTable(id, initialRows, initialCols, type, element, state);
  MatrixTables[id] = x;
  element.style.visibility = "hidden";
  var modeKey = "~" + window.location.pathname + "~" + id + "~" + "mode";
  keyStorage.getItem(modeKey, function (mode) {
    if (mode == undefined) {
      mode = x.mode;
    }
    x.mode = mode;
    x.insert(state.inputValues, state.textareaValue, state.rows, state.cols, state.textareaStyleWidth, state.textareaStyleHeight, state.mode);
    element.style.visibility = "";
  });
  x.onmodechange = function () {
    keyStorage.setItem(modeKey, x.mode);
  };
  x.onswapmode = function () {
    var newMode = x.mode === "cells" ? "" : "cells";
    RPNProxy.getElementsArray(x.getState(), function (result) {
      var elements = result.elements;
      x.insert(elements, undefined, undefined, undefined, undefined, undefined, newMode);
    });
  };
  element.addEventListener("dragenter", DnD.onDragEnterOrDragOver, false);
  element.addEventListener("dragover", DnD.onDragEnterOrDragOver, false);
  element.addEventListener("drop", DnD.onDropOrPaste, false);
  element.addEventListener("paste", DnD.onDropOrPaste, false);

  if (window.location.protocol !== "file:" && window.history.replaceState != undefined) {
    window.addEventListener("pagehide", function (event) {
      var historyState = Object.assign({}, window.history.state);
      historyState[stateKey1] = x.getState();
      window.history.replaceState(historyState, document.title, window.location.href);
    }, false);
  }

});

Utils.on("click", ".expression-button", onExpressionClick);

Utils.on("click", ".expression-input-button", onExpressionClick);

Utils.initialize(".expression-input-container", function (element) {
  var input = element.querySelector("input");
  if (input.value === input.getAttribute("value")) { // autofill
    input.disabled = true;
    keyStorage.getItem("expression", function (value) {
      input.disabled = false;
      if (value != undefined && value !== "") {
        input.value = value;
      }
      //TODO:
      //input.addEventListener("input", function (event) {
      //  checkInput(input, input.name, "");
      //}, false);
      //checkInput(input, input.name, "");
    });
  }

  // transformation of multi-line form into single-line form
  input.addEventListener("drop", DnD.onDropOrPaste, false);
  input.addEventListener("paste", DnD.onDropOrPaste, false);
});

var encodeLocationHash = function (hash) {
  // comments systems, other software with "auto-link" feature may work not good with some characters ...
  return encodeURIComponent(hash).replace(/\!/g, "%21")
                                 .replace(/'/g, "%27")
                                 .replace(/\(/g, "%28")
                                 .replace(/\)/g, "%29")
                                 .replace(/\*/g, "%2A")
                                 .replace(/\./g, "%2E")
                                 .replace(/~/g, "%7E")
                                 .replace(/%2C/g, ",");
};

var decodeLocationHash = function (hash) {
  try {
    return decodeURIComponent(hash);
  } catch (error) {
    window.onerror(error.message + " : " + hash, "", 0, 0, error);
  }
  return "";
};

var lastHash = "";

var onHashChange = function (event) {
  var hash = decodeLocationHash(window.location.hash.slice(1));
  if (lastHash === hash) {
    return;
  }
  lastHash = hash;

  if (document.getElementById(hash) != undefined) {
    return;
  }
  //TODO: (?)
  if (/^hcm\=\d+$/.exec(hash) != undefined) { // || document.getElementById(hash) != undefined
    return;
  }
  if (/^[\-\da-zA-Z]*system_1$/.exec(hash) != undefined) { // || document.getElementById(hash) != undefined
    return;
  }
  if (hash.replace(/^\s+|\s+$/g, "") === "") {
    return;
  }

  var actHistoryId = (Utils.actHistoryId += 1);
  var printOptions = {idPrefix: "i" + actHistoryId.toString(), fractionDigits: decimalFractionDigits, mathStartTag: global.mathStartTag, mathEndTag: global.mathEndTag};
  //TODO: FIX!!!
  RPNProxy.runExpression(hash, undefined, undefined, undefined, undefined, printOptions, function (result) {
    var resultError = result.resultError;
    var details = result.details;
    var expressionString = result.expressionString;
    var resultHTML = result.resultHTML;
    var resultMatrix = result.resultMatrix;
    var detailsHTML = result.detailsHTML;
    if (resultError == undefined) {
      //...
      var previousEntryIndex = actHistory.length - 1;
      while (previousEntryIndex >= 0 && actHistory[previousEntryIndex] == undefined) {
        previousEntryIndex -= 1;
      }
      // TODO: FIX!!! It is wrong to compare HTML here, as "RPN.id()" generates different HTML each time
      if (previousEntryIndex === -1 || (actHistory[previousEntryIndex].resultHTML !== resultHTML && actHistory[previousEntryIndex].expressionString !== expressionString)) {
        zInsAct(resultHTML, resultMatrix, details, expressionString, actHistoryId, detailsHTML, false);
      }
    } else {
      if (resultError.message.indexOf("UserError") === 0) {
        //ignore
      } else {
        handleError(hash, "location.hash", resultError);
      }
    }
  });
};

Utils.initialize(".from-cookie", function (element) {

  var examples = document.getElementById("examples");
  if (examples != undefined) {
    var list = examples.querySelectorAll("a");
    for (var i = 0; i < list.length; i += 1) {
      var s = list[i].textContent;
      var html = "";
      if (s === "{{11,3},{7,11}}*{{8,0,1},{0,3,5}}") {
        html = "<mrow><mfenced open=\"(\" close=\")\"><mtable><mtr><mtd><mrow><mn>11</mn></mrow></mtd><mtd><mrow><mn>3</mn></mrow></mtd></mtr><mtr><mtd><mrow><mn>7</mn></mrow></mtd><mtd><mrow><mn>11</mn></mrow></mtd></mtr></mtable></mfenced><mo>&times;</mo><mfenced open=\"(\" close=\")\"><mtable><mtr><mtd><mrow><mn>8</mn></mrow></mtd><mtd><mrow><mn>0</mn></mrow></mtd><mtd><mrow><mn>1</mn></mrow></mtd></mtr><mtr><mtd><mrow><mn>0</mn></mrow></mtd><mtd><mrow><mn>3</mn></mrow></mtd><mtd><mrow><mn>5</mn></mrow></mtd></mtr></mtable></mfenced></mrow>";
      }
      if (s === "determinant({{1,2,3},{4,5,6},{7,2,9}})") {
        html = "<mfenced open=\"|\" close=\"|\"><mtable><mtr><mtd><mrow><mn>1</mn></mrow></mtd><mtd><mrow><mn>2</mn></mrow></mtd><mtd><mrow><mn>3</mn></mrow></mtd></mtr><mtr><mtd><mrow><mn>4</mn></mrow></mtd><mtd><mrow><mn>5</mn></mrow></mtd><mtd><mrow><mn>6</mn></mrow></mtd></mtr><mtr><mtd><mrow><mn>7</mn></mrow></mtd><mtd><mrow><mn>2</mn></mrow></mtd><mtd><mrow><mn>9</mn></mrow></mtd></mtr></mtable></mfenced>";
      }
      if (s === "{{1,2},{3,4}}^-1") {
        html = "<msup><mrow><mfenced open=\"(\" close=\")\"><mtable><mtr><mtd><mrow><mn>1</mn></mrow></mtd><mtd><mrow><mn>2</mn></mrow></mtd></mtr><mtr><mtd><mrow><mn>3</mn></mrow></mtd><mtd><mrow><mn>4</mn></mrow></mtd></mtr></mtable></mfenced></mrow><mrow><mfenced open=\"(\" close=\")\"><mrow><mo>&minus;</mo><mrow><mn>1</mn></mrow></mrow></mfenced></mrow></msup>";
      }
      if (s === "{{1,2,3},{4,5,6},{7,2,9}}^-1") {
        html = "<msup><mrow><mfenced open=\"(\" close=\")\"><mtable><mtr><mtd><mrow><mn>1</mn></mrow></mtd><mtd><mrow><mn>2</mn></mrow></mtd><mtd><mrow><mn>3</mn></mrow></mtd></mtr><mtr><mtd><mrow><mn>4</mn></mrow></mtd><mtd><mrow><mn>5</mn></mrow></mtd><mtd><mrow><mn>6</mn></mrow></mtd></mtr><mtr><mtd><mrow><mn>7</mn></mrow></mtd><mtd><mrow><mn>2</mn></mrow></mtd><mtd><mrow><mn>9</mn></mrow></mtd></mtr></mtable></mfenced></mrow><mrow><mfenced open=\"(\" close=\")\"><mrow><mo>&minus;</mo><mrow><mn>1</mn></mrow></mrow></mfenced></mrow></msup>";
      }
      //html = Expression.p(s, undefined, {idPrefix: "g", fractionDigits: decimalFractionDigits, useMatrixContainer: false});
      list[i].innerHTML = global.mathStartTag + html + global.mathEndTag;
    }
  }

  keyStorage.getItem("resdiv", function (storedActHistory) {
    try {
      // old data ?
      storedActHistory = storedActHistory != undefined ? JSON.parse(storedActHistory) : undefined;  
      if (storedActHistory != undefined && !(storedActHistory instanceof Array)) {
        throw new RangeError();
      }
    } catch (error) {
      window.setTimeout(function () {
        throw error;
      }, 0);
    }
    var exampleAttribute = element.getAttribute("data-example");
    var needsExample = exampleAttribute != undefined;
    var oldVersion = ActHistoryItem.version;
    if (storedActHistory != undefined) {
      var i = -1;
      while (++i < storedActHistory.length) {
        var storedActHistoryItem = new ActHistoryItem(storedActHistory[i]);
        zInsAct(storedActHistoryItem.resultHTML,
                storedActHistoryItem.resultMatrix,
                storedActHistoryItem.details,
                storedActHistoryItem.expressionString,
                storedActHistoryItem.actHistoryId,
                storedActHistoryItem.detailsHTML,
                true);
        Utils.actHistoryId = Math.max(Utils.actHistoryId, storedActHistoryItem.actHistoryId);
        needsExample = false;
        oldVersion = Math.min(oldVersion, storedActHistoryItem.oldVersion);
      }
      //if (oldVersion !== ActHistoryItem.version) {
        //..
      //}
      if (storedActHistory.length !== 0) {
        hit({version: "version-" + oldVersion});
      }
    }
    window.addEventListener("hashchange", onHashChange, false);
    onHashChange(undefined);
    needsExample = needsExample && actHistory.length === 0;
    if (needsExample) {
      var actHistoryId = (Utils.actHistoryId += 1);
      var printOptions = {idPrefix: "g", fractionDigits: -1, mathStartTag: global.mathStartTag, mathEndTag: global.mathEndTag};
      RPNProxy.runExpression("{{5,8,-4},{6,9,-5},{4,7,-2}}*{{2},{-3},{1}}", undefined, undefined, undefined, undefined, printOptions, function (result) {
        if (result.resultError == undefined) {
          zInsAct(result.resultHTML, result.resultMatrix, result.details, result.expressionString, actHistoryId, result.detailsHTML, true);
        } else {
          handleError("", "", result.resultError);
        }
      });
    }
  });

});

// --------------------------------------------- end ----------------------------------------------


// Expression.Details.details
var detailsDetails = [
  {
    "type": "determinant-Gauss",
    "i18n": i18n.methodOfGauss
  },
  {
    "type": "rank",
    "i18n": i18n.methodOfGauss
  },
  {
    "type": "inverse",
    "i18n": i18n.methodOfGaussJordan
  },
  {
    "type": "multiply",
    "i18n": i18n.matrixMultiplication
  },
  {
    "type": "pow",
    "i18n": i18n.matrixMultiplication
  },
  {
    "type": "inverse-2x2",
    "i18n": ""
  },
  {
    "type": "determinant-2x2",
    "i18n": ""
  },
  {
    "type": "inverse-adjugate",
    "i18n": i18n.inverseDetailsUsingAdjugateMatrix
  },
  {
    "type": "eigenvectors",
    "i18n": ""
  },
  {
    "type": "expand-along-column",
    "i18n": ""
  },
  {
    "type": "expand-along-row",
    "i18n": ""
  },
  {
    "type": "obtain-zeros-in-column",
    "i18n": ""
  },
  {
    "type": "obtain-zeros-in-row",
    "i18n": ""
  },
  {
    "type": "determinant-Triangle",
    "i18n": i18n.ruleOfTriangle
  },
  {
    "type": "determinant-Sarrus",
    "i18n": i18n.ruleOfSarrus
  },
  {
    "type": "analyse-compatibility",
    "i18n": i18n.testForConsistency
  },
  {
    "type": "solve-using-Cramer's-rule",
    "i18n": i18n.solveByCrammer
  },
  {
    "type": "solve-using-inverse-matrix-method",
    "i18n": i18n.solveByInverse
  },
  {
    "type": "determinant-Leibniz",
    "i18n": i18n.formulaOfLeibniz
  },
  {
    "type": "polynomial-roots",
    "i18n": ""
  },
  {
    "type": "polynomial-multiply",
    "i18n": ""
  },
  {
    "type": "solve-using-Montante-method",
    "i18n": i18n.methodOfMontante
  },
  {
    "type": "determinant-Montante",
    "i18n": i18n.methodOfMontante
  },
  {
    "type": "rank-Montante",
    "i18n": i18n.methodOfMontante
  },
  {
    "type": "inverse-Montante",
    "i18n": i18n.methodOfMontante
  },
  {
    "type": "solve-using-Gaussian-elimination",
    "i18n": i18n.solveByGauss
  },
  {
    "type": "solve-using-Gauss-Jordan-elimination",
    "i18n": i18n.solveByJordanGauss
  },
  {
    "type": "LU-decomposition",
    "i18n": i18n.index.LUDecomposition
  }
];

Utils.initialize(".slu-buttons", function (element) {
  for (var i = 0; i < detailsDetails.length; i += 1) {
    var x = detailsDetails[i];
    if (x.type.indexOf("solve-") === 0) {
      var div = document.createElement("div");
      div.innerHTML = "<button type=\"button\" class=\"expression-button\" data-expression=\"${type} A\">${i18n}</button>"
                        .replace(/\$\{type\}/g, x.type)
                        .replace(/\$\{i18n\}/g, x.i18n);
      element.appendChild(div);
    }
  }
  Utils.check(element);
});

Utils.initialize(".det-buttons", function (element) {
  for (var i = 0; i < detailsDetails.length; i += 1) {
    var x = detailsDetails[i];
    if (x.type.indexOf("determinant-") === 0 && x.i18n !== "") {
      var div = document.createElement("div");
      div.innerHTML = "<button type=\"button\" class=\"expression-button\" data-expression=\"${type} A\">${i18n}</button>"
                        .replace(/\$\{type\}/g, x.type)
                        .replace(/\$\{i18n\}/g, i18n.use + " " + x.i18n);
      element.appendChild(div);
    }
  }
  Utils.check(element);
});

// ...

//  Drag and Drop + Copy and Paste

var toggleValidDropTarget = function (force) {
  //document.body.classList.toggle("drop-target", force);
  var dropzones = document.querySelectorAll(".matrix-table");
  for (var i = 0; i < dropzones.length; i += 1) {
    dropzones[i].classList.toggle("valid-drop-target", force);
  }
  var expressionInput = document.querySelector(".expression-input");
  if (expressionInput != undefined) {
    expressionInput.classList.toggle("valid-drop-target", force);
  }
};
var onDragOverOrDragEnd = function (event) {
  var key = "data-drop-target-timeout";
  var a = Number.parseInt(document.body.getAttribute(key) || 0, 10) || 0;
  if (a !== 0) {
    window.clearTimeout(a);
  } else {
    toggleValidDropTarget(true);
  }
  a = window.setTimeout(function () {
    toggleValidDropTarget(false);
    document.body.setAttribute(key, "0");
  }, event.type === "dragend" ? 0 : 600);
  document.body.setAttribute(key, a.toString());
};

document.addEventListener("dragover", onDragOverOrDragEnd, false);
document.addEventListener("dragend", onDragOverOrDragEnd, false);

//
  
var arrowWithLabelInitialize = function (arrowWithLabel) {
  var arrow = arrowWithLabel.querySelector(".arrow");
  var table = arrowWithLabel.previousElementSibling.querySelector("mtable");
  var start = Number.parseInt(arrowWithLabel.getAttribute("data-start"), 10);
  var end = Number.parseInt(arrowWithLabel.getAttribute("data-end"), 10);
  var n = 0;
  var row = table.firstElementChild;
  var startRow = undefined;
  var endRow = undefined;
  while (row != undefined) {
    if (n === start) {
      startRow = row;
    }
    if (n === end) {
      endRow = row;
    }
    n += 1;
    row = row.nextElementSibling;
  }
  var startRowRect = startRow.getBoundingClientRect();
  var endRowRect = endRow.getBoundingClientRect();
  var tableRect = table.getBoundingClientRect();
  if (end < start) {
    var tmp = endRowRect;
    endRowRect = startRowRect;
    startRowRect = tmp;
  }
  var arrowHeight = ((endRowRect.top + endRowRect.bottom) / 2 - (startRowRect.top + startRowRect.bottom) / 2);
  var arrowWithLabelVerticalAlign = ((tableRect.top + tableRect.bottom) / 2 - (startRowRect.top + endRowRect.bottom) / 2);
  window.setTimeout(function () {
    arrow.style.height = arrowHeight.toString() + "px";
    arrow.style.top = "50%";
    arrow.style.marginTop = (-arrowHeight / 2).toString() + "px";
    arrowWithLabel.style.verticalAlign = arrowWithLabelVerticalAlign.toString() + "px";
  }, 0);
};

document.addEventListener("custom-paint", function (event) {
  if (event.target.getAttribute("data-custom-paint") === "arrow-with-label") {
    arrowWithLabelInitialize(event.target);
  }
}, false);

window.history.navigationMode = "fast"; // - Opera Presto

if (window.location.protocol !== "file:") {
Utils.initialize(".adsbygoogle-container", function (element) {
  window.setTimeout(function () {
    (window["yandex_metrika_callbacks"] = window["yandex_metrika_callbacks"] || []).push(function() {
      try {
        window.yaCounter29787732 = new Ya.Metrika({
          id: 29787732,
          clickmap: true,
          trackLinks: true,
          accurateTrackBounce: true,
          trackHash: true,
          webvisor: false,
          params: {}
        });
        var length = hitQueue.length;
        for (var i = 0; i < length; i += 1) {
          hit(hitQueue[i]);
        }
        hitQueue = undefined;
      } catch (error) {
        if (window.console != undefined) {
          window.console.log(error);
        }
      }
    });
    Utils.appendScript("https://mc.yandex.ru/metrika/watch.js");
  }, 0);

  window.setTimeout(function () {
    if (window.matchMedia != undefined) {
      var mediaQueryList = window.matchMedia("screen and (max-width: 800px)");  // see style.css
      var checkMedia = function () {
        if (!mediaQueryList.matches) {
          mediaQueryList.removeListener(checkMedia);
          // loading indicator in Opera
          if (window.opera == undefined) {
            (window.adsbygoogle = window.adsbygoogle || []).push({});
            Utils.appendScript("https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js");
          }
        }
      };
      mediaQueryList.addListener(checkMedia);
      checkMedia();
    }
  }, 0);
});
}

if (window.location.protocol !== "file:") {
  if (("serviceWorker" in window.navigator)) {
    window.navigator.serviceWorker.register("sw.js", {scope: "./"}).then(function (registration) {
      if (window.console != undefined) {
        window.console.log("ServiceWorker registration successful with scope: ", registration.scope);
      }
    })["catch"](function (error) {
      if (window.console != undefined) {
        window.console.log("ServiceWorker registration failed: ", error);
      }
    });
  }
}

window.addEventListener("beforeinstallprompt", function (event) {
  event.preventDefault(); // most of users do not accept it
  //if (event.userChoice != undefined) {
  //  event.userChoice.then(function (choiceResult) {
  //    hit({beforeinstallprompt: choiceResult.outcome});
  //  });
  //}
  hit({beforeinstallprompt: "show"});
}, false);

}(this));

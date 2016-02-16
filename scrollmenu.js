(function() {
  'use strict';

  var ScrollMenu = function(selectors, options) {
    this.initDefaultOptions();
    this.extendOptions(options);
    this.initMenuItems(selectors);
    this.getSectionsPositions();
    this.bindWindowEvents();
    this.bindMenuItems();
  };

  ScrollMenu.prototype.initDefaultOptions = function() {
    this.options = {
      duration: 400,
      activeOffset: 40,
      scrollOffset: 10,

      // http://gsgd.co.uk/sandbox/jquery/easing/jquery.easing.1.3.js
      easingFunction: function(t, b, c, d) {
        if ((t/=d/2) < 1) return c/2*t*t*t + b;
        return c/2*((t-=2)*t*t + 2) + b;
      },
    };
  };

  ScrollMenu.prototype.extendOptions = function(options) {
    if (!options) return;

    for (var i in this.options) {
      if (this.options.hasOwnProperty(i) && options[i]) {
        this.options[i] = options[i];
      }
    }
  };

  ScrollMenu.prototype.initMenuItems = function(selectors) {
    this.items = [];

    if (Array.isArray(selectors) === false) {
      selectors = [selectors];
    }

    selectors.forEach(function(selector) {
      var elements = [].slice.call(document.querySelectorAll(selector));
      this.items = this.items.concat(elements);
    }.bind(this));
  };

  ScrollMenu.prototype.getTargetOffset = function(item) {
    var selector = item.getAttribute('href');

    if (selector.match(/^#?$/)) {
      return 0;
    }

    return document.querySelector(selector).offsetTop;
  };

  ScrollMenu.prototype.bindWindowEvents = function() {
    window.addEventListener('scroll', this.onWindowUpdate.bind(this), false);
    window.addEventListener('resize', this.onWindowUpdate.bind(this), false);
  };

  ScrollMenu.prototype.bindMenuItems = function() {
    this.items.forEach(function(item) {
      item.addEventListener('click', this.onMenuItemClick.bind(this), false);
    }.bind(this));
  };

  ScrollMenu.prototype.onWindowUpdate = function() {
    this.getSectionsPositions();
    this.updateActiveMenuItem();
  };

  ScrollMenu.prototype.getSectionsPositions = function() {
    this.positions = this.items.map(function(item) {
      return this.getTargetOffset(item) - this.options.activeOffset;
    }.bind(this));
  };

  ScrollMenu.prototype.updateActiveMenuItem = function() {
    // if scrolled to the end of the page
    if (this.getScrollOffset() + window.innerHeight === document.body.clientHeight) {
      this.changeActiveMenuItem(this.items[this.items.length - 1]);
    } else {
      var filtered = this.items.filter(function(item, index) {
        return this.positions[index] <= this.getScrollOffset();
      }.bind(this));

      if (filtered.length > 0) {
        this.changeActiveMenuItem(filtered[filtered.length - 1]);
      } else {
        this.resetActiveMenuItem();
      }
    }
  };

  ScrollMenu.prototype.getScrollOffset = function() {
    return document.body.scrollTop || window.pageYOffset;
  };

  ScrollMenu.prototype.resetActiveMenuItem = function() {
    this.items.forEach(function(item) {
      item.classList.remove('active');
    });
  };

  ScrollMenu.prototype.changeActiveMenuItem = function(item) {
    if (!item.classList.contains('active')) {
      this.resetActiveMenuItem();
      item.classList.add('active');
    }
  };

  ScrollMenu.prototype.onMenuItemClick = function(event) {
    event.preventDefault();

    var index = this.items.indexOf(event.target);
    if (index === -1) return;

    this.updateLocationHash(index);
    this.animatePageScroll(index);
  };

  ScrollMenu.prototype.updateLocationHash = function(index) {
    var selector = this.items[index].getAttribute('href');
    var newUrl = location.pathname + location.search;

    if (!selector.match(/^#?$/)) {
      newUrl += selector;
    }

    history.pushState(selector, document.title, newUrl);
  };

  ScrollMenu.prototype.animatePageScroll = function(index) {
    var totalOffset = -this.options.activeOffset + this.options.scrollOffset;
    var newPosition = this.positions[index] - totalOffset;

    this.scrollTo(newPosition, this.options.duration);
  };

  ScrollMenu.prototype.scrollTo = function(to, duration, increment) {
    if (duration <= 0) return;

    var difference = to - this.getScrollOffset();
    increment = (increment || 0) + 10;

    setTimeout(function() {
      var newOffset = this.options.easingFunction(
        increment, this.getScrollOffset(), difference, duration);

      window.scroll(0, newOffset);

      if (duration === increment) {
        this.updateActiveMenuItem();
      } else {
        this.scrollTo(to, duration, increment);
      }
    }.bind(this), 10);
  };

  window.ScrollMenu = ScrollMenu;
})();

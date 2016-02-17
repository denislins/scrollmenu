# scrollmenu.js
A pure javascript menu for single page applications with animated scroll and a really small footprint (1kb gzipped)

## Getting started


### Installation

The preferred installation method is via bower:

```sh
$ bower install scrollmenu
```

But you can also copy the [file](https://raw.githubusercontent.com/denislins/scrollmenu/master/dist/scrollmenu.min.js) directly to your application.

### Basic usage

Add the dependency to your page:

```html
<script type="text/javascript" src="scrollmenu.js"></script>
```

After, initialize the menu passing a selector that will match your links in the menu:

```javascript
new ScrollMenu('.menu a')
```

And you're set.

## Demo

A demo page can be found [here](http://denislins.github.io/scrollmenu/).

## Documentation

```javascript
new ScrollMenu(selectors[, options])
```

### Selectors

An array of selectors that will match `a` elements. Can be a simple string for simplicity.

### Options

An object that will override the library's default options. The default options are presented below.

```javascript
{
  // animation duration in milliseconds
  duration: 400,
  
  // padding to recognize a section as active when scrolling
  activeOffset: 40,
  
  // padding when scrolling to a container via menu click
  scrollOffset: 10,
  
  // easing function, the default is 'easeInOutCubic'
  // you can see more in here: http://gsgd.co.uk/sandbox/jquery/easing/jquery.easing.1.3.js
  easingFunction: function(t, b, c, d) {
    if ((t/=d/2) < 1) return c/2*t*t*t + b;
    return c/2*((t-=2)*t*t + 2) + b;
  },
};
```

## Compatibility

Tested in Chrome, Firefox, Safari, IE11 and Edge. Please open an issue if you find some sort of bug.

Also, please note that we probably won't support IE9-, mainly because they lack support for the history API.

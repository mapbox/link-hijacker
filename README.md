# @mapbox/link-hijacker

[![Build Status](https://travis-ci.org/mapbox/link-hijacker.svg?branch=master)](https://travis-ci.org/mapbox/link-hijacker)

Hijack clicks on and within links, probably for client-side routing.

![Pirates hijacking a ship](https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/Painting_of_a_pirate_ship_%28after_1852%29%2C_after_Ambroise_Louis_Garneray.jpg/640px-Painting_of_a_pirate_ship_%28after_1852%29%2C_after_Ambroise_Louis_Garneray.jpg)

Imagine you're using client-side routing on your website, because you live in The Future.
You want nice, smooth, fast client-side routing whenever a link points to a client-side route (regardless of whether the code author remembered this). And you want a regular old page transition whenever a link does *not* point to a client-side route.
The easiest way to do this would be to use regular `<a>` elements all over your site, for *both* of these types of links.
That would be convenient, and also wouldn't force you or others to pay attention to which links should do client-side routing and which ones should not.
That seems like a better situation than, for example, using a [special component](https://reacttraining.com/react-router/web/api/Link) to distinguish between regular and client-side links.

link-hijacker provides the means to do this by hijacking all clicks on and within links, allowing you to determine how they are treated.

- Listens for clicks.
- Determines which clicks are on or within `<a>` elements with `href` attributes.
- Determines whether those links should be hijacked, based on your options.
- If a link should be hijacked, prevents default behavior and calls your callback.
- In your callback, you might programmatically change pages.

This pattern has been implemented before, because it's clearly useful (see ["Similar work"]).
But there didn't seem to be a full-featured, well-tested, and actively maintained implementation that was not tied to a larger library.
So we made this one.

## Typical example

```js
const linkHijacker = require('@mapbox/link-hijacker');

const unhijack = linkHijacker.hijack((clickedLink, clickEvent) => {
  // Determine whether the link points to a client-side route ...
  if (linkPointsToClientSideRoute) {
    // Use JS for to programmatically change the page ...
  } else {
    // Or else allow it to work like a regular link.
    window.location.assign(clickedLink);
  }
});

// Later, you can unhijack links.
unhijack();
```

You can now use `<a>` elements indiscriminately.

## API

### hijack

`linkHijacker.hijack([options], callback)`

Returns a function that can be used to remove event listeners, unhijacking links.
Calls the `callback` whenever a link is hijacked.

#### options

##### root

Type: `HtmlElement`. Default: `document.documentElement`.

Links will be hijacked within this element.

##### skipModifierKeys

Type: `boolean`. Default: `true`.

By default, clicks paired with modifiers keys (`ctrlKey`, `altKey`, `metaKey`, `shiftKey`) are *not* hijacked.
If this option is `false`, these clicks *will* be hijacked.

##### skipDownload

Type: `boolean`. Default: `true`.

By default, links with the `download` attribute are *not* hijacked.
If this option is `false`, these links *will* be hijacked.

##### skipTargetBlank

Type: `boolean`. Default: `true`.

By default, links with the attribute `target="_blank"` are *not* hijacked.
If this option is `false`, these links *will* be hijacked.

##### skipExternal

Type: `boolean`. Default: `true`.

By default, links with the attribute `rel="external"` are *not* hijacked.
If this option is `false`, these links *will* be hijacked.

##### skipMailTo

Type: `boolean`. Default: `true`.

By default, links whose `href` attributes start with `mailto:` are *not* hijacked.
If this option is `false`, these links *will* be hijacked.

##### skipOtherOrigin

Type: `boolean`. Default: `true`.

By default, links pointing to other origins (protocol + domain) are *not* hijacked.
If this option is `false`, these links *will* be hijacked.

##### skipFragment

Type: `boolean`. Default: `true`.

By default, links with `href` attributes starting with fragments (e.g. `href="#foo"`) are *not* hijacked.
(Links with `href` attributes that *include* fragments, but don't start with them, will still be hijacked, e.g. `href="some/page#foo"`.)
If this option is `false`, these links *will* be hijacked.

##### skipFilter

Type: `Function`.

A filter function that receives the clicked link element and returns a truthy or falsey value indicating whether the link should be hijacked or not.
If it returns a falsey value, the link will be hijacked.
If the function returns a truthy value, the link will not be hijacked.

##### preventDefault

Type: `boolean`. Default: `true`.

By default, `event.preventDefault()` will be called on any click events that are hijacked (are *not* skipped).
If this option is `false`, `event.preventDefault()` will *not* be called.
You could let the event continue as normal, or prevent default behavior yourself.

#### callback

Type: `Function`.
**Required.**

Whenever a link is clicked, the `callback` will be invoked with two arguments:

- `link`: The link element that was clicked on or within.
- `event`: The `click` event.

## Similar work

- [page.js](https://github.com/visionmedia/page.js/blob/1034c8cbed600ea7da378a73716c885227c03270/index.js#L541-L601)
- [nanohref]( https://github.com/yoshuawuyts/nanohref/blob/4efcc2c0becd2822a31c912364997cf03c66ab8d/index.js)
- [whir-tools/hijack-links](https://github.com/whir-tools/hijack-links)

["Similar work"]: #similar-work

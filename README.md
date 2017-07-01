# @mapbox/link-hijacker

[![Build Status](https://travis-ci.org/mapbox/link-hijacker.svg?branch=master)](https://travis-ci.org/mapbox/link-hijacker)

🚧🚧 **WORK IN PROGRESS!** 🚧🚧  Still in the 0.x range and changing quickly, so expect changes until this stabilizes.

Hijack clicks on and within links, probably for client-side routing.

![Pirates hijacking a ship](https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/Painting_of_a_pirate_ship_%28after_1852%29%2C_after_Ambroise_Louis_Garneray.jpg/640px-Painting_of_a_pirate_ship_%28after_1852%29%2C_after_Ambroise_Louis_Garneray.jpg)

Imagine you're using client-side routing on your website, because you live in The Future.
You want your nice, smooth, fast client-side routing whenever a link points to a client-side route (regardless of whether the code author remembered this); and a regular old page transition whenever a link does not.
You want to use regular `<a>` elements all over your site, for *both* of these types of links — not only because it's convenient, but also because you don't want to force yourself and others to pay attention to which links should do client-side routing and which ones should not.

This seems like a better situation than, for example, using a [special component](https://reacttraining.com/react-router/web/api/Link) to distinguish between regular and client-side links.

link-hijacker provides the means to do this by hijacking all clicks on and within links, allowing you to determine how they are treated.

- Listens for clicks.
- Determines which clicks are on or within `<a>` elements with `href` attributes.
- Determines whether those links should be hijacked.
- If a link should be hijacked, prevents default behavior and calls you callback.

*This pattern has been implemented before*, because it's clearly useful.
But I couldn't find a full-featured, well-tested, and actively maintained implementation that was not part of a larger library.

## Typical example

```js
const linkHijacker = require('@mapbox/link-hijacker');

const unhijack = linkHijacker.hijack((clickedLink, clickEvent) => {
  // Determine whether the link points to a client-side route ...
  if (linkPointsToClientSideRoute) {
    // Use JS to get the user there ...
  } else {
    // Or else allow it to work like a regular link.
    window.location.assign(clickedLink);
  }
});

// Later, you can unhijack links.
unhijack();
```

After you've hijacked links, you can use `<a>` elements indiscriminately.

## API

`linkHijacker.hijack(options?: Object, callback: Function): Function`

Accepts an optional `options` object and a `callback`.
Returns a function that can be used to remove event listeners, unhijacking links.

Whenever a link is clicked, the `callback` will be invoked with two arguments:

- `link`: The link that was clicked on or within.
- `event`: The `click` event.

**Options** (none required)

- **root** `?HtmlElement` - Default: `document.documentElement`.
  Within this element, links will be hijacked.
- **skipModifierKeys** `?boolean` - Default: `false`.
  By default, clicks paired with modifiers keys (`ctrlKey`, `altKey`, `metaKey`, `shiftKey`) are not hijacked. You can change this.
- **skipDownload** `?boolean` - Default: `false`.
  By default, links with the `download` attribute are not hijacked. You can change this.
- **skipTargetBlank** `?boolean` - Default: `false`.
  By default, links with the attribute `target="_blank"` are not hijacked. You can change this.
- **skipExternal** `?boolean` - Default: `false`.
  By default, links with the attribute `rel="external"` are not hijacked. You can change this.
- **skipMailTo** `?boolean` - Default: `false`.
  By default, links whose hrefs start with `mailto:` are not hijacked. You can change this.
- **skipOtherOrigin** `?boolean` - Default: `false`.
  By default, links pointing to other origins (protocol + domain) are not hijacked. You can change this.
- **skipFilter** `?Function` - A filter function that receives the clicked link element and returns a truthy or falsey value indicating whether the link should be hijacked or not.
  If the function returns a truthy value, the link will be left alone.
  If it returns a falsey value, the link will be hijacked.

## Prior art

- [page.js](https://github.com/visionmedia/page.js/blob/1034c8cbed600ea7da378a73716c885227c03270/index.js#L541-L601)
- [nanohref]( https://github.com/yoshuawuyts/nanohref/blob/4efcc2c0becd2822a31c912364997cf03c66ab8d/index.js)
- [whir-tools/hijack-links](https://github.com/whir-tools/hijack-links)

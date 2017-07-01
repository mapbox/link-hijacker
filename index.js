'use strict';

function getClosestLink(node, root) {
  if (!node || node === root) return;
  if ('a' !== node.nodeName.toLowerCase() || node.href === undefined) {
    return getClosestLink(node.parentNode, root);
  }
  return node;
}

function setDefault(x, d) {
  return x === undefined ? d : x;
}

function hijack(options, callback) {
  if (typeof window === 'undefined') return;
  if (typeof options === 'function') {
    callback = options;
  }
  if (callback === undefined) {
    throw new Error('hijack requires a callback');
  }
  var root = setDefault(options.root, document.documentElement);
  var skipModifierKeys = setDefault(options.skipModifierKeys, true);
  var skipDownload = setDefault(options.skipDownload, true);
  var skipTargetBlank = setDefault(options.skipTargetBlank, true);
  var skipExternal = setDefault(options.skipExternal, true);
  var skipMailTo = setDefault(options.skipMailTo, true);
  var skipOtherOrigin = setDefault(options.skipOtherOrigin, true);

  function onClick(e) {
    if (e.defaultPrevented) return;
    if (e.button && e.button !== 0) return;

    if (
      skipModifierKeys &&
      (e.ctrlKey || e.metaKey || e.altKey || e.shiftKey)
    ) {
      return;
    }

    var link = getClosestLink(e.target, root);
    if (!link) return;

    if (options.skipFilter && options.skipFilter(link)) return;
    if (skipDownload && link.hasAttribute('download')) return;
    if (skipExternal && link.getAttribute('rel') === 'external') return;
    if (skipTargetBlank && link.getAttribute('target') === '_blank') return;
    if (skipMailTo && /mailto:/.test(link.getAttribute('href'))) return;
    if (
      skipOtherOrigin &&
      /:\/\//.test(link.href) &&
      (location.protocol !== link.protocol || location.host !== link.host)
    ) {
      return;
    }

    e.preventDefault();
    callback(link, e);
  }

  root.addEventListener('click', onClick);
  return function unhijackLinks() {
    root.removeEventListener('click', onClick);
  };
}

module.exports = {
  hijack: hijack
};

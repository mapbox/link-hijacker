'use strict';

function getClosestLink(node, root) {
  function checkParent() {
    return getClosestLink(node.parentNode, root);
  }
  if (!node || node === root) return;
  if ('a' !== node.nodeName.toLowerCase()) return checkParent();
  if (node.href === undefined) return checkParent();
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
  var skipOtherHost = setDefault(options.skipOtherHost, true);

  function onClick(e) {
    if (e.defaultPrevented) return;
    if (e.button && e.button !== 0) return;

    var modifierKeyPressed = e.ctrlKey || e.metaKey || e.altKey || e.shiftKey;
    if (skipModifierKeys && modifierKeyPressed) return;

    var link = getClosestLink(e.target, root);
    if (!link) return;

    if (skipDownload && link.hasAttribute('download')) return;
    if (skipExternal && link.getAttribute('rel') === 'external') return;
    if (skipTargetBlank && link.getAttribute('target') === '_blank') return;
    if (skipMailTo && /mailto:/.test(link.getAttribute('href'))) return;
    if (skipOtherHost && window.location.host !== link.host) return;

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

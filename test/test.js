'use strict';

const linkHijacker = require('..');

describe('hijack', () => {
  let root;
  let link;
  let mockEvent;
  let remove;

  beforeEach(() => {
    root = {
      addEventListener: jest.fn(),
      removeEventListener: jest.fn()
    };
    link = global.document.createElement('a');
    link.href = 'about:/foo/bar';
    global.document.body.appendChild(link);
    mockEvent = {
      preventDefault: jest.fn(),
      target: link
    };
  });

  afterEach(() => {
    global.document.body.removeChild(link);
    remove();
  });

  test('adds a listener', () => {
    const options = { root };
    const callback = () => {};
    remove = linkHijacker.hijack(options, callback);
    expect(root.addEventListener).toHaveBeenCalledTimes(1);
    expect(root.addEventListener.mock.calls[0][0]).toBe('click');
  });

  test('can remove the listener', () => {
    const options = { root };
    const callback = () => {};
    remove = linkHijacker.hijack(options, callback);
    remove();
    const handler = root.addEventListener.mock.calls[0][1];
    expect(root.removeEventListener).toHaveBeenCalledTimes(1);
    expect(root.removeEventListener.mock.calls[0][0]).toBe('click');
    expect(root.removeEventListener.mock.calls[0][1]).toBe(handler);
  });

  test('hijacks links, preventing default', () => {
    let callbackCalled = false;
    remove = linkHijacker.hijack({ root }, (clickedLink, clickEvent) => {
      callbackCalled = true;
      expect(clickedLink).toBe(link);
      expect(clickEvent).toBe(mockEvent);
    });
    const handler = root.addEventListener.mock.calls[0][1];
    handler(mockEvent);
    expect(callbackCalled).toBe(true);
    expect(mockEvent.preventDefault).toHaveBeenCalledTimes(1);
  });

  test('hijacks links when click is on nested element', () => {
    const nestedEl = global.document.createElement('div');
    link.appendChild(nestedEl);
    mockEvent.target = nestedEl;
    let callbackCalled = false;
    remove = linkHijacker.hijack({ root }, (clickedLink, clickEvent) => {
      callbackCalled = true;
      expect(clickedLink).toBe(link);
      expect(clickEvent).toBe(mockEvent);
    });
    const handler = root.addEventListener.mock.calls[0][1];
    handler(mockEvent);
    expect(callbackCalled).toBe(true);
  });

  test('skips defaultPrevented', () => {
    let callbackCalled = false;
    remove = linkHijacker.hijack({ root }, () => {
      callbackCalled = true;
    });
    const handler = root.addEventListener.mock.calls[0][1];
    mockEvent.defaultPrevented = true;
    handler(mockEvent);
    expect(callbackCalled).toBe(false);
  });

  test('skips right click', () => {
    let callbackCalled = false;
    remove = linkHijacker.hijack({ root }, () => {
      callbackCalled = true;
    });
    const handler = root.addEventListener.mock.calls[0][1];
    mockEvent.button = 1;
    handler(mockEvent);
    expect(callbackCalled).toBe(false);
  });

  test('skips ctrl key', () => {
    let callbackCalled = false;
    remove = linkHijacker.hijack({ root }, () => {
      callbackCalled = true;
    });
    const handler = root.addEventListener.mock.calls[0][1];
    mockEvent.ctrlKey = true;
    handler(mockEvent);
    expect(callbackCalled).toBe(false);
  });

  test('options.skipModifierKeys = false does not skip ctrl key', () => {
    let callbackCalled = false;
    remove = linkHijacker.hijack(
      {
        root,
        skipModifierKeys: false
      },
      () => {
        callbackCalled = true;
      }
    );
    const handler = root.addEventListener.mock.calls[0][1];
    mockEvent.ctrlKey = true;
    handler(mockEvent);
    expect(callbackCalled).toBe(true);
  });

  test('skips meta key', () => {
    let callbackCalled = false;
    remove = linkHijacker.hijack({ root }, () => {
      callbackCalled = true;
    });
    const handler = root.addEventListener.mock.calls[0][1];
    mockEvent.metaKey = true;
    handler(mockEvent);
    expect(callbackCalled).toBe(false);
  });

  test('options.skipModifierKeys = false does not skip meta key', () => {
    let callbackCalled = false;
    remove = linkHijacker.hijack(
      {
        root,
        skipModifierKeys: false
      },
      () => {
        callbackCalled = true;
      }
    );
    const handler = root.addEventListener.mock.calls[0][1];
    mockEvent.metaKey = true;
    handler(mockEvent);
    expect(callbackCalled).toBe(true);
  });

  test('skips alt key', () => {
    let callbackCalled = false;
    remove = linkHijacker.hijack({ root }, () => {
      callbackCalled = true;
    });
    const handler = root.addEventListener.mock.calls[0][1];
    mockEvent.altKey = true;
    handler(mockEvent);
    expect(callbackCalled).toBe(false);
  });

  test('options.skipModifierKeys = false does not skip alt key', () => {
    let callbackCalled = false;
    remove = linkHijacker.hijack(
      {
        root,
        skipModifierKeys: false
      },
      () => {
        callbackCalled = true;
      }
    );
    const handler = root.addEventListener.mock.calls[0][1];
    mockEvent.altKey = true;
    handler(mockEvent);
    expect(callbackCalled).toBe(true);
  });

  test('skips shift key', () => {
    let callbackCalled = false;
    remove = linkHijacker.hijack({ root }, () => {
      callbackCalled = true;
    });
    const handler = root.addEventListener.mock.calls[0][1];
    mockEvent.shiftKey = true;
    handler(mockEvent);
    expect(callbackCalled).toBe(false);
  });

  test('options.skipModifierKeys = false does not skip shift key', () => {
    let callbackCalled = false;
    remove = linkHijacker.hijack(
      {
        root,
        skipModifierKeys: false
      },
      () => {
        callbackCalled = true;
      }
    );
    const handler = root.addEventListener.mock.calls[0][1];
    mockEvent.shiftKey = true;
    handler(mockEvent);
    expect(callbackCalled).toBe(true);
  });

  test('skips elements with no link parent', () => {
    let callbackCalled = false;
    remove = linkHijacker.hijack({ root }, () => {
      callbackCalled = true;
    });
    const handler = root.addEventListener.mock.calls[0][1];
    const el = global.document.createElement('div');
    global.document.body.appendChild(el);
    mockEvent.target = el;
    handler(mockEvent);
    expect(callbackCalled).toBe(false);
  });

  test('skips download', () => {
    let callbackCalled = false;
    remove = linkHijacker.hijack({ root }, () => {
      callbackCalled = true;
    });
    const handler = root.addEventListener.mock.calls[0][1];
    link.setAttribute('download', true);
    handler(mockEvent);
    expect(callbackCalled).toBe(false);
  });

  test('options.skipDownload = false does not skip download', () => {
    let callbackCalled = false;
    remove = linkHijacker.hijack(
      {
        root,
        skipDownload: false
      },
      () => {
        callbackCalled = true;
      }
    );
    const handler = root.addEventListener.mock.calls[0][1];
    link.setAttribute('download', true);
    handler(mockEvent);
    expect(callbackCalled).toBe(true);
  });

  test('skips rel="external"', () => {
    let callbackCalled = false;
    remove = linkHijacker.hijack({ root }, () => {
      callbackCalled = true;
    });
    const handler = root.addEventListener.mock.calls[0][1];
    link.setAttribute('rel', 'external');
    handler(mockEvent);
    expect(callbackCalled).toBe(false);
  });

  test('options.skipExternal = false does not skip rel="external"', () => {
    let callbackCalled = false;
    remove = linkHijacker.hijack(
      {
        root,
        skipExternal: false
      },
      () => {
        callbackCalled = true;
      }
    );
    const handler = root.addEventListener.mock.calls[0][1];
    link.setAttribute('rel', 'external');
    handler(mockEvent);
    expect(callbackCalled).toBe(true);
  });

  test('skips target="_blank"', () => {
    let callbackCalled = false;
    remove = linkHijacker.hijack({ root }, () => {
      callbackCalled = true;
    });
    const handler = root.addEventListener.mock.calls[0][1];
    link.setAttribute('target', '_blank');
    handler(mockEvent);
    expect(callbackCalled).toBe(false);
  });

  test('options.skipTargetBlank = false does not skip target="_blank"', () => {
    let callbackCalled = false;
    remove = linkHijacker.hijack(
      {
        root,
        skipTargetBlank: false
      },
      () => {
        callbackCalled = true;
      }
    );
    const handler = root.addEventListener.mock.calls[0][1];
    link.setAttribute('target', '_blank');
    handler(mockEvent);
    expect(callbackCalled).toBe(true);
  });

  test('skips mailto', () => {
    let callbackCalled = false;
    remove = linkHijacker.hijack({ root }, () => {
      callbackCalled = true;
    });
    const handler = root.addEventListener.mock.calls[0][1];
    link.setAttribute('href', 'mailto:fake@gmail.com');
    handler(mockEvent);
    expect(callbackCalled).toBe(false);
  });

  test('options.skipMailTo = false does not skip mailto', () => {
    let callbackCalled = false;
    remove = linkHijacker.hijack(
      {
        root,
        skipMailTo: false
      },
      () => {
        callbackCalled = true;
      }
    );
    const handler = root.addEventListener.mock.calls[0][1];
    link.setAttribute('href', 'mailto:fake@gmail.com');
    handler(mockEvent);
    expect(callbackCalled).toBe(true);
  });

  test('skips links to another host', () => {
    let callbackCalled = false;
    remove = linkHijacker.hijack({ root }, () => {
      callbackCalled = true;
    });
    const handler = root.addEventListener.mock.calls[0][1];
    link.setAttribute('href', 'https://google.com');
    handler(mockEvent);
    expect(callbackCalled).toBe(false);
  });

  test('options.skipFilter', () => {
    let callbackCalled = false;
    remove = linkHijacker.hijack(
      {
        root,
        skipFilter: link => link.hasAttribute('data-no-hijack')
      },
      () => {
        callbackCalled = true;
      }
    );
    const handler = root.addEventListener.mock.calls[0][1];
    link.setAttribute('href', 'about:/path/to/place');
    link.setAttribute('data-no-hijack', '');
    handler(mockEvent);
    expect(callbackCalled).toBe(false);
    link.removeAttribute('data-no-hijack');
    handler(mockEvent);
    expect(callbackCalled).toBe(true);
  });

  test('skips anchor without href', () => {
    let callbackCalled = false;
    remove = linkHijacker.hijack({ root }, () => {
      callbackCalled = true;
    });
    const handler = root.addEventListener.mock.calls[0][1];
    link.removeAttribute('href');
    handler(mockEvent);
    expect(callbackCalled).toBe(false);
  });

  test('skips fragments', () => {
    let callbackCalled = false;
    remove = linkHijacker.hijack({ root }, () => {
      callbackCalled = true;
    });
    const handler = root.addEventListener.mock.calls[0][1];
    link.setAttribute('href', '#foo');
    handler(mockEvent);
    expect(callbackCalled).toBe(false);
  });

  test('does not skip URLs ending with fragments', () => {
    let callbackCalled = false;
    remove = linkHijacker.hijack({ root }, () => {
      callbackCalled = true;
    });
    const handler = root.addEventListener.mock.calls[0][1];
    link.setAttribute('href', '/foo/bar#baz');
    handler(mockEvent);
    expect(callbackCalled).toBe(true);
  });

  test('does not skip URLs ending with slash + fragments', () => {
    let callbackCalled = false;
    remove = linkHijacker.hijack({ root }, () => {
      callbackCalled = true;
    });
    const handler = root.addEventListener.mock.calls[0][1];
    link.setAttribute('href', '/foo/bar/#baz');
    handler(mockEvent);
    expect(callbackCalled).toBe(true);
  });

  test('options.skipFragment', () => {
    let callbackCalled = false;
    remove = linkHijacker.hijack({ root, skipFragment: false }, () => {
      callbackCalled = true;
    });
    const handler = root.addEventListener.mock.calls[0][1];
    link.setAttribute('href', '#foo');
    handler(mockEvent);
    expect(callbackCalled).toBe(true);
  });
});

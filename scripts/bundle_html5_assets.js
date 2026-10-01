const fs = require('fs');
const path = require('path');

const projectRoot = path.resolve(__dirname, '..');
const binDir = path.join(projectRoot, 'export', 'release', 'html5', 'bin');
const textOutputFile = path.join(binDir, 'assets_text.js');
const imageOutputFile = path.join(binDir, 'assets_images.js');
const indexHtmlFile = path.join(binDir, 'index.html');

if (!fs.existsSync(binDir)) {
  console.error('Error: Directory not found: ' + binDir);
  process.exit(1);
}

const textExtensions = ['.json', '.xml', '.txt', '.lua', '.md', '.hx', '.hscript', '.csv', '.tsv'];
const imageExtensions = ['.png', '.jpg', '.jpeg'];

const textAssets = {};
const imageAssets = {};
let textCount = 0;
let textBytes = 0;
let imageCount = 0;
let imageBytes = 0;

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(fullPath);
    } else if (entry.isFile()) {
      if (entry.name === 'assets_text.js' || entry.name === 'assets_images.js' || entry.name === 'HTPsych.js') {
        continue;
      }
      const ext = path.extname(entry.name).toLowerCase();
      const isText = textExtensions.includes(ext);
      const isAssetJs = ext === '.js' && (fullPath.includes(path.sep + 'assets' + path.sep) || fullPath.includes(path.sep + 'mods' + path.sep));
      const isImage = imageExtensions.includes(ext);

      if (isText || isAssetJs) {
        const rel = path.relative(binDir, fullPath).replace(/\\/g, '/');
        const content = fs.readFileSync(fullPath, 'utf8');
        textAssets[rel] = content;
        textCount++;
        textBytes += Buffer.byteLength(content, 'utf8');
      } else if (isImage) {
        const rel = path.relative(binDir, fullPath).replace(/\\/g, '/');
        const buffer = fs.readFileSync(fullPath);
        const mime = ext === '.png' ? 'image/png' : 'image/jpeg';
        imageAssets[rel] = 'data:' + mime + ';base64,' + buffer.toString('base64');
        imageCount++;
        imageBytes += buffer.length;
      }
    }
  }
}

walk(binDir);
console.log(`Bundling ${imageCount} image assets (${(imageBytes / 1024 / 1024).toFixed(2)} MB)...`);
const imagesJsContent = 'window.__EMBEDDED_IMAGES__ = ' + JSON.stringify(imageAssets) + ';\n';
fs.writeFileSync(imageOutputFile, imagesJsContent, 'utf8');
console.log(`Successfully generated ${imageOutputFile} (${(fs.statSync(imageOutputFile).size / 1024 / 1024).toFixed(2)} MB)`);

console.log(`Bundling ${textCount} text assets (${(textBytes / 1024 / 1024).toFixed(2)} MB)...`);

const textJsContent = `// Auto-generated offline asset bundle & HTML5/file:// polyfill
(function() {
  window.__EMBEDDED_ASSETS__ = ${JSON.stringify(textAssets)};

  function cleanUrl(url) {
    if (!url || typeof url !== 'string') return '';
    var clean = url.split('?')[0].split('#')[0];
    clean = clean.replace(/\\\\/g, '/');
    clean = clean.replace(/^[A-Za-z0-9_-]+:/, '');
    clean = clean.replace(/^file:\\/\\/\\/[A-Za-z]:\\/.*?\\/(assets|manifest|mods|flixel)\\//i, '$1/');
    clean = clean.replace(/^file:\\/\\/\\/[A-Za-z]:\\/.*?\\/export\\/release\\/html5\\/bin\\//i, '');
    clean = clean.replace(/^\\.\\//, '').replace(/^\\//, '');
    try { clean = decodeURIComponent(clean); } catch(e) {}
    return clean;
  }

  function findAsset(url) {
    if (!window.__EMBEDDED_ASSETS__) return null;
    var clean = cleanUrl(url);
    if (!clean) return null;

    if (window.__EMBEDDED_ASSETS__.hasOwnProperty(clean)) {
      return window.__EMBEDDED_ASSETS__[clean];
    }
    if (window.__EMBEDDED_ASSETS__.hasOwnProperty('./' + clean)) {
      return window.__EMBEDDED_ASSETS__['./' + clean];
    }
    if (window.__EMBEDDED_ASSETS__.hasOwnProperty('assets/' + clean)) {
      return window.__EMBEDDED_ASSETS__['assets/' + clean];
    }
    if (window.__EMBEDDED_ASSETS__.hasOwnProperty('mods/' + clean)) {
      return window.__EMBEDDED_ASSETS__['mods/' + clean];
    }
    if (clean.startsWith('assets/')) {
      var sharedClean = clean.replace(/^assets\\//, 'assets/shared/');
      if (window.__EMBEDDED_ASSETS__.hasOwnProperty(sharedClean)) {
        return window.__EMBEDDED_ASSETS__[sharedClean];
      }
      var preloadClean = clean.replace(/^assets\\//, 'assets/preload/');
      if (window.__EMBEDDED_ASSETS__.hasOwnProperty(preloadClean)) {
        return window.__EMBEDDED_ASSETS__[preloadClean];
      }
    }
    if (clean.startsWith('assets/shared/')) {
      var unsharedClean = clean.replace(/^assets\\/shared\\//, 'assets/');
      if (window.__EMBEDDED_ASSETS__.hasOwnProperty(unsharedClean)) {
        return window.__EMBEDDED_ASSETS__[unsharedClean];
      }
    }

    var prefixes = ['assets/', 'manifest/', 'mods/', 'flixel/'];
    for (var i = 0; i < prefixes.length; i++) {
      var p = prefixes[i];
      var idx = clean.indexOf(p);
      if (idx !== -1) {
        var sub = clean.substring(idx);
        if (window.__EMBEDDED_ASSETS__.hasOwnProperty(sub)) {
          return window.__EMBEDDED_ASSETS__[sub];
        }
      }
    }

    for (var k in window.__EMBEDDED_ASSETS__) {
      if (k.endsWith('/' + clean) || clean.endsWith('/' + k) || (clean.length > 5 && k.endsWith(clean))) {
        return window.__EMBEDDED_ASSETS__[k];
      }
    }
    return null;
  }

  function findImage(url) {
    if (!window.__EMBEDDED_IMAGES__) return null;
    if (typeof url !== 'string') return null;
    if (url.startsWith('data:') || url.startsWith('blob:')) return url;

    var clean = cleanUrl(url);
    if (!clean) return null;

    if (window.__EMBEDDED_IMAGES__.hasOwnProperty(clean)) {
      return window.__EMBEDDED_IMAGES__[clean];
    }
    if (window.__EMBEDDED_IMAGES__.hasOwnProperty('./' + clean)) {
      return window.__EMBEDDED_IMAGES__['./' + clean];
    }
    if (window.__EMBEDDED_IMAGES__.hasOwnProperty('assets/' + clean)) {
      return window.__EMBEDDED_IMAGES__['assets/' + clean];
    }
    if (window.__EMBEDDED_IMAGES__.hasOwnProperty('mods/' + clean)) {
      return window.__EMBEDDED_IMAGES__['mods/' + clean];
    }
    if (clean.startsWith('assets/')) {
      var sharedClean = clean.replace(/^assets\\//, 'assets/shared/');
      if (window.__EMBEDDED_IMAGES__.hasOwnProperty(sharedClean)) {
        return window.__EMBEDDED_IMAGES__[sharedClean];
      }
      var preloadClean = clean.replace(/^assets\\//, 'assets/preload/');
      if (window.__EMBEDDED_IMAGES__.hasOwnProperty(preloadClean)) {
        return window.__EMBEDDED_IMAGES__[preloadClean];
      }
    }
    if (clean.startsWith('assets/shared/')) {
      var unsharedClean = clean.replace(/^assets\\/shared\\//, 'assets/');
      if (window.__EMBEDDED_IMAGES__.hasOwnProperty(unsharedClean)) {
        return window.__EMBEDDED_IMAGES__[unsharedClean];
      }
    }

    var prefixes = ['assets/', 'mods/', 'flixel/'];
    for (var i = 0; i < prefixes.length; i++) {
      var p = prefixes[i];
      var idx = clean.indexOf(p);
      if (idx !== -1) {
        var sub = clean.substring(idx);
        if (window.__EMBEDDED_IMAGES__.hasOwnProperty(sub)) {
          return window.__EMBEDDED_IMAGES__[sub];
        }
      }
    }

    for (var k in window.__EMBEDDED_IMAGES__) {
      if (clean.endsWith(k) || url.endsWith(k) || k.endsWith('/' + clean) || (clean.length > 5 && k.endsWith(clean))) {
        return window.__EMBEDDED_IMAGES__[k];
      }
    }
    return null;
  }
  window.__findAsset = findAsset;
  window.__findImage = findImage;

  function base64ToArrayBuffer(dataUri) {
    var commaIdx = dataUri.indexOf(',');
    var b64 = commaIdx !== -1 ? dataUri.substring(commaIdx + 1) : dataUri;
    var binStr = atob(b64);
    var len = binStr.length;
    var bytes = new Uint8Array(len);
    for (var i = 0; i < len; i++) {
      bytes[i] = binStr.charCodeAt(i);
    }
    return bytes.buffer;
  }

  // On file:// protocol, suppress setting image.crossOrigin to "Anonymous", which triggers CORS on local images
  if (window.location.protocol === 'file:') {
    try {
      var origDescriptor = Object.getOwnPropertyDescriptor(HTMLImageElement.prototype, 'crossOrigin');
      Object.defineProperty(HTMLImageElement.prototype, 'crossOrigin', {
        configurable: true,
        enumerable: true,
        get: function() {
          return origDescriptor && origDescriptor.get ? origDescriptor.get.call(this) : null;
        },
        set: function(val) {
          // Suppress on file://
        }
      });
    } catch(e) {}

    // Intercept image.src to map to embedded base64 data URIs
    try {
      var origSrcDescriptor = Object.getOwnPropertyDescriptor(HTMLImageElement.prototype, 'src');
      if (origSrcDescriptor && origSrcDescriptor.set) {
        Object.defineProperty(HTMLImageElement.prototype, 'src', {
          configurable: true,
          enumerable: true,
          get: function() {
            return origSrcDescriptor.get ? origSrcDescriptor.get.call(this) : '';
          },
          set: function(val) {
            if (typeof val === 'string' && !val.startsWith('data:') && !val.startsWith('blob:')) {
              var mapped = findImage(val);
              if (mapped) val = mapped;
            }
            return origSrcDescriptor.set.call(this, val);
          }
        });
      }
    } catch(e) {}

    // Catch canvas SecurityError on file://
    try {
      var origGetImageData = CanvasRenderingContext2D.prototype.getImageData;
      CanvasRenderingContext2D.prototype.getImageData = function(sx, sy, sw, sh) {
        try {
          return origGetImageData.apply(this, arguments);
        } catch(e) {
          return this.createImageData(sw, sh);
        }
      };
    } catch(e) {}

    // Catch WebGL texImage2D SecurityError on file://
    var glTypes = [window.WebGLRenderingContext, window.WebGL2RenderingContext];
    for (var g = 0; g < glTypes.length; g++) {
      var GlCls = glTypes[g];
      if (GlCls && GlCls.prototype && GlCls.prototype.texImage2D) {
        (function(origTex) {
          GlCls.prototype.texImage2D = function() {
            try {
              return origTex.apply(this, arguments);
            } catch(err) {
              console.warn('[WebGL] Handled texImage2D error:', err.message);
            }
          };
        })(GlCls.prototype.texImage2D);
      }
    }
  }

  // Hook Lime HTML5HTTPRequest.loadImage
  function hookLime() {
    if (window.$hxClasses && window.$hxClasses["lime._internal.backend.html5.HTML5HTTPRequest"]) {
      var reqCls = window.$hxClasses["lime._internal.backend.html5.HTML5HTTPRequest"];
      if (reqCls && !reqCls.__hookedLoadImage) {
        reqCls.__hookedLoadImage = true;
        var origLoadImage = reqCls.loadImage;
        reqCls.loadImage = function(uri) {
          var mapped = findImage(uri);
          if (mapped) uri = mapped;
          return origLoadImage.call(this, uri);
        };
      }
    }
  }
  function hookOpenFlAssets() {
    if (window.$hxClasses && window.$hxClasses["openfl.utils.Assets"]) {
      var AssetsCls = window.$hxClasses["openfl.utils.Assets"];
      if (!AssetsCls.__hookedEmbedded) {
        AssetsCls.__hookedEmbedded = true;
        var origGetText = AssetsCls.getText;
        AssetsCls.getText = function(id) {
          var found = findAsset(id);
          if (found !== null) return found;
          try {
            return origGetText ? origGetText.call(this, id) : null;
          } catch(e) {
            return null;
          }
        };
        var origExists = AssetsCls.exists;
        AssetsCls.exists = function(id, type) {
          if (findAsset(id) !== null) return true;
          if (findImage(id) !== null) return true;
          try {
            return origExists ? origExists.call(this, id, type) : false;
          } catch(e) {
            return false;
          }
        };
        var origGetBitmapData = AssetsCls.getBitmapData;
        AssetsCls.getBitmapData = function(id, useCache) {
          if (useCache == null) useCache = true;
          if (useCache && AssetsCls.cache && typeof AssetsCls.cache.hasBitmapData === 'function' && AssetsCls.cache.hasBitmapData(id)) {
            return AssetsCls.cache.getBitmapData(id);
          }
          var clean = cleanUrl(id);
          if (useCache && AssetsCls.cache && typeof AssetsCls.cache.hasBitmapData === 'function' && AssetsCls.cache.hasBitmapData(clean)) {
            return AssetsCls.cache.getBitmapData(clean);
          }
          var foundImg = findImage(id);
          if (foundImg) {
            var dataUri = (typeof foundImg === 'string') ? foundImg : (foundImg.src || '');
            var imgEl = new Image();
            imgEl.src = dataUri;
            var ImageCls = window.$hxClasses["lime.graphics.Image"];
            var BitmapDataCls = window.$hxClasses["openfl.display.BitmapData"];
            if (ImageCls && ImageCls.fromImageElement && BitmapDataCls && BitmapDataCls.fromImage) {
              var limeImg = ImageCls.fromImageElement(imgEl);
              if (limeImg) {
                var bmp = BitmapDataCls.fromImage(limeImg);
                if (bmp) {
                  if (useCache && AssetsCls.cache && typeof AssetsCls.cache.setBitmapData === 'function') {
                    AssetsCls.cache.setBitmapData(id, bmp);
                    AssetsCls.cache.setBitmapData(clean, bmp);
                  }
                  return bmp;
                }
              }
            }
          }
          try {
            return origGetBitmapData ? origGetBitmapData.call(this, id, useCache) : null;
          } catch(e) {
            console.warn('[Assets] Could not getBitmapData for:', id);
            return null;
          }
        };
      }
    }
    if (window.$hxClasses && window.$hxClasses["lime.utils.Assets"]) {
      var LimeAssetsCls = window.$hxClasses["lime.utils.Assets"];
      if (!LimeAssetsCls.__hookedEmbedded) {
        LimeAssetsCls.__hookedEmbedded = true;
        var origLimeGetText = LimeAssetsCls.getText;
        LimeAssetsCls.getText = function(id) {
          var found = findAsset(id);
          if (found !== null) return found;
          try {
            return origLimeGetText ? origLimeGetText.call(this, id) : null;
          } catch(e) {
            return null;
          }
        };
        var origLimeExists = LimeAssetsCls.exists;
        LimeAssetsCls.exists = function(id, type) {
          if (findAsset(id) !== null) return true;
          if (findImage(id) !== null) return true;
          try {
            return origLimeExists ? origLimeExists.call(this, id, type) : false;
          } catch(e) {
            return false;
          }
        };
        var origLimeGetImage = LimeAssetsCls.getImage;
        LimeAssetsCls.getImage = function(id, useCache) {
          var foundImg = findImage(id);
          if (foundImg) {
            var dataUri = (typeof foundImg === 'string') ? foundImg : (foundImg.src || '');
            var imgEl = new Image();
            imgEl.src = dataUri;
            var ImageCls = window.$hxClasses["lime.graphics.Image"];
            if (ImageCls && ImageCls.fromImageElement) {
              var limeImg = ImageCls.fromImageElement(imgEl);
              if (limeImg) return limeImg;
            }
          }
          try {
            return origLimeGetImage ? origLimeGetImage.call(this, id, useCache) : null;
          } catch(e) {
            console.warn('[LimeAssets] Could not getImage for:', id);
            return null;
          }
        };
      }
    }
  }
  function hookFlxMouse() {
    if (window.$hxClasses && window.$hxClasses["flixel.input.mouse.FlxMouse"]) {
      var MouseCls = window.$hxClasses["flixel.input.mouse.FlxMouse"];
      if (MouseCls && MouseCls.prototype && !MouseCls.prototype.__hookedGetWorldPos) {
        MouseCls.prototype.__hookedGetWorldPos = true;
        var origGetWorldPos = MouseCls.prototype.getWorldPosition;
        MouseCls.prototype.getWorldPosition = function(Camera, point) {
          if (!Camera) {
            var FlxG = window.$hxClasses["flixel.FlxG"];
            Camera = (FlxG && FlxG.camera) ? FlxG.camera : ((FlxG && FlxG.cameras && FlxG.cameras.list) ? FlxG.cameras.list[0] : null);
          }
          if (!Camera) {
            if (!point) {
              var FlxPoint = window.$hxClasses["flixel.math.FlxPoint"];
              return FlxPoint ? FlxPoint.get(0, 0) : { x: 0, y: 0 };
            }
            point.x = 0;
            point.y = 0;
            return point;
          }
          return origGetWorldPos.call(this, Camera, point);
        };
      }
    }
  }
  hookLime();
  hookOpenFlAssets();
  hookFlxMouse();
  var assetHookInterval = setInterval(function() {
    hookLime();
    hookOpenFlAssets();
    hookFlxMouse();
    if (window.$hxClasses && window.$hxClasses["openfl.utils.Assets"] && window.$hxClasses["openfl.utils.Assets"].__hookedEmbedded &&
        window.$hxClasses["lime._internal.backend.html5.HTML5HTTPRequest"] && window.$hxClasses["lime._internal.backend.html5.HTML5HTTPRequest"].__hookedLoadImage) {
      clearInterval(assetHookInterval);
    }
  }, 20);


  // Auto-initialize Fengari JS library into any luaState
  function patchFengari() {
    var feng = window.fengari;
    if (feng && !feng.__patchedJsLib) {
      feng.__patchedJsLib = true;
      if (feng.lualib && feng.lualib.luaL_openlibs) {
        var origOpenLibs = feng.lualib.luaL_openlibs;
        feng.lualib.luaL_openlibs = function(L) {
          origOpenLibs(L);
          try {
            feng.lauxlib.luaL_requiref(L, feng.to_luastring('js'), feng.interop.luaopen_js, 1);
            feng.lua.lua_pop(L, 1);
          } catch(e) {
            console.warn('[Fengari] Failed to auto-open js lib in luaState:', e);
          }
        };
      }
      if (feng.interop && feng.interop.push) {
        var origPush = feng.interop.push;
        feng.interop.push = function(L, val) {
          try {
            return origPush(L, val);
          } catch(err) {
            if (err && typeof err.message === 'string' && err.message.includes('js library not loaded')) {
              try {
                feng.lauxlib.luaL_requiref(L, feng.to_luastring('js'), feng.interop.luaopen_js, 1);
                feng.lua.lua_pop(L, 1);
                return origPush(L, val);
              } catch(e2) {
                console.warn('[Fengari] Fallback require js failed:', e2);
              }
            }
            throw err;
          }
        };
      }
      if (feng.to_jsstring) {
        var origToJsstring = feng.to_jsstring;
        feng.to_jsstring = function(u8) {
          if (u8 === null || u8 === undefined) return '';
          if (typeof u8 === 'string') return u8;
          if (u8 instanceof Uint8Array || (u8 && u8.constructor && u8.constructor.name === 'Uint8Array')) {
            try {
              return origToJsstring(u8);
            } catch(e) {
              return '';
            }
          }
          return String(u8);
        };
      }
      if (feng.lauxlib) {
        if (feng.lauxlib.luaL_dostring) {
          var origDoString = feng.lauxlib.luaL_dostring;
          feng.lauxlib.luaL_dostring = function(L, str) {
            if (typeof str === 'string') {
              str = feng.to_luastring(str);
            }
            return origDoString.call(this, L, str);
          };
        }
        if (feng.lauxlib.luaL_loadstring) {
          var origLoadString = feng.lauxlib.luaL_loadstring;
          feng.lauxlib.luaL_loadstring = function(L, str) {
            if (typeof str === 'string') {
              str = feng.to_luastring(str);
            }
            return origLoadString.call(this, L, str);
          };
        }
      }
    }
  }
  patchFengari();
  if (!window.fengari || !window.fengari.__patchedJsLib) {
    var fengInterval = setInterval(function() {
      patchFengari();
      if (window.fengari && window.fengari.__patchedJsLib) {
        clearInterval(fengInterval);
      }
    }, 20);
  }

  // Optimize Howler HTML5 audio pool to prevent pool exhaustion warnings
  var origHowler = window.Howler;
  function patchHowler(h) {
    if (h && typeof h === 'object') {
      h.html5PoolSize = 500;
      if (typeof h._obtainHtml5Audio === 'function') {
        h._obtainHtml5Audio = function() {
          var e = this;
          if (e._html5AudioPool && e._html5AudioPool.length) {
            return e._html5AudioPool.pop();
          }
          var a = new Audio();
          a._unlocked = true;
          return a;
        };
      }
    }
  }
  patchHowler(origHowler);
  try {
    Object.defineProperty(window, 'Howler', {
      configurable: true,
      enumerable: true,
      get: function() { return origHowler; },
      set: function(val) {
        origHowler = val;
        patchHowler(val);
      }
    });
  } catch(e) {}

  // Unlock audio gesture on first user interaction
  function unlockAudio() {
    try {
      if (window.Howler) {
        if (window.Howler.ctx && window.Howler.ctx.state === 'suspended') {
          window.Howler.ctx.resume();
        }
        window.Howler._autoUnlock = false;
        if (typeof window.Howler._unlockAudio === 'function') {
          window.Howler._unlockAudio();
        }
      }
    } catch(e) {}
    var el = document.getElementById('audio-unlock-overlay');
    if (el) el.style.display = 'none';
  }

  ['click', 'touchstart', 'touchend', 'keydown', 'mousedown'].forEach(function(evt) {
    window.addEventListener(evt, unlockAudio, { once: false, passive: true });
  });

  // Intercept XMLHttpRequest
  var RealXHR = window.XMLHttpRequest;
  var origOpen = RealXHR.prototype.open;
  var origSend = RealXHR.prototype.send;
  var origSetRequestHeader = RealXHR.prototype.setRequestHeader;
  var origOverrideMimeType = RealXHR.prototype.overrideMimeType;

  RealXHR.prototype.open = function(method, url, async, user, password) {
    this.__url = url;
    this.__method = method;
    return origOpen.apply(this, arguments);
  };

  RealXHR.prototype.setRequestHeader = function(header, value) {
    if (origSetRequestHeader) {
      try { origSetRequestHeader.apply(this, arguments); } catch(e) {}
    }
  };

  RealXHR.prototype.overrideMimeType = function(mime) {
    if (origOverrideMimeType) {
      try { origOverrideMimeType.apply(this, arguments); } catch(e) {}
    }
  };

  RealXHR.prototype.send = function(body) {
    // 1. Check embedded text/json assets
    var content = findAsset(this.__url);
    if (content !== null) {
      var self = this;
      setTimeout(function() {
        Object.defineProperty(self, 'readyState', { value: 4, writable: true, configurable: true });
        Object.defineProperty(self, 'status', { value: 200, writable: true, configurable: true });
        Object.defineProperty(self, 'statusText', { value: 'OK', writable: true, configurable: true });
        Object.defineProperty(self, 'responseText', { value: content, writable: true, configurable: true });

        var resp = content;
        if (self.responseType === 'arraybuffer') {
          resp = (new TextEncoder().encode(content)).buffer;
        } else if (self.responseType === 'json') {
          try { resp = JSON.parse(content); } catch(e) { resp = null; }
        }
        Object.defineProperty(self, 'response', { value: resp, writable: true, configurable: true });

        if (typeof self.onreadystatechange === 'function') {
          try { self.onreadystatechange.call(self, new Event('readystatechange')); } catch(e) { console.error(e); }
        } else {
          try { self.dispatchEvent(new Event('readystatechange')); } catch(e) {}
        }

        if (typeof self.onload === 'function') {
          try { self.onload.call(self, new Event('load')); } catch(e) { console.error(e); }
        } else {
          try { self.dispatchEvent(new Event('load')); } catch(e) {}
        }

        if (typeof self.onloadend === 'function') {
          try { self.onloadend.call(self, new Event('loadend')); } catch(e) { console.error(e); }
        } else {
          try { self.dispatchEvent(new Event('loadend')); } catch(e) {}
        }
      }, 0);
      return;
    }

    // 2. Check embedded image assets
    var imgData = findImage(this.__url);
    if (imgData !== null) {
      var self = this;
      setTimeout(function() {
        Object.defineProperty(self, 'readyState', { value: 4, writable: true, configurable: true });
        Object.defineProperty(self, 'status', { value: 200, writable: true, configurable: true });
        Object.defineProperty(self, 'statusText', { value: 'OK', writable: true, configurable: true });

        var ab = base64ToArrayBuffer(imgData);
        var resp = ab;
        if (self.responseType === 'blob') {
          var mime = imgData.startsWith('data:image/jpeg') ? 'image/jpeg' : 'image/png';
          resp = new Blob([ab], { type: mime });
        } else if (self.responseType === 'text' || !self.responseType) {
          resp = imgData;
        }
        Object.defineProperty(self, 'response', { value: resp, writable: true, configurable: true });
        Object.defineProperty(self, 'responseText', { value: typeof resp === 'string' ? resp : '', writable: true, configurable: true });

        if (typeof self.onreadystatechange === 'function') {
          try { self.onreadystatechange.call(self, new Event('readystatechange')); } catch(e) { console.error(e); }
        } else {
          try { self.dispatchEvent(new Event('readystatechange')); } catch(e) {}
        }

        if (typeof self.onload === 'function') {
          try { self.onload.call(self, new Event('load')); } catch(e) { console.error(e); }
        } else {
          try { self.dispatchEvent(new Event('load')); } catch(e) {}
        }

        if (typeof self.onloadend === 'function') {
          try { self.onloadend.call(self, new Event('loadend')); } catch(e) { console.error(e); }
        } else {
          try { self.dispatchEvent(new Event('loadend')); } catch(e) {}
        }
      }, 0);
      return;
    }

    return origSend.apply(this, arguments);
  };

  // Intercept fetch
  if (typeof window.fetch === 'function') {
    var origFetch = window.fetch;
    window.fetch = function(input, init) {
      var url = typeof input === 'string' ? input : (input && input.url ? input.url : '');
      var content = findAsset(url);
      if (content !== null) {
        return Promise.resolve(new Response(content, {
          status: 200,
          statusText: 'OK',
          headers: { 'Content-Type': 'text/plain; charset=utf-8' }
        }));
      }
      var imgData = findImage(url);
      if (imgData !== null) {
        var ab = base64ToArrayBuffer(imgData);
        var mime = imgData.startsWith('data:image/jpeg') ? 'image/jpeg' : 'image/png';
        return Promise.resolve(new Response(ab, {
          status: 200,
          statusText: 'OK',
          headers: { 'Content-Type': mime }
        }));
      }
      return origFetch.apply(this, arguments);
    };
  }
})();
`;

fs.writeFileSync(textOutputFile, textJsContent, 'utf8');
console.log(`Successfully generated ${textOutputFile} (${(fs.statSync(textOutputFile).size / 1024 / 1024).toFixed(2)} MB)`);

// Patch index.html if needed
if (fs.existsSync(indexHtmlFile)) {
  let html = fs.readFileSync(indexHtmlFile, 'utf8');
  let changed = false;

  if (!html.includes('assets_images.js')) {
    html = html.replace('<script type="text/javascript" src="./assets_text.js"></script>', '<script type="text/javascript" src="./assets_images.js"></script>\n\t<script type="text/javascript" src="./assets_text.js"></script>');
    changed = true;
  }

  if (!html.includes('assets_text.js')) {
    html = html.replace('<script type="text/javascript" src="./HTPsych.js"></script>', '<script type="text/javascript" src="./assets_text.js"></script>\n\t<script type="text/javascript" src="./HTPsych.js"></script>');
    changed = true;
  }

  if (!html.includes('audio-unlock-overlay')) {
    const overlay = `\t<div id="audio-unlock-overlay" style="position:fixed;top:12px;left:50%;transform:translateX(-50%);background:rgba(20,20,30,0.9);color:#ffcc00;padding:8px 18px;border-radius:20px;font-family:sans-serif;font-size:14px;border:1px solid #ffcc00;cursor:pointer;z-index:9999;user-select:none;box-shadow:0 4px 12px rgba(0,0,0,0.6);" onclick="this.style.display='none'">
\t\t&#128266; Click anywhere to enable sound
\t</div>\n`;
    html = html.replace('<div id="openfl-content"></div>', '<div id="openfl-content"></div>\n' + overlay);
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(indexHtmlFile, html, 'utf8');
    console.log('Successfully patched index.html');
  }
}

// Patch HTPsych.js if needed
const htpsychFile = path.join(binDir, 'HTPsych.js');
if (fs.existsSync(htpsychFile)) {
  let js = fs.readFileSync(htpsychFile, 'utf8');
  let changed = false;

  // 1. Expose $hxClasses globally
  if (!js.includes('$global.$hxClasses =')) {
    js = js.replace('var $hxClasses = {},', 'var $hxClasses = $global.$hxClasses = {},');
    changed = true;
  }

  // 2. Make lime_media_AudioBuffer.fromFile preload immediately
  if (js.includes('html5 : true, preload : false')) {
    js = js.replace(/html5 : true, preload : false/g, 'html5 : true, preload : true');
    changed = true;
  }

  // 3. Fix FlxSound.init endTime when length is 0
  if (js.includes('this.endTime = this._length;')) {
    js = js.replace('this.endTime = this._length;', 'this.endTime = this._length > 0 ? this._length : null;');
    changed = true;
  }

  // 4. Define dynamic length, getters, and seamless pause/resume/seek on flixel_sound_FlxSound.prototype
  const hookMarker = 'var flixel_sound_FlxSoundGroup = function';
  const flxSoundPatch = `
if (typeof flixel_sound_FlxSound !== 'undefined' && flixel_sound_FlxSound.prototype && !flixel_sound_FlxSound.prototype.__flxSoundSyncedPatched) {
  flixel_sound_FlxSound.prototype.__flxSoundSyncedPatched = true;
  flixel_sound_FlxSound.prototype.__dynamicLengthPatched = true;
  Object.defineProperty(flixel_sound_FlxSound.prototype, '_length', {
    configurable: true,
    enumerable: true,
    get: function() {
      if ((!this.__rawLength || this.__rawLength <= 0) && this._sound != null) {
        var l = this._sound.get_length();
        if (l > 0) {
          this.__rawLength = l;
          if (this.endTime === 0 || this.endTime == null) {
            this.endTime = l;
          }
        }
      }
      return this.__rawLength || 0;
    },
    set: function(val) {
      this.__rawLength = val;
    }
  });
  Object.defineProperty(flixel_sound_FlxSound.prototype, 'length', {
    configurable: true,
    enumerable: true,
    get: function() {
      return this._length;
    }
  });
  flixel_sound_FlxSound.prototype.get_length = function() {
    return this._length;
  };

  // Safe playing getter: true only if channel exists and not paused
  flixel_sound_FlxSound.prototype.get_playing = function() {
    return this._channel != null && !this._paused;
  };
  Object.defineProperty(flixel_sound_FlxSound.prototype, 'playing', {
    configurable: true,
    enumerable: true,
    get: function() {
      return this.get_playing();
    }
  });

  // Non-destructive pause: pauses Howler and audio nodes without destroying channel or resetting currentTime
  flixel_sound_FlxSound.prototype.pause = function() {
    if (this._channel == null) return this;
    try {
      this._time = this._channel.get_position();
    } catch(e) {}
    this._paused = true;
    if (this._sound && this._sound.__buffer && this._sound.__buffer.__srcHowl) {
      var h = this._sound.__buffer.__srcHowl;
      var soundId = (this._channel && this._channel.__audioSource && this._channel.__audioSource.__backend) ? this._channel.__audioSource.__backend.id : -1;
      if (soundId !== -1) {
        try { h.pause(soundId); } catch(e) {}
        try {
          var s = h._soundById(soundId);
          if (s && s._node) {
            s._node.pause();
          }
        } catch(e) {}
      } else {
        try { h.pause(); } catch(e) {}
      }
    }
    return this;
  };

  // Seamless resume/play: unpauses existing channel if paused, without destroying/re-creating
  var origFlxSoundPlay = flixel_sound_FlxSound.prototype.play;
  flixel_sound_FlxSound.prototype.play = function(ForceRestart, StartTime, EndTime) {
    if (StartTime == null) StartTime = 0.0;
    if (ForceRestart == null) ForceRestart = false;
    if (!this.exists) return this;

    if (ForceRestart) {
      this.cleanup(false, true);
    }

    if (this._channel != null && !this._paused && !ForceRestart) {
      return this;
    }

    if (this._paused && this._channel != null && !ForceRestart) {
      this._paused = false;
      if (this._sound && this._sound.__buffer && this._sound.__buffer.__srcHowl) {
        var h = this._sound.__buffer.__srcHowl;
        var soundId = (this._channel && this._channel.__audioSource && this._channel.__audioSource.__backend) ? this._channel.__audioSource.__backend.id : -1;
        if (soundId !== -1) {
          try { h.play(soundId); } catch(e) {}
          try { h.volume(this.volume, soundId); } catch(e) {}
          try {
            var s = h._soundById(soundId);
            if (s && s._node) {
              s._node.volume = this.volume;
              if (s._node.paused) {
                s._node.play();
              }
            }
          } catch(e) {}
        } else {
          try { h.play(); } catch(e) {}
        }
      }
      this.endTime = EndTime;
      return this;
    }

    var res = origFlxSoundPlay.call(this, ForceRestart, StartTime, EndTime);
    if (this._sound && this._sound.__buffer && this._sound.__buffer.__srcHowl) {
      var h = this._sound.__buffer.__srcHowl;
      var soundId = (this._channel && this._channel.__audioSource && this._channel.__audioSource.__backend) ? this._channel.__audioSource.__backend.id : -1;
      if (soundId !== -1) {
        try { h.volume(this.volume, soundId); } catch(e) {}
        try {
          var s = h._soundById(soundId);
          if (s && s._node) {
            s._node.volume = this.volume;
            if (s._node.paused) {
              s._node.play();
            }
          }
        } catch(e) {}
      }
    }
    return res;
  };

  flixel_sound_FlxSound.prototype.resume = function() {
    if (this._paused) {
      this.play();
    }
    return this;
  };

  // Seamless set_time: seeks Howl and audio elements without destroying channel
  var origFlxSoundSetTime = flixel_sound_FlxSound.prototype.set_time;
  flixel_sound_FlxSound.prototype.set_time = function(time) {
    this._time = time;
    if (this._channel != null && this._sound && this._sound.__buffer && this._sound.__buffer.__srcHowl) {
      var h = this._sound.__buffer.__srcHowl;
      var sec = Math.max(0, time / 1000);
      var chan = this._channel;
      if (chan && chan.__audioSource) {
        chan.__audioSource.offset = time | 0;
        if (chan.__audioSource.__backend && chan.__audioSource.__backend.id !== -1) {
          var soundId = chan.__audioSource.__backend.id;
          try {
            h.seek(sec, soundId);
          } catch(e) {}
          try {
            var s = h._soundById(soundId);
            if (s && s._node) {
              s._node.currentTime = sec;
            }
          } catch(e) {}
          return time;
        }
      }
      try {
        h.seek(sec);
      } catch(e) {}
      return time;
    }
    return origFlxSoundSetTime.call(this, time);
  };

  var origFlxSoundStop = flixel_sound_FlxSound.prototype.stop;
  flixel_sound_FlxSound.prototype.stop = function() {
    this._paused = false;
    return origFlxSoundStop.call(this);
  };

  var origFlxSoundSetVolume = flixel_sound_FlxSound.prototype.set_volume;
  flixel_sound_FlxSound.prototype.set_volume = function(Volume) {
    var res = origFlxSoundSetVolume.call(this, Volume);
    if (this._sound && this._sound.__buffer && this._sound.__buffer.__srcHowl) {
      var h = this._sound.__buffer.__srcHowl;
      try { h.volume(Volume); } catch(e) {}
      if (h._sounds) {
        for (var i = 0; i < h._sounds.length; i++) {
          var s = h._sounds[i];
          if (s && s._node) {
            try { s._node.volume = Volume; } catch(e) {}
          }
        }
      }
    }
    return res;
  };
}
`;
  if (!js.includes('__flxSoundSyncedPatched') && js.includes(hookMarker)) {
    js = js.replace(hookMarker, flxSoundPatch + '\n' + hookMarker);
    changed = true;
  }

  // 5. Patch flixel_input_FlxPointer to prevent null camera / null camera.scroll crash
  const pointerMarker = 'var flixel_input_IFlxInputManager = function';
  const pointerPatch = `
if (typeof flixel_input_FlxPointer !== 'undefined' && flixel_input_FlxPointer.prototype && !flixel_input_FlxPointer.prototype.__nullSafePatched) {
  flixel_input_FlxPointer.prototype.__nullSafePatched = true;
  var origGetWorldPosition = flixel_input_FlxPointer.prototype.getWorldPosition;
  flixel_input_FlxPointer.prototype.getWorldPosition = function(Camera, point) {
    if (Camera == null) Camera = flixel_FlxG.camera;
    if (Camera == null || Camera.scroll == null) {
      if (point == null) {
        var p = flixel_math_FlxBasePoint.pool.get().set(0, 0);
        p._inPool = false;
        point = p;
      }
      point.set_x(this.screenX || 0);
      point.set_y(this.screenY || 0);
      return point;
    }
    return origGetWorldPosition.call(this, Camera, point);
  };
  var origGetScreenPosition = flixel_input_FlxPointer.prototype.getScreenPosition;
  flixel_input_FlxPointer.prototype.getScreenPosition = function(Camera, point) {
    if (Camera == null) Camera = flixel_FlxG.camera;
    if (Camera == null) {
      if (point == null) {
        var p = flixel_math_FlxBasePoint.pool.get().set(0, 0);
        p._inPool = false;
        point = p;
      }
      point.set_x(this._globalScreenX || 0);
      point.set_y(this._globalScreenY || 0);
      return point;
    }
    return origGetScreenPosition.call(this, Camera, point);
  };
}
`;
  if (!js.includes('__nullSafePatched') && js.includes(pointerMarker)) {
    js = js.replace(pointerMarker, pointerPatch + '\n' + pointerMarker);
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(htpsychFile, js, 'utf8');
    console.log('Successfully patched HTPsych.js (FlxSound dynamic length, FlxPointer null-safety, AudioBuffer preload, global $hxClasses)');
  }
}

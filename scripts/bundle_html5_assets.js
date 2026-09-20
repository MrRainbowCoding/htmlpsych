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
      if (clean.endsWith(k) || url.endsWith(k)) {
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
  hookLime();
  var hookTimer = setInterval(function() {
    hookLime();
    if (window.$hxClasses && window.$hxClasses["lime._internal.backend.html5.HTML5HTTPRequest"] && window.$hxClasses["lime._internal.backend.html5.HTML5HTTPRequest"].__hookedLoadImage) {
      clearInterval(hookTimer);
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

  // 4. Define dynamic _length and length getters on flixel_sound_FlxSound.prototype
  const hookMarker = 'var flixel_sound_FlxSoundGroup = function';
  const flxSoundPatch = `
if (typeof flixel_sound_FlxSound !== 'undefined' && flixel_sound_FlxSound.prototype && !flixel_sound_FlxSound.prototype.__dynamicLengthPatched) {
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
}
`;
  if (!js.includes('__dynamicLengthPatched') && js.includes(hookMarker)) {
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

# Friday Night Funkin' - HTML Psych Engine
Modified version of Psych Engine Extra with HTML5 support!

## Credits:
* Starmapo - PE Extra Programmer and Artist
* Mr. Rainbow - HTML Psych Creator

## Special Thanks:
* KadeDev & GitHub Contributors - Made Kade Engine (some code and ideas are from there)
* Leather128 & GitHub Contributors - Made Leather Engine (some code and ideas are from there)
* srPerez - Made VS Shaggy & the original 6K+ notes

## Psych Engine Credits:
* Shadow Mario - Programmer
* RiverOaken - Artist
* Yoshubs - Assistant Programmer

### Psych Engine Special Thanks:
* bbpanzu - Ex-Programmer
* SqirraRNG - Crash Handler and Base code for Chart Editor's Waveform
* KadeDev - Fixed some cool stuff on Chart Editor and other PRs
* iFlicky - Composer of Psync and Tea Time, also made the Dialogue Sounds
* PolybiusProxy - Video Loader Library (hxCodec)
* Keoiki - Note Splash Animations
* Smokey - Sprite Atlas Support
* Nebula the Zorua - LUA JIT Fork and some Lua reworks
_____________________________________

# New Features (from OG Psych Engine)
* Custom key amounts (currently 1K to 13K)
* Custom time signatures (1-100/1-64)
* Hscript compatibility
* Custom UI skins (custom rating sprites, countdown sprites, etc.)
* Character groups (more than one Boyfriend, opponent, or Girlfriend)
* Separate voices for the player and the opponent (by adding a 'VoicesOpponent' or 'VoicesDad' file)
* Gameplay Changers: Play as the opponent, change song (not chart, SONG) speed, demo mode (showcase gameplay)
* Go to options menu from the pause menu (and go right back to game after you're done!)


# New Options
* Note underlays
* Instant restart after dying
* Show number of ratings (sicks, goods, etc.)
* "Crappy" quality option (no stage)
* Toggle autopause when not focused on the game
* "Shit" counting as a miss
* Smooth health bar
* Save Data menu where you can clear your save data

# Minor Touches
* Camera bump in Freeplay (from @Stilic)
* Difficulty dropdown in charting menu (from @CerBor)
_____________________________________

## Build and Setup Instructions

### Automated Setup (Recommended on Windows)
Simply run the setup script:
```bat
setup\installLibs.bat
```
This automatically installs Git, Haxe, Node.js (via WinGet), sets up HaxeFlixel 5.6.1, Lime, OpenFL, and installs all required libraries (`flixel-addons`, `flixel-ui`, `flixel-tools`, `hscript`, `hscript-ex`, `discord_rpc`, `linc_luajit`, `hxCodec`).

---

### Manual Setup
If you prefer manual setup:
1. [Install Haxe](https://haxe.org/download/) (Haxe 4.2+ recommended).
2. Install [Git](https://git-scm.com/downloads).
3. Install [Node.js](https://nodejs.org/) (needed for bundling offline HTML5 assets & Lua scripts).
4. Run the following commands in your terminal:
   ```bash
   haxelib install lime
   haxelib install openfl
   haxelib install flixel 5.6.1
   haxelib run lime setup flixel
   haxelib run lime setup
   haxelib install flixel-tools
   haxelib run flixel-tools setup
   haxelib install flixel-addons
   haxelib install flixel-ui
   haxelib install hscript
   haxelib install hxCodec
   haxelib git hscript-ex https://github.com/ianharrigan/hscript-ex
   haxelib git discord_rpc https://github.com/Aidan63/linc_discord-rpc
   haxelib git linc_luajit https://github.com/nebulazorua/linc_luajit
   ```

---

### Compiling and Playing

#### HTML5 (Web & Offline Standalone)
Compiling to HTML5 supports full Lua scripting, modpacks, and offline local file execution:
1. **Compile HTML5 build:**
   ```bash
   lime build html5
   ```
   *(For debug mode: `lime build html5 -debug`)*

2. **Bundle Assets and Offline Lua Engine:**
   ```bash
   node scripts/bundle_html5_assets.js
   ```
   This bundles all game and mod assets (audio, JSON charts, character configs, sprites, and Lua scripts) into an offline-compatible package powered by Fengari Web Lua.

3. **Play:**
   - Double-click `Play-HTML5.bat` in the project root, or
   - Directly open `export/release/html5/bin/index.html` in any modern web browser.

#### Desktop (Windows, Mac, Linux)
- **Windows:**
  Install [Visual Studio Community](https://visualstudio.microsoft.com/downloads/) with *MSVC v142 C++ build tools* and *Windows 10 SDK*. Then run:
  ```bash
  lime test windows
  ```
- **Mac:**
  Install Xcode, then run `lime test mac`.
- **Linux:**
  Run `lime test linux`.
- **32-Bit Build:**
  Add `-32 -D 32bits` (e.g. `lime test windows -32 -D 32bits`).

package;

using StringTools;

class LuaToHscript {
    public static function convert(luaCode:String):String {
        if (luaCode == null || luaCode.trim().length == 0) return "";

        var hscript = luaCode;

        // 1. Convert comments (-- comment -> // comment)
        var commentRegex = new EReg("--(.*)", "g");
        hscript = commentRegex.replace(hscript, "//$1");

        // 2. Fix local functions (local function name() -> function name())
        // If left as 'var function', hscript throws an 'Unexpected token: function' panic
        var localFuncRegex = new EReg("local\\s+function\\s+", "g");
        hscript = localFuncRegex.replace(hscript, "function ");

        // 3. Convert standard loose variable declarations (local myVar -> var myVar)
        var varRegex = new EReg("local\\s+", "g");
        hscript = varRegex.replace(hscript, "var ");

        // 4. Translate function blocks safely (function onCreate() -> function onCreate() {)
        var funcRegex = new EReg("function\\s+([a-zA-Z0-9_]+)\\s*\\((.*)\\)", "g");
        hscript = funcRegex.replace(hscript, "function $1($2) {");

        // 5. Fix structure closures (end -> })
        var endRegex = new EReg("\\bend\\b", "g");
        hscript = endRegex.replace(hscript, "}");

        // 6. Handle Lua table assignments/dictionaries to loose dynamic objects ({ ['key'] = val } -> { key : val })
        var tableKeyRegex = new EReg("\\[['\"]([a-zA-Z0-9_]+)['\"]\\]\\s*=", "g");
        hscript = tableKeyRegex.replace(hscript, "$1 :");

        // 7. Prevent Lua boolean string errors (Lua allows loose string evaluations sometimes)
        hscript = hscript.replace("then", ""); // Strip out Lua's 'then' keyword safely

        return hscript;
    }
}

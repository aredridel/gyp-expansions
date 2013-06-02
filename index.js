var ometajs_ = require("ometajs");

var AbstractGrammar = ometajs_.grammars.AbstractGrammar;

var BSJSParser = ometajs_.grammars.BSJSParser;

var BSJSIdentity = ometajs_.grammars.BSJSIdentity;

var BSJSTranslator = ometajs_.grammars.BSJSTranslator;

function h() {
    console.log("!");
    return true;
}

var Expansion = function Expansion(source, opts) {
    AbstractGrammar.call(this, source, opts);
};

Expansion.grammarName = "Expansion";

Expansion.match = AbstractGrammar.match;

Expansion.matchAll = AbstractGrammar.matchAll;

exports.Expansion = Expansion;

require("util").inherits(Expansion, AbstractGrammar);

Expansion.prototype["flag"] = function $flag() {
    return this._atomic(function() {
        return this._match("<") && function() {
            return this._options.phase == "pre";
        }.call(this);
    }) || this._atomic(function() {
        return this._match(">") && function() {
            return this._options.phase == "post";
        }.call(this);
    });
};

Expansion.prototype["ref"] = function $ref() {
    return this._atomic(function() {
        var c;
        return this._rule("flag", false, [], null, this["flag"]) && (this._match("@") || this._atomic(function() {
            return this._rule("empty", false, [], null, this["empty"]);
        })) && this._match("(") && this._any(function() {
            return this._atomic(function() {
                return !this._atomic(function() {
                    return this._match(")");
                }, true) && this._rule("char", false, [], null, this["char"]);
            });
        }) && (c = this._getIntermediate(), true) && this._match(")") && this._exec(this._options.variables[c.join("")]);
    }) || this._atomic(function() {
        var c;
        return (this._atomic(function() {
            return this._rule("flag", false, [], null, this["flag"]);
        }) || this._atomic(function() {
            return this._rule("empty", false, [], null, this["empty"]);
        })) && this._match("!") && (this._match("@") || this._atomic(function() {
            return this._rule("empty", false, [], null, this["empty"]);
        })) && this._match("(") && this._rule("command", false, [], null, this["command"]) && (c = this._getIntermediate(), 
        true) && this._match(")") && this._exec([ "command", c ]);
    });
};

Expansion.prototype["command"] = function $command() {
    return this._atomic(function() {
        var a;
        return this._match("[") && this._rule("arguments", false, [], null, this["arguments"]) && (a = this._getIntermediate(), 
        true) && this._match("]") && this._exec(a);
    }) || this._atomic(function() {
        var s;
        return this._rule("stringInside", false, [], null, this["stringInside"]) && (s = this._getIntermediate(), 
        true) && this._exec(s);
    });
};

Expansion.prototype["arguments"] = function $arguments() {
    return this._rule("listOf", false, [ "string", "," ], null, this["listOf"]);
};

Expansion.prototype["string"] = function $string() {
    return this._atomic(function() {
        var c;
        return this._match('"') && this._any(function() {
            return this._atomic(function() {
                return this._rule("stringInside", false, [ '"' ], null, this["stringInside"]);
            });
        }) && (c = this._getIntermediate(), true) && this._match('"') && this._exec(c.join(""));
    }) || this._atomic(function() {
        var c;
        return this._match("'") && this._any(function() {
            return this._atomic(function() {
                return this._rule("stringInside", false, [ "'" ], null, this["stringInside"]);
            });
        }) && (c = this._getIntermediate(), true) && this._match("'") && this._exec(c.join(""));
    });
};

Expansion.prototype["stringInside"] = function $stringInside() {
    var x;
    return this._skip() && (x = this._getIntermediate(), true) && (this._atomic(function() {
        var r;
        return this._rule("ref", false, [], null, this["ref"]) && (r = this._getIntermediate(), 
        true) && this._exec(r);
    }) || this._atomic(function() {
        var y;
        return this._match("\\") && this._rule("char", false, [], null, this["char"]) && (y = this._getIntermediate(), 
        true) && this._exec(y);
    }) || this._atomic(function() {
        var c;
        return this._atomic(function() {
            return !this._atomic(function() {
                return this._rule("token", true, [ x ], null, this["token"]);
            }, true) && this._rule("char", false, [], null, this["char"]);
        }) && (c = this._getIntermediate(), true) && this._exec(c);
    }));
};

Expansion.prototype["stringRaw"] = function $stringRaw() {
    var c;
    return this._any(function() {
        return this._atomic(function() {
            return this._rule("stringInside", false, [ "" ], null, this["stringInside"]);
        });
    }) && (c = this._getIntermediate(), true) && this._exec(c.join(""));
};

var expansions = module.exports = {
    parser: Expansion,
    expandString: function(s, variables, which) {
        return Expansion.matchAll(s, "stringRaw", {
            variables: variables,
            phase: which
        });
    },
    expandArray: function(a, variables, which) {
        var re = which == "pre" ? /^<@\((.*)\)$/ : /^>@\((.*)\)$/;
        var out = [];
        var m;
        for (var i = 0; i < a.length; i++) {
            if (m = re.exec(a[i])) {
                if (Array.isArray(variables[m[1]])) {
                    variables[m[1]].forEach(function(e) {
                        out.push(e);
                    });
                } else {
                    out.push(variables[m[1]]);
                }
            } else {
                out.push(a[i]);
            }
        }
        return out;
    }
};
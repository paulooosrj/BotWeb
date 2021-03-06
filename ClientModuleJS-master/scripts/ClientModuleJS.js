"use strict";

class Modules {

    constructor(config) {
        this.Path = config.path || "scripts/modules/";
        this.Debugged = config.debug || false;
        this.Developer = config.developer || false;
        return this.Require.bind(this);
    }

    Development(file){
    	var Cache = this.Cache();
    	this.getCode(file, function() {
             var res = this.responseText;
             var buffer = Cache.getCache(file);
             console.log("➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖");
             console.log("☑️ 👨🏻‍💻 DEBUG MODO DESENVOLVEDOR 👨🏻‍💻 ☑️");
             if(res != buffer){
             	console.log("👉🏽 Cache Modificado! do modulo : "+file+" ✔️\n O modulo sera recarregado ✔️");
             	Cache.setCache(file, res);
             }else{
             	console.log("👉🏽 Não mudou nada no cache do modulo : "+file+" 🔴");
             }
             console.log("➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖");
        });
    }

    getCode(dir, call) {
        var req = new XMLHttpRequest();
        req.onload = call;
        req.open("GET", dir, true);
        req.send();
    }

    static ClearCache(reload) {
        if (sessionStorage.getItem("modulesLoaded") != null) {
            var Cached = JSON.parse(sessionStorage.getItem("modulesLoaded"));
            Cached.map((moduleName, moduleIndex) => {
                sessionStorage.removeItem(moduleName);
            });
            sessionStorage.removeItem("modulesLoaded");
            if ((reload || false)) {
                location.reload();
            }
        }
    }

    Cache(n) {

        return {
            exists(name) {
                if (sessionStorage.getItem(name) == null) {
                    return false;
                } else {
                    return true;
                }
            },
            setCache(n, c) {
                function PushModule(name) {
                    var CacheModules = JSON.parse(sessionStorage.getItem("modulesLoaded"));
                    if (CacheModules.indexOf(name) == -1) {
                        CacheModules.push(name);
                        sessionStorage.setItem("modulesLoaded", JSON.stringify(CacheModules));
                    }
                }
                if (!this.exists("modulesLoaded")) {
                    sessionStorage.setItem("modulesLoaded", JSON.stringify(new Array()));
                }
                PushModule(n);
                sessionStorage.setItem(n, c);
            },
            getCache(n) {
                return sessionStorage.getItem(n);
            }
        }

    }

    Patterns(code, debug, filename) {
        var m = new Function("", `
			const debug = ${debug};
			const exports = {};
			const module = {exports: {}}; 
			${code}
			if(Object.values(exports).length > 0){
				if(debug){ console.log("Modulo Importado via : exports"); }
				return exports;
			} else if(Object.values(module.exports).length > 0){
				if(debug){ console.log("Modulo Importado via : module.exports"); }
				return module.exports;
			} else{
				throw 'Indefinido "exports" ou "module.exports" No Arquivo : ${location.href+filename}';
				return exports;
			}
		`);
        return m;
    }

    Require(filename) {
        const Path = this.Path;
        let file = Path + filename + ".js";
        var Cache = this.Cache();
        if (!Cache.exists(file)) {
            this.getCode(file, function() {
                var res = this.responseText;
                Cache.setCache(file, res);
            });
        }
        if (Cache.exists(file)) {
        	if(this.Developer){ this.Development(file); }
            var p = this.Patterns(Cache.getCache(file), this.Debugged, file);
            return p();
        } else {
            var BotVerifyCache = setInterval(function() {
                if (Cache.exists(file)) {
                    clearInterval(BotVerifyCache);
                    location.reload();
                }
            }, 1);
        }
    }

}

class loadScript{

	constructor(arr = [], debug = false){

		this.debug = debug;
		this.array = arr;
		this.loaded = this.loadScripted();
		this.loaded.next();

	}

	loadedScript(h){
		var pattern1 = /(?:https|http):(.*).(?:com|net|com.br|io|org)(.*).(?:js|min.js)/ig,
			pattern2 = /(?:https|http):\/\/(.*).(?:com|net|com.br|io|org)/ig;
		if(pattern1.test(h)){
			var n = pattern2.exec(h);
			var name = n[1];
			if(this.debug){ console.log("Carregando: "+ name); }
		}else{
			if(this.debug){ console.log("Não é um link valido"); }
		}
		var scr = document.createElement('script');
		scr.charset = "utf-8";
		scr.className = "loadedScriptModule";
		scr.type = "text/javascript";
		scr.src = h;
		document.querySelector("head").append(scr);
		scr.onerror = function(){
			throw "Ocorreu um erro ao Carregar Script : "+h;
		}
		var loadScp = function(){
			if(this.debug){ console.log("Carregado : "+ name); }
			this.loaded.next();
		};
		var loadFn = loadScp.bind(this);
		scr.onload = loadFn;
	}

	*loadScripted(){
		for (let elem of this.array){
        	yield this.loadedScript(elem);
    	}
	}

}

module.exports = {
	Load: loadScript
};
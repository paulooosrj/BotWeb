class BotWeb {

    static getInstance(config = {}) {
        if (!BotWeb.instance) {
            var s = this;
            BotWeb.instance = new s(config);
        }
        return BotWeb.instance;
    }

    constructor(config) {
        if(typeof Loader == "function"){
            var loading = new Loader([
                //"artyom.js-master/build-vanilla/artyom.min.js"
            ]);
        }
        this.Active = false;
        this.Database = {};
        BotWeb.BotConfig = {};
        BotWeb.BotConfig["input"] = config.input || document.querySelector("input");
        BotWeb.BotConfig["bot_name"] = config.name || "Mr.Robot";
        BotWeb.BotConfig["create_as"] = new Date();
        this.Database["EventsTrigger"] = {};
        this.events();
        this.output();
        var s = this;
        setTimeout(() => {
            s.Reconhecer();
        }, 15);
    }

    Reconhecer(){
        artyom.initialize({
            lang: "pt-PT",
            continuous: true,
            debug: false,
            listen: true
        }).then(() => {
            //console.log("Artyom has been succesfully initialized");
        }).catch((err) => {
            //console.error("Artyom couldn't be initialized: ", err);
        });
        var s = this;
        this.listenVoz('Iniciar', function(){
            s.BotOnline();
        });
    }

    listenVoz(name, fn){
        var Services = {
            PoolService: {
                db: new Map(),
                "set": function(n, v){
                    var s = Services.PoolService.db;
                    s.set(n, v);
                },
                "get": function(n){
                    var s = Services.PoolService.db;
                    return s.get(n);
                }
            },
            Bot: {
                Falar(msg){
                    artyom.say(msg);
                }
            }
        };
        artyom.addCommands([{
            indexes: [name],
            action: function(i){
                if(i == 0){
                    var fns = fn.bind(Services);
                    fns();
                }
            }
        }]);
    }

    listenVozParam(name, fn){
        var Services = {
            PoolService: {
                db: new Map(),
                "set": function(n, v){
                    var s = Services.PoolService.db;
                    s.set(n, v);
                },
                "get": function(n){
                    var s = Services.PoolService.db;
                    return s.get(n);
                }
            },
            Bot: {
                Falar(msg){
                    artyom.say(msg);
                }
            }
        };
        artyom.addCommands([{
            indexes: [name],
            smart: true,
            action: function(i, p){
                if(i == 0){
                    var fns = fn.bind(Services);
                    fns(p);
                }
            }
        }]);
    }

    listen(name, fn) {

        var Services = {
            PoolService: {
                db: new Map(),
                "set": function(n, v){
                    var s = Services.PoolService.db;
                    s.set(n, v);
                },
                "get": function(n){
                    var s = Services.PoolService.db;
                    return s.get(n);
                }
            },
            Bot: {
                Falar(msg){
                    artyom.say(msg);
                }
            }
        };
        this.Database["EventsTrigger"][name] = fn.bind(Services);

    }

    events() {
        this.Database["EventsTrigger"]["/search"] = function(msg) {
            msg = encodeURI(msg).trim();
            var url = "https://pt.wikipedia.org/w/api.php?action=query&list=search&origin=*&srsearch=" + msg + "&format=json";
            $.get(url, function(res) {
                console.log(typeof res);
                if (!'query' in res) {
                    throw "Erro na funcao Search";
                }
                if (!'search' in res.query) {
                    throw "Erro na funcao Search";
                }
                var response = res.query.search[0];
                $(".BotWeb-Response").html(`<strong>${response.title}</strong><br/><p>${response.snippet}</p>`);
                $(".BotWeb-Response").css("display", "flex");
                $(".BotWeb-Modal").css("width", parseInt($(".BotWeb-Modal-Inputs").width()) + "px");
                $(".BotWeb-Response").css("width", "100%");
                $(".BotWeb-Response").addClass("animated bounceInDown");
                setTimeout(() => { $(".BotWeb-Response").removeClass("animated bounceInDown"); }, 4000);
                //var d = JSON.parse(Res);
                //console.log(d);
            });
        };
        this.Database["EventsTrigger"]["/temperature"] = function(msg) {
            console.log("TEMPERATURE !!!");
        };
        this.Database["EventsTrigger"]["/andress"] = function(msg) {
            console.log("ANDRESS !!!");
        };
        this.Database["EventsTrigger"]["/youtube"] = function(msg) {
            console.log("SEARCH YOUTUBE !!!");
        };
        this.Database["EventsTrigger"]["/cotacao"] = function(msg) {
            console.log("COTACAO !!!");
        };

    }

    output() {

        function NewObj(n, c) {
            var v = document.createElement(n);
            v.className = c;
            return v;
        }

        var input = BotWeb.BotConfig["input"],
            view = input.parentNode,
            clone = input,
            modal = NewObj("div", "BotWeb-Modal"),
            modalInputs = NewObj("div", "BotWeb-Modal-Inputs");

        var height = $(clone).height();

        input.remove();

        this.Database["Template"] = {};
        this.Database["Template"]["BotWebBot"] = `<div class='BotWeb-Bot animated bounceIn' style='height:${height}px !important'>BotWeb</div>`;
        modalInputs.append(clone[0]);
        $(modal).html("<div class='BotWeb-Response'></div>");
        modal.append(modalInputs);
        $("body").append(modal);
        BotWeb.BotConfig["input"] = clone[0];

    }

    OnMessage(msg) {

        var input = BotWeb.BotConfig["input"],
            msgOrigin = msg,
            regexBot = /@botweb/ig;
        var regexs = Object.keys(this.Database["EventsTrigger"]).map((cm) => {
            var n = new RegExp(cm, "gi");
            return n;
        });

        msg = msg.toLowerCase();
        if (this.Active) {
            var t = regexs.filter((v) => {
                return v.test(msg) == true;
            });
            if (t.length > 0) {
                var fn = "/" + t[0].source.replace(/[\\//]/gi, "").trim();
                var r = new RegExp(t[0].source + " (.*)", "gi");
                var value = r.exec(msgOrigin)[1];
                if (fn in this.Database["EventsTrigger"]) {
                    this.Database["EventsTrigger"][fn](value);
                }
            }
        }

        if (regexBot.test(msg) && this.Active == false) {
            this.BotOnline();
        }

    }

    BotOnline(){
        var input = BotWeb.BotConfig["input"];
        $(Bot.Database.Template.BotWebBot).insertBefore($(".BotWebInput"));
        $(".BotWeb-Modal").css("box-shadow", "0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)");
        $(input).css("border-top-right-radius", "3px");
        $(input).css("border-bottom-right-radius", "3px");
        this.Active = true;
        this.OnVerifyBotter(input);
    }

    OnVerifyBotter(i) {
        function Botter() {
            if ($(i).val().length == 0 && $(".BotWeb-Response").css("display") == "flex") {
                $(".BotWeb-Response").html("");
                $(".BotWeb-Response").css("display", "none");
            }
        }
        this.Database["OnBotter"] = setInterval(Botter, 4000);
    }

    online() {

        var input = BotWeb.BotConfig["input"],
            self = this;

        $(".BotWebInput").keyup(function(e) {
            if (self.Active == false) { self.OnMessage(input.value); } else if (e.keyCode == 13) { self.OnMessage(input.value); }
        });

    }

    Run() {
        this.online();
    }

    toString() {

        return JSON.stringify(this);

    }

}

module.exports = {
    Core: BotWeb
};
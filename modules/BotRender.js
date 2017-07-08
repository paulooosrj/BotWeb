class BotRender {

    static getInstance() {
        if (!BotRender.instance) {
            var s = this;
            BotRender.instance = new s();
        }
        return BotRender.instance;
    }

    constructor(bot = BotWeb.getInstance()) {

        bot = (typeof bot != "object") ? BotWeb.getInstance() : bot;
        bot = Object.assign(bot, { BotConfig: BotWeb.BotConfig });

    }

    Render(code) {

        $(".BotWeb-Response").html(code);
        $(".BotWeb-Response").css("display", "flex");
        $(".BotWeb-Modal").css("width", parseInt($(".BotWeb-Modal-Inputs").width()) + "px");
        $(".BotWeb-Response").css("width", "100%");
        $(".BotWeb-Response").addClass("animated bounceInDown");
        setTimeout(() => { $(".BotWeb-Response").removeClass("animated bounceInDown"); }, 4000);

    }

}

module.exports = {
    Core: BotRender
}
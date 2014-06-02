var loading = document.getElementById("loading");
var gameCanvas = document.getElementById("gameCanvas");

cc.game.onStart = function(){
    cc.view.resizeWithBrowserSize(true);
    cc.view.setDesignResolutionSize(1440, 1920, cc.ResolutionPolicy.SHOW_ALL);

    var title = document.getElementById('title');
    title.parentNode.removeChild(title);

    //cc.loader.resPath = "srcSprites";

    // turn on display FPS
    cc.director.setDisplayStats(this.config['showFPS']);

    // set FPS. the default value is 1.0/60 if you don't call this
    cc.director.setAnimationInterval(1.0 / 60);

    //cc.view.enableAutoFullScreen(false); // to disable
    //var enabled = cc.view.isAutoFullScreenEnabled();
    //cc.log(enabled);

    //load resources
    cc.LoaderScene.preload(cookie_resources, function () {

        //cc.director.runScene(new WhiteTileMenu());
        cc.director.runScene(new CookieClickScene());
        gameCanvas.style.visibility="visible";
        loading.style.visibility="hidden";
    }, this);
};
//cc.game.run();

loadGame = function(){
    gameCanvas.style.visibility="hidden";
    cc.game.run();
};


loadGame();
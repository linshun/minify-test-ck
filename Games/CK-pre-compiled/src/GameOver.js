var GameOverLayer = cc.Layer.extend( {
   ctor:function() {
       this._super();
   } ,
    init:function() {
        this._super();

        /*if(navigator.onLine && typeof(RevMob)!="undefined" && typeof(RevMob.showFullscreen)!="undefined") {
         RevMob.showFullscreen();
         }*/

        var winSize = cc.director.getWinSize();
        var centerpos = cc.p(winSize.width/2, winSize.height/2);

        // background image
        var spritebg = cc.Sprite.create(background);
        spritebg.setPosition(centerpos);
        this.addChild(spritebg);

        // create menu and onPlay event callback
        var menuItemPlay = cc.MenuItemSprite.create(
            cc.Sprite.create(playButton),
            cc.Sprite.create(playButtonPressed),
            null,
            this.onPlay,
            this
        );

        var menu = cc.Menu.create(menuItemPlay);
        menu.setPosition(centerpos);
        this.addChild(menu);
    },
    onPlay:function() {
        cc.director.runScene(new AntSmasherScene());
    }
});

var GameOverScene = cc.Scene.extend({
   onEnter:function() {
       this._super();
       var layer = new GameOverLayer();
       layer.init();
       this.addChild(layer);
   }
});

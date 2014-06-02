var screenSizeY = 1920;
var screenSizeX = 1440;
var cookie;

var totalCookies=0;
var baseCps=0;
var cps=0;
var clickValue;
var lastSecondClicks;
var multiplierFactor;
var clickPoints;

var cookieSize = 60;

var droppingCookies;
var droppingCookieStretch;
var droppingCookieBar;
var droppingCookieBarIcon;

var bonusLastTrigger;
var bonusTime = 20;
var bonusIsActive;
var bonusStretch;
var bonusBar;
var bonusBarIcon;

var aHUDLayer;

var backgroundSprite1, backgroundSprite2;

var waveMilk1, waveMilk2, waveChoc1, waveChoc2;

var topPanel, botPanel;

var store, moreGames, storeClose;

var notEnoughCookies;

var lastCpsPayment;

var saveCounter;

var winSize, share, freeCookiesButton, scaleFactor, thisDateTime;

var CookieClickLayer = cc.Layer.extend({
    ctor:function() {
        this._super();
        this.init();
    },

    init:function(){
	    this._super();;

        winSize = cc.director.getWinSize();
        scaleFactor = winSize/1440;
        if(navigator.onLine && typeof(RevMob)!="undefined" && typeof(RevMob.showFullscreen)!="undefined") {
            RevMob.showFullscreen();
        }

        clickValue = 1;
        baseCps = 0;
        cps = 0;
        totalCookies = 0;
        lastSecondClicks = 0;
        saveCounter = 0;
        backgroundSprite1 = cc.Sprite.create(background);
        backgroundSprite1.setPosition(screenSizeX/2, screenSizeY/2);
        backgroundSprite2 = cc.Sprite.create(background);
        backgroundSprite2.setPosition(screenSizeX/2, screenSizeY * 1.5);
        lastCpsPayment = new Date().getTime();

        waveMilk1 = cc.Sprite.create(wave_normal);
        waveMilk2 = cc.Sprite.create(wave_normal);
        waveChoc1 = cc.Sprite.create(wave_chocolate);
        waveChoc2 = cc.Sprite.create(wave_chocolate);

        multiplierFactor = {
            factor: 1,
            x: screenSizeX/2,
            y: screenSizeY/6,
            label: cc.LabelTTF.create("", "RockwellBold", 120)
        };

        cc.audioEngine.setEffectsVolume(0.2);

        var that = this;
        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            onTouchBegan: function (touch, event) {
                return true;
            },
            onTouchMoved: function (touch, event) {
            },
            //Process the touch end event
            onTouchEnded: function (touch, event) {
                that.checkTouch(touch);
            }
        }, this);

        clickPoints = [];
        droppingCookies = [];
        droppingCookieStretch = 1;
        droppingCookieBar = cc.Sprite.create(progress);
        droppingCookieBar.setPosition(cc.p(0, screenSizeY - 100));
        droppingCookieBarIcon = cc.Sprite.create(mini_cookie_icon);
        droppingCookieBarIcon.setPosition(cc.p(screenSizeX - 100, screenSizeY - 100));


        bonusLastTrigger = new Date().getTime();
        bonusIsActive = false;
        bonusStretch = 1;
        bonusBar = cc.Sprite.create(progress);
        bonusBar.setPosition(cc.p(0, 75));
        bonusBarIcon = cc.Sprite.create(chocolate_icon);
        bonusBarIcon.setScale(0.5);
        bonusBarIcon.setPosition(cc.p(screenSizeX - 100, 75));

        cookie = {
            sprite: cc.Sprite.create(cookie),
            x: screenSizeX/2,
            y: screenSizeY/2,
            size: 0
        }

        notEnoughCookies = {
            label: cc.LabelTTF.create("Not Enough Cookies", "RockwellBold", 80),
            x: screenSizeX/2,
            y: screenSizeY/2 + 350,
            duration: 0
        }

        store = {
            spriteButton: cc.Sprite.create(shop_btn),
            spriteBackground: cc.Sprite.create(loja_background),
            open: false,
            products: [
                {
                    spriteIcon: cc.Sprite.create(powerclick_icon),
                    spriteCoin: cc.Sprite.create(mini_cookie_value),
                    labelName: cc.LabelTTF.create("PowerClick", "RockwellBold", 80, cc.size(500,0), cc.TEXT_ALIGNMENT_LEFT),
                    labelPrice: cc.LabelTTF.create("50", "RockwellBold", 80, cc.size(300,0), cc.TEXT_ALIGNMENT_LEFT),
                    labelLevel: cc.LabelTTF.create("Level 0", "RockwellBold", 70, cc.size(400,0), cc.TEXT_ALIGNMENT_LEFT),
                    labelCps: cc.LabelTTF.create("Click:x2", "RockwellBold", 60, cc.size(400,0), cc.TEXT_ALIGNMENT_LEFT),
                    boundX: 0,
                    boundY: 0,
                    price: 50,
                    level: 0,
                    click: 2
                },
                {
                    spriteIcon: cc.Sprite.create(bonus12h_icon),
                    spriteCoin: cc.Sprite.create(mini_cookie_value),
                    labelName: cc.LabelTTF.create("MoonClick", "RockwellBold", 80, cc.size(500,0), cc.TEXT_ALIGNMENT_LEFT),
                    labelPrice: cc.LabelTTF.create("500", "RockwellBold", 80, cc.size(300,0), cc.TEXT_ALIGNMENT_LEFT),
                    labelLevel: cc.LabelTTF.create("Level 0", "RockwellBold", 70, cc.size(400,0), cc.TEXT_ALIGNMENT_LEFT),
                    labelCps: cc.LabelTTF.create("Cps:+10", "RockwellBold", 60, cc.size(400,0), cc.TEXT_ALIGNMENT_LEFT),
                    boundX: 0,
                    boundY: 0,
                    price: 5,
                    level: 0,
                    cps: 10
                },
                {
                    spriteIcon: cc.Sprite.create(autoclick_icon),
                    spriteCoin: cc.Sprite.create(mini_cookie_value),
                    labelName: cc.LabelTTF.create("AutoClick", "RockwellBold", 80, cc.size(500,0), cc.TEXT_ALIGNMENT_LEFT),
                    labelPrice: cc.LabelTTF.create("500", "RockwellBold", 80, cc.size(300,0), cc.TEXT_ALIGNMENT_LEFT),
                    labelLevel: cc.LabelTTF.create("Level 0", "RockwellBold", 70, cc.size(400,0), cc.TEXT_ALIGNMENT_LEFT),
                    labelCps: cc.LabelTTF.create("Cps:+100", "RockwellBold", 60, cc.size(400,0), cc.TEXT_ALIGNMENT_LEFT),
                    boundX: 0,
                    boundY: 0,
                    price: 500,
                    level: 0,
                    cps: 100
                },
                {
                    spriteIcon: cc.Sprite.create(grandma_icon),
                    spriteCoin: cc.Sprite.create(mini_cookie_value),
                    labelName: cc.LabelTTF.create("GrandMa", "RockwellBold", 80, cc.size(500,0), cc.TEXT_ALIGNMENT_LEFT),
                    labelPrice: cc.LabelTTF.create("5000", "RockwellBold", 80, cc.size(300,0), cc.TEXT_ALIGNMENT_LEFT),
                    labelLevel: cc.LabelTTF.create("Level 0", "RockwellBold", 70, cc.size(400,0), cc.TEXT_ALIGNMENT_LEFT),
                    labelCps: cc.LabelTTF.create("Cps:+1000", "RockwellBold", 60, cc.size(400,0), cc.TEXT_ALIGNMENT_LEFT),
                    boundX: 0,
                    boundY: 0,
                    price: 5000,
                    level: 0,
                    cps: 1000
                },
                {
                    spriteIcon: cc.Sprite.create(elementx_icon),
                    spriteCoin: cc.Sprite.create(mini_cookie_value),
                    labelName: cc.LabelTTF.create("Element X", "RockwellBold", 80, cc.size(500,0), cc.TEXT_ALIGNMENT_LEFT),
                    labelPrice: cc.LabelTTF.create("50000", "RockwellBold", 80, cc.size(300,0), cc.TEXT_ALIGNMENT_LEFT),
                    labelLevel: cc.LabelTTF.create("Level 0", "RockwellBold", 70, cc.size(400,0), cc.TEXT_ALIGNMENT_LEFT),
                    labelCps: cc.LabelTTF.create("Cps:+10000", "RockwellBold", 60, cc.size(400,0), cc.TEXT_ALIGNMENT_LEFT),
                    boundX: 0,
                    boundY: 0,
                    price: 50000,
                    level: 0,
                    cps: 10000
                }
            ]
        }

        store.spriteButton.setPosition(cc.p(screenSizeX - 250, screenSizeY/5));
        store.spriteBackground.setPosition(cc.p(screenSizeX/2, screenSizeY/2 - 100));

        storeClose = cc.Sprite.create(close_btn);
        storeClose.setPosition(cc.p(screenSizeX - 250, screenSizeY/2 + 400));

        freeCookiesButton = cc.MenuItemSprite.create(
            cc.Sprite.create(freeCookiesButtonImage),
            cc.Sprite.create(freeCookiesButtonPressedImage),
            null, this.socialInterstitialClicked
        );

        freeCookiesButton.setPosition(cc.p(screenSizeX/2, screenSizeY/5));


        moreGames = cc.MenuItemSprite.create(
            cc.Sprite.create(moregames_btn),
            cc.Sprite.create(more_games_btn_press),
            null,
            this.moreGamesSite
        );

        moreGames.setPosition(cc.p(250, screenSizeY/5));

        topPanel = cc.Sprite.create(progress);
        topPanel.setScaleX(screenSizeX/10);
        topPanel.setScaleY(30);
        topPanel.setPosition(screenSizeX/2, screenSizeY - 150);
        topPanel.setOpacity(120);

        botPanel = cc.Sprite.create(progress);
        botPanel.setScaleX(screenSizeX/10);
        botPanel.setScaleY(15);
        botPanel.setPosition(screenSizeX/2, 75);
        botPanel.setOpacity(180);

        waveMilk1.setPosition(cc.p(0 + 2344/2, -240));
        waveMilk2.setPosition(cc.p(2344 + 2344/2, -240));
        waveChoc1.setPosition(cc.p(0 + 2344/2, -240));
        waveChoc2.setPosition(cc.p(2344 + 2344/2, -240));

        this.load();

        this.schedule(this.start);
        return this;
    },

    socialInterstitialClicked:function(){
        //cc.log("socialInterstitialClicked");
        var that = this;
        thisDateTime = new Date().getTime();
        //cc.log("thisDateTime", thisDateTime);
        //cc.log("timeStoraged", localStorage.getItem("cookieClickShared"));
    },

    shareOkContinuePlaying:function(){
        totalCookies = totalCookies + 100;
    },

    start:function(){
        saveCounter ++;
        this.removeAllChildren();

        this.handleBonusToogle();

        this.payCps();

        if (aHUDLayer == undefined)
            aHUDLayer = this.getParent().getChildByTag(TagOfLayer.hudLayer);

        backgroundSprite1.setPositionY(backgroundSprite1.getPositionY() - 2);
        backgroundSprite2.setPositionY(backgroundSprite2.getPositionY() - 2);
        if (backgroundSprite1.getPositionY() <= - screenSizeY/2)
            backgroundSprite1.setPositionY(backgroundSprite2.getPositionY() + screenSizeY);
        if (backgroundSprite2.getPositionY() <= - screenSizeY/2)
            backgroundSprite2.setPositionY(backgroundSprite1.getPositionY() + screenSizeY);

        this.addChild(backgroundSprite1);
        this.addChild(backgroundSprite2);

        this.addChild(topPanel);

        this.removeChild(cookie.sprite);
        cookie.sprite.setPosition(cc.p(cookie.x, cookie.y));
        cookie.sprite.setRotation(180);
        cookie.sprite.setScale(1 - cookie.size);
        if (cookie.size > 0){
            cookie.size -= 0.05;
        }
        this.addChild(cookie.sprite);

        for (var i = 0; i < clickPoints.length; i ++){
            var points = clickPoints[i];
            points.label.setColor(cc.color(255,255,255));
            points.label.setPosition(cc.p(points.x, (points.y + points.yFloat)));
            points.yFloat += Math.min(points.yFloat * 0.1, 10);

            if (points.yFloat + points.y > screenSizeY){
                clickPoints.splice(i, 1);
            } else {
                this.addChild(points.label);
            }
        }

        this.drawWaves();

        this.addChild(botPanel);

        cps = baseCps + lastSecondClicks * multiplierFactor.factor * clickValue;

        this.drawMultiplierFactor();
        this.dropCookies();

        aHUDLayer.updateCps(cps);
        aHUDLayer.updateTotalCookies(totalCookies);

        droppingCookieBar.setScaleX(droppingCookieStretch);
        bonusBar.setScaleX(bonusStretch);

        this.addChild(droppingCookieBar);
        this.addChild(droppingCookieBarIcon);
        this.addChild(bonusBar);
        this.addChild(bonusBarIcon);
        this.addChild(store.spriteButton);
        this.addChild(moreGames);
        this.addChild(freeCookiesButton);



        if (store.open)
            this.showStore();

        this.notEnoughCookies();

        if (saveCounter == 600){//10 seconds
            this.save();
            saveCounter = 0;
        }
    },

    drawWaves:function(){
        waveMilk1.setPositionX(waveMilk1.getPositionX() - 2);
        waveMilk2.setPositionX(waveMilk2.getPositionX() - 2);
        waveChoc1.setPositionX(waveChoc1.getPositionX() - 2);
        waveChoc2.setPositionX(waveChoc2.getPositionX() - 2);


        var waveHigh = -240 + (multiplierFactor.factor - 1) * 200;
        if (waveHigh > waveMilk1.getPositionY()){
            waveMilk1.setPositionY(waveMilk1.getPositionY() + 2);
            waveMilk2.setPositionY(waveMilk2.getPositionY() + 2);
            waveChoc1.setPositionY(waveChoc1.getPositionY() + 2);
            waveChoc2.setPositionY(waveChoc2.getPositionY() + 2);
        } else if (waveHigh < waveMilk1.getPositionY()){
            waveMilk1.setPositionY(waveMilk1.getPositionY() - 2);
            waveMilk2.setPositionY(waveMilk2.getPositionY() - 2);
            waveChoc1.setPositionY(waveChoc1.getPositionY() - 2);
            waveChoc2.setPositionY(waveChoc2.getPositionY() - 2);
        }

        if (waveMilk1.getPositionX() <= - 2344/2)
            waveMilk1.setPositionX(waveMilk2.getPositionX() + 2344);
        if (waveChoc1.getPositionX() <= - 2344/2)
            waveChoc1.setPositionX(waveChoc2.getPositionX() + 2344);
        if (waveMilk2.getPositionX() <= - 2344/2)
            waveMilk2.setPositionX(waveMilk1.getPositionX() + 2344);
        if (waveChoc2.getPositionX() <= - 2344/2)
            waveChoc2.setPositionX(waveChoc1.getPositionX() + 2344);

        if (bonusIsActive) {
            this.addChild(waveChoc1);
            this.addChild(waveChoc2);
        } else {
            this.addChild(waveMilk1);
            this.addChild(waveMilk2);
        }
    },

    showStore:function(){
        this.removeChild(store.spriteBackground);
        this.addChild(store.spriteBackground);
        for (var i = 0; i < store.products.length; i ++){
            var divider = cc.Sprite.create(divisoria_loja);
            this.removeChild(store.products[i].spriteIcon);
            this.removeChild(store.products[i].spriteCoin);
            this.removeChild(store.products[i].labelName);
            this.removeChild(store.products[i].labelPrice);
            this.removeChild(store.products[i].labelCps);
            this.removeChild(store.products[i].labelLevel);
            store.products[i].spriteIcon.setPosition(cc.p(screenSizeX/2 - 420, screenSizeY/2 + 210 - 200 * i));
            store.products[i].spriteCoin.setPosition(cc.p(screenSizeX/2 - 280, screenSizeY/2 + 210 - 200 * i - 60));
            store.products[i].spriteCoin.setAnchorPoint(cc.p(0,0));
            store.products[i].labelName.setPosition(cc.p(screenSizeX/2 - 20, screenSizeY/2 + 210 - 200 * i + 50));
            store.products[i].labelName.setColor(cc.color(255,255,255));
            store.products[i].labelName.enableStroke(cc.color(0,0,0),7);
            store.products[i].labelPrice.setPosition(cc.p(screenSizeX/2 - 50, screenSizeY/2 + 210 - 200 * i - 30));
            store.products[i].labelPrice.setColor(cc.color(0,0,0));
            store.products[i].labelCps.setPosition(cc.p(screenSizeX/2 + 400, screenSizeY/2 + 210 - 200 * i - 30));
            store.products[i].labelCps.setColor(cc.color(255,226,0));
            store.products[i].labelCps.enableStroke(cc.color(0,0,0),7);
            store.products[i].labelLevel.setPosition(cc.p(screenSizeX/2 + 400, screenSizeY/2 + 210 - 200 * i + 40));
            store.products[i].labelLevel.setColor(cc.color(0,0,0));
            store.products[i].boundX = store.products[i].spriteIcon.getPosition().x - store.products[i].spriteIcon.getBoundingBox().width/2;
            store.products[i].boundY = store.products[i].spriteIcon.getPosition().y + store.products[i].spriteIcon.getBoundingBox().height/2;
            divider.setPosition(cc.p(screenSizeX/2, store.products[i].boundY + 35));
            if (i != 0)
            this.addChild(divider);
            this.addChild(store.products[i].labelName);
            this.addChild(store.products[i].labelPrice);
            this.addChild(store.products[i].labelCps);
            this.addChild(store.products[i].labelLevel);
            this.addChild(store.products[i].spriteIcon);
            this.addChild(store.products[i].spriteCoin);
        }
        this.addChild(storeClose);
    },

    payCps:function(){
        var currentTime = new Date().getTime();
        if ( (currentTime - lastCpsPayment)/1000 >= 1){
            lastCpsPayment = currentTime;
            totalCookies += baseCps;
        }
    },

    checkTouch:function(touch){
        var location = touch.getLocation();

        if (!store.open){
            //main cookie detection
            if (location.x > cookie.sprite.getPosition().x - cookie.sprite.getBoundingBox().width/2 && location.x < cookie.sprite.getPosition().x + cookie.sprite.getBoundingBox().width/2 &&
                location.y > cookie.sprite.getPosition().y - cookie.sprite.getBoundingBox().height/2 && location.y < cookie.sprite.getPosition().y + cookie.sprite.getBoundingBox().height/2){
                    this.click(location);
            }

            //dropping cookies detection
            for (var i = 0; i < droppingCookies.length; i ++) {
                var droppingCookie = droppingCookies[i];
                if (location.x > droppingCookie.sprite.getPosition().x - droppingCookie.sprite.getBoundingBox().width / 2 && location.x < droppingCookie.sprite.getPosition().x + droppingCookie.sprite.getBoundingBox().width / 2 &&
                    location.y > droppingCookie.sprite.getPosition().y - droppingCookie.sprite.getBoundingBox().height / 2 && location.y < droppingCookie.sprite.getPosition().y + droppingCookie.sprite.getBoundingBox().height / 2) {
                    this.clickDroppingCookie(droppingCookie);
                    droppingCookies.splice(i, 1);
                }
            }

        } else {
            //store products detection
            for (var i = 0; i < store.products.length; i ++) {
                var product = store.products[i];
                if (location.x > product.boundX && location.x < screenSizeX/2 + screenSizeX/2 - product.boundX &&
                    location.y > product.boundY - 100 && location.y < product.boundY) {
                    if (totalCookies >= product.price){
                        this.buy(product);
                    } else {
                        notEnoughCookies.duration = 90;
                    }
                }
            }
        }


        //storebutton detection
        if (location.x > store.spriteButton.getPosition().x - store.spriteButton.getBoundingBox().width / 2 && location.x < store.spriteButton.getPosition().x + store.spriteButton.getBoundingBox().width / 2 &&
            location.y > store.spriteButton.getPosition().y - store.spriteButton.getBoundingBox().height / 2 && location.y < store.spriteButton.getPosition().y + store.spriteButton.getBoundingBox().height / 2) {
            if (!store.open){
                this.openStore();
            }
        }
        if (location.x > storeClose.getPosition().x - storeClose.getBoundingBox().width / 2 && location.x < storeClose.getPosition().x + storeClose.getBoundingBox().width / 2 &&
            location.y > storeClose.getPosition().y - storeClose.getBoundingBox().height / 2 && location.y < storeClose.getPosition().y + storeClose.getBoundingBox().height / 2) {
            if (store.open){
                this.closeStore();
            }
        }

        if (location.x > moreGames.getPosition().x - moreGames.getBoundingBox().width / 2 && location.x < moreGames.getPosition().x + moreGames.getBoundingBox().width / 2 &&
            location.y > moreGames.getPosition().y - moreGames.getBoundingBox().height / 2 && location.y < moreGames.getPosition().y + moreGames.getBoundingBox().height / 2) {

                this.moreGamesSite();
        }

        if (location.x > freeCookiesButton.getPosition().x - freeCookiesButton.getBoundingBox().width / 2 && location.x < freeCookiesButton.getPosition().x + freeCookiesButton.getBoundingBox().width / 2 &&
            location.y > freeCookiesButton.getPosition().y - freeCookiesButton.getBoundingBox().height / 2 && location.y < freeCookiesButton.getPosition().y + freeCookiesButton.getBoundingBox().height / 2) {

            this.socialInterstitialClicked();
        }


    },

    buy:function(product){
        totalCookies -= product.price;
        product.level += 1;
        product.price = Math.round(product.price * 1.5);
        product.labelLevel.setString("Level "+product.level);
        product.labelPrice.setString(product.price);

        if (product.cps != undefined){
            baseCps += product.cps;
        } else if (product.click != undefined){
            clickValue *= 2;
        }
    },

    notEnoughCookies:function(){
      if (notEnoughCookies.duration > 1){
          this.removeChild(notEnoughCookies.label);
          notEnoughCookies.label.setPosition(cc.p(notEnoughCookies.x, notEnoughCookies.y));
          notEnoughCookies.label.setColor(cc.color(255,255,255));
          notEnoughCookies.label.enableStroke(cc.color(0,0,0),10);
          this.addChild(notEnoughCookies.label);
          notEnoughCookies.duration --;
      } else if (notEnoughCookies.duration == 1){
          this.removeChild(notEnoughCookies.label);
      }
    },

    closeStore:function(){
        store.open = false;
    },

    openStore:function(){
        store.open = true;
    },

    click:function(location){
        droppingCookieStretch += 1;
        if (droppingCookieStretch >= screenSizeX/10*2) {
            this.createDroppingCookies();
            droppingCookieStretch = 1;
        }

        cookie.size = 0.1;
        totalCookies += clickValue * multiplierFactor.factor * (bonusIsActive ? 10 : 1);
        aHUDLayer.updateTotalCookies(totalCookies);

        lastSecondClicks += 1;
        setTimeout(function(){
            lastSecondClicks -= 1;
        }, 1000);

        clickPoints.unshift(
            {   //Math.random() * (max - min) + min
                x: Math.random() * ( (cookie.sprite.getPosition().x + cookie.sprite.getBoundingBox().width/2) - (cookie.sprite.getPosition().x - cookie.sprite.getBoundingBox().width/2))
                    + (cookie.sprite.getPosition().x - cookie.sprite.getBoundingBox().width/2),
                y: Math.random() * ( (cookie.sprite.getPosition().y + cookie.sprite.getBoundingBox().height/2) - (cookie.sprite.getPosition().y))
                    + (cookie.sprite.getPosition().y),
                yFloat: 0.2,
                alpha: 255,
                label: cc.LabelTTF.create("+" + (multiplierFactor.factor  * 1 * clickValue * (bonusIsActive ? 10 : 1)), "RockwellBold", 60)
            }
        );
    },

    clickDroppingCookie:function(droppingCookie){
        totalCookies += clickValue * 1000;
        aHUDLayer.updateTotalCookies(totalCookies);

        clickPoints.unshift(
            {   //Math.random() * (max - min) + min
                x: Math.random() * ( (droppingCookie.sprite.getPosition().x + droppingCookie.sprite.getBoundingBox().width/2) - (droppingCookie.sprite.getPosition().x - droppingCookie.sprite.getBoundingBox().width/2))
                    + (droppingCookie.sprite.getPosition().x - droppingCookie.sprite.getBoundingBox().width/2),
                y: Math.random() * ( (droppingCookie.sprite.getPosition().y + droppingCookie.sprite.getBoundingBox().height/2) - (droppingCookie.sprite.getPosition().y))
                    + (droppingCookie.sprite.getPosition().y),
                yFloat: 0.2,
                alpha: 255,
                label: cc.LabelTTF.create("+" +  clickValue * 1000, "RockwellBold", 150)
            }
        );

        this.removeChild(droppingCookie.sprite);
    },

    drawMultiplierFactor:function(){
        multiplierFactor.factor = Math.round(lastSecondClicks / 3) + 1;
        multiplierFactor.label.setString("x" + (multiplierFactor.factor * clickValue * (bonusIsActive ? 10 : 1)));

        this.removeChild(multiplierFactor.label);
        multiplierFactor.label.setColor(cc.color(152,154,162));
        multiplierFactor.label.enableStroke(cc.color(0,0,0), 5);
        multiplierFactor.label.setPosition(cc.p(multiplierFactor.x, multiplierFactor.y));

        if (multiplierFactor.factor > 1){
            this.addChild(multiplierFactor.label);
        }
    },

    createDroppingCookies:function(){
        for (var i = 0; i < 10; i ++){
            droppingCookies.unshift(
                {   //Math.random() * (max - min) + min
                    x: Math.random() * ( (screenSizeX - cookieSize) - (0 + cookieSize)) + 0 + cookieSize,
                    y: Math.random() * ( screenSizeY * 7 - screenSizeY * 1.5) + screenSizeY * 1.5,
                    clicked: false,
                    sprite: cc.Sprite.create(cookiedourado)
                }
            );
        }
    },

    dropCookies:function(){
        for (var i = 0; i < droppingCookies.length; i ++){
            var droppingCookie = droppingCookies[i];

            this.removeChild(droppingCookie.sprite);
            if (droppingCookie.y < 0 - cookieSize){
                droppingCookies.splice(i, 1);
            } else {
                droppingCookie.sprite.setScale(0.2);
                droppingCookie.sprite.setPosition(cc.p(droppingCookie.x, droppingCookie.y));
                droppingCookie.y -= 15;
                this.addChild(droppingCookie.sprite);
            }
        }
    },

    handleBonusToogle:function(){
        var currentTime = new Date().getTime();

        var bonusCountdown = bonusTime - (currentTime - bonusLastTrigger) / 1000;
        if (bonusIsActive && bonusCountdown <= bonusTime/2){
            bonusIsActive = false;
            bonusLastTrigger = currentTime;
        } else if (bonusCountdown <= 0){
            bonusIsActive = true;
            bonusLastTrigger = currentTime;
        }

        if (bonusIsActive) {
            bonusStretch = screenSizeX/10*2 - ((currentTime - bonusLastTrigger) / 1000) * screenSizeX/10*2 / bonusTime * 2 ;
        } else {
            bonusStretch = (bonusTime - bonusCountdown) * (screenSizeX/10*2 / bonusTime) ;
        }
    },

    save:function(){
        localStorage.setItem("CCTotalCookies", totalCookies);
        localStorage.setItem("CCBaseCps", baseCps);
        localStorage.setItem("CCClickValue", clickValue);

        for (var i = 0; i < 5; i ++){
            localStorage.setItem("CCProduct" + (i+1) + "Level", store.products[i].level);
            localStorage.setItem("CCProduct" + (i+1) + "Price", store.products[i].price);
        }
    },

    load:function(){
        if (localStorage.getItem("CCTotalCookies") != undefined)
            totalCookies = parseInt(localStorage.getItem("CCTotalCookies"));
        if (localStorage.getItem("CCBaseCps") != undefined)
            baseCps = parseInt(localStorage.getItem("CCBaseCps"));
        if (localStorage.getItem("CCClickValue") != undefined)
            clickValue = parseInt(localStorage.getItem("CCClickValue"));

        for (var i = 0; i < 5; i ++){
            if (localStorage.getItem("CCProduct" + (i+1) + "Level") != undefined){
                store.products[i].level = parseInt(localStorage.getItem("CCProduct" + (i+1) + "Level"));
                store.products[i].labelLevel.setString("Level " + store.products[i].level);
            }
            if (localStorage.getItem("CCProduct" + (i+1) +  "Price") != undefined){
                store.products[i].price = parseInt(localStorage.getItem("CCProduct" + (i+1) + "Price"));
                store.products[i].labelPrice.setString(store.products[i].price);
            }
        }
    },

    moreGamesSite:function(){
        cc.log("moreGamesSiteFunction");
        console.log("consoleMoreGamesSite");
    }


});

var HUDLayer = cc.Layer.extend({
    totalCookiesLabel:null,
    cpsLabel:null,
    points:0,
    lives:2,
    livesImage: [],

    ctor:function() {
        this._super();
        this.init();
    },
    init:function() {
        this._super();

        this.totalCookiesLabel = cc.LabelTTF.create(this.totalCookies + " Cookies", "RockwellBold", 150);
        this.totalCookiesLabel.setColor(cc.color(255,255,255));
        this.totalCookiesLabel.setPosition(cc.p(screenSizeX/2, screenSizeY - 120));
        this.addChild(this.totalCookiesLabel);

        this.cpsLabel = cc.LabelTTF.create(this.cps + " per second", "RockwellBold", 80);
        this.cpsLabel.setColor(cc.color(255,255,255));
        this.cpsLabel.setPosition(cc.p(screenSizeX/2, screenSizeY - 220));
        this.addChild(this.cpsLabel);
    },
    updateTotalCookies:function(totalCookies){
        this.totalCookiesLabel.setString(totalCookies + " Cookies");
    },
    updateCps:function(cps){
        this.cpsLabel.setString(cps + " per second");
    }


});


var CookieClickScene = cc.Scene.extend({
	onEnter:function(){

		this._super();
		this.addChild(new CookieClickLayer(), 0, TagOfLayer.cookieClickLayer);
        this.addChild(new HUDLayer(), 0, TagOfLayer.hudLayer);
	}
});
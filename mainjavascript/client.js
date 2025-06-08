/*Developer: Alexander Gluschenko (08-03-2015, 26-11-2016, 10-03-2017, 28-09-2017)*/

function SetupVKEvents()
{
    VK.addCallback('onOrderSuccess', function (order_id) {
        console.log("OrderSuccess");

        if(!isWebGL)
        {
            var game = GetUnity();
            game.SendMessage("WebInteraction", "SetMoney");
        }
        else
        {
            gameInstance.SendMessage("WebInteraction", "SetMoney");
        }
    });
    
    VK.addCallback('onOrderFail', function () {
        console.log("OrderFail");
    });

    VK.addCallback('onOrderCancel', function () {
        console.log("OrderCancel");
    });

    VK.addCallback('onWindowBlur', function () {
        Show("hider_wrap"); // Убирает приложение из зоны видимости
    });

    VK.addCallback('onWindowFocus', function () {
        Hide("hider_wrap"); // Обращает предыдущее действие
    });

    VK.addCallback('onSubscriptionSuccess', function(subscription_id) {
        console.log("onSubscriptionSuccess");

        if(!isWebGL)
        {
            var game = GetUnity();
            game.SendMessage("WebInteraction", "ApplySubscription");
        }
        else
        {
            gameInstance.SendMessage("WebInteraction", "ApplySubscription");
        }
    });

    VK.addCallback('onSubscriptionFail', function() {
        console.log("onSubscriptionFail");
    });

    VK.addCallback('onSubscriptionCancel', function() {
        console.log("onSubscriptionCancel");
    });
}

//

function CallAuthData(target, method)
{
    console.log("CallAuthData");

    if(!isWebGL)
    {
        var game = GetUnity();
        game.SendMessage(target, method, JSON.stringify(UserData));
        
        if(Command != "") game.SendMessage(target, "ExecuteCommand", Command);
        
        ReachGoal("LaunchWebPlayer");
    }
    else
    {
        gameInstance.SendMessage(target, method, JSON.stringify(UserData));

        if(Command != "") gameInstance.SendMessage(target, "ExecuteCommand", Command);

        ReachGoal("LaunchWebGL");
    }

    ReachGoal("GameLaunched");
}

function WallPost(text, attachment) {
    var params = {
        message: text,
        attachments: attachment
    };
    VK.api('wall.post', params);
}

function OpenOrder(item) // OBSOLETE
{
    showOrderBox(item);
}

function showOrderBox(item) 
{
    var params = {
        type: 'item',
        item: item
    };
    VK.callMethod('showOrderBox', params);
}

function showSubscriptionBox(action, item)
{
    var params = {};
    params.action = action;

    switch(action)
    {
        case "create":
            params.item = item;
            break;
        case "resume":
        case "cancel":
            params.subscription_id = item;
            break;
    }

    VK.callMethod('showSubscriptionBox', action, params);
}

function showSubscriptionsBox(action, item)
{
    showSubscriptionBox(action, item);
}

function InviteFriends() {
    VK.callMethod("showInviteBox");
}

function Share() {
    WallPost("Текст", "photo-31188834_338477007");
}

//

function UploadScreenshot(data)
{
    var title = "BuilderCraft";
    var desc = "BuilderCraft: Увлекательная строительная песочница. \nИграть по ссылке: https://vk.com/buildercraft_game#s";
    VKIntegration.UploadPhoto(title, desc, data, function(photo){
        var p = VKIntegration.processPhoto(photo);
        //
        AJAX.ServerRequest({ 
            method: "utils.pushScreenshot", 
            photo_id: p.photo_id, 
            photo: p.photo, 
            preview: p.preview, 
            owner: p.owner 
        }, function(data){
            console.log("Screenshot pushed!");
        }, "/buildercraft/server/receiver.php");
        //
        WallPost("", p.photo_id);
    });
}

//

function Proto() {
    return document.location.protocol;
}

function Write(id, val) {
    Find(id).innerHTML = val;
}

function Find(id) {
    var obj = document.getElementById(id);
    return obj;
}

function Hide(id) {
    Find(id).style.display = 'none';
    DebugLog("Hide", id);
}

function Show(id) {
    Find(id).style.display = 'block';
    DebugLog("Show", id);
}

function Navigate(url) {
    document.location = url;
    DebugLog("Navigate", url);
}

function DebugLog(name, msg) {
    console.log(name + " -> " + msg);
}


function ReachGoal(key)
{
    if(typeof(yaCounter33947789) != "undefined")
    {
        var counter = yaCounter33947789;
        if(counter.reachGoal != null)
        {
            counter.reachGoal(key);
        }
    }
}
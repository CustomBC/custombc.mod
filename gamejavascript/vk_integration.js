/*Developer: Alexander Gluschenko (28-09-2017)*/

/*function UploadScreenshot(data)
{
    VKIntegration.UploadPhoto("Test", "Test desc", "R0lGODdhMAAwAPAAAAAAAP///ywAAAAAMAAw" +
    "AAAC8IyPqcvt3wCcDkiLc7C0qwyGHhSWpjQu5yqmCYsapyuvUUlvONmOZtfzgFz" +
    "ByTB10QgxOR0TqBQejhRNzOfkVJ+5YiUqrXF5Y5lKh/DeuNcP5yLWGsEbtLiOSp" +
    "a/TPg7JpJHxyendzWTBfX0cxOnKPjgBzi4diinWGdkF8kjdfnycQZXZeYGejmJl" +
    "ZeGl9i2icVqaNVailT6F5iJ90m6mvuTS4OK05M0vDk0Q4XUtwvKOzrcd3iq9uis" +
    "F81M1OIcR7lEewwcLp7tuNNkM3uNna3F2JQFo97Vriy/Xl4/f1cf5VWzXyym7PH" +
    "hhx4dbgYKAAA7", function(photo){
        var p = VKIntegration.processPhoto(photo);

        AJAX.ServerRequest({ 
            method: "PushScreenshot", 
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
}*/

let VKIntegration = {};

VKIntegration.UploadPhoto = function(album_title, album_description, photo_data, callback){

    VKIntegration.getAlbums(function(albums){

        var album_id = 0;

        for(var i = 0; i < albums.length; i++)
        {
            var album = albums[i];
            var id = album.id;
            var title = album.title;

            if(title == album_title)
            {
                album_id = id;
                break;
            }
        }

        var getUploadServer = function(aid) {
            VKIntegration.getUploadServer(aid, function(data){
                var album_id = data.album_id;
                var user_id = data.user_id;
                var upload_url = data.upload_url;

                VKIntegration.uploadPhoto(upload_url, { upload_url: upload_url, photo_data: photo_data }, function(data){
                    data = JSON.parse(data);
                    console.log(data);

                    var server = data.server;
                    var photos_list = data.photos_list;
                    var aid = data.aid;
                    var hash = data.hash;

                    VKIntegration.savePhoto(aid, server, photos_list, hash, album_description, function(data){
                        if(data.length > 0)
                        {
                            var photo = data[0];
                            callback(photo);
                        }
                    });
                });
            });
        };

        if(album_id != 0) {
            getUploadServer(album_id);
        }
        else {
            VKIntegration.createAlbum(album_title, album_description, function(album){
                getUploadServer(album.id);
            });
        }

    });

};

VKIntegration.getAlbums = function(callback) {
    VK.api("photos.getAlbums", {}, function(data)
    {
        if(data.response != null)
        {
            console.log(data.response);
            callback(data.response.items);
        }
        else
        {
            console.log(data.error);
        }
    });
};

VKIntegration.createAlbum = function(title, description, callback) {
    VK.api("photos.createAlbum", { "title": title,"description": description }, function(data)
    {
        if(data.response != null)
        {
            console.log(data.response);
            callback(data.response);
        }
        else
        {
            console.log(data.error);
        }
    });
};

VKIntegration.getUploadServer = function(album_id, callback){
    VK.api("photos.getUploadServer", { album_id: album_id }, function(data)
    {
        if(data.response != null)
        {
            console.log(data.response);
            callback(data.response);
        }
        else
        {
            console.log(data.error);
        }
    });
};

VKIntegration.uploadPhoto = function(url, data, callback){
    
    AJAX.Request({
        type: "POST",
        url: "/buildercraft/server/vk/image_upload.php",
        data: data,
        success: function (data) { callback(data); },
    });

    /*AJAX.UploadFile(data, "file1", function (data) { 
        callback(data);
    }, url);*/
};

VKIntegration.savePhoto = function(album_id, server, photos_list, hash, caption, callback){
    VK.api("photos.save", { album_id: album_id, server: server, photos_list: photos_list, hash: hash, caption: caption }, function(data)
    {
        if(data.response != null)
        {
            console.log(data.response);
            callback(data.response);
        }
        else
        {
            console.log(data.error);
        }
    });
};

VKIntegration.processPhoto = function(photo){
    
    var photo_preview = photo.photo_130;
    var photo_url = "";
    var photo_id = "photo" + photo.owner_id + "_" + photo.id;
    var owner = photo.owner_id;

    if(photo.photo_75 != null) photo_url = photo.photo_75;
    if(photo.photo_130 != null) photo_url = photo.photo_130;
    if(photo.photo_604 != null) photo_url = photo.photo_604;
    if(photo.photo_807 != null) photo_url = photo.photo_807;
    if(photo.photo_1280 != null) photo_url = photo.photo_1280;
    if(photo.photo_2560 != null) photo_url = photo.photo_2560;
    
    return {
        photo_id: photo_id,
        photo: photo_url,
        preview: photo_preview,
        owner: owner,
    };
};
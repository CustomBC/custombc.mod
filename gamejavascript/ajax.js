var AJAX = {
    Progress: { current: 0, total: 1, onChanged: function(e){ } },
    CreateXMLHTTP: function() {
        let xhr = null;

        if (XMLHttpRequest != null) {
            xhr = new XMLHttpRequest();
        }

        if(!xhr == null)
        {
            try {
                xhr = new ActiveXObject("Msxml2.XMLHTTP");
            }
            catch (e) {
                try {
                    xhr = new ActiveXObject("Microsoft.XMLHTTP");
                }
                catch (e) {
                    xhr = false;
                }
            }
        }
        
        return xhr;
    },
    ServerRequest: function(data, action, url) {
        AJAX.Request({
            type: "POST",
            url: url,
            data: data,
            success: function (data) { action(data); },
        });
    },
    UploadFile: function(file, field_name, callback, receiver) {
        if (!receiver) receiver = "/engine/upload.php";
        //
        let Data = new FormData();
        Data.append(field_name, file);
        //
        let XHR = new XMLHttpRequest();

        XHR.timeout = 3600 * 1000;
        XHR.onreadystatechange = function (response) { console.log(response); };
        XHR.onloadend = function (response) { callback(response); };
        XHR.open("POST", receiver, true);
        //
        XHR.upload.onprogress = function(e){
            if (e.lengthComputable) {
                AJAX.Progress.current = e.loaded;
                AJAX.Progress.total = e.total;
            }
            AJAX.Progress.onChanged(e);
        };

        XHR.upload.onloadstart = function(e){
            AJAX.Progress.current = 0;
            AJAX.Progress.onChanged(e);
        }

        XHR.upload.onloadend = function(e){
            AJAX.Progress.current = e.loaded;
            AJAX.Progress.onChanged(e);
        }
        //
        XHR.send(Data);
    },
    Request: function(config) {
        var XHR = AJAX.CreateXMLHTTP();
        //
        if (config.type == null) config.type = "GET";
        if (config.success == null) config.success = function (data) { console.log(data); };
        if (config.error == null) config.error = function (error) { console.log("AJAX error: " + error); };
        if (config.timeout == null) config.timeout = 60 * 10 * 1000;
        //
        var ToURL = function (arr) {
            var output = "";

            for (var key in arr) {
                if (typeof arr[key] != "function") {
                    output += key + "=" + encodeURIComponent(arr[key]) + "&";
                }
            }

            return output;
        };

        if (config.type == "POST" || config.type == "GET")
        {
            var POSTData = null;

            if (config.type == "POST") {
                POSTData = ToURL(config.data);
            }

            if (config.type == "GET") {
                config.url += "?" + ToURL(config.data);
            }

            //
            XHR.timeout = config.timeout;
            //XHR.responseType = "text";
            
            XHR.onprogress = function(e){
                if (e.lengthComputable) {
                    AJAX.Progress.current = e.loaded;
                    AJAX.Progress.total = e.total;
                }
                //console.log(e);
            };
            
            XHR.onloadstart = function(e){ AJAX.Progress.current = 0; }
            XHR.onloadend = function(e){ AJAX.Progress.current = e.loaded; }
            
            XHR.open(config.type, config.url, true);

            //console.log(XHR);

            if (config.type == "POST") XHR.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

            XHR.onreadystatechange = function () {
                if (XHR.readyState == 4) {
                    if (XHR.status == 200) {
                        config.success(XHR.responseText);
                    }
                    else {
                        config.error(XHR.statusText);
                    }
                }

            };

            XHR.send(POSTData);
        }
    },
    LoadScript: function (src, onload) {
        var s = document.createElement("script");
        s.type = "text/javascript";
        s.async = true;
        s.src = src;
        s.onload = function () {
            onload();
            console.log("LoadScript: " + src);
        };

        var preScript = document.getElementsByTagName("script")[0];
        preScript.parentNode.insertBefore(s, preScript);
    },
    LoadCSS: function (src) {
        var s = document.createElement("link");
        s.type = "text/css";
        s.href = src;
        s.rel = "stylesheet";
        s.media = "all";
        s.onload = function () {
            console.log("LoadCSS: " + src);
        };

        var preLink = document.getElementsByTagName("link")[0];
        preLink.parentNode.insertBefore(s, preLink);
    },
};
var Support = {
    isWebAssemblySupported: function(){
        return typeof WebAssembly != "undefined";
    },
    isWebGLSupported: function(){
        var return_context = false;
        
        if (!!window.WebGLRenderingContext) {
            var canvas = document.createElement("canvas"),
                names = ["webgl", "experimental-webgl", "moz-webgl", "webkit-3d"],
            context = false;

            for(var i = 0; i < names.length; i++) {
                try {
                    context = canvas.getContext(names[i]);
                    if (context && typeof context.getParameter == "function") {
                        // WebGL is enabled
                        if (return_context) {
                            // return WebGL object if the function's argument is present
                            return {name:names[i], gl:context};
                        }
                        // else, return just true
                        return true;
                    }
                } catch(e) {}
            }

            // WebGL is supported, but disabled
            return false;
        }

        // WebGL not supported
        return false;
    },
    GetBrowser: function(){
        var ua=navigator.userAgent,tem,M=ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || []; 
        //console.log(M[0]+" "+M[1]);
        if(/trident/i.test(M[1])){
            tem=/\brv[ :]+(\d+)/g.exec(ua) || []; 
            return {name:'IE',version:(tem[1]||'')};
            }   
        if(M[1]==='Chrome'){
            tem=ua.match(/\bOPR\/(\d+)/);
            if(tem!=null)   {return {name:'Opera', version:tem[1], chromeversion: M[2]};}
            // next
            tem=ua.match(/\bAmigo\/(\d+)/);
            if(tem!=null)   {return {name:'Amigo', version:tem[1], chromeversion: M[2]};}
            // next
            tem=ua.match(/\bYaBrowser\/(\d+)/);
            if(tem!=null)   {return {name:'Yandex', version:tem[1], chromeversion: M[2]};}
            
            /*for (var i=0; i<navigator.plugins.length; i++)
                if (navigator.plugins[i].name == 'Chromium PDF Viewer') {return {name:'Chromium', version:tem[1], chromeversion: M[2]};}*/
        }
        M=M[2]? [M[1], M[2]]: [navigator.appName, navigator.appVersion, '-?'];
        if((tem=ua.match(/version\/(\d+)/i))!=null)
        {
            M.splice(1,1,tem[1]);
        }
        return {
            name: M[0],
            version: M[1],
        };
    },
    isUnityInstalled: function() {
        var javaRegex = /Unity Player/, plugins = navigator.plugins;
        if (navigator && plugins) {
            for (plugin in plugins){
                if(plugins.hasOwnProperty(plugin) && javaRegex.exec(plugins[plugin].name)) {
                    return true;
                }
            }
        }
        return false;
    },
    isJavaAvailable: function() {
        var javaRegex = /(Java)(\(TM\)| Deployment)/, plugins = navigator.plugins;
        if (navigator && plugins) {
            for (plugin in plugins){
                if(plugins.hasOwnProperty(plugin) && javaRegex.exec(plugins[plugin].name)) {
                    return true;
                }
            }
        }
        return false;
    },
};



 



// dependency.. http://ajax.googleapis.com/ajax/libs/swfobject/2.2/swfobject.js

// json2.js (for ie7 and lower)
"object"!=typeof JSON&&(JSON={}),function(){"use strict"
function f(t){return 10>t?"0"+t:t}function quote(t){return escapable.lastIndex=0,escapable.test(t)?'"'+t.replace(escapable,function(t){var e=meta[t]
return"string"==typeof e?e:"\\u"+("0000"+t.charCodeAt(0).toString(16)).slice(-4)})+'"':'"'+t+'"'}function str(t,e){var r,n,o,f,u,p=gap,i=e[t]
switch(i&&"object"==typeof i&&"function"==typeof i.toJSON&&(i=i.toJSON(t)),"function"==typeof rep&&(i=rep.call(e,t,i)),typeof i){case"string":return quote(i)
case"number":return isFinite(i)?i+"":"null"
case"boolean":case"null":return i+""
case"object":if(!i)return"null"
if(gap+=indent,u=[],"[object Array]"===Object.prototype.toString.apply(i)){for(f=i.length,r=0;f>r;r+=1)u[r]=str(r,i)||"null"
return o=0===u.length?"[]":gap?"[\n"+gap+u.join(",\n"+gap)+"\n"+p+"]":"["+u.join(",")+"]",gap=p,o}if(rep&&"object"==typeof rep)for(f=rep.length,r=0;f>r;r+=1)"string"==typeof rep[r]&&(n=rep[r],o=str(n,i),o&&u.push(quote(n)+(gap?": ":":")+o))
else for(n in i)Object.prototype.hasOwnProperty.call(i,n)&&(o=str(n,i),o&&u.push(quote(n)+(gap?": ":":")+o))
return o=0===u.length?"{}":gap?"{\n"+gap+u.join(",\n"+gap)+"\n"+p+"}":"{"+u.join(",")+"}",gap=p,o}}"function"!=typeof Date.prototype.toJSON&&(Date.prototype.toJSON=function(){return isFinite(this.valueOf())?this.getUTCFullYear()+"-"+f(this.getUTCMonth()+1)+"-"+f(this.getUTCDate())+"T"+f(this.getUTCHours())+":"+f(this.getUTCMinutes())+":"+f(this.getUTCSeconds())+"Z":null},String.prototype.toJSON=Number.prototype.toJSON=Boolean.prototype.toJSON=function(){return this.valueOf()})
var cx=/[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,escapable=/[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,gap,indent,meta={"\b":"\\b","  ":"\\t","\n":"\\n","\f":"\\f","\r":"\\r",'"':'\\"',"\\":"\\\\"},rep
"function"!=typeof JSON.stringify&&(JSON.stringify=function(t,e,r){var n
if(gap="",indent="","number"==typeof r)for(n=0;r>n;n+=1)indent+=" "
else"string"==typeof r&&(indent=r)
if(rep=e,e&&"function"!=typeof e&&("object"!=typeof e||"number"!=typeof e.length))throw Error("JSON.stringify")
return str("",{"":t})}),"function"!=typeof JSON.parse&&(JSON.parse=function(text,reviver){function walk(t,e){var r,n,o=t[e]
if(o&&"object"==typeof o)for(r in o)Object.prototype.hasOwnProperty.call(o,r)&&(n=walk(o,r),void 0!==n?o[r]=n:delete o[r])
return reviver.call(t,e,o)}var j
if(text+="",cx.lastIndex=0,cx.test(text)&&(text=text.replace(cx,function(t){return"\\u"+("0000"+t.charCodeAt(0).toString(16)).slice(-4)})),/^[\],:{}\s]*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,"@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,"]").replace(/(?:^|:|,)(?:\s*\[)+/g,"")))return j=eval("("+text+")"),"function"==typeof reviver?walk({"":j},""):j
throw new SyntaxError("JSON.parse")})}()

var Recorder = (function(){
  
  // alert(location.href);
  if(location.href.indexOf('file:\/\/')==0){
    alert("Warning: Due to flash security restrictions snapper cannot load when accessed via file: protocol. Please test using a web server.");
    return; 
  }
  
  // -----------------------------------------------
  
  // helper funcs ( collection of hacks to make plain old js less painful )
  var noop = function(){};
  var console = window['console'] || {log: noop, debug: noop, info: noop, warn: noop, error: function(args){alert(args);}};
  var getXHR = function() { return window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP'); }
  var ajaxJSONPost = function(url, data, callback) {
    var oReq = getXHR();
    oReq.onload = function() { callback(this); };
    oReq.open('post', url, true);
    oReq.setRequestHeader('Content-type', 'application/json');
    oReq.send(JSON.stringify(data));
    return oReq;
  }

    
  // dom stuff
  var loadScriptTag = function(src, loaded, callback) {
    if(loaded()){
      callback();
      return;
    }
    // console.log("Loading missing javascript.", "swfobject", src);
    var scriptTag=document.createElement('scr'+'ipt');
    scriptTag.type = 'text/javascript';
    scriptTag.src=src;
    var head = document.getElementsByTagName("head")[0];
    head.appendChild(scriptTag);
    function check(){
      if(loaded()){
        callback();
      } else {
        setTimeout(check, 50);
      }
    };
    check(); 
  };
  var loadLinkTag = function(src){
    var link = document.createElement("link");
    link.setAttribute('rel','stylesheet');
    link.setAttribute('type','text/css');
    link.setAttribute('media', 'screen');
    link.setAttribute('charset', 'utf-8');
    link.setAttribute('href',src);
    document.getElementsByTagName("head")[0].appendChild(link);
    // <link rel="stylesheet" href="snapbox.css" type="text/css" media="screen" title="snapbox" charset="utf-8" />
  }
  var loadStyleTag = function(content){
    var style = document.createElement('style');
    style.setAttribute("type", "text/css");
    if (style.styleSheet) { // IE
        style.styleSheet.cssText = content;
    } else {                // the world
        var textNode = document.createTextNode(content);
        style.appendChild(textNode);
    }
    var head = document.getElementsByTagName('head')[0];
    head.appendChild(style);
  }
  var hasClassName = function(element, className) {
    var elementClassName = element.className;
    return (elementClassName.length > 0 && (elementClassName == className ||
      new RegExp("(^|\\s)" + className + "(\\s|$)").test(elementClassName)));
  };
  var addClassName = function(element, className) {
    if (!hasClassName(element, className))
      element.className += (element.className ? ' ' : '') + className;
    return element;
  };
  var removeClassName = function(element, className) {
    if(hasClassName(element, className)){
      element.className = element.className.replace(
        new RegExp("(^|\\s+)" + className + "(\\s+|$)"), ' ');
    }
    return element;
  };
  
  if(!document.getElementsByClassName){
    document.getElementsByClassName = function(className) {
      var docList = this.all || this.getElementsByTagName('*');
      var matchArray = new Array();
      /*Create a regular expression object for class*/
      var re = new RegExp("(?:^|\\s)"+className+"(?:\\s|$)");
      for (var i = 0; i < docList.length; i++) {
          if (re.test(docList[i].className) ) {
              matchArray[matchArray.length] = docList[i];
          }
      }
      return matchArray;
    };
  }
  
  // basic stuff
  var lower = function(obj){
    return obj.toString().toLowerCase();
  };
  var collect = function(list,func){
    var x = [];
    for(var i=0; i<list.length; i++){
      if(func(list[i])){
        x.push(list[i]);
      }
    }
    return x;
  }
  var each = function(list,func){
    var x = [];
    for(var i=0; i<list.length; i++){
      x.push(func(list[i]));
    }
    return x;
  }
  var first = function(list,func){
    var x;
    for(var i=0; i<list.length; i++){
      x = func(list[i]);
      if(x){
        return list[i];
      }
    }
  }
  var merge = function(a,b){
    obj = {};
    for(prop in a){
      obj[prop] = a[prop];
    }
    for(prop in b){
      obj[prop] = b[prop];
    }
    return obj;
  }
  
  var setData = function(obj, data){
    for(var prop in data){
      obj.setAttribute('data-'+prop, data[prop]);
    }
  };
  var getData = function(obj){
    var data = {};
    for(var i=0; i<obj.attributes.length; i++){
      if(obj.attributes[i].nodeName.indexOf('data-')==0){
        data[obj.attributes[i].nodeName.split("data-")[1]] = obj.attributes[i].nodeValue;
      }
    }
    return data;
  };
  var randId = function(){
    return "rand_"+Math.random().toString().replace('.','');
  };
  var validElementId = function(element){
    if(element.id){
      return element.id;
    } else {
      element.id = randId();
      return element.id;
    }
  };
  
  // positioning 
  var getScrollerWidth = function(){
      var scr = null;
      var inn = null;
      var wNoScroll = 0;
      var wScroll = 0;

      // Outer scrolling div
      scr = document.createElement('div');
      scr.style.position = 'absolute';
      scr.style.top = '-1000px';
      scr.style.left = '-1000px';
      scr.style.width = '100px';
      scr.style.height = '50px';
      // Start with no scrollbar
      scr.style.overflow = 'hidden';

      // Inner content div
      inn = document.createElement('div');
      //inn.style.width = '100%';
      inn.style.height = '200px';

      // Put the inner div in the scrolling div
      scr.appendChild(inn);
      // Append the scrolling div to the doc
      document.body.appendChild(scr);

      // Width of the inner div sans scrollbar
      wNoScroll = inn.offsetWidth;
      // Add the scrollbar
      scr.style.overflow = 'auto';
      // Width of the inner div width scrollbar
      wScroll = inn.offsetWidth;

      // Remove the scrolling div from the doc
      document.body.removeChild(
          document.body.lastChild);

      // Pixel width of the scroller
      return (wNoScroll - wScroll);
  };
  var getStyle = function(obj, styleProp){
    if (obj.currentStyle)
      return obj.currentStyle[styleProp];
    else if (window.getComputedStyle)
      return document.defaultView.getComputedStyle(obj,null).getPropertyValue(styleProp);
  };
  var getScrollPos = function(){
    var docElem = document.documentElement;
    return {
      scrollX: document.body.scrollLeft || window.pageXOffset || (docElem && docElem.scrollLeft),
      scrollY: document.body.scrollTop || window.pageYOffset || (docElem && docElem.scrollTop)
    };
  };
  var getPageSize = function(){
    return {
      width: window.innerWidth || (document.documentElement && document.documentElement.clientWidth) || document.body.clientWidth,
      height: window.innerHeight || (document.documentElement && document.documentElement.clientHeight) || document.body.clientHeight
    };
  };
  var getElementSize = function(obj){
    return {
      width: obj.offsetWidth || obj.style.pixelWidth,
      height: obj.offsetHeight || obj.style.pixelHeight
    };
  };
  
  // animation 
  var setOpacity = function(e, obj, value){
    obj.style.opacity = value/100;
    obj.style.filter = 'alpha(opacity=' + value + ')';
  };
  var fadeIn = function(obj, level, speed, callback){
    if (level === undefined) var level = 100;
    if (speed === undefined) var speed = 70;
    if (!speed)
    {
      setOpacity(null, obj, level*10);
      if (callback) callback();
      return;
    }
    setOpacity(null, obj, 0);
    for (var i=0; i<=level; i++){
      setTimeout(bind(setOpacity, obj, i*10), speed*i);
    }
    if (callback) setTimeout(callback, speed*(i+1));
  };
  var fadeOut = function(){}; // todo 
  var center = function(obj){
    var pageSize = getPageSize();
    var scrollPos = getScrollPos();
    var emSize = getElementSize(obj);
    var x = Math.round((pageSize.width - emSize.width) / 2 + scrollPos.scrollX);
    var y = Math.round((pageSize.height - emSize.height) / 2 + scrollPos.scrollY);
    obj.style.left = x + 'px';
    obj.style.top = y + 'px';
  };
  
  // events
  // var events = {};
  // var addEventListener = function(name, callback){
  //   if (!events[name]) events[name] = new Array();
  //   events[name].push(callback);
  // };
  // var fireEvent = function(name){
  //   if (events[name] && events[name].length){
  //     for (var i=0; i<events[name].length; i++){
  //       var args = [];
  //       for (var n=1; n<arguments.length; n++) {
  //         args.push(arguments[n]);
  //       }
  //       if (events[name][i](args) === false) {
  //         break;
  //       }
  //     }
  //   }
  // };
  var dispatchEvent = function(obj, type, bubble, canCancel){
    if(bubble == undefined){
      bubble = true;
    }
    if(canCancel == undefined){
      canCancel = true;
    }
    if(document.createEvent){
      var e = document.createEvent('HTMLEvents');
      if(e.initEvent){
        e.initEvent(type, bubble, canCancel);
      }
      if(obj.dispatchEvent){
        obj.dispatchEvent(e);
      }
    } else if(obj.fireEvent){
      obj.fireEvent('on'+type);
    }
  };
  var deferUntilReady = function(callback){
    var readyRun = false;
    var ready = function(){
      if(readyRun){
        return;
      }
      readyRun = true;
      callback();
    }
    var domReady = null;
    if ( document.addEventListener ) {
      domReady = function() {
        document.removeEventListener( "DOMContentLoaded", domReady, false );
        ready();
      };
    } else if ( document.attachEvent ) {
      domReady = function() {
        if ( document.readyState === "complete" ) {
          document.detachEvent( "onreadystatechange", domReady );
          ready();
        }
      };
    }
    var bindRun = false;
    var bind = function() {
      if(bindRun) {
        return;
      }
      bindRun = true;
      if ( document.readyState === "complete" ) {
        return ready();
      }
      if ( document.addEventListener ) {
        document.addEventListener( "DOMContentLoaded", domReady, false );
        window.addEventListener( "load", ready, false );
      } else if ( document.attachEvent ) {
        document.attachEvent("onreadystatechange", domReady);
        window.attachEvent( "onload", ready );
      }
    };
    bind();
  }
  var bindEvent = function(el, event, callback){
    if ( document.addEventListener ) {
      el.addEventListener(event, callback, false );
    } else if ( document.attachEvent ) {
      el.attachEvent( "on"+event, callback );
    }
  }
  
  var isIE6 = false; // todo fix!
  
  // -----------------------------------------------
  var assetRoot = "http://code.webcamsnapper.com.s3.amazonaws.com/";
  var asset = function(path){
    return assetRoot + path;
  }
  
  // -----------------------------------------------
  var docReady = false;
  var deferred = [];
  var snapperIdx = 0;
  
  // -----------------------------------------------
  
  var cssRules = function(){
    
    var overlayImageBase64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAIAAAACCAMAAABFaP0WAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAAZQTFRF////////VXz1bAAAAAJ0Uk5T/wDltzBKAAAAD0lEQVR42mJgYARCgAADAAAMAAMrbpwTAAAAAElFTkSuQmCC"; 
    var overlayImageURL = asset('images/overlay.png');
    
    var closeImageBase64 = "data:image/png;base64,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%3D";
    var closeImageURL = asset('images/close.png');
  
    var css = "\
    #snapbox {z-index:1000000; position:fixed;top:0;left:0;right:0;bottom:0;display:block;}\
    #snapbox_overlay\ {position:fixed;top:0;left:0;right:0;bottom:0;display:block;opacity:1;background-image:url('"+overlayImageBase64+"');z-index:1000000;}\
    #snapbox_wrapper {position:absolute;top:50%;left:50%;margin:-200px 0 0 -200px;display:block;padding:0;opacity:1;z-index:1000001;}\
    #snapbox_content {position:relative;display:block;overflow:visible;text-align:left;z-index:1000002;}\
    #snapbox_content object {display:block;}\
    #snapbox_content .snapbox_image {width:100%;height:100%;margin:0;padding:0;border:0;display:block;}\
    #snapbox_head a#snapbox_close\ {width:30px;height:30px;position:absolute;top:-10px;right:-10px;margin:0;padding:0;outline:0;border:none;text-indent:-9999999px;z-index:100000000;background-image:url('"+closeImageBase64+"');}\
    #snapbox_overlay {\
      *background-image:url('"+overlayImageURL+"');\
      _background-image:url('"+overlayImageURL+"');\
    }\
    #snapbox_head a#snapbox_close {\
      *background-image:url('"+closeImageURL+"');\
      _background-image:url('"+closeImageURL+"');\
    }\
    .webcam .webcam_thumb, .webcam .webcam_thumb img{width: 240px; }\
    .webcam.active .webcam_button  {display:none;}\
    .webcam.active .webcam_target {display:block;} \
    .webcam.active .webcam_thumb {display:none;}\
    .webcam.inactive .webcam_thumb {display:none;} \
    .webcam.inactive .webcam_target {display:none;} \
    .webcam.inactive.thumb_set .webcam_thumb {display:block;}\
    .webcam.inactive .webcam_button {display:block;}\
    body.flash_bug_fix_odd_width #snapbox_wrapper {padding-left: 0.5px; padding-right: -0.5px;}\
    body.flash_bug_fix_odd_height #snapbox_wrapper {padding-top: 0.5px; padding-bottom: -0.5px;}\
    ";
    
    return css;
  }

  var defaultSettings = function(){
    var settings = {
      swf: asset('recorder.swf'),
      width: 320, height: 240,
      wmode: 'opaque',
      server: 'rtmp://media.codegent.net/records',
      size: 'small',
      resolution : '320x240',
      bandwidth : 150,
      fps : 20,
      quality : 80,
      gain : 100,
      silence_level : 0,
      silence_timeout : 0,
      duration : 60,
      border : 'round shadow',
      // shadow: true,
      sizes: {
        tiny : [320,240],
        small : [400,300],
        standard : [480,360],
        medium : [560,420],
        large : [640,480],
        huge : [800,600]
      }
    };
    return settings;
  };

  var snapperURL = function(path) {
    if(location.href.indexOf('https://') == 0){
      return "https://webcamsnapper-hrd.appspot.com" + path;
    } else {
      return "http://www.webcamsnapper.com" + path;
    }
  }

  var defaultVars = function(){
    var vars = {
      onClickSaveVideoJS:"onClickSaved",
      onClickRecordingStopped:"onClickStopped",
      prepare_encoding_url: snapperURL('/prepare_video_encodings'),
      upload_url: snapperURL('/push_video'),
      output_formats: ['png','flv','mp4','mp4_640x480','3gp'],
      customHexColor:"FFFFFF",
      padding:"0,0,0,0",
      recordServer:'rtmp://media.codegent.net/records',
      recordName:"",
      previewServer:'rtmp://media.codegent.net/records',
      maxRecordDuration:60,
      camFullWidth:640,
      camFullHeight:480,
      cam_max_bandwidth:250,
      camFPS:20,
      camQuality:80,
      micGain:100,
      micSilenceLevel:0,
      micSilenceTimeout:0,
      hideSoundDetect:1,
      hideInfoBtn:1,
      video_border_size:1,
      video_border_color:'999999',
      show_setting_on_start:0,
      camera_security_type:1,
      auto_save: 0, 
      backgroundType:'bgRoundWithShadow',
      padding:"20,20,5,20",
      ignoreSO: 1,
      license_domain : "",
      license_key : "",
    };
    return vars;
  };
  var globalSettings;
  
  var ua = navigator.userAgent.toLowerCase();
  var firefox = (ua.indexOf('firefox') != -1 && ua.indexOf('mac os x') != -1);
  
  var firefoxPixelFlashBugByClass = function(){
    if(firefox){
      removeClassName(document.body, 'flash_bug_fix_odd_width');
      removeClassName(document.body, 'flash_bug_fix_even_width');
      removeClassName(document.body, 'flash_bug_fix_odd_height');
      removeClassName(document.body, 'flash_bug_fix_even_height');
      var w = document.documentElement.clientWidth;
      var h = document.documentElement.clientHeight;
      addClassName(document.body, 'flash_bug_fix_'+( (w % 2 == 0) ? 'even' : 'odd' )+'_width');
      addClassName(document.body, 'flash_bug_fix_'+( (h % 2 == 0) ? 'even' : 'odd' )+'_height');
    }
  };
  
  if(firefox){
    bindEvent(window, 'resize', firefoxPixelFlashBugByClass);
  }
  // firefoxPixelFlashBugByClass();
  
  var firefoxPixelFlashBugFixByResizeWindow = function(){
    if(firefox){
      var rx = document.documentElement.clientWidth % 2 == 1 ? -1 : 0; 
      var ry = document.documentElement.clientHeight % 2 == 1 ? -1 : 0;
      if(rx != 0 || ry != 0){
        window.resizeBy(rx, ry); // note this gives warning for some users. ugly!
      }
    }
  };
  
  var SnapBox = (function(){
    
    var box;
    var wrapper;
    var content;
    var overlay;
    var close;
    var overflow = 'auto';
    
    var showing = false;
    var close;
    
    var hide = function(){
      if(box.style.display=='none'){
        return;
      }
      box.style.display = 'none';
      // content.innerHTML = '';
      if(box.parentNode) {
        box.parentNode.removeChild(box);
      }
      box = undefined;
      showing = false;
      if(closeCallback){
        closeCallback();
      }
    };
    
    var insert = function(){
      box = document.getElementById('snapbox');
      if(box){
        return;
      }
      box = document.createElement('div');
      box.setAttribute('id', 'snapbox');
      box.innerHTML = '\
        <div id="snapbox_overlay"></div>\
        <div id="snapbox_wrapper">\
          <div id="snapbox_head"><a id="snapbox_close" href="javascript:void(0)">close</a></div>\
          <div id="snapbox_content"></div>\
        </div>';
      box.style.display = 'none';
      document.body.appendChild(box);
      overlay = document.getElementById('snapbox_overlay');
      wrapper = document.getElementById('snapbox_wrapper');
      content = document.getElementById('snapbox_content');
      close = document.getElementById('snapbox_close');
      // bindEvent(window, 'scroll', reposition);
      // bindEvent(window, 'resize', reposition);
      bindEvent(close, 'click', hide);
      bindEvent(window, 'keypress', function(e){ if (e.keyCode == (window.event ? 27 : e.DOM_VK_ESCAPE)) { hide() }});
    };
    
    var show = function(html, width, height, callback){ 
      showing = true;
      closeCallback = callback;
      insert();
      content.style.width = ''+width+'px';
      content.style.height = ''+height+'px';
      content.innerHTML = html;
      wrapper.style.margin = '-'+(height/2)+'px 0px 0px -'+(width/2)+'px';
      box.style.display = 'block';
      firefoxPixelFlashBugByClass();
    };
    
    return {
      show : show, 
      hide : hide
    };
    
  })();

  
  function findPos(obj) {
    var curleft = curtop = 0;
    if (obj.offsetParent) {
      curleft = obj.offsetLeft
      curtop = obj.offsetTop
      while (obj = obj.offsetParent) {
        curleft += obj.offsetLeft
        curtop += obj.offsetTop
      }
    }
    return [curleft,curtop];
  }
  
  var lastSnapperId; // bit of a hack
  
  var initFlash = function(swf, target, width, height, settings, vars){
    var version = '9.0.0';
    var expressInstall = '';
    var params = {"allowScriptAccess":"always", "wmode": settings['wmode'] || 'normal'}; // "bgcolor": "000000"
    var id = "recorder"+snapperIdx;
    var attrs = {id:id, name: "recorder"+snapperIdx};
    snapperIdx++;
    loadScriptTag(
      '//ajax.googleapis.com/ajax/libs/swfobject/2.2/swfobject.js', 
      function(){return window['swfobject'];}, 
      function(){
        swfobject.embedSWF(swf, target, width.toString(), height.toString(), version, expressInstall, vars, params, attrs);  
        lastSnapperId = id;       
      }
    );
  };
  
  var backToCapture = function(){
    document.getElementById(lastSnapperId).backToCapture();
  };
  
  // callbacks
  var globalCallback = function(callback){
    var handlerName = 'handler_'+randId();
    window[handlerName] = callback;
    // console.log(window[handlerName]);
    return handlerName;
  }
  
  // make sure we dont get errors from calling non existant js handlers
  var recordHandlers = ['onRecordComplete', 'onStartRecord', 'onCancelRecord'];
  each(recordHandlers, function(recordHandler){
    if(window[recordHandler] == undefined){
      window[recordHandler] = noop;
    }
  });
  
  var display = function(mode, args){
  
    // settings
    var settings = {};
    if(lower(typeof(args))=='function'){
      settings = {'complete': args};
    } else if(lower(typeof(args))=='string'){
      var id = args;
      var callback = function(snap){
        var element = document.getElementById(id);
        element.value = snap; 
        dispatchEvent(element, 'change');
      }
      settings = {'complete': callback };
    } else {
      settings = args || {}; 
    }
    
    // console.debug(globalSettings);
    
    settings = merge(globalSettings, settings);
    
    // vars
    var vars = defaultVars();
    
    // size 
    if(settings['size']){
      var dims = settings['sizes'][settings['size']] || settings['sizes']['standard'];
      settings['width'] = dims[0];
      settings['height'] = dims[1];
    }
    
    if(settings['border']){
      settings['backgroundType'] = "bg";
      settings['backgroundType'] += (settings['border'].indexOf('round') != -1) ? 'Round' : 'Rect';
      settings['backgroundType'] += (settings['border'].indexOf('shadow') != -1) ? 'WithShadow' : 'WithoutShadow';
    }
    
    if(settings['resolution']){
      // should really check the format here.
      var dims = settings['resolution'].split("x");
      if(dims.length == 1){ dims[1] = Math.round(parseInt(dims[0]) / 4 * 3); }
      settings['camFullWidth'] = dims[0];
      settings['camFullHeight'] = dims[1];
    }

    if(settings['camera_security_type'] != undefined){
      if(settings['camera_security_type']=='remember'){
        settings['camera_security_type'] = 1;
      } else {
        settings['camera_security_type'] = 0;
      }
    }
    
    // friendly names
    
    settings['recordServer'] = settings['server']; 
    settings['previewServer'] = settings['server'];
    settings['maxRecordDuration'] = settings['duration'];
    settings['cam_max_bandwidth'] = settings['bandwidth'];
    settings['camFPS'] = settings['fps'];
    settings['camQuality'] = settings['quality'];
    settings['micGain'] = settings['gain'];
    settings['micSilenceLevel'] = settings['silence_level'];
    settings['micSilenceTimeout'] = settings['silence_timeout'];
    
    
    // overwrite from settings
    for(prop in vars){
      if(settings[prop]){
        vars[prop] = settings[prop];
      }
    }
 
    var complete = settings['complete'];

    // Send the urls of the encoded videos to the 'complete' callback.
    vars['onClickSaveVideoJS'] = globalCallback(function(data) {
      setTimeout(function() {
        complete(JSON.parse(data[0]));
        backToCapture();
      }, 100);
      SnapBox.hide();
    });


    // Tell webcamsnapper api a video has been created, so it can start the
    // encoding process if necessary.
    vars['onClickRecordingStopped'] = globalCallback(function(data) {
      var url = vars['prepare_encoding_url'];
      var videoID = data[0];
      var postData = {
        license_key: vars['license_key'],
        license_domain: vars['license_domain'],
        video_id: videoID,
        output_formats: vars['output_formats']
      }
      uploadReq = ajaxJSONPost(url, postData, function(res) {});
    });

    
    var width = (settings['width']) ? parseInt(settings['width']) : 480;
    var height = (settings['height']) ? parseInt(settings['height']) : 360;
    var padding = each(vars['padding'].split(","),function(x){return parseInt(x);});
    var border_size = parseInt(vars['video_border_size']); 
    
    width+=padding[1] + padding[3];
    height+=padding[0] + (padding[2]*2);

    height += 56;
    
    var swf = settings['swf'];
  
    if(mode == 'show'){
      // vars['show_confirm_screen'] = false;
      SnapBox.show('<div id="snapbox_target"></div>', width, height, settings['close']);
      window.setTimeout(function(){
        initFlash(swf, 'snapbox_target', width, height, settings, vars);
      }, 100); 
    } else {
      var target = settings['target'];
      if(typeof(target) != 'string'){
        target = validElementId(target);
      }
      // console.log(settings, vars);      
      // vars = {};
      initFlash(swf,target, width, height, settings, vars);
    }
    
  }

  // -----------------------------------------------

  // wait until the page has loaded.
  deferUntilReady(function(){
    docReady = true;
    // alert("settings");
    // alert(assetRoot);
    globalSettings = merge(defaultSettings(),globalSettings || {});
    each(deferred, function(x){x();});
    // stylesheet. 
    if(globalSettings['style']==undefined){
      globalSettings['style'] = cssRules();
    };
    if(globalSettings['style'].indexOf('http')==0){
      loadLinkTag(globalSettings['style']);
    } else {
      loadStyleTag(globalSettings['style']);
    }
    firefoxPixelFlashBugByClass();
  });

  // -----------------------------------------------

  // public
  var configure = function(settings){
    var updateConfig = function(){
      if(settings['asset_root']){
        assetRoot = settings['asset_root']; 
      }
      globalSettings = merge(globalSettings, settings);
    }
    if(!docReady){
      deferred.push(updateConfig);
      return; 
    }
    return updateConfig();
  };
  var show = function(args){
    if(!docReady){
      deferred.push(function(){display('show', args);});
      return; 
    }
    return display('show', args);
  };
  var embed = function(args){
    if(!docReady){
      if(typeof(args)=='function'){
        var target = randId();
        document.write('<div id="'+target+'" class="snapper"></div>');
        args = {target:target, complete:args};
      }
      deferred.push(function(){display('embed', args);});
      return; 
    }
    return display('embed', args);
  };
  
  var version = "1.0"; 
  
  return {
    version : version,  
    configure : configure,
    embed : embed,
    show : show, 
    backToCapture : backToCapture,
    assetRoot : assetRoot,
    setAssetRoot : function(x){assetRoot=x;}
  };
  
})();

if(location.href.indexOf("https://")==0){
  Recorder.setAssetRoot('//webcamsnapper-hrd.appspot.com/release/20140522/');
} else {
  Recorder.setAssetRoot('http://www.webcamsnapper.com/release/20140522/');
}

if(location.href.indexOf("http://localhost:8081")==0){
  Recorder.setAssetRoot('http://localhost:8081/latest/');
}
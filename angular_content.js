
var bannerExists = false;
var image;
$(document).ready(function(){
  $(document).mousemove(function(event){
    if (event.pageX == 0 && !bannerExists){
      bannerExists = true;
      getScreenshot(function(response){
        image = response.screenshotUrl;
        //constructBanner();
        console.log('constructin gbanner');
        $(document.body).prepend(banner);
      });
    }
  });
});
function startAngular(){
  var myApp = angular.module('contentApp', ['ngRoute']);

  myApp.controller("HomeCtrl", function ($scope) {
    $scope.msg = 'hi there david';
  });
}

function getScreenshot(callback){
  chrome.extension.sendMessage({name:'screenshot'}, function(response){
    callback(response);
  });
  //mock = {};
  //mock.screenshotUrl = 'asdf';
  //callback('asdf');
}

function constructBanner(){
  $(document.body).prepend(banner);
  $(BANNER).mouseleave(function(){
    $(BANNER).remove();
    bannerExists = false;
  });
  lookupResults();
  activateInput();
  addInput();
  pullGolinks();
}

function pullGolinks(){
  $(GOLINKS).html('');
  q = new Parse.Query(ParseGoLink);
  q.descending('createdAt');
  q.startsWith('url', 'https://www.youtube.com');
  q.find({
    success:function(golinks){
      _.each(golinks, function(golink){
        golink_div = $('<div class = "pull-left golink"></div>');
        //$(golink_div).html('<a href = "'+golink.get('url')+'">'+golink.get('key')+'</a>');
        if(golink.get('image') && golink.get('image') != ''){
          img = $('<img></img>');
          $(img).attr('src', golink.get('image').url());
          a = $('<a></a>');
          $(a).attr('src', golink.get('image').url());
          $(a).append(img);
          $(golink_div).append(a);
        }
        $(GOLINKS).append(golink_div);
      });
    }
  });
}
function addGolink(){
  key = $('#key-input').val();
  url = window.location.href;
  var base64 = image.split('base64,')[1];
  name = 'uploaded_img.jpg';
  var parseFile = new Parse.File(name, { base64: base64 });
  parseFile.save().then(function(){
    golink = new ParseGoLink();
    golink.set('image', parseFile);
    golink.set('key', key);
    golink.set('url', url);
    golink.save({
      success:function(data){
        $('#key-input').val('');
        pullGolinks();
      }
    });
  });
}
  
function addInput(){
  $(IMAGE).attr('src', image);
}

function lookupResults(){
  //add results to banner
  lookupUrl(window.location.href, function(golinks){
    if(golinks.length == 0){
      $(LOOKUP).text('No matches');
    }
    else{
      keys =  _.map(golinks, function(x){
        return 'pbl.link/'+x.get('key');
      });
      $(LOOKUP).text('Links for this url: '+keys.join(','));
      //_.each(golinks, function(golink){
        //item = $('<div class = "url-result"></div>');
        //$(item).text(golink.get('key'));
        //$(LOOKUP).append(item);
      //});
    }
  });
}


function activateInput(){
  $('#key-input').keypress(function(e){
    if(e.which== 13){
      addGolink();
    }
  });
}

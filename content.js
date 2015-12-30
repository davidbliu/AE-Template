var bannerExists = false;
var image;
var myId;
chrome.extension.sendMessage({name:'getId'}, function(response){
  myId = response.id;
});

//$(document).mousemove(function(event){
  //if (event.pageX < 10 && !bannerExists){
    //bannerExists = true;
    //constructBanner(banner);
  //}
//});



function getScreenshot(callback){
  chrome.extension.sendMessage({name:'screenshot'}, function(response){
    callback(response);
  });
}

function constructBanner(banner){
  $(document.body).prepend(banner);
  $(IMAGE).attr('src', image);
  $(BANNER).mouseleave(function(){
    $(BANNER).remove();
    bannerExists = false;
  });
 //lookupResults();
  //activateInput();
  //pullGolinks();
  chrome.extension.sendMessage({name:'tabs'}, function(tabs){
    displayTabs(tabs);
  });
  displayLinks();
  pullSocialTabs();
}

function pullGolinks(){
  q = new Parse.Query(ParseGoLink);
  q.descending('createdAt');
  q.find({
    success:function(golinks){
      displayGolinks(golinks);
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
      //$(LOOKUP).text('Links for this url: '+keys.join(','));
      _.each(golinks, function(golink){
        result = $('<div></div>');
        $(result).text('pbl.link/'+golink.get('key'));
        $(LOOKUP).append(result);
      });
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

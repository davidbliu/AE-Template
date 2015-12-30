console.log('hi from content script');
console.log(document);
console.log(window.location.href);
var bannerExists = false;
var image;
$(document).ready(function(){
  //append banner
  //fade out banner
  var iframe = document.createElement('iframe');
  iframe.src = chrome.extension.getURL("banner.html");
  iframe.className = 'css-isolation-popup';
  iframe.frameBorder = 0;

  $(document).mousemove(function(event){
    if (event.pageX == 0 && !bannerExists){
      bannerExists = true;
      getScreenshot(function(response){
        image = response.screenshotUrl;
        constructBanner();
      });
    }
  });
});
function getScreenshot(callback){
  console.log('getting screenshot');
  chrome.extension.sendMessage({name:'screenshot'}, function(response){
    callback(response);
  });
}

function constructBanner(){
  var banner = $('<div></div>');
  $(banner).attr('id', 'banner');
  removeBanner(banner);
  lookupResults(banner);
  addInput(banner);
  $(document.body).prepend(banner);
  activateInput();
}

function addInput(banner){
  input = $('<input type = "text" placeholder = "key"></input>');
  $(input).addClass('golink-input');
  $(input).attr('id', 'key-input');
  button = $('<button></button>');
  $(banner).append(input);
  img = $('<img class = "thumbnail-img"></img>');
  $(img).attr('src', image);
  $(banner).append(img);
}

function lookupResults(banner){
  results = $('<div class = "results"></div>')
  $(results).prepend('<h3>URL Matches</h3>');
  $(banner).append(results);
  //add results to banner
  resultsDiv = $('<div></div>');
  lookupUrl(window.location.href, function(golinks){
    if(golinks.length == 0){
      results.text('Not a PBL Link...yet');
    }
    else{
      _.each(golinks, function(golink){
        item = $('<div></div>');
        $(item).text(golink.get('key'));
        $(results).append(item);
      });
    }
  });
}
function removeBanner(banner){
  $(banner).mouseleave(function(){
    $(banner).fadeOut();
    bannerExists = false;
  });
}

function lookupUrl(url, callback){
  q = new Parse.Query(ParseGoLink);
  q.startsWith('url', url);
  q.find({
    success:function(golinks){
      callback(golinks);
    }
  });
}

function activateInput(){
  console.log('activating input')
  $('#key-input').keypress(function(e){
    if(e.key == 13){
      key = $(this).val();
      golink = new ParseGoLink();
      golink.key = key;
      golink.url = window.location.href;
      golink.save({
        success:function(golink){
          console.log('saved');
          $('#key-input').val('');
        }
      });
    }
  });
}

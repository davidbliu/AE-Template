var banner = ''
+ '<div class = "twbs" id = "content-banner">'
+   '<div id = "tabs-container">'
+     '<h3>My Tabs</h3>'
+   '</div>'
+   '<div id = "other-tabs-container">'
+     '<h3>Social Tabs</h3>'
+     '<div id = "social-tabs-container"></div>'
+   '</div>'
+   '<div>'
+     '<h3>Featured</h3>'
+       '<div id = "golinks-container"></div>'
+   '</div>'
+ '</div>';
console.log(banner);

var editBanner = ''
+ '<div class = "twbs" id = "content-banner">'
+  '<h3 id = "edit-h3"></h3>'
+  '<input type="text" id = "golink-keys-input" class="form-control" placeholder = "Add keys (ie: pbl.link/key)">'
+  '<div class = "btn btn-default" id = "bookmark-it-btn"><i class = "glyphicon glyphicon-bookmark"></i> Bookmark it!</div>'
+ '</div>';

var options_div = ''
+ '<div class = "options-div">'
+   '<div class = "bookmark-golink"><i class = "glyphicon glyphicon-bookmark"></i> Bookmark this</div>'
+   '<div><i class = "glyphicon glyphicon-pencil"></i> <input type = "text" placeholder = "Add aliases"></div>'
+ '</div>';

var IMAGE = '#thumbnail-img';
var LOOKUP = '#lookup-results';
var BANNER = '#content-banner';
var GOLINKS = '#golinks-container';
var TABS = '#tabs-container';
var BOOKMARK = '#bookmark-it-btn';
var KEYS= '#golink-keys-input';
var SHARING = '#sharing-toggle';

var timeoutId = 0;
var clicks = 0;
var editTab;
function pullSocialTabs(){
  q = new Parse.Query(SocialTabs);
  q.find({
    success:function(data){
      _.each(data, function(entry){
        tabs = entry.get('tabs').tabs;
        //_.each(tabs, function(tab){
          //$('#social-tabs-container').append('<div>'+tab.title+'</div>');
        //});
      });
    }
  });
}
function displayTabs(tabs){
  console.log(tabs);
  console.log('those were tabs');
  _.each(tabs, function(tab){
    tab_div = $('<div class = "tab-div"></div>');
    $(tab_div).append('<img src = "'+tab.favIconUrl+'" class = "favicon-img"></img>');
    $(tab_div).append('<a href = "javascript:void(0);" class = "tab-span" data-tab-id = "'+tab.id+'">'+tab.title+'</a>');
    $(TABS).append(tab_div);
  });
  //activate adding
  $('.add-icon').click(function(){
    tabId = parseInt($(this).attr('data-tab-id'));
  });
  //activate tabswitch
  $('.tab-span').on('click', function(e){
    that = $(this);
    clicks++;
    tabid = parseInt($(this).attr('data-tab-id'));
    if(clicks == 1){
      timeoutId = setTimeout(function(){
        clicks = 0;
        chrome.extension.sendMessage({name:'switchTab', tab_id:tabid}, function(){});
      }, 500);
    }
    else{
      clearTimeout(timeoutId);
      clicks = 0;
      $(BANNER).remove();
      constructBanner(editBanner);
      showEdit(tabid);
    }
  });
}

//populate editBanner
function showEdit(tabid){
  chrome.extension.sendMessage({name:'getTab', tab_id:tabid}, function(tab){
    //save editTab for later
    editTab = tab;
    $('#edit-h3').append('<img src = "'+tab.favIconUrl+'">');
    $('#edit-h3').append('<span>'+tab.title+'</span>');
    $(BOOKMARK).click(function(){
      addLink(editTab.id);
    });
  });
}

function addLink(tabId){
  chrome.extension.sendMessage({name:'getTab', tab_id:tabId}, function(tab){
    link = new Link();
    link.set('title', tab.title);
    link.set('url', tab.url);
    link.set('faviconUrl', tab.favIconUrl);
    link.set('permissions', 'Only Me');
    link.set('keys', $(KEYS).val().split(','));
    link.save(null, {
      success:function(data){
        $(BANNER).prepend('<h1>Bookmark created!</h1>');
      }
    });
  });
}


function displayLinks(){
  $(GOLINKS).html("");
  q = new Parse.Query(Link);
  q.descending('createdAt');
  q.find({
    success:function(links){
      _.each(links, function(link){
        link_div = $('<div class = "tab-div"></div>');
        $(link_div).append('<img src = "' + link.get('faviconUrl')+'" class = "favicon-img"></img>');
        $(link_div).append('<a href = "'+link.get('url')+'" target = "_blank">'+link.get('title')+'</a>');
        $(GOLINKS).append(link_div);
      });
    }
  });
}

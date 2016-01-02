var MAIN_WINDOW = ''
+ '<div class = "dodo-window twbs" id = "dodo-main-window">'
+   '<div class = "pull-right">'
+     '<a href = "#">x</a>'
+   '</div>'
+   '<div>Wtcha Dodo</div>'
+ '</div>';

var ACTIVE_WINDOW = ''
+ '<div class = "dodo-window twbs" id = "dodo-active-window">'
+   '<ul class = "list-group" id = "dodo-active-list"></ul>'
+ '</div>';

function createActiveDiv(activeTab, user){

  var activeDiv = ''
  + '<li class = "list-group-item" class = "dodo-active-li">'
  +   '<span class = "dodo-user-div">'
  +     '<img class = "profile-img" src = "'+user.photoUrl+'">'
  +     user.displayName + ' : '
  +   '</span>'
  +   '<span>'
  +     '<img class = "favicon-img" src = "'+activeTab.favIconUrl+'">'
  +     '<a href = "'+activeTab.url+'">'+activeTab.title+'</a>'
  +   '</span>'
  + '</li>';
  return activeDiv;

}
function showActiveWindow(active, userDict){
  $('#dodo-active-window').each(function(){
    $(this).remove();
  });
  $(document.body).prepend(ACTIVE_WINDOW);
  //add stuff to it
  _.each(_.keys(active), function(key){
    var activeDiv = createActiveDiv(active[key], userDict[key]);
    $('#dodo-active-list').append(activeDiv);
  });
  $('#dodo-active-window').click(function(){
    $(this).fadeOut('fast', function(){
      $('#dodo-active-window').remove();
    });
  });
}


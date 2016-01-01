console.log("comments");

var COMMENT_BOX = ''
+ '<div id = "comment-box" class = "twbs">'
+ '</div>';

console.log(COMMENT_BOX);


function showComments(comments){
  $('#comment-box').append('<ul id = "comment-list" class = "list-group"></ul>');
  _.each(comments, function(comment){
    var comment_li = $('<li class = "list-group-item">'+comment+'</li>');
    $('#comment-list').append(comment_li);
  });
}

var comments = [];
comments.push('hi there david');
comments.push('what are you doing');
comments.push('this is cool');
//showComments(comments);
//

var mouseX;
var mouseY;
$(document).mousedown(function(e){
  mouseX = e.pageX;
  mouseY = e.pageY;
  console.log('clicked on '+e.pageX+','+e.pageY);
});
$(document).ready(function(){

function updateComments(comments){
  $('.dodo-comment-div').each(function(){
    $(this).remove();
  });
  _.each(comments, function(comment){
    insertComment(comment);
  });
}  

function insertComment(comment){
  var cdiv = $('<div></div>');
  $(cdiv).addClass('dodo-comment-div');
  $(cdiv).text(comment.content);
  $(cdiv).css('left', '0px');
  $(cdiv).css('top', '0px');
  $(document.body).prepend(cdiv);
  $(cdiv).animate({
    left:'+='+comment.left+'px',
    top:'+='+comment.top+'px'
  },100);
}  

//get comments on initial load
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
  if(request.name && request.name == 'comment'){
    console.log('received comment: '+request.comment);
    console.log('comment is at '+mouseX + ','+mouseY);
    comment = {
      content:request.comment,
      left:mouseX,
      top:mouseY,
      url:window.location.href
    }
    //post comment to background page
    chrome.extension.sendMessage({name:'postComment', comment:comment}, function(x){});
    insertComment(comment);
  }
  if(request.name && request.name == 'updateComments'){
    console.log('content: updating comments');
    console.log(request.comments);
    updateComments(request.comments);
  }
});

});

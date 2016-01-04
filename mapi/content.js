chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
if(request.api && request.api == 'mapi' && isValidMapiRequest(request)){
  if(request.recipient == 'copilot'){
    handleCopilotMessage(request, sendResponse);
  }
  if(request.recipient == 'copilot_webpage'){
    window.postMessage(request, '*');
  }
  if(request.recipient == 'content'){
    handler = contentHandlers[request.type];
    if(handler != null){
      handler(request);
    }
  }
  if(request.recipient == 'background'){
    chrome.extension.sendMessage(request, null);
  }
}
});

var contentHandlers = {
  test:function(message){
    //console.log('content: handling test mapi message');
  },
  newComment:function(message){
    //console.log('content: new comment was created');
    createComment(message.comment);
  },
  updateComments:function(message){
    updateComments(message.comments);
  },
  active:function(message){
    //console.log('content: active received');
    showActiveWindow(message.active, message.userDict);
  }


};

//messages from the webpage
window.addEventListener('message', function(event){
  if(event.data.api && event.data.api == 'mapi'){
    message = event.data;
    if(isValidMapiRequest(message)){
      if(message.recipient == 'copilot'){
        handler = copilotHandlers[message.type];
        if(handler != null){
          handler(message);
        }
      }
      else{
        if(message.recipient == 'background'){
          chrome.extension.sendMessage(message, null);
        }
        if(message.recipient == 'content'){
          //send to content script via background page
          chrome.extension.sendMessage(message, null);
        }
      }
    }
  }
});

function handleCopilotMessage(message, callback){
  //console.log('copilot: handleCopilotMessage called');
  //console.log(message);
  if(message.type == 'getPopupHtml'){
    response = {};
    response.tabs = $('#tabs-div').html();
    response.bookmarks = $('#bookmarks-div').html();
    response.collaborators = $('#collaborators-div').html();
    //console.log(response);
    callback(response);
  }
}
var copilotHandlers = {
  test:function(message){
    //console.log('copilot: this was a mapi test');
  }
}


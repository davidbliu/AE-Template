chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
if(request.api && request.api == 'mapi' && isValidMapiRequest(request)){
  if(request.recipient == 'background'){
    handler = backgroundHandler[request.type];
    if(handler != null){
      handler(request, sendResponse);
    }
  }
  if(request.recipient == 'content'){
    chrome.tabs.query({url: request.url}, function(tabs){
      if(tabs.length > 0){
        chrome.tabs.sendMessage(tabs[0].id, request, null);
      }
    });
  }
  if(request.recipient  == 'copilot' || request.recipient == 'copilot_webpage'){
    chrome.tabs.sendMessage(copilotTab.id, request, null);
  }
}
});

function sendToCopilot(message){
  if(copilotTab != null){
    chrome.tabs.sendMessage(copilotTab.id, message, null);
  }
}

var backgroundHandler = {
  getCopilotTab: function(message, callback){
    callback(copilotTab);
  },
  setCopilotTab: function(message, callback){
    copilotTab = message.copilotTab;
  },
  activeChanged: function(message, callback){
    myActive = message.active;
    userDict = message.userDict;
    // send data to 
    chrome.tabs.query({active:true},function(tabs){
      tab = tabs[0];
      msg = {
        api:'mapi',
        sender:'background',
        recipient:'content',
        active:myActive,
        type:'active',
        userDict:userDict
      };
      chrome.tabs.sendMessage(tab.id, msg);
    });
  },
  getState: function(message, callback){
    callback({active:myActive, userDict: userDict});
  }

};


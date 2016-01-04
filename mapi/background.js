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
    //copilotTab = message.copilotTab;
    //console.log("deprecated");
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
  },
  connectCopilot: function(message, callback){
    chrome.tabs.query({title:'COPILOT'}, function(tabs){
      if(tabs.length > 0){
        handleCopilotConnect(tabs[0]);
        // send tabs as an ACK
        chrome.tabs.query({windowId: copilotTab.windowId}, function(tabs){
          sendTabs(tabs);
        });
      }
    });
  },
  closeCopilot: function(message, callback){
    if(copilotTab != null){
      chrome.tabs.remove(copilotTab.id, null);
    }
  },
  removeTab: function(message, callback){
    chrome.tabs.remove(message.tab.id, null);
  },
  redirectLink: function(message, callback){
    chrome.tabs.query({url: message.url}, function(tabs){
      if(tabs.length == 0){
        try{
          chrome.tabs.get(parseInt(message.tabId), function(tab){
            if(tab != null && tab.id != null){
              chrome.tabs.update(tab.id, {active:true}, null);
            }
            else{
              chrome.tabs.create({active:true,url:message.url},null);
            }
          });
        }
        catch(err){
            chrome.tabs.create({active:true, url:message.url}, null);
        }
      }
      else{
        chrome.tabs.update(tabs[0].id, {active:true}, null);
      }
    });
  }
};


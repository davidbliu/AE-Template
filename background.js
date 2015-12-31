var tabScreenshots = {};
var copilotTab;
var myEmail;
var myId;
chrome.identity.getProfileUserInfo(function(userInfo){
  myId = userInfo.id;
  console.log(myId);
});

chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
  if(request.name == 'getId'){
    sendResponse({id:myId});
  }
  if(request.name == 'getCopilotTab'){
    sendResponse(copilotTab);
  }
  if(request.name == 'setCopilotTab'){
    console.log('setting copilot tab');
    copilotTab = request.copilotTab;
  }
  if(request.name =='popup_request'){
    if(copilotTab != null){
      chrome.tabs.sendMessage(copilotTab.id, {name:'popup'}, function(response){
        sendResponse(response);
      });
    }
    else{
      sendResponse({html:'<h1>no copilot tab open</h1>'});
    }
  }
  if(request.name =='open_webpage'){
    console.log('temporarily disabled');
    //if(copilotTab != null){
      //chrome.tabs.update(copilotTab.id, {selected:true});
    //}
    //else{
      //chrome.tabs.create({url:copilotSite}, function(tab){
        //copilotTab = tab;
      //});
    //}
  }
  if (request.name == 'screenshot') {
      chrome.tabs.captureVisibleTab(null, {quality:5}, function(dataUrl) {
        sendResponse({ screenshotUrl: dataUrl });
        //save screenshot in dict
        tabScreenshots[tab.id] = dataUrl;
      });
  }
  if(request.name == 'tabs'){
    chrome.tabs.query({}, function(tabs){
      sendResponse(tabs);
    });
  }
  if(request.name == 'getTab'){
    chrome.tabs.get(request.tab_id, function(tab){
      sendResponse(tab);
    });
  }
  if(request.name == 'switchTab'){
    chrome.tabs.update(request.tab_id, {selected:true});
  }
  if(request.name == 'registerPush'){
    registerForPush();
    sendResponse('hi noresponse');
  }
  //if(request.name == 'shareStart'){
    //chrome.tabs.query({title:'COPILOT'}, function(tabs){
      //copilotTab = tabs[0];
      ////send some
      //chrome.tabs.query({windowId:copilotTab.windowId}, function(tabs){
        //chrome.tabs.sendMessage(copilotTab.id, {name:'tabChange', tabs:tabs, id:myId});
      //});
      //sendResponse(copilotTab);
    //});
  //}
});

var TAB_CHANGE_RATE= 1000; 

chrome.tabs.onActivated.addListener(function(activeInfo){
  if(copilotTab != null && copilotTab.windowId == activeInfo.windowId){
    chrome.tabs.query({windowId:copilotTab.windowId}, function(tabs){
      chrome.tabs.sendMessage(copilotTab.id, {name:'tabChange', tabs:tabs, id:myId});
    });
  }
});
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab){
  if(copilotTab != null && tab.windowId == copilotTab.windowId){
    if(tab.status == 'complete'){
      chrome.tabs.sendMessage(copilotTab.id, {name:'history', tab:tab});
    }
    chrome.tabs.query({windowId:copilotTab.windowId}, function(tabs){
      chrome.tabs.sendMessage(copilotTab.id, {name:'tabChange', tabs:tabs, id:myId});
    });
  }
});

chrome.tabs.onRemoved.addListener(function(tabId, removeInfo){
  if(copilotTab != null){
    if(tabId == copilotTab.id){
      copilotTab = null;
    }
    else{
      chrome.tabs.query({windowId:copilotTab.windowId}, function(tabs){
        chrome.tabs.sendMessage(copilotTab.id, {name:'tabChange', tabs:tabs, id:myId});
      });
    }
  }
});

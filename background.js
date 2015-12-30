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
  if(request.name =='open_webpage'){
    if(copilotTab != null){
      chrome.tabs.update(copilotTab.id, {selected:true});
    }
    else{
      chrome.tabs.create({url:'http://wd.berkeley-pbl.com/david/real.html'}, function(tab){
        copilotTab = tab;
      });
    }
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
  if(request.name == 'shareStart'){
    chrome.tabs.query({title:'COPILOT'}, function(tabs){
      copilotTab = tabs[0];
      sendResponse(copilotTab);
    });
  }
});

var TAB_CHANGE_RATE= 1000; 
ROOT_URL = 'http://wd.berkeley-pbl.com/copilot/api.php';

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab){
  if(copilotTab != null && changeInfo.status != 'loading' && tab.windowId == copilotTab.windowId){
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

var tabScreenshots = {};
var copilotTab;
var myEmail;
var myId;

chrome.browserAction.setIcon({path:{
  19: './mushroom_red.png',
  38: './mushroom_red.png'
}});

//track realtime api models
var myActive;
var userDict;

chrome.identity.getProfileUserInfo(function(userInfo){
  myId = userInfo.id;
  console.log(myId);
});

function sendTabs(tabs){
  msg = {
    api:'mapi',
    sender:'background',
    recipient:'copilot_webpage',
    type:'tabChange',
    tabs:tabs
  }
  chrome.tabs.sendMessage(copilotTab.id, msg);
}

function handleCopilotDisconnect(){
  copilotTab = null;
  chrome.browserAction.setIcon({path:{
    19: './mushroom_red.png',
    38: './mushroom_red.png'
  }});
}

function handleCopilotConnect(tab){
  copilotTab = tab;
  chrome.browserAction.setIcon({path:{
    19: './mushroom_pair.png',
    38: './mushroom_pair.png'
  }});
}

chrome.tabs.onActivated.addListener(function(activeInfo){
  if(copilotTab != null && copilotTab.windowId == activeInfo.windowId){
    chrome.tabs.query({windowId:copilotTab.windowId}, function(tabs){
      sendTabs(tabs);
    });
  }
});
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab){
  if(copilotTab != null && tab.windowId == copilotTab.windowId){
    //check if navigated away from copilot
    if(tab.id == copilotTab.id){
      if(tab.title != 'COPILOT'){
        handleCopilotDisconnect();
      }
    }
    if(tab.status == 'complete'){
      msg = {
        api:'mapi',
        sender:'background',
        recipient:'copilot_webpage',
        type:'history',
        tab:tab
      }
      chrome.tabs.sendMessage(copilotTab.id, msg);
    }
    chrome.tabs.query({windowId:copilotTab.windowId}, function(tabs){
      sendTabs(tabs);
    });
  }
});

chrome.tabs.onRemoved.addListener(function(tabId, removeInfo){
  if(copilotTab != null){
    if(tabId == copilotTab.id){
      handleCopilotDisconnect();
    }
    else{
      chrome.tabs.query({windowId:copilotTab.windowId}, function(tabs){
        sendTabs(tabs);
      });
    }
  }
});

chrome.contextMenus.create({
    "title": "Add Comment",
    "contexts": ["page", "selection", "image", "link"],
    "onclick" : addCommentHandler
  });
  function addCommentHandler(e){
    var comment = prompt("Comment on this page", "");
    if (comment != null){
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        var msg = {
          api:'mapi',
          sender:'background',
          recipient:'content',
          type:'newComment',
          comment:comment
        }
        chrome.tabs.sendMessage(tabs[0].id, msg, null);
      });
    }
  }

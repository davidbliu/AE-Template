

chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
  if(request.name == 'getId'){
    sendResponse({id:myId});
  }
  if(request.name == 'updateComments'){
    console.log('background: updating comments');
    console.log(request);
    chrome.tabs.query({url:request.url}, function(tabs){
      if(tabs.length > 0){
        var tab = tabs[0];
        chrome.tabs.sendMessage(tab.id, request, function(response){});
      }
    });
  }
  if(request.name == 'postComment'){
    if(copilotTab == null){
      alert('No copilot session open, comment failed to post');
    }
    else{
      console.log('sending comment along');
      console.log(request.comment);
      chrome.tabs.sendMessage(copilotTab.id, {name:'postComment', comment:request.comment}, function(response){
      });
    }
  }
  if(request.name == 'openCopilotTab'){
    if(copilotTab){
      chrome.tabs.update(copilotTab.id, {active:true}, function(tab){});
    }
    else{
      chrome.tabs.create({url:'popup.html'});
    }
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
});


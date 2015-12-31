//this script should ONLY AFFECT THE COPILOT WEBPAGE


//window.postMessage({'something':'hi', 'type': 'extension'},'*');
window.addEventListener('message', function(event){
  if(event.data.type && event.data.type == 'copilot_webpage'){
    handleWebpageMessage(event.data);
  }
});


function handleWebpageMessage(message){
  //if(message.name == 'ONLINE'){
    //start sharing webpages
    //chrome.extension.sendMessage({name:'shareStart'}, function(response){ }); 
  //}
  if(message.name == 'sync'){
    chrome.extension.sendMessage({name:'syncTabs', tabs:message.tabs}, function(response){ });
  }
}

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse){
  if(message.name == 'tabChange'){
    //forward the message to webpage
    message.type = 'extension';
    window.postMessage(message, '*');
  }
  if(message.name == 'tabRemove'){
  }
  if(message.name == 'popup'){
    sendResponse({
      tabs: $('#tabs-div').html(),
      collaborators: $('#collaborators-div').html(),
      bookmarks: $('#bookmarks-div').html()
    });
  }
});

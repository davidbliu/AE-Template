//this script should ONLY AFFECT THE COPILOT WEBPAGE


//window.postMessage({'something':'hi', 'type': 'extension'},'*');
window.addEventListener('message', function(event){
  if(event.data.type && event.data.type == 'copilot_webpage'){
    handleWebpageMessage(event.data);
  }
  if(event.data && event.data.name && event.data.name == 'updateComments'){
    chrome.extension.sendMessage(event.data, null);
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
  if(message.name == 'history'){
    message.type = 'extension';
    window.postMessage(message, '*');
  }
  if(message.name == 'postComment'){
    console.log('copilot content script received comment');
    console.log(message.comment);
    message.type = 'extension';
    console.log(message);
    window.postMessage(message, '*');
  }
});

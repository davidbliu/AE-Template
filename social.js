
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse){
  if(message.name == 'tabChange'){
    //forward the message to webpage
    message.type = 'extension';
    window.postMessage(message, '*');
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

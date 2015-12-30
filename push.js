

function registerForPush(){
  console.log('trying to register with gcm');
  var senderIds = ["448301113255"];
  chrome.gcm.register(senderIds, registerCallback);
}

//register for push notificaitons
function registerCallback(registrationId) {
  //store in local storage
  chrome.storage.local.set({registered: true});
  chrome.storage.local.set({'registrationId': registrationId});
  prompt('This is your chrome registration id, please submit it on our app to register for push', registrationId);
}

chrome.gcm.onMessage.addListener(function(message) {
  console.log('received push notification');
  console.log(message['data']);
});

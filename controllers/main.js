var copilotTab;

myApp.controller("MainCtrl", function ($scope) {

  $scope.stopSharing = function(){
    msg = {
      api:'mapi',
      sender:'popup',
      recipient:'background',
      type:'closeCopilot'
    }
    chrome.extension.sendMessage(msg, null);
    window.close();
  }
chrome.extension.sendMessage({api:'mapi', recipient:'background', type:'getCopilotTab'}, function(tab){
    copilotTab = tab;
    if(copilotTab != null){
      msg = {
        api:'mapi',
        recipient:'copilot',
        sender:'popup',
        type:'getPopupHtml'
      };
      chrome.tabs.sendMessage(copilotTab.id, msg, function(response){
        $('#tabs-div').html(response.tabs);
        $('#bookmarks-div').html(response.bookmarks);
        scrollTabs();
        activateLinks();
        $scope.$digest();
      });
    }
    else{
      $scope.msg = 'Copilot Tab Not Open';
      $scope.nocopilot = true;
      $scope.$digest();
    }
});

stateMsg = {
  api:'mapi',
  recipient:'background',
  sender:'popup',
  type:'getState'
}

chrome.extension.sendMessage(stateMsg, function(data){
  $scope.active = data.active;
  $scope.userDict = data.userDict;
  $scope.userIds = _.keys(data.userDict);
  $scope.$digest();
});


$scope.createRedirect = function(){
  chrome.tabs.create({url:CREATE_URL, index:0, active:true}, null);
};
  $scope.copilotRedirect = function(){
    if(copilotTab == null){
      chrome.tabs.query({title:'COPILOT'}, function(tabs){
        var tabids = _.map(tabs, function(x){
          return x.id;
        });
        chrome.tabs.remove(tabids, function(){
          chrome.tabs.create({index:0, url:ROOT_URL, active:true}, function(tab){
            copilotTab = tab;
            //msg = {
              //api: 'mapi',
              //sender:'popup',
              //recipient:'background',
              //type:'setCopilotTab',
              //copilotTab:tab
            //};
            //chrome.extension.sendMessage(msg, null);
          });
        });
      });
    }
    else{
      chrome.tabs.update(copilotTab.id, {active:true});
    }
  }
});

function scrollTabs(id){
  setTimeout(function(){
    $('.collaborator-link').click(function(){
      id = $(this).attr('id').split('-')[0];
      tabs_id = id + '-tabs';
      $("html, body").animate({ scrollTop: $('#'+tabs_id).offset().top }, 100);
    });
  }, 1000);
}

function activateLinks(){
  setTimeout(function(){
    $('.dodo-link').click(function(){
      msg = {
        api:'mapi',
        sender:'copilot_webpage',
        recipient:'background',
        type:'redirectLink',
        url: $(this).attr('data-url'),
        tabId: $(this).attr('data-tabid') 
      }
      chrome.extension.sendMessage(msg, null);
  });
  }, 1000);
}

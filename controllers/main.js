var copilotTab;
var ROOT_URL = 'http://wd.berkeley-pbl.com/david/real.html';
//var ROOT_URL = 'http://localhost/cli/real.html';
myApp.controller("MainCtrl", function ($scope) {
  chrome.extension.sendMessage({name:'getCopilotTab'}, function(tab){
    copilotTab = tab;
    if(copilotTab != null){
      chrome.tabs.sendMessage(copilotTab.id, {name:'popup'}, function(response){
        $('#tabs-div').html(response.tabs);
        $('#bookmarks-div').html(response.bookmarks);
        console.log(response.bookmarks);
        $scope.$digest();
      });
    }
    else{
      $scope.msg = 'copilot tab not open';
      $scope.$digest();
    }
  });

  $scope.copilotRedirect = function(){
    if(copilotTab == null){
      chrome.tabs.create({url:ROOT_URL, active:true}, function(tab){
        chrome.extension.sendMessage({name:'setCopilotTab', copilotTab: tab}, null);
      });
    }
    else{
      chrome.tabs.update(copilotTab.id, {active:true});
    }
  }
});


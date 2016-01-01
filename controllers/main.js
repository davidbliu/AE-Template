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
        $('#collaborators-div').html(response.collaborators);
        scrollTabs();
        $scope.$digest();
      });
    }
    else{
      $scope.msg = 'Copilot Tab Not Open';
      $scope.nocopilot = true;
      $scope.$digest();
    }
  });

  $scope.copilotRedirect = function(){
    if(copilotTab == null){
      chrome.tabs.create({index:0, url:ROOT_URL, active:true}, function(tab){
        chrome.extension.sendMessage({name:'setCopilotTab', copilotTab: tab}, null);
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

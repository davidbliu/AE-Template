myApp.controller("ShareController", function ($scope, $http) {
	$scope.getChromeID = function(){
		var bgPage = chrome.extension.getBackgroundPage();
        bgPage.registerForPush();
	};
	$scope.submitChromeID = function(id){
		$scope.message = 'Submitting '+id.toString() + ' as your chrome id...';
	};

	$scope.setup = false;
	$scope.showSetup = function(){
		$scope.setup = true;
	}
	$scope.hideSetup = function(){
		$scope.setup = false;
	}
});
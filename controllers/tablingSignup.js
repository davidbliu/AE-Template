myApp.controller("TablingSignupController", function ($scope, $http) {
	$scope.message = "Sign up for a tabling slot here";

	function getWeeklySlots(){
		$http.get(tokenizedURL(ROOT_URL + '/api/weekly_slots')).
          success(function(data, status, headers, config){
            $scope.weeklySlots = data;
          })
	}
	$scope.timeString = function(time){
		return timeToString(time);
	}
	$scope.slotCapacity = function(slot){
		return 5-slot.member_emails.length;
	}
	getWeeklySlots();
});
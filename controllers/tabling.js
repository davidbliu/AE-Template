myApp.controller("TablingController", function ($scope, $http) {
	function getAllCommitments(){
        $http.get(tokenizedURL(ROOT_URL + '/api/commitments')).
          success(function(data, status, headers, config){
            $scope.commitmentsHash = data;
            $scope.commitments = data[email];
            $scope.emails = Object.keys(data);
          });
    }
    function getTablingSlots(){
    	$http.get(tokenizedURL(ROOT_URL + '/api/tabling_schedule')).
          success(function(data, status, headers, config){
            $scope.tablingSchedule = data;
            mySlots = data.filter(function(slot){
            	return (slot.member_emails.indexOf(email)!= -1);
            });
            if(mySlots.length > 0){
            	$scope.mySlot = mySlots[0];
            }
          });
    }
    function getTablingSchedule(){
    	$http.get(tokenizedURL(ROOT_URL + '/api/member_hash')).
          success(function(data, status, headers, config){
            $scope.memberHash = data;
            // get tabling slots after fetching member hash
            getTablingSlots();
          });
    }
	getTablingSchedule();
	$scope.timeString = function(time){
		return timeToString(time);
	}
    
});
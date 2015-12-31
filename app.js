var myApp = angular.module('copilotApp', ['ngRoute']);

myApp.config(function($routeProvider) {
    $routeProvider
        .when('/', {
          templateUrl: 'views/main.html',
          controller: 'MainCtrl',
        })
        .otherwise({
          'redirect_to': '/'
        });
});

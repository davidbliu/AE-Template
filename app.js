var myApp = angular.module('mem', ['ngRoute']);

myApp.config(function($routeProvider) {
    $routeProvider
        .when('/old', {
            templateUrl : 'views/home.html',
            controller  : 'HomeController'
        })
        .when('/', {
          templateUrl: 'views/old.html',
          controller: 'OldController',
        })
        .otherwise({
          'redirect_to': '/'
        });
});

'use strict';


// Declare app level module which depends on filters, and services
angular.module('myApp', [
  'ngRoute',
  'myApp.filters',
  'myApp.services',
  'myApp.directives',
  'myApp.controllers',
  'firebase'
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.when("/", {
  	templateUrl: "partials/landing_page.html",
  	controller:  "LandingPageController"	
  });
  $routeProvider.when("/contacts_page", {
  	templateUrl: "partials/contacts_page.html",
  	controller: "ContactController"	
  });		
  $routeProvider.otherwise({redirectTo: "/" });
}]);
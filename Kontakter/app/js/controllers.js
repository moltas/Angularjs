'use strict';

/* Controllers */

angular.module("myApp.controllers", [])
	.controller("LandingPageController", [function() {

	}])			//The list of dependencies for this controller needs
	.controller("ContactController", ["$scope", "contactService", "authService", function($scope, contactService, authService){

		// bind users contacts to scope
		authService.getCurrentUser().then(function(user){
			if (user){		//Sets the value of contacts to the userId value
				$scope.contacts = contactService.getContactsByUserId(user.id);
			}
		})

		$scope.newContact = {name: "", phone: "", address: ""};

		$scope.saveContact = function() {
			contactService.saveContact($scope.newContact, $scope.currentUser.id);
			$scope.newContact = {name: "", phone: "", address: ""};	
		};

		$scope.deleteContact = function(id){
			$scope.contacts.$remove(id);
		};

	}])
	.controller("AuthController", ["$scope", "authService", function($scope, authService){
		
		// Object bound to inputs on the register and login pages
		$scope.user = {email: "", password: ""};

		//method to register a new user using the authservice
		$scope.register = function(){     
			authService.register($scope.user);
		};	
		//method that logins in the user using the authService
		$scope.login = function(){
			authService.login($scope.user);	
		};

		//method to log out a user using the authService
		$scope.logout = function(){
			authService.logout();	
		}
	}]);

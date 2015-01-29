'use strict';

/* Controllers */

angular.module('myApp.controllers', [
	"firebase"
])

.controller("MainController", ["$scope", "$rootScope", "itemService", function($scope, $rootScope, itemService) {


		$scope.newItem = { 
			name: "",
			selected: false
		};

		//Using emails as user id was my first plan but it didnt work
		// as inteded, but maybe i'll be wiser someday

		// $scope.userId = userService.getUserEmail();
		// var emailId = $scope.userId.email.toString();

		// function emailFormat(email) {
		// 	return email.replace(/\./g, 'dot'); //replaces the "." in the email with the word "dot"
		// };

		// var ekey = emailFormat(emailId);

		if($rootScope.currentUser){ //if currentUser is true, $scope.items will be binded to location of users items
			$scope.items = itemService.getItemById($rootScope.currentUser); //gets items from current user
		}

		//===================================================================
		// CREATE and DELETE
		//===================================================================

		//method that adds items to the items array
		$scope.addItem = function() {
			itemService.addItem($scope.newItem, $rootScope.currentUser); //uses itemService to add items to firebase
			//clears the textfields
			$scope.newItem = {
				name: "",
				selected: false
			};
		};

		//method that remove items from firebase based on id
		$scope.deleteItem = function(id) {
			itemService.deleteItem($scope.items, id); //uses itemService to remove items to firebase
		};

		//method that deletes the selected users
		$scope.deleteSelected = function() {
			itemService.deleteSelected($scope.items); //uses itemService to remove selected items
		};

		//selects all items
		$scope.selectAll = function() {
			itemService.selectAll($scope.items); //uses the itemsService to toggle select all items
		};


	}])
	// controller that handles authentication
	.controller("AuthController", ["$scope", "authService", function($scope, authService) {

		//the user object
		$scope.user = {
			email: "",
			password: ""
		};

		//method that registers a new user, using authService
		$scope.register = function() {
			authService.register($scope.user);

		};

		//method that log in a user using authService
		$scope.login = function() {
			authService.login($scope.user); //uses a authService function to login the user
			console.log($scope.user.email + " logged in");
			// userService.setUserEmail($scope.user.email);
		};
		//method that logs out a user using authService
		$scope.logout = function() {
			authService.logout();
		};

	}]);
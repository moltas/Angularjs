'use strict';

/* Controllers */

angular.module('myApp.controllers', [])
	.controller('LandingPageController', [function() {

	}])
	.controller('ContactController', ['$scope' , '$firebase',function($scope, $firebase) {
		// Creates a connection between the app and firebase
		var contactsRef = new Firebase('https://kontakter.firebaseio.com/');

		$scope.contacts = $firebase(contactsRef);

		$scope.newContact = {name: "", phone: "", adress: ""};

		$scope.saveContact = function() {
			//adds contact data to firebase
			$scope.contacts.$add($scope.newContact);
			//resets the values in the textfields	
			$scope.newContact = {name: "", phone: "", adress: ""};
		};

		$scope.deleteContact = function(item){
			console.log(item.$id);	
		};

		//function to send a text message to contact
		$scope.sendTextMessage = function(phoneNumber) {
			var textMessageRef = new Firebase('https://kontakter.firebaseio.com/textMessages');
			var textMessage = $firebase(textMessageRef);
			textMessage.$add({phoneNumber: phoneNumber});
		}
	}]);

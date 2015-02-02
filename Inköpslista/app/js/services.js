"use strict";


angular.module("myApp.services", [])
	.value("FIREBASE_URL", "https://inkopslista.firebaseio.com/")
	.factory("dataService", function($firebase, $rootScope, FIREBASE_URL, authService) {

		var fireRef = new Firebase(FIREBASE_URL);

		return fireRef;
	})
	//Service that is used to set and get email from user
	// .factory("userService", function() {  

	// 	var user = { email: "" };

	// 	var userObject = {
	// 		setUserEmail: function(email) {
	// 			user.email = email;
	// 		},
	// 		getUserEmail: function() {
	// 			return user;
	// 		}
	// 	}
	// 	return userObject;
	// })

	//service that is used to manage items
	.factory("itemService", function(dataService, $firebase) {

		var users = dataService.child("users");

		var itemServiceObject = {
			addItem: function(item, userId) {
				var usersAsArray = $firebase(users.child(userId).child("items")).$asArray();
				usersAsArray.$add(item);
			},
			deleteItem: function(collection, id) {
				collection.$remove(id);
			},
			deleteSelected: function(collection) {
				var self = this; //saves this from this location for later use
				//this lets the data load from firebase, before running any code
				collection.$loaded().then(function(array) {
					//iterates the items deleteing them if selected=true
					for (var i = 0; i < collection.length; i++) {
						if (array[i].selected) {
							self.deleteItem(collection, array[i]);
						}
					}
				});
			},
			selectAll: function(collection) {
				var counter = 0; //to keep track of items selected
				//this lets the data load from firebase, before running any code
				collection.$loaded().then(function(array) {
					//iterates the items and sets selected to true if not all items are selected
					for (var i = 0; i < collection.length; i++) {
						if (array[i].selected) {
							counter++;
							if (counter === collection.length) {
								for (var j = 0; j < collection.length; j++) {
									array[j].selected = false;
								}
							}
						} else {
							array[i].selected = true;
						}
					}
				});
			},
			hideSelect: function(collection){
				if(collection.length === 0){
					return true;
				}else{
					return false;
				}
			},
			//returns the items from firebase and returns them as array
			getItemById: function(userId) {
				return $firebase(users.child(userId).child("items")).$asArray();
			}

		};

		return itemServiceObject;
	})
	//service for authentication
	.factory("authService", function($firebase, $location, $rootScope, FIREBASE_URL) {
		var auth = new Firebase(FIREBASE_URL);

		var authServiceObject = {
			register: function(user) {
				auth.createUser(user, function(error, data) {
					if (error === null) {
						console.log("User created successfully");
						authServiceObject.login(user);
					} else {
						console.log("Error creating user: ", error);
					}
				});
			},
			login: function(user) {
				auth.authWithPassword(user, function(error, data) {
					if (error) {
						console.log("Login failed", error);
					} else {
						$location.path("/landing_page");
						if(!$rootScope.$$phase) $rootScope.$apply(); //a fix I found that stopped me from havign to double click to go to the landing page
					}
				});
			},
			logout: function() {
				auth.unauth(); //logs out the user
				//redirect user to landing page
				$location.path("/landing_page");
			}
		};

		//checks if the user is authenticated, and sets currentUser based on that
		auth.onAuth(function(authData, user) {
			if (authData) {
				$rootScope.currentUser = authData.uid; //sets currentUser to id of user
			} else {
				$rootScope.currentUser = null;
			}
		});

		return authServiceObject;
	});
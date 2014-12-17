'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service
angular.module('myApp.services', [])
  .value('FIREBASE_URL', 'https://kontakter.firebaseio.com/')
  //to avoid repetition and clean up the code abit
  .factory("dataService", function($firebase, FIREBASE_URL){
    var dataRef = new Firebase(FIREBASE_URL);
    var fireData = $firebase(dataRef); 

    return fireData; 
  })
  .factory("contactService", function(dataService){
    var users = dataService.$child("users");

    var contactServiceObject = {
      saveContact: function(contact, userId){
        //Saving the contact within the userId/contacts 
        users.$child(userId).$child("contacts").$add(contact);
      },
      getContactsByUserId: function(userId){
        //getting the directory with userId
        return users.$child(userId).$child("contacts");
      }   
    };

    return contactServiceObject;
  })

  .factory("authService", function($firebaseSimpleLogin, $location, $rootScope, FIREBASE_URL) {
    var authRef = new Firebase(FIREBASE_URL);
    var auth = $firebaseSimpleLogin(authRef);

    var authServiceObject = {
      register: function(user){
        auth.$createUser(user.email, user.password).then(function(data){
          console.log(data);
          authServiceObject.login(user);
        });   
      },
      login: function(user) {
        auth.$login('password', user).then(function(data) {
          console.log(data);
          $location.path("/contacts_page");
        });
      },
      logout: function(){
        auth.$logout();
        $location.path("/");  
      },
      getCurrentUser: function(){
        return auth.$getCurrentUser();
      }

    };

    $rootScope.$on("$firebaseSimpleLogin:login", function(e, user){
      // save currentuser on our rootscope
      $rootScope.currentUser = user;
    });

    $rootScope.$on("$firebaseSimpleLogin:logout", function(){
      // sets current user to null, so user isnt logged in anymore
      $rootScope.currentUser = null;
    });


    return authServiceObject;
  });

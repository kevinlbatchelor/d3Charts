var myApp = angular.module("myApp", ['ui.bootstrap']);

myApp.controller("ctrl", function($http) {
    var app = this;

    $http.get('http://localhost:3000/people').success(function(people) {
        app.people = people;
    });

    app.selectPerson = function(person) {
        app.selectPerson = person;
        app.selectPerson.fullName = person.firstName + " " + person.lastName;
    }
});

//angular.modules('egghead', []).
//    controller('AppCtrl', function($http) {
//        var app = this;
//
//        $http.get('http://localhost:3000/people').success(function(people) {
//            app.people = people;
//        });
//
//        app.selectPerson = function(person) {
//            app.selectPerson = person;
//            app.selectPerson.fullName = person.firstName + " " + person.lastName;
//        }
//    })
//
//;
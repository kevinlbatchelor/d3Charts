var app = angular.module('app', []);
app.constant('API_URL', 'http://localhost:3000');

app.controller('mainCtrl', function(userFactory) {
    var vm = this;
    vm.getRandom = function() {
        userFactory.getUser().then(function(result) {
            vm.randomUser = result.data;
        },handleError)
    };

    vm.login = function(username, password){
        userFactory.login(username, password).then(function(result){
            vm.randomUser = result.data;
        }, handleError)
    };

    var handleError = function(res){
        alert('Error'+res.data)
    }
});

app.factory('userFactory', function($http, API_URL) {
    var userFactory = {};

    userFactory.getUser = function() {
        return $http.get(API_URL + '/random-user');
    };

    userFactory.login = function(user, pass){
        console.log(user+pass);
        return $http.post(API_URL+'/login', {username:user, password: pass});
    };

    return userFactory;
});

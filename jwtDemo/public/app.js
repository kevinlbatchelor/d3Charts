var app = angular.module('app', []);
app.constant('API_URL', 'http://localhost:3000');

app.controller('mainCtrl', function (userFactory) {
    var vm = this;
    vm.getRandom = function () {
        userFactory.getUser().then(function (result) {
            vm.randomUser = result.data;

        }, handleError)
    };

    vm.login = function (username, password) {
        userFactory.login(username, password).then(function (result) {
            vm.user = result.data.user;
        }, handleError)
    };

    var handleError = function (res) {
        alert('Error' + res.data)
    }
});

app.factory('userFactory', function ($http, API_URL, sessionFactory) {
    var userFactory = {};

    userFactory.getUser = function () {
        return $http.get(API_URL + '/random-user');
    };

    userFactory.login = function (user, pass) {
        return $http.post(API_URL + '/login', {username: user, password: pass}).then(function(response){
            sessionFactory.setToken(response.data.token);
            return response;
        });
    };

    return userFactory;
});

app.factory('sessionFactory', function ($window) {
    var sessionFactory = {};
    var key = 'auth-token';

    var store = $window.localStorage;
    sessionFactory.getToken = function(){
        return store.getItem(key);
    };

    sessionFactory.setToken = function (token) {
        if(token){
            store.setItem(key, token);
        } else {
            store.removeItem(key);
        }
    };

    return sessionFactory;
});

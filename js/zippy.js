myApp.directive('zippy', function(){
    return {
        restrict: 'E',
        transclude: 'true',
        scope:{
          title:"@"
        },
        template: '<div ng-click="toggleContent()">{{title}}<div ng-transclude="" ng-show="visible"></div></div>',
        link: function(scope){
            scope.visible = false;

            scope.toggleContent = function(){
                scope.visible = !scope.visible;
            }

        }
    };
});

myApp.directive('password', function(){
   return {
       restrict:'E',
       replace: 'true',
       template:'<div><input type="text" ng-model="model.input" >{{model.input}}</div>',
//       template:'<input type="text" ng-model="model.input" ><div>{{model.input}}</div>',

       link: function (scope, element){
            scope.$watch('model.input', function(value){
                if(value === 'password'){
                    console.log(element.children(1).children());
                    element.toggleClass('alert alert-info');

                }
            })
       }
   }
});
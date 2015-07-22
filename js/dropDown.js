myApp.directive('dropDown', ['$compile', '$timeout', '$parse', function ($compile, $timeout, $parse) {
    return {
        restrict: "E",
        scope: {
            ngModel: '=',
            data: '=',
            config: '='
        },
        link: function (scope, element, attrs) {
            var config = {
                idField: null
            };

            angular.extend(config, scope.config);

            var currentStep = 0;
            var slideNumber = 0;
            var buttonConfig = {inputs: {back: false, search: false}};
            scope.steps = [];
            scope.isCollapsed = true;


            var group = angular.element("<div class='dropDown' collapse='isCollapsed'></div>");
            $compile(group)(scope);
            element.append(group);

            var list = angular.element("<div ng-repeat='item in data'>" +
                "<div ng-hide='item.inputs.back===false' class='dropDownItem' ng-click='handleClick(item)'>" +
                "{{item.name}}" +
                "<i ng-if='item.hasChild' class='glyphicon glyphicon-chevron-right pull-right'></i>" +
                "</div>" +
                "</div>");
            $compile(list)(scope);
            group.append(list);

            var button = angular.element("<button class='btn btn-default dropDownBtn' ng-click='isCollapsed = !isCollapsed'>{{config.name}}</button>");
            $compile(button)(scope);
            button.insertBefore(group);

            var mapData = function (thingToMap, button) {
                if (angular.isUndefined(thingToMap[0].inputs)) {
                    thingToMap.unshift(button);
                }

                thingToMap.map(function (i) {

                    if (angular.isObject(i)) {
                        angular.forEach(i, function (values, itt) {
                            if (angular.isArray(values)) {
                                i.children = values;
                                i.hasChild = true;
                            }
                        });
                    }
                    return i;
                });
            };

            var getId = $parse(config.idField);

            scope.updateNgModel = function (value) {
                if (config.idField) {
                    scope.ngModel = getId(value);
                } else {
                    scope.ngModel = value;
                }
            };

            mapData(scope.data, buttonConfig);

            scope.handleClick = function (clickedItem) {
                if (angular.isDefined(clickedItem.children)) {
                    scope.openChild(clickedItem.children);
                } else if (angular.isDefined(clickedItem.inputs)) {
                    scope.closeChild();
                } else {
                    scope.updateNgModel(clickedItem);
                    scope.isCollapsed = true;
                }
            };

            scope.getOption = function (option) {
                if (config.idField) {
                    return config.idField(option);
                } else {
                    return option;
                }
            };

            scope.openChild = function (children) {
                if (children) {
                    element.find(".dropDownChildStartPosition").remove();

                    scope.steps.push(children);
                    scope.slideClass = "dropDownChild";

                    var list = angular.element("<div ng-class='slideClass'><div ng-repeat='item in steps[" + slideNumber + "]'>" +
                        "<div class='dropDownItem' ng-click='handleClick(item)'>" +
                        "<span>{{item.name}}</span>" +
                        "<div ng-if='item.inputs.back'><i class='glyphicon glyphicon-chevron-left'></i> Back</div>" +
                        "<i ng-if='item.hasChild' class='glyphicon glyphicon-chevron-right pull-right'></i>" +
                        "</div>" +
                        "</div></div>");
                    $compile(list)(scope);
                    group.append(list);

                    mapData(scope.steps[slideNumber], {inputs: {back: true, search: false}});

                    $timeout(function () {
                        list.addClass("dropDownChildEndPosition");
                        list.addClass(currentStep + "-slide");
                    });
                    currentStep++;
                    slideNumber++;
                }
            };

            scope.closeChild = function () {
                var slide = element.find("." + currentStep + "-slide");
                currentStep--;
                slide.addClass("dropDownChildStartPosition");
            };
        }
    };
}]);
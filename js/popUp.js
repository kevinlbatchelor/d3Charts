myApp.directive('isPopOver', function ($compile, $q, $timeout) {
        return {
            template: '',
            replace: true,
            restrict: 'A',
            scope: {
                config: '=',
                isPopOver: '='
            },
            link: function ($scope, $element) {
                var config = {
                    position: 'top',
                    showOnClick: false,
                    showOnMouse: true
                };

                angular.extend(config, $scope.config);

                if (config.showOnClick) {
                    config.showOnMouse = false;
                }

                var html = angular.element('<div ng-show="show" name="PopOver" ng-style="popPosition" class="PopOver"><div name="PopOverText" class="PopOverText">{{isPopOver}}</div><div class="PopOverArrow"> </div></div>');

                var tempHtml = html.clone();
                tempHtml.addClass('offscreen');

                $element.after(tempHtml);
                $element.after(html);

                $compile(html)($scope);
                $compile(tempHtml)($scope);

                if (config.showOnClick) {
                    $element.bind("click", function () {
                        $scope.showPopOver();
                        $scope.$apply();
                    });
                }

                if (config.showOnMouse) {
                    $element.bind("mouseenter", function () {
                        $scope.showPopOver();
                        $scope.$apply();
                    });

                    $element.bind("mouseleave", function () {
                        $scope.showPopOver();
                        $scope.$apply();
                    });
                }

                $scope.showPopOver = function () {
                    $scope.show = !$scope.show;
                };

                $timeout(function () {
                    var arrow = 15;
                    var el = $element[0];
                    var height = el.offsetHeight;
                    var width = el.offsetWidth;
                    var top = el.offsetTop;
                    var left = el.offsetLeft;

                    var popWidth = tempHtml[0].offsetWidth;
                    var popHeight = tempHtml[0].offsetHeight;

                    switch (config.position) {
                        case 'top':
                            top = top - popHeight - arrow;
                            html.addClass('top');
                            break;

                        case 'bottom':
                            top = top + height + arrow;
                            html.addClass('bottom');
                            break;

                        case 'left':
                            left = left - popWidth - arrow;
                            html.addClass('left');
                            break;

                        case 'right':
                            left = left + width + arrow;
                            html.addClass('right');
                            break;
                    }

                    $scope.popPosition = {top: top, left: left};
                }, 500);

                return true;
            }
        }
    }
 );
myApp.directive('audioPlayer', function () {

    return {
        restrict: 'EA',
        scope: {
            path:'=',
            audioFunction:'='

        },
        template: '<audio id="audio" width="400" controls autoplay>' +
            '<source src="{{path}}" type="audio/mpeg">' +
            '<source src="{{path}}" type="audio/ogg">Your browser does not support HTML5 audio.' +
            '</audio>',


        link: function ($scope) {
            var srcs = document.getElementById('audio').children;
            var vid = document.getElementById('audio');

            function getMedia() {
                return new Promise(function (resolve, reject) {
                    vid.addEventListener('ended', function () {
                        resolve("The song is over");
                    });

                    for (var i = 0; i < srcs.length; i++) {
                        srcs[i].addEventListener('error', function (e) {
                            reject("Something went amuck");
                        }, true);
                    }
                });
            }

            getMedia().then(function (msg) {
                $scope.audioFunction();
            }, function (error) {
                console.log(error);
            });
        }
    }
});
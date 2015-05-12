myApp.directive('videoPlayer', function () {

    return {
        restrict: 'EA',
        scope: {

        },
        template: '<video id="video" width="400" controls autoplay>' +
                    '<source src="vids/fractal.avi" type="video/mp4">' +
                    '<source src="vids/legos.mp4" type="video/mp4">Your browser does not support HTML5 video.' +
                    '</video>',

        link: function () {
            var srcs = document.getElementById('video').children;
            var vid = document.getElementById('video');

            function getVids() {
                return new Promise(function (resolve, reject) {
                    vid.addEventListener('play', function () {
                        resolve("Enjoy the show");
                    });

                    for (var i = 0; i < srcs.length; i++) {
                        srcs[i].addEventListener('error', function (e) {
                            reject("Something went amuck");
                        }, true);
                    }
                });
            }

            getVids().then(function (msg) {
                console.log(msg);
            }, function (error) {
                console.log(error);
            });
        }
    }
});
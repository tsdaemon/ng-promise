/**
 * @license ngPromise v0.1.1
 * (c) 2015-2017 tsdaemon
 * https://github.com/tsdaemon/ng-promise
 * License: MIT
 */

angular.module('ngPromise', [])
    .factory('promiseExtension', [
        '$q', function ($q) {

            var isArray = function (value) {
                return Object.prototype.toString.call(value) === '[object Array]';
            };
            var isEmpty = function (value) {
                if (isArray(value)) {
                    for (var i = 0; i < value.length; i++) {
                        if (value[i] != null || typeof value[i] !== 'undefined')
                            return false;
                    }
                    return true;
                } else {
                    return value == null;
                }
            };
            return {
                done: function ($scope, promiseName, start, finish) {
                    var oldPromise = null;
                    $scope.$watch(promiseName, function (value) {
                        var empty = isEmpty(value);
                        if (!empty) {
                            // if another promise already running, add it to new promise
                            if (oldPromise != null) {
                                if (isArray(value)) {
                                    value.push(oldPromise);
                                } else {
                                    value = [value, oldPromise];
                                }
                            } else { // else run start callback
                                start();
                            }

                            oldPromise = $q.all(value);
                            oldPromise.finally(finish);
                            oldPromise.finally(function () {
                                oldPromise = null;
                            });
                        }
                    }, true);
                }
            };
        }])
    .directive('ngPromiseDisabled', ['promiseExtension', function (promiseExtension) {
        return {
            restrict: 'A',
            scope: {
                ngPromiseDisabled: '='
            },
            link: function (scope, element) {
                promiseExtension.done(scope, 'ngPromiseDisabled', function () {
                    element.attr('disabled', 'disabled');
                }, function () {
                    element.removeAttr('disabled');
                });
            }
        }
    }])
    .directive('ngPromiseHide', ['promiseExtension', function (promiseExtension) {
        return {
            restrict: 'A',
            scope: {
                ngPromiseHide: '='
            },
            link: function (scope, element) {
                promiseExtension.done(scope, 'ngPromiseHide', function () {
                    element.addClass('ng-hide');
                }, function () {
                    element.removeClass('ng-hide');
                });
            }
        }
    }])
    .directive('ngPromiseShow', ['promiseExtension', function (promiseExtension) {
        return {
            restrict: 'A',
            scope: {
                ngPromiseShow: '='
            },
            link: function (scope, element) {
                element.addClass('ng-hide');

                promiseExtension.done(scope, 'ngPromiseShow', function () {
                    element.removeClass('ng-hide');
                }, function () {
                    element.addClass('ng-hide');
                });
            }
        }
    }]);
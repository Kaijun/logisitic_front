'use strict';
;(function () {
	
    angular.module('home')
    .controller('TestCtrl', ['$scope', '$http', function($scope, $http) {
    	$scope.test = 'test';
    	console.log($scope.test);

    	$http({
            method:'GET',
            url: 'http://localhost:8000/testJson'
        }).then(function (response) {
            return response.data;
            console.log(response.data);
            // when the response is available
        });
    }]);
})();
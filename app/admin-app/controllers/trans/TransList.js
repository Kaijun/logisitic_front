(function() {
    'use strict';

    angular
        .module('admin.controllers')
        .controller('TransList', TransList);

    TransList.$inject = ['$scope', 'TransService', '$timeout', '$state', '$http'];

    /* @ngInject */
    function TransList($scope, TransService, $timeout, $state, $http) {
        $scope.transs = [];
        $scope.goToDetail = goToDetail;
        $scope.pageInfo = null;

        $scope.requestPage = requestPage;

        activate();

        ////////////////

        function activate() {
            TransService.getTranss().then(function(data){
                $scope.transs = data.data;
                $timeout(function () {
                    $scope.pageInfo = data;
                })
            })
        }
        function goToDetail (transId) {
            $state.go('transDetail', {transId: transId});
        }
        function requestPage (url) {
            $http.get(url).then(function (response) {
                $scope.transs = response.data.data;
                $timeout(function () {
                    $scope.pageInfo = response.data;
                })
            })
        }
    }
})();
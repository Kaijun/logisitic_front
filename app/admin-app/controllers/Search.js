(function() {
    'use strict';

    angular
        .module('admin.controllers')
        .controller('Search', Search);

    Search.$inject = ['$scope', '$state', '$http', '$timeout', 'AppConfig'];

    /* @ngInject */
    function Search($scope, $state, $http, $timeout, AppConfig) {
        $scope.packages=[];
        $scope.searchText = '';
        $scope.search = search;
        $scope.goToDetail = goToDetail;

        activate();

        ////////////////

        function activate() {

        }

        function search () {
            $http.get(AppConfig.apiUrl + '/searching?query=' + $scope.searchText).then(function (response) {
                $scope.packages = response.data;
            })
        }        
        function goToDetail (stock) {
            $state.go('stockDetail', {stockId: stock.id});
        }
    }
})();
(function() {
    'use strict';

    angular
        .module('admin.controllers')
        .controller('VorkasseList', VorkasseList);

    VorkasseList.$inject = ['$scope', 'VorkasseService', 'InfoService', '$timeout', '$state', '$http'];

    /* @ngInject */
    function VorkasseList($scope, VorkasseService, InfoService, $timeout, $state, $http) {
        $scope.vorkasses = [];
        $scope.goToDetail = goToDetail;
        $scope.deleteVorkasse = deleteVorkasse;
        $scope.pageInfo = null;

        $scope.requestPage = requestPage;

        activate();

        ////////////////

        function activate() {
            VorkasseService.getVorkasses().then(function(data){
                if(data.success===true){
                    data = data.data
                    $scope.vorkasses = data.data;
                    $scope.vorkasses.map(function (item) {
                        item.statusStr = InfoService.getVorkasseStatusMapping(item.status);
                    })
                    $scope.vorkasses = $scope.vorkasses.filter(function (item) {
                        return item.id;
                    });
                    $timeout(function () {
                        $scope.pageInfo = data;
                    })
                }
            })
        }
        function goToDetail (vorkasseId) {
            $state.go('vorkasseDetail', {vorkasseId: vorkasseId});
        }
        function deleteVorkasse (trans) {
            if(trans.id){
                swal({
                    title: "确认删除?",
                    showCancelButton: true,
                }, function () {
                    TransService.deleteVorkasse(trans.transorder_id).then(function(data) {
                        $scope.vorkasses.map(function (item, index, arry) {
                            if(item === trans){
                                arry.splice(index, 1);
                            }
                        })
                    });
                })
            }
        }
        function requestPage (url) {
            $http.get(url).then(function (response) {
                response = response.data;
                if(response.success===true){
                   
                    $scope.vorkasses = response.data.data;      
                    $scope.vorkasses.map(function (item) {
                        item.statusStr = InfoService.getVorkasseStatusMapping(item.status);
                    })          
                    $scope.vorkasses = $scope.vorkasses.filter(function (item) {
                        return item.id;
                    });
                    $timeout(function () {
                        $scope.pageInfo = response.data;
                    }) 
                }
            })
        }
    }
})();
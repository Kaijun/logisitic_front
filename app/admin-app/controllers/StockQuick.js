(function() {
    'use strict';

    angular
        .module('admin.controllers')
        .controller('StockQuickCtrl', StockQuickCtrl);


    /* @ngInject */
    function StockQuickCtrl($scope, StockService, $timeout) {

        $scope.stock = null;
        $scope.search = search;
        $scope.serachText = null;

        activate();

        ////////////////

        function activate() {

        }

        function search() {
            if($scope.serachText){
                StockService.getStockByTrackNr($scope.serachText).then(function (data) {
                    data.timeString = (new Date(data.timestamp.date)).toISOString().substring(0, 10);
                    $timeout(function(){
                        $scope.stock = data;
                    });
                })
            }
        }
    }
})();
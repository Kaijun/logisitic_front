(function() {
    'use strict';

    angular
        .module('admin.controllers')
        .controller('LogisticManage', LogisticManage);

    LogisticManage.$inject = ['$scope', '$timeout', 'LogisticService', '$state', '$stateParams'];

    /* @ngInject */
    function LogisticManage($scope, $timeout, LogisticService, $state, $stateParams) {

        var logisticPathObj = {
            logistic_name: null,
            number_ship_company: 2,
            ship_company_international: "",
            ship_company_china: "",
            options: [],
            weight_upper_bound: null,
            user_group: null,
            description: null,
            based_on: "0",
            base_price: null,
            price_ladders: [],
        }

        $scope.isPopupShown = false;
        $scope.ladderFrom = null;
        $scope.ladderTo = null;
        $scope.ladderPrice = null;

        $scope.logisticPath = null;
        $scope.shipOptions = '';
        $scope.roles = '';
        $scope.ladders = [];

        $scope.submit = submit;
        $scope.addLadder = addLadder;
        $scope.deleteLadder = deleteLadder;
        $scope.editLadder = editLadder;
        $scope.popupConfirm = popupConfirm;
        $scope.popupCancle = popupCancle;

        activate();

        ////////////////

        function activate() {
            $timeout(function () {
                $scope.logisticPath = angular.copy(logisticPathObj);

            })

        }

        function submit () {
            $scope.logisticPath.price_ladders = $scope.ladders;
            $scope.logisticPath.options = $scope.shipOptions.split(' ').map(function (item) {
                return {
                    type_name: item
                }
            });
            LogisticService.submitLogistic($scope.logisticPath).then(function (data) {
                $state.go('logisticList');
            })
        }

        function addLadder () {
            $scope.isPopupShown = true;
            if($scope.ladders.length===0){
                $scope.ladderFrom = 0;
            }
            else{
                $scope.ladderFrom = $scope.ladders[$scope.ladders.length-1].lower_bound;
            }
        }
        function deleteLadder (ladder) {
            // body...
        }
        function editLadder (ladder) {
            // body...
        }

        function popupConfirm () {
            if($scope.ladderTo && $scope.ladderPrice){
                if($scope.ladders.length===0 || parseInt($scope.ladderTo) > parseInt($scope.ladders[$scope.ladders.length-1].lower_bound)){
                    $scope.ladders.push({
                        lower_bound: $scope.ladderTo,
                        unit_price: $scope.ladderPrice,
                    });
                    popupCancle();
                }
            }

        }
        function popupCancle () {
            $scope.ladderFrom = null;
            $scope.ladderTo = null;
            $scope.ladderPrice = null;
            $scope.isPopupShown = false;
        }
    }
})();
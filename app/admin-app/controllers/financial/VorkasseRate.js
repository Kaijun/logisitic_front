(function() {
    'use strict';

    angular
        .module('admin.controllers')
        .controller('VorkasseRate', VorkasseRate);

    VorkasseRate.$inject = ['$scope', '$timeout', 'VorkasseService'];

    /* @ngInject */
    function VorkasseRate($scope, $timeout, VorkasseService) {
        $scope.currentRate = null;
        $scope.rate = null;
        $scope.confirmEdit = confirmEdit;

        activate();

        ////////////////

        function activate() {
            VorkasseService.getVorkasseRate().then(function (data) {
                $timeout(function () {
                    $scope.currentRate = data;
                })
            });
        }

        function confirmEdit () {
            if($scope.rate){
                VorkasseService.editVorkasseRate($scope.rate).then(function () {
                    swal({
                        type: "success",
                        title: "调整汇率成功",
                        showCancelButton: false,
                        confirmButtonColor: "#DD6B55",
                        confirmButtonText: "确定",
                        closeOnConfirm: true,
                    }, function () {
                       
                        $timeout(function() {
                           $scope.currentRate = $scope.rate;
                        });
                    })
                })
            }
        }

        $scope.cancle = function () {
            $scope.rate = null;
        }
    }
})();
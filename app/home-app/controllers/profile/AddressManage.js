(function() {
    'use strict';

    angular
        .module('home.controllers')
        .controller('AddressManageCtrl', AddressManageCtrl);

    AddressManageCtrl.$inject = ['$scope', 'ProfileService', '$state', '$timeout'];

    /* @ngInject */
    function AddressManageCtrl($scope, ProfileService, $state, $timeout) {

        $scope.cancle = cancle;
        $scope.submit = submit;
        $scope.item = {city: null};

        var addressObj = {
            province: null, 
            city: null,
            town: null,
            street: null,
            addr_symbol: null,
            post_code: null,
            receiver_name: null,
            phone: null,
            ID_card_no: null,
            ID_card_front: '11',
            ID_card_back: '11',
            is_default: null,
         };

         var isEditing = false;

         $scope.address = null;
         $scope.addressList = null;

         $scope.editAddr = editAddr;
         $scope.deleteAddr = deleteAddr;

        activate();

        ////////////////

        function activate() {
            $scope.address = angular.copy(addressObj);
            ProfileService.getAddressList().then(function (data) {
                $scope.addressList = data;
            })

            $scope.$on('onCitySelected', function(event, item) {
                $scope.address.province = item.cn[0];
                $scope.address.city = item.cn[1];
                $scope.address.town = item.cn[2];
                $scope.address.post_code = item.zip;
            })
        }

        function cancle(){
            $scope.address = angular.copy(addressObj);
            var isEditing = false;
            
        }

        function editAddr(addr){
            $timeout(function () {
                $scope.address = addr;
                $scope.item.city[0] = $scope.address.province;
                $scope.item.city[1] = $scope.address.city;
                $scope.item.city[2] = $scope.address.town;
                var isEditing = true;
            })
        }

        function deleteAddr(addr){
            $timeout(function () {
                $scope.address = addr
                var isEditing = true;
            })
        }

        function submit(){
            if(isEditing && $scope.address.id){
                ProfileService.editAddress($scope.address.id, $scope.address).then(function () {
                    $state.go($state.current, {}, {reload: true});
                });;
            }
            else{
                ProfileService.submitAddress($scope.address).then(function () {
                    $state.go($state.current, {}, {reload: true});
                });
            }
        }
    }
})();
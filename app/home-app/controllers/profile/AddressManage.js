(function() {
    'use strict';

    angular
        .module('home.controllers')
        .controller('AddressManageCtrl', AddressManageCtrl);

    AddressManageCtrl.$inject = ['$scope', 'ProfileService', '$state'];

    /* @ngInject */
    function AddressManageCtrl($scope, ProfileService, $state) {

        $scope.cancle = cancle;
        $scope.submit = submit;

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
         var isEditingAddrId = null;

         $scope.address = null;
         $scope.addressList = null;

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
            var isEditingAddrId = null;
            
        }

        function submit(){
            if(isEditing && isEditingAddrId){
                ProfileService.editAddress(isEditing, $scope.address).then(function () {
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
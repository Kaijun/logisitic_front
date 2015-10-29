(function() {
    'use strict';

    angular
        .module('home.controllers')
        .controller('AddressManageCtrl', AddressManageCtrl);

    AddressManageCtrl.$inject = ['$scope', 'ProfileService', '$state', '$timeout', 'InfoService', '$compile', '$q'];

    /* @ngInject */
    function AddressManageCtrl($scope, ProfileService, $state, $timeout, InfoService, $compile, $q) {

        $scope.cancle = cancle;
        $scope.submit = submit;
        $scope.imagesToUpload = [];

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
            ID_card_front: null,
            ID_card_back: null,
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
                $scope.address = angular.copy(addr);
                //re-render the city selector
                $scope.item = {
                    city: [$scope.address.province, $scope.address.city, $scope.address.town]
                }
                var citySelectorDom = angular.element(document.querySelector('#city-selector'));
                citySelectorDom.children().remove();
                var newElement = $compile( "<city-select ng-model='item.city'></city-select>" )( $scope );
                citySelectorDom.append( newElement );

                isEditing = true;
            })
        }

        function deleteAddr(addr){
            swal({
                title: "确认删除?",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                cancelButtonText: "取消",
                confirmButtonText: "确定",
                closeOnConfirm: true,
            }, function () {
                ProfileService.deleteAddress(addr.id).then(function(data) {
                    if(data.success===true){
                        swal("删除成功", "", "success");
                        var idx = $scope.addressList.indexOf(addr);
                        $scope.addressList.splice(idx, 1);
                        cancle();
                    }
                });
            })
        }

        function submit(){

            var promises = []; 

            if($scope.imagesToUpload[0]){
                var promise = InfoService.uploadImage($scope.imagesToUpload[0]).then(function(data){
                    if(data.success === true ) 
                        $scope.address.ID_card_front = data.file_name;
                });
                promises.push(promise)
            }
            if($scope.imagesToUpload[1]){
                var promise = InfoService.uploadImage($scope.imagesToUpload[1]).then(function(data){
                    if(data.success === true ) 
                        $scope.address.ID_card_back = data.file_name;
                });
                promises.push(promise)
            }
            
            $q.all(promises).then(function () {
                if(isEditing && $scope.address.id){
                    ProfileService.editAddress($scope.address.id, $scope.address).then(function () {
                        swal('修改成功', '', 'success');
                        $state.go($state.current, {}, {reload: true});
                    });;
                }
                else{
                    ProfileService.submitAddress($scope.address).then(function () {
                        swal('添加成功', '', 'success');
                        $state.go($state.current, {}, {reload: true});
                    });
                }
            })
        }
    }
})();
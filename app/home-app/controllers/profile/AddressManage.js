(function() {
    'use strict';

    angular
        .module('home.controllers')
        .controller('AddressManageCtrl', AddressManageCtrl);

    AddressManageCtrl.$inject = ['$scope', 'AppConfig', 'ProfileService', '$state', '$timeout', 'InfoService', '$compile', '$q'];

    /* @ngInject */
    function AddressManageCtrl($scope, AppConfig, ProfileService, $state, $timeout, InfoService, $compile, $q) {

        $scope.imageUrlPrefix = AppConfig.apiUrl+ '/image/';

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
         $scope.frontIDSelected = frontIDSelected;
         $scope.backIDSelected = backIDSelected;

        activate();

        ////////////////

        function activate() {
            $scope.address = angular.copy(addressObj);
            ProfileService.getAddressList().then(function (data) {
                $scope.addressList = data;
            })

            // $scope.$on('onCitySelected', function(event, item) {
            //     $scope.address.province = item.cn[0];
            //     $scope.address.city = item.cn[1];
            //     $scope.address.town = item.cn[2];
            //     $scope.address.post_code = item.zip;
            // })
        }

        function cancle(){
            $scope.address = angular.copy(addressObj);
            var isEditing = false;
            
        }

        function editAddr(addr){
            $timeout(function () {
                $scope.address = angular.copy(addr);
                if($scope.address.ID_card_front){
                    var $frontDom = $('.ip-pic-front');
                    $frontDom.css('background-image', 'url(' + $scope.imageUrlPrefix + $scope.address.ID_card_front + ')')
                    $frontDom.css('background-size', '100% 100%')
                }
                if($scope.address.ID_card_back){
                    var $backDom = $('.ip-pic-back');
                    $backDom.css('background-image', 'url(' + $scope.imageUrlPrefix + $scope.address.ID_card_back + ')')
                    $backDom.css('background-size', '100% 100%')
                }


                isEditing = true;
            })
        }

        function deleteAddr(addr){
            swal({
                title: "确认删除?",
                showCancelButton: true,
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
            if(!validate()){
                return;
            }
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

        function validate () {
            if(!$scope.address.province || !$scope.address.city ){
                swal('请完善城市信息! 选择您所在的省份/城市/县区', '', 'error');
                return false;
            }
            return true;
        }

        function frontIDSelected (ctx) {
            var reader = new FileReader();
            reader.onload = function(event) {
                var $dom = $('.ip-pic-front');
                $dom.css('background-image', 'url(' + event.target.result + ')')
                $dom.css('background-size', '100% 100%')
                $scope.$apply()
            }
          // when the file is read it triggers the onload event above.
          reader.readAsDataURL(ctx.files[0]);
        }
        function backIDSelected (ctx) {
            var reader = new FileReader();
            reader.onload = function(event) {
                var $dom = $('.ip-pic-back');
                $dom.css('background-image', 'url(' + event.target.result + ')')
                $dom.css('background-size', '100% 100%')
            }
          // when the file is read it triggers the onload event above.
          reader.readAsDataURL(ctx.files[0]);
        }
    }
})();
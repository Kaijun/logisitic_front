(function() {
    'use strict';

    angular
        .module('home.controllers')
        .controller('VorkasseSubmitCtrl', VorkasseSubmitCtrl);

    VorkasseSubmitCtrl.$inject = ['$scope', 'VorkasseService', 'InfoService', '$timeout', '$q', '$state', '$stateParams'];

    /* @ngInject */
    function VorkasseSubmitCtrl($scope, VorkasseService, InfoService, $timeout, $q, $state,  $stateParams) {
       var vorkasseObj = {
            amount: null,
            reference_website: null,
            description: null,
            proof_files_paths: null,
        }
        $scope.vorkasse = null; 

        $scope.imagesToUpload = [];
        $scope.isConfirmShown = false;
        $scope.confirmSubmit = confirmSubmit;
        $scope.editSubmit = editSubmit;
        $scope.deleteSubmit = deleteSubmit;

        var isImagesChanged = false;
        var isEditMode = false;

        active();

        function active () {

            $timeout(function(){
                if(!$stateParams.id){
                    $scope.vorkasse = angular.copy(vorkasseObj);
                }
                else{
                    isEditMode = true;
                    VorkasseService.getVorkasse($stateParams.id).then(function(data){
                        $scope.vorkasse = data;
                    },
                    // 非法
                    function(){
                        $state.go('index');
                    })
                }
            });


            //监察Images是否改变...
            $scope.$watch('imagesToUpload', function (newValue, oldValue) {
                if(newValue === oldValue) return;
                isImagesChanged = true;
            }, true);
            
        }
        

        $scope.confirm = function(){
            // TODO: check if stock available!!!

            //upload Images
            var imgFileNames = [];
            if(isImagesChanged){
                var deferred = $q.defer();
                var promises = []; 
                $scope.imagesToUpload.forEach(function (image, index) {
                    var promise = InfoService.uploadImage(image).then(function(data){
                        if(data.success=='true')
                            // imgFileNames.push(data.file_name);

                            $scope.vorkasse['proof_files_paths'] = data.file_name;
                            // $scope.vorkasse['image_'+(index+1)] = data.file_name;
                    });
                    promises.push(promise);
                });
                $q.all(promises).then(function(){
                    $timeout(function () {
                        isImagesChanged = false;
                        // $scope.vorkasse['proof_files_paths'] = imgFileNames;
                        toggleConfirmView();
                    });
                });
            }
            else{
                toggleConfirmView();
            }
            
            
        }


        function toggleConfirmView(){
            $scope.isConfirmShown = !$scope.isConfirmShown;
        }

        function confirmSubmit () {
            console.log($scope.vorkasse);
            if($stateParams.id && isEditMode){
                VorkasseService.editVorkasse($stateParams.id, $scope.vorkasse).then(function (data) {
                    // if(data.package_id && data.success==="true"){
                    //     $state.go('stockDetail', {stockId: $stateParams.stockId});
                    // }
                });
            }
            else{
                VorkasseService.submitVorkasse($scope.vorkasse).then(function (data) {
                    if(data.id && data.success===true){
                        $state.go('vorkasseDetail', {id: data.id});
                    }
                });
            }
        }

        function editSubmit () {
            $scope.isConfirmShown = false;
        }

        function deleteSubmit () {
            $state.go('vorkasseSubmit', {}, { reload: true });
        }
    }
})();
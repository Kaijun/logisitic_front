// (function() {
//     'use strict';

//     angular
//         .module('admin.controllers')
//         .controller('TransCompany', TransCompany);

//     TransCompany.$inject = ['$scope', '$state', '$timeout', 'LogisticService'];

//     /* @ngInject */
//     function TransCompany($scope, $state, $timeout, LogisticService) {

//         $scope.transCompanies = [];
//         $scope.isPopupShown = false;
//         $scope.companyName = '';
//         $scope.companyPrefix = '';

//         $scope.deleteTransCompany = deleteTransCompany;
//         $scope.addTransCompany = addTransCompany;
//         $scope.cancle = cancle;
//         $scope.submitTransCompany= submitTransCompany;

//         activate();

//         ////////////////

//         function activate() {
//             LogisticService.getTransCompanies().then(function (data) {
//                 $scope.transCompanies = data;
//             })
//         }        
//         function deleteTransCompany(tc){
//             swal({
//                 title: "确认删除?",
//                 showCancelButton: true,
//             }, function () {
                
//                 LogisticService.deleteTransCompany(tc.id).then(function (data) {

//                     $scope.transCompanies.forEach(function (item, idx, arry) {
//                         if(item.id == tc.id){
//                             arry.splice(idx, 1);
//                         }
//                     })
//                 })
//             })
//         }

//         function addTransCompany () {
//             $scope.isPopupShown = true;
//         }
//         function cancle () {
//             $scope.isPopupShown = false;
//         }
//         function submitTransCompany () {
//             if($scope.companyName && $scope.companyPrefix){
//                 LogisticService.submitTransCompany({name: $scope.companyName, prefix: $scope.companyPrefix}).then(function (data) {
//                     $scope.isPopupShown = false;
//                     swal('添加成功', '', 'success');
//                     $state.go($state.current, {}, {reload: true})
//                 })
//             }
//         }
//     }
// })();
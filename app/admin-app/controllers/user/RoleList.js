(function() {
    'use strict';

    angular
        .module('admin.controllers')
        .controller('RoleList', RoleList);

    RoleList.$inject = ['$scope', 'RoleService', '$timeout'];

    /* @ngInject */
    function RoleList($scope, RoleService, $timeout) {
        $scope.roles=[];
        $scope.deleteRole = deleteRole;

        activate();

        ////////////////

        function activate() {
            RoleService.getRoles().then(function (data) {
                $scope.roles = data;
            });

        }

        function deleteRole (id) {
            if(id){
                swal({
                    title: "确认删除?",
                    showCancelButton: true,
                }, function () {

                    RoleService.deleteRole(id).then(function(data) {

                        swal({
                            type: "success",
                            title: "删除!",
                            showCancelButton: false,
                            confirmButtonColor: "#DD6B55",
                            confirmButtonText: "确定",
                            closeOnConfirm: true,
                        }, function () {
                            
                            $scope.roles.map(function (item, index, arry) {
                                if(item.id === id){
                                    arry.splice(index, 1);
                                }
                            })
                        })
                    });
                })
            }
        }
    }
})();
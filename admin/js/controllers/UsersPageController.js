angular.module('MetronicApp').controller('UsersPageController', function ($rootScope, $scope, $http, $timeout,userService,$filter,$modal) {
    $scope.$on('$viewContentLoaded', function() {   
        // initialize core components
        App.initAjax();
        userService.getAllUsers(function (response) {
            $scope.hommyUsers = $filter('filter')(response, { isChef: false });
            $scope.showUserGrid($scope.hommyUsers);
        })


        // set sidebar closed and body solid layout mode
        $rootScope.settings.layout.pageContentWhite = true;
        $rootScope.settings.layout.pageBodySolid = false;
        $rootScope.settings.layout.pageSidebarClosed = false;
    });
    $scope.showUserGrid = function (data) {
        $scope.userGridOptions = {
            paginationPageSizes: [10, 25, 50, 75],
            paginationPageSize: 10,//initial item number to be display in grid
            enableRowSelection: true,//for row selection
            enableSelectAll: true,
            showGridFooter: true,//show grid footer
            enableColumnMenus: false//remove column menu
        };
        $scope.userGridOptions.columnDefs = [
            { name: "name" },
            { name: "email" },
            { name: "Address", field: "address[0].area" },
            {
                name: 'Edit', cellTemplate: 'views/edit-button.html', width: 50
            }
            
        ]
        $scope.userGridOptions.data = data;
    }

    $scope.searchUsers = function () {
        $scope.userGridOptions.data = $filter("filter")($scope.hommyUsers, $scope.search)
    }

    $scope.editRow = function (row) {

        //schema for form
        $scope.schema = {
            "type": "object",
            "title": "editUser"
            //"properties": {
            //    "password": "string",
            //    "name": "string",
            //    "address": {
            //        "_id": "string",
            //        "addressType": "string",
            //        "address": "string",
            //        "city": "string",
            //        "area": "string",
            //        "loc": [
            //          "string"
            //        ]
            //    }
            //}
        }
                 
        
        $scope.form = ["*"];
        console.log(row);
        $scope.model = angular.copy(row);

        $scope.modalInstance = $modal.open({
            templateUrl: 'views/edit-modal.html',
            controller: "UsersPageController",
            scope: $scope
        });
    }

    $scope.save = function () {
        console.log($scope.model)
        //data to be store
        var updatedArray = {
            orderStatus: $scope.model.orderStatus
        }
        console.log(updatedArray);

        //update order
        orderService.updateOrder($scope.model._id, updatedArray, function () {
            for (i = 0; i < $scope.orderGridOptions.data.length; i++) {
                if ($scope.orderGridOptions.data[i].orderId == $scope.model.orderId) {
                    $scope.orderGridOptions.data[i].orderStatus = $scope.model.orderStatus
                }
            }
            $scope.modalInstance.close();
            alert("Updated row successfully");

        })
    }
});
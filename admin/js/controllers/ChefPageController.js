angular.module('MetronicApp').controller('ChefPageController', function ($rootScope, $scope, $http, $timeout, orderService, userService, kitchenService, $filter,$modal) {
    $scope.$on('$viewContentLoaded', function() {   
        // initialize core components
        App.initAjax();

        //bind grid
        userService.getAllUsers(function (response) {
            $scope.hommyChefs = $filter('filter')(response, { isChef: true });
            $scope.showChefGrid($scope.hommyChefs);
        })

        // set sidebar closed and body solid layout mode
        $rootScope.settings.layout.pageContentWhite = true;
        $rootScope.settings.layout.pageBodySolid = false;
        $rootScope.settings.layout.pageSidebarClosed = false;
    });
    $scope.showChefGrid = function (data) {
        $scope.chefGridOptions = {
            paginationPageSizes: [10, 25, 50, 75],
            paginationPageSize: 10,//initial item number to be display in grid
            //enableRowSelection: true,//for row selection
            //enableSelectAll: true,
            showGridFooter: true,//show grid footer
            enableColumnMenus: false//remove column menu
        };
        $scope.chefGridOptions.columnDefs = [
            { name: "name" },
            { name: "email" },
            {name: "address", field:"address[0].area"},
            {
                name: 'Edit', cellTemplate: 'views/edit-button.html', width: 50
            }
        ]
        $scope.chefGridOptions.data = data;
    }

    $scope.searchChefs = function () {
        $scope.chefGridOptions.data = $filter("filter")($scope.hommyChefs, $scope.search)
    }

    $scope.editRow = function (row) {

        //schema for form
        $scope.schema = {
            "type": "object",
            "title": "editUser",
            "properties": {
                "name": { "type": "string", title: "name" },
                "email": { "type": "string", title: "email" },
                "dob": { "type": "string", title: "Data of Birth" }
            }
        }


        $scope.form = ["*"];

        $scope.model = angular.copy(row.entity);

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


    $scope.openAddModal = function () {
        //schema for form
        $scope.addschema = {
            "type": "object",
            "title": "AddUser",
            "properties": {
                "name": { type: "string", title: "Name" },
                "email": { type: "string", title: "Email" },
                "mobile": { type: "string", title: "mobile" },
                "password": { type: "string", title: "Password" }
            }
        }

        $scope.addform = ["*"];
        $scope.addmodel = {};

        $scope.modalInstance = $modal.open({
            templateUrl: 'views/add-modal.html',
            controller: "UsersPageController",
            scope: $scope
        });
    }

    $scope.addRow = function () {
        kitchenService.addKitchen($scope.addmodel, function (response) {
            console.log(response)
            if (response.status == 200) {
                alert("user Added successfully")
            }
        })

    }

});
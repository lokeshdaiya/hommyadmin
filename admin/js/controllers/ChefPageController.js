angular.module('MetronicApp').controller('ChefPageController', function ($rootScope, $scope, $http, $timeout, orderService, userService, kitchenService, $filter, $modal) {
    $scope.$on('$viewContentLoaded', function () {
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
            { name: "address", field: "address[0].area" },
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
            "title": "editChef",
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
            controller: "ChefPageController",
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
            "title": "Add Chef",
            "properties": {
                //"chefName": { type: "string", title: "Chef Name"},
                "name": { type: "string", title: "Chef Name" },
                "email": { type: "string", title: "Email" },
                "mobile": { type: "number", title: "Mobile" },
                "password": { type: "string", title: "Password" },
                "dob": { type: "string", title: "Date of Birth" },
                //"secondaryPhone": { type: "string" },
                //"deliveryTime": { type: "number" },
                //"address": { type: "string", title: "Address" },
                //"area": { type: "string" },
                //"city": { type: "string" },
                //"loc": { type: "string" },
                //"offerMessage": { type: "string" },
                //"hommyCommission": { type: "nnumber" },
                //"pureVeg": { type: "boolean" },
                //"isEnabled": { type: "boolean" },
                //"timings": {
                //    type: "array",
                //    items: {
                //        type:"string"
                //    }
                //},
                //"bankDetails": {
                //    title:"Bank Details",
                //    type: "object",
                //    properties: {
                //        "accHolder": { type: "string" },
                //        "accNumber": { type: "string" },
                //        "IFSC": { type: "string" },
                //        "bankName": { type: "string" },
                //        "branchArea": {type: "string"}
                //        }
                //    }
                //}
                "address": {
                    "type": "object",
                    "title": 'Address',
                    "properties": {
                        "addressType": { type: "string", title: "Address Type" },
                        "address": { type: "string", title: "Address" },
                        "city": { type: "string", title: "City" },
                        "area": { type: "string", title: "Area" }
                    },
                    required: ["addressType", "address", "city", "area"]
                }
            },
            required: ["name", "email", "mobile", "password", "dob"]
        }

        //$scope.addform = [
        //    {
        //        key: "name",
        //        title: "Chef Name"
        //    },
        //    {
        //        key: "dob",
        //        title: "Date of Birth"
        //    },
        //    {
        //        key: "email",
        //        title: "Email",
        //        type: "email"
        //    },
        //    {
        //        key: "mobile",
        //        title: "Mobile",
        //        type: "number"
        //    },
        //    {
        //        key: "password",
        //        title: "Password",
        //        type: "password"
        //    },
        //    {
        //        "key": "address",
        //        "items": [
        //            { "key": "addressType", "type": "string", "title": "Address Type" },
        //            { "key": "address", "type": "string", "title": "Address" },
        //            { "key": "city", "type": "string", "title": "City" },
        //            { "key": "area", "type": "string", "title": "Area" }]
        //    },
        //];
        $scope.addform = ["*"];
        $scope.addmodel = {};

        $scope.modalInstance = $modal.open({
            templateUrl: 'views/add-modal.html',
            controller: "ChefPageController",
            scope: $scope
        });
    }

    $scope.addRow = function () {
        $scope.addmodel.isChef = true;
        kitchenService.addKitchen($scope.addmodel, function (response) {
            console.log(response)
            if (response.status == 200) {
                alert("Chef Added successfully")
            }
        })

    }

});
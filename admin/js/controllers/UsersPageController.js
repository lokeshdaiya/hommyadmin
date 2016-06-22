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

    //open edit modal
    $scope.editRow = function (row) {
        //schema for form
        $scope.schema = {
            "type": "object",
            "title": "editUser",
            "properties": {
                "name": { "type": "string", title: "name" },
                //"email": { "type": "string", title: "email" },
                "dob": { "type": "string", title: "Data of Birth" },
                //"address.addressType": {type:"string",title:"Address Type"},
                //"address.address": {type:"string",title:"Address"},
                //"address.city": {type:"string",title:"City"},
                //"address.area": {type:"string",title:"Area"}
                
            }
        }
                 
        
        $scope.form = ["*"];
        $scope.model = angular.copy({ name: row.entity.name, dob: row.entity.dob });//add more field if needed to update
        //take index to update grid after save
        $scope.editIndex = $scope.userGridOptions.data.indexOf(row.entity);
        $scope.editUserId = row._id;

        $scope.modalInstance = $modal.open({
            templateUrl: 'views/edit-modal.html',
            controller: "UsersPageController",
            scope: $scope
        });
    }

    //update row
    $scope.save = function () {
        //update user
        userService.updateHommyUser($scope.model, $scope.editUserId, function (response) {
            console.log(response);
            if (response.status == 200) {
                $scope.userGridOptions.data[$scope.editIndex]=response.data
                //for (i = 0; i < $scope.userGridOptions.data.length; i++) {
                //    if ($scope.userGridOptions.data[i]._id == $scope.editUserId) {
                //        //$scope.userGridOptions.data[i].orderStatus = $scope.model
                //        for (var property in $scope.model) {
                //            $scope.userGridOptions.data[i][property] = $scope.model[property]
                //        }
                //    }
                //}
                $scope.modalInstance.close();
                alert("Updated row successfully");
            }
            else {
                $scope.modalInstance.close();
                alert("Failed to updated row");
            }

        })
    }

    //open add mdoal
    $scope.openAddModal = function () {
        //schema for form
        $scope.addschema = {
            "type": "object",
            "title": "AddUser",
            "properties": {
                "name": { type: "string", title: "Name" },
                "email": { type: "string", title: "Email" },
                "mobile": { type: "string", title: "mobile" },
                "password": { type: "string", title: "Password" },
                "dob": { type: "string", title: "DOB", "format": "date" },
                "address": {
                    "type": "object",
                    "title":'',
                    "properties": {
                        "addressType": { type: "string", title: "Address Type" },
                        "address": { type: "string", title: "Address" },
                        "city": { type: "string", title: "city" },
                        "area": { type: "string", title: "area" }
                    }
                }
            }
        }

        $scope.addform = ["*"];
        $scope.addmodel = { };
        $scope.modalInstance = $modal.open({
            templateUrl: 'views/add-modal.html',
            controller: "UsersPageController",
            scope: $scope
        });
    }

    //add new row 
    $scope.addRow = function () {
        $scope.addmodel.isChef = false;
        userService.addUser($scope.addmodel, function (response) {
            console.log(response)
            if (response.status == 200) {
                $scope.modalInstance.close();
                alert("User Added successfully")
            } else {
                alert("Opps...Something went wrong..please check details again")
            }
        })

    }

});
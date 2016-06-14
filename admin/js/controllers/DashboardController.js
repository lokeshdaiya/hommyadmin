angular.module('MetronicApp').controller('DashboardController', function ($rootScope, $scope, $http, $timeout, orderService,userService,$filter,$modal) {
    $scope.$on('$viewContentLoaded', function() {   
        // initialize core components
        App.initAjax();

        //bind grid
        orderService.getOrderDetails(function (response) {
            $scope.orders = response;
            $scope.showOrderGrid(response);
        })

        userService.getAllUsers(function (response) {
            $scope.createUserGridData(response,function(data){
                $scope.showUserGrid(data);
            });
        })
    });
   
    $scope.createUserGridData = function (data,callback) {
        var gridData = {};
        $scope.totalChef = $filter('filter')(data, { isChef: true });
        $scope.totalUser = $filter('filter')(data, { isChef: false });
        var result=$filter("groupBy")(data,"address[0].area");
        var userGridArray=[];
        angular.forEach(result,function(value,key){
            var totalChef = $filter('filter')(value, { isChef: true });
            var totalUser = $filter('filter')(value, { isChef: false });
            var jsonObject={
                            "Area":key,
                            "TotalChef":totalChef.length,
                            "TotalUser":totalUser.length
            }
            userGridArray.push(jsonObject);

        })
        console.log(userGridArray);
        callback(userGridArray);
    }
    $scope.showOrderGrid = function (data) {
        $scope.orderGridOptions = {
            paginationPageSizes: [10, 25, 50, 75],
            paginationPageSize: 10,//initial item number to be display in grid
            //enableRowSelection: true,//for row selection
            //enableSelectAll: true,
            showGridFooter: true,//show grid footer
            enableColumnMenus: false,//remove column menu
        };
        $scope.orderGridOptions.columnDefs = [
          {
              name: 'Order Id', cellTemplate: '<div>' +
                     '<a href="#{{row.entity.orderId}}">{{row.entity.orderId}}</a>' +
                     '</div>'
          },
          { name: 'Delivery Time', field: 'deliveryTime' },
          { name: 'Order Time', field: 'createdAt' },
          { name: 'Delivery Type', field: 'deliveryType' },
          { name: 'Area', field: 'shippingArea' },
          { name: 'Status', field: 'orderStatus' },
          {
              name: 'Edit', cellTemplate: 'views/edit-button.html', width: 50
          }

        ]
        $scope.orderGridOptions.data = data;
    }

    
    $scope.searchOrders = function () {
        $scope.orderGridOptions.data = $filter("filter")($scope.orders,$scope.search)
    }

    $scope.editRow = function (row) {

        //schema for form
        $scope.schema = {
                        "type": "object",
                        "title": "editOrder",
                        "properties": {
                                        "orderStatus": {
                                                        "title": "orderStatus",
                                                        "type": "string"
                                                       }
                                      }
                    }
        $scope.form = ["*"];

        $scope.model = angular.copy(row.entity);

        $scope.modalInstance=$modal.open({
            templateUrl: 'views/edit-modal.html',
            controller: "DashboardController",
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

    $scope.showUserGrid=function(data){
          
          $scope.userGridOptions = {
            paginationPageSizes: [10, 25, 50, 75],
            paginationPageSize: 10,//initial item number to be display in grid
            //enableRowSelection: true,//for row selection
            //enableSelectAll: true,
            showGridFooter: true,//show grid footer
            enableColumnMenus: false,//remove column menu
        };

        $scope.userGridOptions.columnDefs = [
          
          { name: 'Area', field: 'Area' },
          { name: 'TotalChef', field: 'TotalChef' },
          { name: 'TotalUser', field: 'TotalUser' },

        ]

        $scope.userGridOptions.data = data;
    }

    // set sidebar closed and body solid layout mode
    $rootScope.settings.layout.pageContentWhite = true;
    $rootScope.settings.layout.pageBodySolid = false;
    $rootScope.settings.layout.pageSidebarClosed = false;
});
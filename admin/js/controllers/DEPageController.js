angular.module('MetronicApp').controller('DashboardController', function ($rootScope, $scope, $http, $timeout, orderService,userService,$filter) {
    $scope.$on('$viewContentLoaded', function() {   
        // initialize core components
        App.initAjax();

        //bind grid
        orderService.getOrderDetails(function (response) {
            $scope.orders = response;
            $scope.showOrderGrid(response);
        })

        userService.getAllUsers(function (response) {
            $scope.createUserGridData(response);
        })
    });
   
    $scope.createUserGridData = function (data) {
        var gridData = {};
        $scope.totalChef = $filter('filter')(data, { isChef: true });
        $scope.totalUser = $filter('filter')(data, { isChef: false });
        var groupbyData = $filter('group')(data, "address.area");
        var r = _.groupBy(_.flatten(_.pluck(data, "address")), function (item) {
            return item;
        })
        console.log(groupbyData);

    }
    $scope.showOrderGrid = function (data) {

        $scope.orderGridOptions = {
            paginationPageSizes: [10, 25, 50, 75],
            paginationPageSize: 10,//initial item number to be display in grid
            enableRowSelection: true,//for row selection
            enableSelectAll: true,
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
          { name: 'Order Time', field: 'CreatedAt' },
          { name: 'Delivery Type', field: 'deliveryType' },
          { name: 'Area', field: 'shippingArea' },
          { name: 'Status', field: 'orderStatus' }
        ]
        $scope.orderGridOptions.data = data;
    }

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
          {
              name: 'Order Id', cellTemplate: '<div>' +
                     '<a href="#{{row.entity._id}}">{{row.entity._id}}</a>' +
                     '</div>'
          },
          { name: 'deliveryTime', field: 'deliveryTime' },
          { name: 'deliveryType', field: 'deliveryType' },
          { name: 'Area', field: 'shippingArea' },
          { name: 'Status', field: 'orderStatus' }
        ]
        $scope.userGridOptions.data = data;
    }
    // set sidebar closed and body solid layout mode
    $rootScope.settings.layout.pageContentWhite = true;
    $rootScope.settings.layout.pageBodySolid = false;
    $rootScope.settings.layout.pageSidebarClosed = false;
});
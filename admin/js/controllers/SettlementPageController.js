angular.module('MetronicApp').controller('SettlementPageController', function ($rootScope, $scope, $http, $timeout, orderService) {
    $scope.$on('$viewContentLoaded', function() {   
        // initialize core components
        App.initAjax();
        var data = [];
        $scope.showOrderGrid(data);
    });

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
          { name: 'Date'},
          { name: 'Order id' },
          { name: 'HC ID' },
          { name: 'HC Name' },
          { name: 'Area' },
          { name: 'Bill Amount' },
          { name: 'Delivery Charges' },
          { name: 'Service Fee' },
          { name: 'Service Tax(14%)' },
          { name: 'Swatch Bharat CESS(0.5%)' },
          { name: 'Krishi Kalyan CESS(0.5%)' },
          { name: 'Service Fee + Taxes' },
          { name: 'Net Payable Amount' },
        ]
        $scope.orderGridOptions.data = data;
    }

    $scope.searchOrders = function () {
        $scope.orderGridOptions.data = $filter("filter")($scope.orders, $scope.search)
    }
    // set sidebar closed and body solid layout mode
    $rootScope.settings.layout.pageContentWhite = true;
    $rootScope.settings.layout.pageBodySolid = false;
    $rootScope.settings.layout.pageSidebarClosed = false;
});
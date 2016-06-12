angular.module('MetronicApp').controller('ChefPageController', function ($rootScope, $scope, $http, $timeout, orderService, userService, kitchenService, $filter) {
    $scope.$on('$viewContentLoaded', function() {   
        // initialize core components
        App.initAjax();

        //bind grid
        userService.getAllUsers(function (response) {
            $scope.hommyChefs = $filter('filter')(response, { isChef: true });
            $scope.showChefGrid($scope.hommyChefs);
        })
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



    // set sidebar closed and body solid layout mode
    $rootScope.settings.layout.pageContentWhite = true;
    $rootScope.settings.layout.pageBodySolid = false;
    $rootScope.settings.layout.pageSidebarClosed = false;
});
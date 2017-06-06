function locationService($http, $log, transferBoxConfig) {
    return {
        getStatesList: function () {
            return $http.get(transferBoxConfig.URL);
        }
    };
}
locationService.inject = ['$http', '$log', 'transferBoxConfig'];
angular.module('transferApp').service('locationService', locationService);
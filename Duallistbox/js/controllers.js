(function () {
    var appCtrl = function ($scope, $log, locationService) {
        var c = this;
        c.name = "TransferBox";
        c.states = {};
        c.loading = true;
        c.init = function () {
    locationService.getStatesList().success(function (data) {
                c.states = data;
                c.loading = false;
            }).error(function (err) {
                c.loading = false;
            });
        };
  c.init();
    }
    appCtrl.inject = ['$scope', '$log', 'locationService'];
    angular.module('transferApp').controller('appCtrl', appCtrl);
        function DualListController($scope, $log, $rootScope, $timeout, transferBoxConfig) {
        var c = this;
        c.stateList = [];
        c.selectedStates = [];
        c.selectAllsl = false;
        c.selectAllss = false;
        c.loading = true; 
        c.states = JSON.parse($scope.states);
        c.added = false;
        c.stateList = c.states.available; 
        c.selectedStates = c.states.selected;
        c.selectAll = function (type, value) {
            if (type == transferBoxConfig.AVAL) {
                c.selectAllsl = value;
            } else {
                c.selectAllss = value;
            }
            c.changeSelected(type === transferBoxConfig.AVAL ? c.stateList : c.selectedStates, value);
        };
        c.changeSelected = function (list, value) {
            angular.forEach(list, function (item, index) {
                item.selected = value;
            });
        }
              c.selectItem = function (state) {
            state.selected = !state.selected;
        }
        c.moveLeft = function (state, index) {
            state.selected = false;
            c.stateList.push(angular.copy(state));
            state.delete = true;
            c.selectedStates = c.removeObjects(c.selectedStates);
            c.getSelectedList();
        };
               c.moveRight = function (state, index) {
            state.selected = false;
            c.selectedStates.push(angular.copy(state));
            state.delete = true;
            c.stateList = c.removeObjects(c.stateList);
            c.getSelectedList();
        };
               c.moveObjects = function (source, dest) {
            angular.forEach(source, function (item, index) {
                if (item.selected || item.selected === 'true') {
                    item.selected = false;
                    dest.push(angular.copy(item));
                    item.delete = true;
                }
            });

        };
        c.removeObjects = function (source) {
            source = source.filter(function (obj) {
                return obj.delete != true;
            });
            return source;
        };
        c.moveAll = function (value) {
            if (value == transferBoxConfig.LEFT) {
                c.moveObjects(c.selectedStates, c.stateList);
                c.selectedStates = c.removeObjects(c.selectedStates);
            } else {
                c.moveObjects(c.stateList, c.selectedStates);
                c.stateList = c.removeObjects(c.stateList);
            }
            c.selectAllsl = false;
            c.selectAllss = false;
            c.getSelectedList();
        }
        c.getSelectedList = function () {
            var states = [];
            angular.forEach(c.selectedStates, function (state) {
                states.push(state.id);
            });
            states.sort();
            return states.join(transferBoxConfig.SEP);
        };
        c.dropSuccessHandler = function ($event, index, array, state) {
            if (c.added) {
                array.splice(index, 1);
                          }
        };
        c.onDrop = function ($event, $data, array) {
            c.added = false;
            var p = -1;
            var pos = array.filter(function (obj) {
                if (obj.id === $data.id) {
                    p = 1;
                }
            });
            console.log(p);
            if (p < 0) {
                c.added = true;
                array.push($data);
            } else {
                c.added = false;
            }
        };

                      }
    DualListController.inject = ['$scope', '$log', '$rootScope', 'locationService', '$timeout', 'transferBoxConfig'];
    angular.module('transferbox').controller('DualListController', DualListController);
})();
(function() {
    angular.module('transferbox', ['ngDragDrop']);
    angular.module('transferbox').constant(
        "transferBoxConfig", {
            AVAL: 'aval',
            LEFT: 'left',
            RIGHT: 'right',
            SEP: ','
        }
    )
    function DualListController($scope, $log, $rootScope, $timeout, transferBoxConfig) {
        var c = this;
        c.stateList = [];
        c.selectedStates = [];
        c.selectAllsl = false;
        c.selectAllss = false;
        c.loading = true; 
        c.added = false;
        c.selectAll = function(type, value) {
            if (type == transferBoxConfig.AVAL) {
                c.selectAllsl = value;
            } else {
                c.selectAllss = value;
            }
            c.changeSelected(type === transferBoxConfig.AVAL ? c.stateList : c.selectedStates, value);
        };
        c.changeSelected = function(list, value) {
            angular.forEach(list, function(item, index) {
                item.selected = value;
            });
        }
        c.selectItem = function(state) {
            state.selected = !state.selected;
        }
        c.moveLeft = function(state, index) {
            state.selected = false;
            c.stateList.push(angular.copy(state));
            state.delete = true;
            c.selectedStates = c.removeObjects(c.selectedStates);
            c.getSelectedList();
        };
        c.moveRight = function(state, index) {
            state.selected = false;
            c.selectedStates.push(angular.copy(state));
            state.delete = true;
            c.stateList = c.removeObjects(c.stateList);
            c.getSelectedList();
        };
        c.moveObjects = function(source, dest) {
            angular.forEach(source, function(item, index) {
                if (item.selected || item.selected === 'true') {
                    item.selected = false;
                    dest.push(angular.copy(item));
                    item.delete = true;
                }
            });
        };
        c.removeObjects = function(source) {
            source = source.filter(function(obj) {
                return obj.delete != true;
            });
            return source;
        };
        c.moveAll = function(value) {
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
        c.getSelectedList = function() {
            var states = [];
            angular.forEach(c.selectedStates, function(state) {
                states.push(state.id);
            });
            states.sort();
            return states.join(transferBoxConfig.SEP);
        };
        c.dropSuccessHandler = function($event, index, array, state) {
            if (c.added)
                array.splice(index, 1);
        };
        c.onDrop = function($event, $data, array) {
            var p = -1;
            var pos = array.filter(function(obj) {
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
    var transferBox = function() {
        return {
            restrict: 'A',
            scope: {
                states: '@states'
            },
            template: `<div class="row"> 
                <div class="col-md-6 col-sm-6 box ">
                 <div class="col-md-12 list" ui-on-Drop="c.onDrop($event,$data,c.stateList)"> 
                    <div class="list-group-item" ng-repeat="state in c.stateList  | orderBy: 'name' track by $index" ng-class="{selected:state.selected ==true}"   ui-draggable="true" drag="state" 
                    on-drop-success="c.dropSuccessHandler($event,$index,c.stateList,state)" >
                           <span ng-click="c.selectItem(state)" class="text"> {{state.name}} </span>
                         <span class="glyphicon glyphicon-chevron-right text-right icon" aria-hidden="true" ng-click="c.moveRight(state,$index)"></span>
                    </div>
                           
                    </div>
                </div>

                <!-- <div class="col-md-1">
                        <div id="slider">slider</div>
                </div> -->

                <div class="col-md-6 col-sm-6  box">
                     <div class="col-md-12 list"  ui-on-Drop="c.onDrop($event,$data,c.selectedStates)">

                            <div class="list-group-item" ng-repeat="state in c.selectedStates | orderBy:'name' track by $index "  ng-class="{selected:state.selected}"  ui-draggable="true" drag="state" 
                    on-drop-success="c.dropSuccessHandler($event,$index,c.selectedStates,state)" >

                                <span class="glyphicon glyphicon-chevron-left text-left icon" aria-hidden="true" ng-click="c.moveLeft(state,$index)"></span>
                                <span ng-click="c.selectItem(state)" class="text"> {{state.name}} </span>

                            </div>

                    </div>
                </div>
                          </div>`,
            link: function($scope, element, attr) {},
            bindToController: true,
            controller: 'DualListController',
            controllerAs: 'c'
        };
    }
    DualListController.inject = ['$scope', '$log', '$rootScope', '$timeout', 'transferBoxConfig'];
    angular.module('transferbox')
        .controller('DualListController', DualListController)
        .directive('filterbox', filterBox);
})();

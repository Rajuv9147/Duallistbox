(function () {
    var transferBox = function () {
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
            link: function ($scope, element, attr) {},
            bindToController: true,
            controller: 'DualListController',
            controllerAs: 'c'
        };
    }
    angular.module('transferbox')
        .directive('transferbox', transferBox);

})();
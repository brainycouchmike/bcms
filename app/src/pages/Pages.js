(function(){
    'use strict';
    // Prepare the 'core' module for subsequent registration of controllers and delegates
    angular.
    module('pages', [ 'ngMaterial', 'ngRoute', 'core' ]).
    service('pageService', [
        '$q', 
        /**
        * Pages DataService
        * Uses embedded, hard-coded data model; acts asynchronously to simulate
        * remote data service call(s).
        *
        * @returns {{loadAllPages: Function}}
        * @constructor
        */
        function($q){
            var pages = [
              {
                name: 'Home',
                avatar: 'svg-1',
                content: 'Home Page',
                requirements: []
              },
              {
                name: 'About',
                avatar: 'svg-2',
                content: 'About Page',
                requirements: []
              },
              {
                name: 'Login',
                avatar: 'svg-3',
                content: 'asdf',
                requirements: []
              }
            ];

            // Promise-based API
            return {
              loadAllPages : function() {
                // Simulate async nature of real remote calls
                return $q.when(pages);
              }
            };
        }
    ]).
    controller('PageController', [
        'coreService', 'pageService', '$mdSidenav', '$mdBottomSheet', '$log', '$q',
        /**
        * Page Controller for the BCMS App
        * @param $scope
        * @param $mdSidenav
        * @param avatarsService
        * @constructor
        */
        function(coreService, pageService, $mdSidenav, $mdBottomSheet, $log, $q) {
            var self = this;
            self.selected     = null;
            self.pages        = [ ];
            self.selectPage   = selectPage;
            self.toggleMenu   = togglePagesMenu;
            self.menu         = menu;
            
            getAllPages();
            
            // *********************************
            // Internal methods
            // *********************************
            
            function getAllPages() {
                if(!self.pages || !self.pages.length) {
                    // Load all registered pages
                    pageService.loadAllPages().
                    then(function(pages) {
                        self.pages    = [].concat(pages);
                        self.selected = pages[0];
                    });
                }
                return self.pages;
            }
            
            /**
             * First hide the bottomsheet IF visible, then
             * hide or Show the 'left' sideNav area
             */
            function togglePagesMenu() {
              var pending = $mdBottomSheet.hide() || $q.when(true);
            
              pending.then(function(){
                $mdSidenav('left').toggle();
              });
            }
            
            /**
             * Select the current avatars
             * @param menuId
             */
            function selectPage(page) {
              self.selected = angular.isNumber(page) ? $scope.pages[page] : page;
              self.toggleMenu();
            }
            
            /**
             * Show the menu
             */
            function menu($event) {
                var page = self.selected;
            
                $mdBottomSheet.show({
                  parent: angular.element(document.getElementById('content')),
                  templateUrl: '/src/pages/view/pageMenu.html',
                  controller: [ '$mdBottomSheet', PageMenuController],
                  controllerAs: "vm",
                  bindToController : true,
                  targetEvent: $event
                }).then(function(clickedItem) {
                  clickedItem && $log.debug( clickedItem.name + ' clicked!');
                });
            
                /**
                 * Bottom Menu controller for the Avatar Actions
                 */
                function PageMenuController( $mdBottomSheet ) {
                  this.page = page;
                  this.items = [
                    { name: 'Phone'       , icon: 'phone'       , icon_url: 'assets/svg/phone.svg'},
                    { name: 'Twitter'     , icon: 'twitter'     , icon_url: 'assets/svg/twitter.svg'},
                    { name: 'Google+'     , icon: 'google_plus' , icon_url: 'assets/svg/google_plus.svg'},
                    { name: 'Hangout'     , icon: 'hangouts'    , icon_url: 'assets/svg/hangouts.svg'}
                  ];
                  this.performAction = function(action) {
                    $mdBottomSheet.hide(action);
                  };
                }
            }
        }
    ]);
})();
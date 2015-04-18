(function(){

  angular
       .module('core')
       .controller('Core', [
          'pageService', '$mdSidenav', '$mdBottomSheet', '$log', '$q',
          CoreController
       ]);

  /**
   * Main Controller for the Angular Material Starter App
   * @param $scope
   * @param $mdSidenav
   * @param avatarsService
   * @constructor
   */
  function CoreController( coreService, $mdSidenav, $mdBottomSheet, $log, $q) {
    var self = this;

    self.selected     = null;
    self.cores        = [ ];
    self.selectCore   = selectPage;
    self.toggleMenu   = toggleCoresMenu;
    self.menu        = menu;

    // Load all registered cores

    coreService
          .loadAllCores()
          .then( function( cores ) {
            self.cores    = [].concat(cores);
            self.selected = cores[0];
          });

    // *********************************
    // Internal methods
    // *********************************

    /**
     * First hide the bottomsheet IF visible, then
     * hide or Show the 'left' sideNav area
     */
    function toggleCoresMenu() {
      var pending = $mdBottomSheet.hide() || $q.when(true);

      pending.then(function(){
        $mdSidenav('left').toggle();
      });
    }

    /**
     * Select the current avatars
     * @param menuId
     */
    function selectCore ( core ) {
      self.selected = angular.isNumber(core) ? $scope.cores[core] : core;
      self.toggleMenu();
    }

    /**
     * Show the bottom sheet
     */
    function menu($event) {
        var core = self.selected;

        $mdBottomSheet.show({
          parent: angular.element(document.getElementById('content')),
          templateUrl: '/src/cores/view/contactSheet.html',
          controller: [ '$mdBottomSheet', CoreSheetController],
          controllerAs: "vm",
          bindToController : true,
          targetEvent: $event
        }).then(function(clickedItem) {
          clickedItem && $log.debug( clickedItem.name + ' clicked!');
        });

        /**
         * Bottom Sheet controller for the Avatar Actions
         */
        function CoreSheetController( $mdBottomSheet ) {
          this.core = core;
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

})();

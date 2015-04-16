(function(){

  angular
       .module('pages')
       .controller('PageController', [
          'pageService', '$mdSidenav', '$mdBottomMenu', '$log', '$q',
          PageController
       ]);

  /**
   * Page Controller
   * @param $scope
   * @param $mdSidenav
   * @param avatarsService
   * @constructor
   */
  function PageController(pageService, $mdSidenav, $mdBottomMenu, $log, $q) {
    var self = this;

    self.selected     = null;
    self.pages        = [ ];
    self.selectPage   = selectPage;
    self.toggleMenu   = togglePagesMenu;
    self.menu        = menu;

    // Load all registered pages

    pageService
          .loadAllPages()
          .then( function( pages ) {
            self.pages    = [].concat(pages);
            self.selected = pages[0];
          });

    // *********************************
    // Internal methods
    // *********************************

    /**
     * First hide the bottomsheet IF visible, then
     * hide or Show the 'left' sideNav area
     */
    function togglePagesMenu() {
      var pending = $mdBottomMenu.hide() || $q.when(true);

      pending.then(function(){
        $mdSidenav('left').toggle();
      });
    }

    /**
     * Select the current avatars
     * @param menuId
     */
    function selectPage ( page ) {
      self.selected = angular.isNumber(page) ? $scope.pages[page] : page;
      self.toggleMenu();
    }

    /**
     * Show the menu
     */
    function menu($event) {
        var page = self.selected;

        $mdBottomMenu.show({
          parent: angular.element(document.getElementById('content')),
          templateUrl: '/src/pages/view/pageMenu.html',
          controller: [ '$mdBottomMenu', PageMenuController],
          controllerAs: "vm",
          bindToController : true,
          targetEvent: $event
        }).then(function(clickedItem) {
          clickedItem && $log.debug( clickedItem.name + ' clicked!');
        });

        /**
         * Bottom Menu controller for the Avatar Actions
         */
        function PageMenuController( $mdBottomMenu ) {
          this.page = page;
          this.items = [
            { name: 'Phone'       , icon: 'phone'       , icon_url: 'assets/svg/phone.svg'},
            { name: 'Twitter'     , icon: 'twitter'     , icon_url: 'assets/svg/twitter.svg'},
            { name: 'Google+'     , icon: 'google_plus' , icon_url: 'assets/svg/google_plus.svg'},
            { name: 'Hangout'     , icon: 'hangouts'    , icon_url: 'assets/svg/hangouts.svg'}
          ];
          this.performAction = function(action) {
            $mdBottomMenu.hide(action);
          };
        }
    }

  }

})();

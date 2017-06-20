// Copyright IBM Corp. 2015. All Rights Reserved.
// Node module: loopback-getting-started-intermediate
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

angular
  .module('app')
  .controller('AllReserveController', ['$scope', 'Reserve', function($scope,
      Reserve) {
    $scope.reserves = Reserve.find({
      filter: {
        include: [
          'hotel',
          'customer'
        ]
      }
    });
  }])
  .controller('AddReserveController', ['$scope', 'Hotel', 'Reserve',
      '$state', function($scope, Hotel, Reserve, $state) {
    $scope.action = 'Add';
    $scope.hotels = [];
    $scope.selectedHotel;
    $scope.reserve = {};
    $scope.isDisabled = false;

    Hotel
      .find()
      .$promise
      .then(function(hotels) {
        $scope.hotels = hotels;
        $scope.selectedHotel = $scope.selectedHotel || hotels[0];
      });

    $scope.submitForm = function() {
      Reserve
        .create({
          rating: $scope.reserve.rating,
          comments: $scope.reserve.comments,
          hotelId: $scope.selectedHotel.id
        })
        .$promise
        .then(function() {
          $state.go('all-reserves');
        });
    };
  }])
  .controller('DeleteReserveController', ['$scope', 'Reserve', '$state',
      '$stateParams', function($scope, Reserve, $state, $stateParams) {
    Reserve
      .deleteById({ id: $stateParams.id })
      .$promise
      .then(function() {
        $state.go('my-reserves');
      });
  }])
  .controller('EditReserveController', ['$scope', '$q', 'Hotel', 'Reserve',
      '$stateParams', '$state', function($scope, $q, Hotel, Reserve,
      $stateParams, $state) {
    $scope.action = 'Edit';
    $scope.hotels = [];
    $scope.selectedHotel;
    $scope.reserve = {};
    $scope.isDisabled = true;

    $q
      .all([
        Hotel.find().$promise,
        Reserve.findById({ id: $stateParams.id }).$promise
      ])
      .then(function(data) {
        var hotels = $scope.hotels = data[0];
        $scope.reserve = data[1];
        $scope.selectedHotel;

        var selectedHotelIndex = hotels
          .map(function(hotel) {
            return hotel.id;
          })
          .indexOf($scope.reserve.hotelId);
        $scope.selectedHotel = hotels[selectedHotelIndex];
      });

    $scope.submitForm = function() {
      $scope.reserve.hotelId = $scope.selectedHotel.id;
      $scope.reserve
        .$save()
        .then(function(reserve) {
          $state.go('all-reserves');
        });
    };
  }])
  .controller('MyReserveController', ['$scope', 'Reserve','$rootScope',
      function($scope, Reserve,$rootScope) {
        // after a refresh, the currenUser is not immediately on the scope
        // So, we're watching it on the scope and load my reservations only then.
        $scope.$watch('currentUser.id', function(value) {
          if (!value) {
            return;
          }
          $scope.reserves = Reserve.find({
            filter: {
              where: {
                customerId: $scope.currentUser.id
              },
              include: [
                'hotel',
                'customer'
              ]
            }
          });
        });
  }]);

'use strict';

(function(){

    angular.module('selling', ['ngAnimate', 'ngMaterial'])
    .controller('MainCtrl',['$http', function($http) {
        var instance = this;

        this.items = [];


        $http.get('data/items.json').success(function(data){
            instance.items = data;
        });

    }]);;
})();
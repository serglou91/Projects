var app=angular.module('app', ['ionic','firebase']);
	app.config(function($stateProvider,$urlRouterProvider){
		$stateProvider
		.state('teams',{
			url:'/teams',
			templateUrl: "views/teams.html",
			controller: "teamController"
		})
		.state('players',{
			url:'/players',
			templateUrl: "views/players.html",	
			controller: "playerController"
		});
		$urlRouterProvider.otherwise('/teams');
	});
	
	app.run(function($ionicPlatform) {
	  $ionicPlatform.ready(function() {
		// Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
		// for form inputs)
		if(window.cordova && window.cordova.plugins.Keyboard) {
		  cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
		}
		if(window.StatusBar) {
		  StatusBar.styleDefault();
		}
	  });
	});
	
	app.factory('teamService', function () {
        var team = {};

        return {
            setTeam:function (data) {
                team = data;
                console.log(data);
            },
            getTeam:function () {
                return team;
            }
        };
    });
	
	app.controller('teamController',['$scope','$firebaseArray','$firebaseObject','teamService',function($scope,$firebaseArray,$firebaseObject,teamService){
		$scope.teams=[];
		$scope.team="";
		
		$scope.loadTeams= function(){
			var ref = new Firebase('https://shining-heat-6659.firebaseio.com/');
			$scope.teams = $firebaseArray(ref.child('teams'));
			$scope.teams.$loaded().then(function(){
				console.log('Got the team data from our firebase');
			}).catch(function(error){
				console.log('Error getting data from our firebase');
			});
			var button = document.getElementById("playerButton").disabled= true;
		};
		
		$scope.chooseTeam= function(teamKey){
			console.log(teamKey);
			if ($scope.team==""){
				$scope.team=teamKey;
				teamService.setTeam($scope.team);
				var ele = document.getElementById(teamKey);
				ele.style.color = "white";
				ele.style.backgroundColor="#e74c3c";
				var button = document.getElementById("playerButton").disabled= false;
			}
			else{
				var oldEle= document.getElementById($scope.team);
				oldEle.style.color="black";
				oldEle.style.backgroundColor="white";
				
				$scope.team= teamKey;
				teamService.setTeam($scope.team);
				var ele = document.getElementById($scope.team);
				ele.style.color = "white";
				ele.style.backgroundColor="#e74c3c";
			}
		};
	}]);
	
	app.controller('playerController',['$scope','$firebaseArray','$firebaseObject','teamService',function($scope,$firebaseArray,$firebaseObject,teamService){
		$scope.team=teamService.getTeam();
		console.log($scope.team);
		$scope.players ={};
		
		$scope.loadPlayers= function(){
				console.log("loadPlayers: " + "\'"+$scope.team+"\'");
				var plyrRef = new Firebase('https://shining-heat-6659.firebaseio.com/players');
				plyrRef.orderByChild("teamaffiliation").startAt($scope.team).endAt($scope.team)
				.once('value', function(snap) {
					console.log(snap.val());
					$scope.players= snap.val();
				});
		};
		
	}]);
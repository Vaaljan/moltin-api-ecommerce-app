angular.module('storeFront.moltin',[])
		.factory('MoltinAuth', function($q){
			var deferred = $q.defer();
			var moltin = new Moltin({publicId:'qKRonmK7IZATt9cgEUAcoC5G6QUC4JZuskieyAWkLJ'})
				moltin.Authenticate(function(){
							deferred.resolve(moltin)
					});

return deferred.promise;
});
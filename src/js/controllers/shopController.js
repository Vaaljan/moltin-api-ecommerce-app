angular.module('mainApp')

  .controller('shopController', ['dataService','products','categories', function (dataService,products,categories) {
    
    var controller = this;
    controller.products = products;
    controller.dataService = dataService;
    controller.products = products;
     controller.categories = categories;

// console.log("categories ",categories)
controller.category = _.chain(controller.products)
	.map(function(item){
		return {
		"category":item.category.value,
		"data":item
	}
	})
	.groupBy("category")
.value();



  }]);
angular.module('mainApp').service('dataService', function() {
  /* jshint ignore:start */
  // Ignore the variable not declared warining -- the processData is injected by the system
  this.productData = productData;
  // this.sassConfig = sassConfig || {};
  /* jshint ignore:end */
var self = this;

////Global Functions
self.singleProduct = null;
self.currentCart =  [];
self.cart;

self.getProductData = function(prodNo){
	self.singleProduct = prodNo;
}

self.images = [];
	
		self.currentIndex = 0;
		
		self.setCurrentIndex = function(index){
			self.currentIndex = index;
		};

		self.isCurrentIndex = function(index){
			return self.currentIndex === index;
		};

		self.showNext = function(){
			self.currentIndex = (self.currentIndex < self.images.length - 1) ? ++self.currentIndex : 0;
		};
		self.showPrevious = function(){
			self.currentIndex = (self.currentIndex > 0) ? --self.currentIndex : self.images.length -1;
		};



});

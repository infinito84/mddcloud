var $ = require('jquery');

module.exports = {
	template:require('../templates/modal.hbs'),
	show: function(data,width,height,callback,instance) {
		if (width === undefined){
			width = 400;
		}
		if (height === undefined){
			height = 400;
		}
		var $body = $("body");
		$body.append(this.template(data));
		
		var h = $(window).height();
		var w = $(window).width();
		if (width > w - 20){
			width = w - 20;
		}
		if (height > h - 20){
			height = h - 20;
		}        
		/*----Center modal----*/
		var $modal = $(".modal");
		$modal.css({
			display : "block", 
			left    : ((w - width) / 2) + "px", 
			top     : ((h - height) / 2) + "px"
		}).width(width - 20).height(height - 20);
		$modal.find(".content").height(height - 140);
		
		if(typeof callback === "function"){
			$(".mask").click(function(){
				callback.apply(instance);
			});
			$modal.find("span.x").click(function(){
				callback.apply(instance);
			});
		}
		else{
			$modal.find("span.x").click(this.close);
			$(".mask").click(this.close);
		}
		$(".mask").css({display: "block"});1

	},
	close: function() {
		$(".modal,.mask").remove();
		$("body").off("keydown");
	}
};
var Backbone	= require('backbone'),
	$			= require('jquery'),
	app			= require('../app/namespace'),
	plugins		= require('../app/plugins'),
	actorSVG		= require('./svg/actor');

module.exports = Backbone.View.extend({
	tagName 	: 'div',
	className 	: 'useCase-view',
	template:require('../templates/useCase.hbs'),
	render:function(){
		$('.menu li').removeClass('active');
		$('[href="#useCase"]').parent().addClass('active');
		var html=this.template({});
		this.$el.html(html);
		return this;
	},	
	svg:function() {
		var svg = plugins.Snap("svg");
		app.collections.actors.forEach(function(actor){
			var actor = new actorSVG({
				svg : svg,
				model : actor
			}).render();
		});
		/*$("svg").mousemove(function(e){
			var offset = $(this).offset();
			actor.transform(['T',e.clientX-offset.left,',',e.clientY-offset.top].join(''));
		});*/
		
	}
});
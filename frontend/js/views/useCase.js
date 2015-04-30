var Backbone	= require('backbone'),
	$			= require('jquery'),
	app			= require('../app/namespace'),
	plugins		= require('../app/plugins');

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
	svg : function() {
		var svg = plugins.Snap("svg");
		window.actor = svg.group(
			svg.circle(10,10,10).attr({stroke:'black',strokeWidth:2,fill:'white'}),
			svg.line(10,20,10,40).attr({stroke:'black',strokeWidth:2}),
			svg.line(0,30,20,30).attr({stroke:'black',strokeWidth:2}),
			svg.line(10,40,0,50).attr({stroke:'black',strokeWidth:2}),
			svg.line(10,40,20,50).attr({stroke:'black',strokeWidth:2})
		);
		$("svg").mousemove(function(e){
			var offset = $(this).offset();
			console.log(['T',e.clientX-offset.left,',',e.clientY-offset.top].join(''));
			actor.transform(['T',e.clientX-offset.left,',',e.clientY-offset.top].join(''));
		});
	}
});
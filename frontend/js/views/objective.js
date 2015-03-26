var Backbone			=	require('backbone'),
	$					=	require('jquery'),
	app					=	require('../app/namespace'),
	modal 				= 	require('../app/modal'),
	EnumerationsView 	=	require('./enumerations'),
	ParticipantsView 	=	require('./participants');

module.exports = Backbone.View.extend({
	tagName 	: 'div',
	className 	: 'project-view',
	events : { 
		'click #edit-objective' : 'edit'
	},
	template:require('../templates/objective.hbs'),
	render:function(){
		$('.menu li').removeClass('active');
		$('#dropdown-objectives').addClass('active');
		var html=this.template(this.model.toJSON());
		this.$el.html(html);
		app.utils.dataBinding(this);
		return this;
	},	
	edit : function(){
		alert("hola");
	}
});
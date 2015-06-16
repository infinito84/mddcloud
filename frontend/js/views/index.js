var Backbone	= require('backbone'),
	$			= require('jquery'),
	app			= require('../app/namespace'),
	DropDown 	= require('./dropDown');

module.exports = Backbone.View.extend({
	tagName 	: 'div',
	className 	: 'app',
	template 	: require('../templates/index.hbs'),

	render:function(){
		var html=this.template(app.currentUser.toJSON());
		this.$el.html(html);
		return this;
	},	

	initialize: function() {
		$('body').html(this.render().el);
		this.bindEvents();
	},

	bindEvents:function(){
		$('.sidebar').niceScroll();
		$('.dropdown').click(function(e){
			var ul=$(e.target).parent().children('ul');
			var i=$(e.target).parent().children('i');
			if(ul.css('display')==='none'){
				ul.show();
				i.removeClass('fa-chevron-circle-right');
				i.addClass('fa-chevron-circle-down');
			}
			else{
				ul.hide();
				i.removeClass('fa-chevron-circle-down');
				i.addClass('fa-chevron-circle-right');
			}
		});
		$('#app>i').click(function(){
			if($('#app>i').hasClass('fa-chevron-left')){
				$('#app').animate({
					width:'100%',
					'margin-left':'0px'
				},1000,function(){
					$('#app>i').removeClass('fa-chevron-left');
					$('#app>i').addClass('fa-chevron-right');	
				});
			}
			else{			
				$('#app').animate({
					width:'80%',
					'margin-left':'20%'
				},1000,function(){
					$('#app>i').removeClass('fa-chevron-right');
					$('#app>i').addClass('fa-chevron-left');
				});
			}
		});
		$('#generate-web-app').click(function(){
			$("body").append("<div id='webFrame' style='background-color:rgba(0,0,0,0.75);position:fixed;width:100%;height:100%;z-index:1000;top:0px;left:0px'><h1 style='color:white;margin: 1em 1em;'></h1></div>");
			app.socket.emit('generate-web-app');
		});
		window.scrollTo(0,1);
		new DropDown({
			$el 		: $("#dropdown-objectives"),
			collection 	: app.collections.objectives,
			extra 		: {type : 'objective'}
		});
		new DropDown({
			$el 		: $("#dropdown-actors"),
			collection 	: app.collections.actors,
			extra 		: {type : 'actor'}
		});
		new DropDown({
			$el 		: $("#dropdown-functionalRequirements"),
			collection 	: app.collections.functionalRequirements,
			extra 		: {type : 'functionalRequirement'}
		});
		new DropDown({
			$el 		: $("#dropdown-storageRequirements"),
			collection 	: app.collections.storageRequirements,
			extra 		: {type : 'storageRequirement'}
		});
		new DropDown({
			$el 		: $("#dropdown-nonFunctionalRequirements"),
			collection 	: app.collections.nonFunctionalRequirements,
			extra 		: {type : 'nonFunctionalRequirement'}
		});
		new DropDown({
			$el 		: $("#dropdown-diagramActivities"),
			collection 	: app.collections.functionalRequirements,
			extra 		: {type : 'activityDiagram'}
		});
	}
});
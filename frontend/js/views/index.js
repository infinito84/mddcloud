var Backbone	 =	require('backbone'),
	$			 =	require('jquery')
	app			 = 	require('../app/namespace');

module.exports = Backbone.View.extend({
	tagName 	: 'div',
	className 	: 'app',
	template 	: require('../templates/index.hbs'),

	render:function(){
		var html=this.template({});
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
		window.scrollTo(0,1);
	}
});
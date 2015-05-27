var Backbone			=	require('backbone'),
	$					=	require('jquery'),
	app					=	require('../app/namespace'),
	modal 				= 	require('../app/modal'),
	MultimediaView 		=	require('./multimedia');

module.exports = Backbone.View.extend({
	tagName 	: 'div',
	className 	: 'mettings-view',
	SubView 	: MultimediaView,
	template 	: require('../templates/meetings.hbs'),

	render : function(){
		$('.menu li').removeClass('active');
		$('[href="#meetings"]').parent().addClass('active');
		var html=this.template({});
		this.$el.html(html);
		this.bindEvents();
		return this;
	},	
	bindEvents : function() {
		app.utils.listeningCollection(this);
		this.$el.find('input[type=file]').fileupload({
			url  : '/multimedia/upload/',
		}).bind('fileuploadsubmit', function (e, data) {
			$.notify(app.utils.t('Uploading file...'),'info');
			data.formData = {
				project : app.project.get('_id'),
				type 	: data.fileInput.data('upload')
			};
		});
	}
});
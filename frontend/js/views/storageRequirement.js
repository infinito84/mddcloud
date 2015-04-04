var Backbone					= require('backbone'),
	$							= require('jquery'),
	app							= require('../app/namespace'),
	modal 						= require('../app/modal'),
	StorageRequirementEditView 	= require('./storageRequirementEdit'),
	ParticipantsView 			= require('./participants'),
	CustomCollectionView		= require('./customCollection');


module.exports = Backbone.View.extend({
	tagName 	: 'div',
	className 	: 'storageRequirement-view',
	events : { 
		'click #edit-storageRequirement' : 'edit'
	},
	template:require('../templates/storageRequirement.hbs'),
	render:function(){
		$('.menu li').removeClass('active');
		$('#dropdown-storageRequirements').addClass('active');
		$('li>a[href="#view/storageRequirement/'+this.model.id+'"]').parent().addClass('active');
		var html=this.template(this.model.toJSON());
		this.$el.html(html);
		this.customRender.multimedias(this,this.$el.find('[data=multimedias]'),this.model.get('multimedias'));
		this.customRender.sources(this,this.$el.find('[data=sources]'),this.model.get('sources'));
		this.customRender.contributors(this,this.$el.find('[data=authors]'),this.model.get('authors'));
		app.utils.dataBinding(this);
		return this;
	},	
	customRender : {
		multimedias : function(view,$elem,value){
			$elem.html('');
			value = value || [];
			if(value.length > 0){
				var collection = app.utils.filterCollection(app.collections.multimedias,value);
				new CustomCollectionView({
					collection 	: collection,
					extra 		: {type : 'multimedia'},
					$el 		: $elem
				});
			}
			else{
				$elem.html(app.utils.t('This storage requirement doesn\'t have multimedia resources'));
			}
		},
		sources : function(view,$elem,value){
			$elem.html('');
			value = value || [];
			if(value.length > 0){
				var collection = app.utils.filterCollection(app.collections.users,value);
				new CustomCollectionView({
					collection 	: collection,
					extra 		: {type : 'user'},
					$el 		: $elem
				});
			}
			else{
				$elem.html(app.utils.t('This storage requirement doesn\'t have sources'));
			}
		},
		contributors : function(view,$elem,value){
			$elem.html('');
			value = value || [];
			if(value.length > 0){
				var collection = app.utils.filterCollection(app.collections.users,value);
				new CustomCollectionView({
					collection 	: collection,
					extra 		: {type : 'user'},
					$el 		: $elem
				});
			}
			else{
				$elem.html(app.utils.t('This storage requirement doesn\'t have collaborators'));
			}
		}
	},
	edit : function(){
		new StorageRequirementEditView({
			model : this.model
		});
	}
});
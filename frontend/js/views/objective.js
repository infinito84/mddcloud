var Backbone			= require('backbone'),
	$					= require('jquery'),
	app					= require('../app/namespace'),
	modal 				= require('../app/modal'),
	EnumerationsView 	= require('./enumerations'),
	ParticipantsView 	= require('./participants'),
	CustomCollectionView= require('./customCollection');

module.exports = Backbone.View.extend({
	tagName 	: 'div',
	className 	: 'objective-view',
	events : { 
		'click #edit-objective' : 'edit'
	},
	template:require('../templates/objective.hbs'),
	render:function(){
		$('.menu li').removeClass('active');
		$('#dropdown-objectives').addClass('active');
		var html=this.template(this.model.toJSON());
		this.$el.html(html);
		this.customRender.multimedias(this,this.$el.find('[data=multimedias]'),this.model.get('multimedias'));
		this.customRender.sources(this,this.$el.find('[data=sources]'),this.model.get('sources'));
		this.customRender.contributors(this,this.$el.find('[data=authors]'),this.model.get('authors'));
		this.customRender.parentObjective(this,this.$el.find('[data=parentObjective]'),this.model.get('parentObjective'));
		app.utils.dataBinding(this);
		return this;
	},	
	customRender : {
		multimedias : function(view,$elem,value){
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
				$elem.html(app.utils.t('This objective doesn\'t have multimedia resources'));
			}
		},
		sources : function(view,$elem,value){
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
				$elem.html(app.utils.t('This objective doesn\'t have sources'));
			}
		},
		contributors : function(view,$elem,value){
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
				$elem.html(app.utils.t('This objective doesn\'t have collaborators'));
			}
		},
		parentObjective : function(view,$elem,value){
			console.log(value);
			if(value){
				var objective = app.collections.objectives.get(value);
				$elem.html(objective.get('name'));
			}
			else{
				$elem.html(app.utils.t('This objective does\'t have a parent objective'));
			}
		}
	},
	edit : function(){
		alert("hola");
	}
});
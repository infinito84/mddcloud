var Backbone 	= require('backbone'),
	$ 			= require('jquery'),
	plugins 	= require('../../app/plugins'),
	app 		= require('../../app/namespace');

module.exports = Backbone.View.extend({
	initialize : function(options){
		var that = this;
		this.svg = options.svg;
		var actorModel = app.collections.actors.findWhere({
			_id : that.model.get('actor')
		});
		var useCaseModel = app.collections.functionalRequirements.findWhere({
			_id : that.model.get('useCase')
		});
		this.model.set({
			x1 : actorModel.get('x'),
			y1 : actorModel.get('y'),
			x2 : useCaseModel.get('x'),
			y2 : useCaseModel.get('y')
		});
		this.listenTo(this.model, 'change:x1', this.updateCoordinates, this);
		this.listenTo(this.model, 'change:y1', this.updateCoordinates, this);
		this.listenTo(this.model, 'change:x2', this.updateCoordinates, this);
		this.listenTo(this.model, 'change:y2', this.updateCoordinates, this);
	},
	updateCoordinates : function(){
		var that = this;
		this.association.attr({
			x1 : that.model.get('x1'),
			y1 : that.model.get('y1'),
			x2 : that.model.get('x2'),
			y2 : that.model.get('y2')
		});
		this.text.attr({
			x : that.model.get('x1'),
			y : that.model.get('y1') - 20
		});
	},
	render : function(){
		var svg = this.svg;
		this.association = svg.line(0,0,0,0);
		this.text = svg.text(0,0,app.utils.t('Click for deleting'));
		this.svg.group(this.association,this.text)
			.addClass("use-case-association")
			.prependTo(svg);
		this.updateCoordinates();
		this.addEvents();
		return this.association;
	},
	addEvents : function(){
		
	}
});
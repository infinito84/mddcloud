var Backbone 	= require('backbone'),
	$ 			= require('jquery'),
	plugins 	= require('../../app/plugins'),
	app 		= require('../../app/namespace');

module.exports = Backbone.View.extend({
	initialize : function(options){
		var that = this;
		this.svg = options.svg;
		this.classAModel = app.collections.storageRequirements.findWhere({
			_id : that.model.get('classA')
		});
		
		this.classBModel = app.collections.storageRequirements.findWhere({
			_id : that.model.get('classB')
		});
		
		this.m1 = '1';
		this.m2 = '0..1';
		if(this.model.get('type') === 'ONE_TO_MANY'){
			this.m2 = '0..*';
		}

		this.model.set({
			x1 : this.classAModel.get('x'),
			y1 : this.classAModel.get('y'),
			x2 : this.classBModel.get('x'),
			y2 : this.classBModel.get('y')
		});
		this.listenTo(this.model, 'change:x1', this.updateCoordinates, this);
		this.listenTo(this.model, 'change:y1', this.updateCoordinates, this);
		this.listenTo(this.model, 'change:x2', this.updateCoordinates, this);
		this.listenTo(this.model, 'change:y2', this.updateCoordinates, this);
		this.listenTo(this.model, 'destroy' , this.destroyModel, this);
	},
	updateCoordinates : function(){
		var that = this;
		var x1 = this.model.get('x1');
		var y1 = this.model.get('y1');
		var w1 = this.classAModel.get('width');
		var h1 = this.classAModel.get('height');
		var x2 = this.model.get('x2');
		var y2 = this.model.get('y2');
		var w2 = this.classBModel.get('width');
		var h2 = this.classBModel.get('height');
		var mx1 = x1 + w1/2;
		var my1 = y1 + h1/2;
		var mx2 = x2 + w2/2;
		var my2 = y2 + h2/2;
		if(x1 < mx2 && mx2 < x1 + w1){
			this.association1.attr({
				x1 : mx2,
				x2 : mx2,
				y1 : my1,
				y2 : my2
			});
			this.association2.attr({
				x1 : mx2,
				x2 : mx2,
				y1 : my1,
				y2 : my2
			});
			this.text.attr({
				x : mx2,
				y : (my1 + my2)/2
			});
			if(my1 < my2){
				this.t1.attr({
					x : mx2 + 5,
					y : y1 + h1 + 10
				});
				this.t2.attr({
					x : mx2 + 11,
					y : y2 - 3
				});
			}
			else{
				this.t1.attr({
					x : mx2 + 5,
					y : y1 - 3
				});
				this.t2.attr({
					x : mx2 + 11,
					y : y2 + h2 + 10
				});
			}
		}
		else if(y1 < my2 && my2 < y1 + h1){
			this.association1.attr({
				x1 : mx1,
				x2 : mx2,
				y1 : my2,
				y2 : my2
			});
			this.association2.attr({
				x1 : mx1,
				x2 : mx2,
				y1 : my2,
				y2 : my2
			});
			this.text.attr({
				x : (mx1 + mx2)/2,
				y : my2 - 10 
			});
			if(mx1 < mx2){
				this.t1.attr({
					x : x1 + w1 + 5,
					y : my2 + 11
				});
				this.t2.attr({
					x : x2 -11,
					y : my2 + 11
				});
			}
			else{
				this.t1.attr({
					x : x1 - 7,
					y : my2 + 11
				});
				this.t2.attr({
					x : x2 + w2 + 11,
					y : my2 + 11
				});
			}
		}
		else if(my1 < my2){
			this.association1.attr({
				x1 : mx1,
				x2 : mx2,
				y1 : my1,
				y2 : my1
			});
			this.association2.attr({
				x1 : mx2,
				x2 : mx2,
				y1 : my1,
				y2 : my2
			});
			this.text.attr({
				x : mx2,
				y : my1 - 10
			});
			this.t2.attr({
				x : mx2 + 11,
				y : y2 - 3
			});
			if(mx1 < mx2){
				this.t1.attr({
					x : x1 + w1 + 5,
					y : my1 - 5
				});
			}
			else{
				this.t1.attr({
					x : x1 - 7,
					y : my1 - 5
				});
			}
		}
		else{
			this.association1.attr({
				x1 : mx1,
				x2 : mx1,
				y1 : my1,
				y2 : my2
			});
			this.association2.attr({
				x1 : mx1,
				x2 : mx2,
				y1 : my2,
				y2 : my2
			});
			this.text.attr({
				x : mx1,
				y : my2 - 10
			});
			this.t1.attr({
				x : mx1 + 5,
				y : y1 - 5
			});
			if(mx1 < mx2){
				this.t2.attr({
					x : x2 -11,
					y : my2 + 11
				});
			}
			else{
				this.t2.attr({
					x : x2 + w2 + 11,
					y : my2 + 11
				});
			}
		}
	},
	render : function(){
		var svg = this.svg;
		this.association1 = svg.line(0,0,0,0);
		this.association2 = svg.line(0,0,0,0);
		this.text = svg.text(0,0,app.utils.t('Click to delete'));
		this.t1 = svg.text(0,0,this.m1).addClass('multiplicity');
		this.t2 = svg.text(0,0,this.m2).addClass('multiplicity');
		this.group = this.svg
			.group(
				this.association1,
				this.association2,
				this.text,
				this.t1,
				this.t2
			)
			.addClass("class-association")
			.prependTo(svg);
		this.updateCoordinates();
		this.addEvents();
		return this;
	},
	addEvents : function(){
		var that = this;
		this.association1.click(function(){
			that.model.destroy();
			app.collections.classAssociations.remove(that.model);
		});
		this.association2.click(function(){
			that.model.destroy();
			app.collections.classAssociations.remove(that.model);
		});
	},
	destroyModel : function(){
		this.group.remove();
		this.remove();
	}
});
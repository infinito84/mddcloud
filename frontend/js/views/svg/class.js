var Backbone 					= require('backbone'),
	$							= require('jquery'),
	app 						= require('../../app/namespace'),
	plugins						= require('../../app/plugins'),
	StorageRequirementEditView 	= require('../storageRequirementEdit'),
	AddAtributeView 			= require('../addAttribute'),
	ClassAssociationModel		= require('../../models/classAssociation');

module.exports = Backbone.View.extend({
	initialize : function(options){
		this.svg = options.svg;
		this.listenTo(this.model, 'change:name', this.setTexts, this);
		this.listenTo(this.model, 'change:attributes', this.setTexts, this);
		this.listenTo(this.model, 'change:x', this.updatePosition, this);
		this.listenTo(this.model, 'change:y', this.updatePosition, this);
	},
	updateName : function(){
		this.label.attr({
			text : app.utils.fixName(this.model.get('name'))
		});
	},
	updatePosition : function(){
		this.class.transform(['T',this.model.get('x'),',',this.model.get('y')].join(''));
	},
	render : function(){
		var svg = this.svg;
		
		this.label = svg.text(5, 15,'');
		this.label.addClass('label');

		this.rect1 = svg.rect(0,0,this.label.getBBox().w + 30,this.label.getBBox().h + 20);
		this.rect2 = svg.rect(0,20,this.label.getBBox().w + 30,40);
		this.rects = svg.group(this.rect1,this.rect2);
		this.rects.addClass('boxes');
		
		this.addAttribute = svg.image('/img/diagrams/add_attribute.png',0,-25,20,20);
		this.r11 = svg.image('/img/diagrams/r11.png',20,-25,20,20);
		this.r1n = svg.image('/img/diagrams/r1n.png',40,-25,20,20);
		this.edit = svg.image('/img/diagrams/edit.png',60,-25,20,20);

		this.attributes = svg.text(0, 35, '');

		this.class = svg.group(
			svg.rect(0,-5,80,5).addClass('transparent'),
			this.addAttribute,
			this.r11,
			this.r1n,
			this.edit,
			this.rects,
			this.label,
			this.attributes
		);
		this.class.addClass('class-svg');

		var size = this.setTexts();

		var svgWidth = $("#container").width() - 30;
		var svgHeight = $("#container").height() - 65;
		var x = this.model.get('x') || Math.random() * svgWidth + 20;
		var y = this.model.get('y') || Math.random() * svgHeight;
		this.class.transform(['T',x,',',y].join(''));

		this.model.set({
			x 		: x, 
			y 		: y,
			width 	: size.w,
			height 	: size.h
		}).save();

		this.addEvents();
		return this;
	},
	setTexts : function(){
		var that = this;

		this.label.attr({
			text : app.utils.fixName(this.model.get('name'))
		});

		this.attributes.attr({
			text : (this.model.get('attributes') || []).map(function(id){
				var attribute = app.collections.attributes.get(id);
				var type = attribute.get('type');
				if(type === 'ENUM'){
					var enumeration = app.collections.enumerations.get(attribute.get('enumeration'));
					if(enumeration){
						type = app.utils.fixName(enumeration.get('name'));
					}
				}
				return app.utils.fixName(attribute.get('name')) +' : '+ type;
			})
		});

		this.attributes.selectAll("tspan").forEach(function(element, index){
			(function(){
				var attribute = that.model.get('attributes')[index];
				element.attr({
					x : 5, 
					dy : index === 0 ? 0 : 12
				});
				if(attribute){
					attribute = app.collections.attributes.get(attribute);
					element.click(function(){
						if(app.selectingClass){
							return;
						}
						attribute.destroy();
						var attributes = that.model.get('attributes').slice(0);
						var pos = attributes.indexOf(attribute.id);
						if(pos !== -1){
							attributes.splice(pos,1);
							that.model.set('attributes',attributes);
							that.model.save();
						}
					});
				}
			})();
		});

		var width = Math.max(this.label.getBBox().w,this.attributes.getBBox().w) + 10;
		var height = Math.max((this.model.get('attributes') || []).length * 12 + 10,40);
		this.rect1.attr({width : width});
		this.rect2.attr({width : width, height : height});
		return {w : width,h : height + 20};
	},
	addEvents : function(){
		var that = this;
		this.class.drag(this.moveDrag, this.startDrag, this.endDrag, this, this, this);

		this.edit.click(function(){
			new StorageRequirementEditView({
				model : that.model
			});
		});

		this.addAttribute.click(function(){
			new AddAtributeView({
				model : that.model
			});
		});

		this.r11.click(function(){
			$('.classDiagram-view').addClass("select-class");
			var x = that.model.get('x');
			var y = that.model.get('y');
			app.classAssociation = that.svg.line(x,y,x,y).attr({
				stroke 		: 'green',
				strokeWidth : 2
			}).prependTo(that.svg);
			app.typeSelection = 'ONE_TO_ONE';
			app.selectingClass = true;
			app.selectedClass = that.model;
			app.selectedSize = that.rects.getBBox();
			that.class.addClass('no-select');
		});

		this.r1n.click(function(){
			$('.classDiagram-view').addClass("select-class");
			var x = that.model.get('x');
			var y = that.model.get('y');
			app.classAssociation = that.svg.line(x,y,x,y).attr({
				stroke 		: 'green',
				strokeWidth : 2
			}).prependTo(that.svg);
			app.typeSelection = 'ONE_TO_MANY';
			app.selectingClass = true;
			app.selectedClass = that.model;
			app.selectedSize = that.rects.getBBox();
			that.class.addClass('no-select');
		});

		this.class.click(function(){
			if(app.selectingClass){
				if(that.model.id !== app.selectedClass.id){
					var classAssociation = new ClassAssociationModel();
					classAssociation.save({
						classA : app.selectedClass.id,
						classB : that.model.id,
						type   : app.typeSelection
					},{
						successfully : function(model){
							app.collections.classAssociations.add(model);
						}
					});
					app.classAssociation.remove();
					if(app.classAssociation2){
						app.classAssociation2.remove();
						delete app.classAssociation2;
					}
					delete app.classAssociation;
					delete app.typeSelection;
					delete app.selectingClass;
					delete app.selectedClass;
					delete app.selectedSize;
					$('.no-select').removeClass('no-select');
					$('.classDiagram-view').removeClass("select-class");
				}
			}
		});
	},
	moveDrag : function(dx, dy, x, y, event){
		this.nx = this.ox + dx;
		this.ny = this.oy + dy;
		this.class.transform(['T',this.nx,',',this.ny].join(''));
		this.moved = true;
		this.notifyAssociations();
	},
	startDrag : function(x, y, event){
		this.ox = this.model.get('x');
		this.oy = this.model.get('y');
		this.moved = false;
	},
	endDrag : function(event){
		if(this.moved){
			this.model.set({
				x : this.nx,
				y : this.ny
			}).save();
		}
	},
	notifyAssociations : function(){
		var that = this;
		app.collections.classAssociations.where({
			classA : this.model.id
		}).forEach(function(association){
			association.set({
				x1 : that.nx,
				y1 : that.ny
			});
		});
		app.collections.classAssociations.where({
			classB : this.model.id
		}).forEach(function(association){
			association.set({
				x2 : that.nx,
				y2 : that.ny
			});
		});
	}
});
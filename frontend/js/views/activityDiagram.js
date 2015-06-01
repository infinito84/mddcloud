var Backbone		= require('backbone'),
	$				= require('jquery'),
	app				= require('../app/namespace'),
	plugins			= require('../app/plugins'),
	Action 			= require('../models/action'),
	actionSVG 		= require('./svg/action');

module.exports = Backbone.View.extend({
	tagName 	: 'div',
	className 	: 'activityDiagram-view',
	template:require('../templates/activityDiagram.hbs'),
	attachedViews : [],
	initialize : function(){
		this.x1 = 400;
		this.y1 = 200;
		this.x = 300;
		this.y = 400;
		this.width = 200;
		this.height = 40;
		this.interval = setInterval(this.checkSelection.bind(this),100);
		this.listenTo(this.model, 'change:actions', this.checkActions, this);
	},
	render : function(){
		$('.menu li').removeClass('active');
		$('#dropdown-diagramActivities').addClass('active');
		var html=this.template({});
		this.$el.html(html);
		return this;
	},	
	svg : function() {
		this.svg = plugins.Snap("svg");
		var that = this;

		(this.model.get('actions') || []).forEach(function(id){
			var action = app.collections.actions.get(id);
			that.addAction.apply(that, [action]);
		});
	
		this.addEvents();
	},
	checkActions : function(){
		var that = this;
		(this.model.get('actions') || []).forEach(function(id){
			if($('.action'+id).length === 0){
				var action = app.collections.actions.get(id);
				that.addAction(action);
			}
		})
	},
	addAction : function(action){
		action.set({
			nx : action.get('x'),
			ny : action.get('y')
		});
		var actionView = new actionSVG({
			svg 	: this.svg,
			model 	: action
		}).render();
		this.attachedViews.push(actionView);
	},
	addEvents : function(){
		var that = this;
		$('svg').click(function(){
			that.svg.selectAll('.selected').forEach(function(svgElement){
				svgElement.removeClass('selected');
			});
			delete app.selectedAction;
		});		
	},
	removeViews : function(){
		this.attachedViews.forEach(function(view, i){
			view.remove();
		});
		clearInterval(this.interval);
		this.remove();
	},
	checkSelection : function(){
		var that = this;
		var $menu = $('.svg-menu-right');
		var actions = this.model.get('actions') || [];
		if(app.selectedAction){
			if(app.selectedAction.id === this.menu){
				return;
			}

			var child = app.collections.actions.findWhere({
				parentAction : app.selectedAction.id
			});			
			var action = app.selectedAction.toJSON();

			$menu.html($.el.p(app.utils.t('Please select a action below')));

			if(action.operation === 'START'){
				if(child){
					$menu.html($.el.p(app.utils.t('No more actions available, please select another element')));
					return;
				}
				var user = app.collections.storageRequirements.findWhere({special : 'USER'});

				var $el = $($.el.div({class : 'item read'}));
				$el.html(app.utils.t('Read specific data in session from:') +' <b>'+ user.get('name') +'</b>');
				$el.click(function(){
					that.newAction({
						operation			: 'READ',
						readMethod 			: 'SESSION',
						storageRequirement 	: user.id,
						x 					: action.x - 100,
						y 					: action.y + 100,
						width 				: 200,
						height				: 40,
						parentAction		: action._id
					});
				});
				$menu.append($el);

				app.collections.storageRequirements.forEach(function(storage){
					$el = $($.el.div({class : 'item read'}));
					$el.html(app.utils.t('Read all data from:') +' <b>'+ storage.get('name')+ '</b>');
					$el.click(function(){
						that.newAction({
							operation			: 'READ',
							readMethod 			: 'GENERAL',
							storageRequirement 	: storage.id,
							x 					: action.x - 100,
							y 					: action.y + 100,
							width 				: 200,
							height				: 40,
							parentAction		: action._id
						});
					});
					$menu.append($el);
				});
			}
			if(action.operation === 'READ'){
				var storage = app.collections.storageRequirements.get(action.storageRequirement);
				var create = app.collections.actions.findWhere({
					parentAction : action._id, 
					operation : 'CREATE'
				});
				var $el; 

				if(!create){
					$el = $($.el.div({class : 'item create'}));
					$el.html(app.utils.t('Create new data from:') +' <b>'+ storage.get('name') +'</b>');
					$el.click(function(){
						that.newAction({
							operation			: 'CREATE',
							storageRequirement 	: storage.id,
							x 					: action.x,
							y 					: action.y + 100,
							width 				: 200,
							height				: 40,
							parentAction		: action._id
						});
					});
					$menu.append($el);
				}
				
				app.collections.classAssociations.where({
					classA : storage.id
				}).forEach(function(classAssociation){
					var storageId = classAssociation.get('classB');
					var storage = app.collections.storageRequirements.get(storageId);
					var read = app.collections.actions.findWhere({
						parentAction : action._id, 
						operation : 'READ'
					});
					if(!read){
						$el = $($.el.div({class : 'item read'}));
						$el.html(app.utils.t('Read specific data from:') +' <b>'+ storage.get('name')+ '</b>');
						$el.click(function(){
							that.newAction({
								operation			: 'READ',
								readMethod 			: 'SPECIFIC',
								storageRequirement 	: storage.id,
								x 					: action.x,
								y 					: action.y + 100,
								width 				: 200,
								height				: 40,
								parentAction		: action._id
							});
						});
						$menu.append($el);
					}
				});

				var update = app.collections.actions.findWhere({
					parentAction : action._id, 
					operation : 'UPDATE'
				});
				if(!update){
					$el = $($.el.div({class : 'item update'}));
					$el.html(app.utils.t('Update specific data from:') +' <b>'+ storage.get('name') +'</b>');
					$el.click(function(){
						that.newAction({
							operation			: 'UPDATE',
							storageRequirement 	: storage.id,
							x 					: action.x,
							y 					: action.y + 100,
							width 				: 200,
							height				: 40,
							parentAction		: action._id
						});
					});
					$menu.append($el);
				}

				var del = app.collections.actions.findWhere({
					parentAction : action._id, 
					operation : 'DELETE'
				});
				if(!del){
					$el = $($.el.div({class : 'item delete'}));
					$el.html(app.utils.t('Delete specific data from:') +' <b>'+ storage.get('name') +'</b>');
					$el.click(function(){
						that.newAction({
							operation			: 'DELETE',
							storageRequirement 	: storage.id,
							x 					: action.x,
							y 					: action.y + 100,
							width 				: 200,
							height				: 40,
							parentAction		: action._id
						});
					});
					$menu.append($el);
				}
				$el = $($.el.div({class : 'item start'}));
				$el.html(app.utils.t('Remove this action'));
				$el.click(function(){
					alert("removiendo");
				});
				$menu.append($el);
			}
			this.menu = app.selectedAction.id;
		}
		else{
			if(actions.length === 0){
				if(this.menu === 0){
					return;
				}
				$menu.html($.el.div({class : 'item start'},app.utils.t('Start')))
				.prepend($.el.p(app.utils.t('Use the controls in this panel for adding actions to this Activity Diagram')))
				.find('.item.start').click(function(){
					that.newAction({
						operation	: 'START',
						x 			: $('svg').width()/2,
						y 			: 30,
						width 		: 20,
						height		: 20
					});
				});
				this.menu = 0;
			}
			else{
				if(this.menu === 1){
					return;
				}
				$('.svg-menu-right').html($.el.p(app.utils.t('Please select some element on the diagram for interacting')));
				this.menu = 1;
			}
		}
	},
	newAction : function(data){
		var that = this;
		$('svg').click();

		var action = new Action();
		action.save(data, {
			successfully : function(action){
				app.collections.actions.add(action);
				var actions = (that.model.get('actions') || []).slice(0);
				actions.push(action.id);
				that.model.set('actions',actions);
				that.model.save();
			}
		});
	}
});
//Load models
var Model = {
	User 						: require('../models/user'),
	Actor 						: require('../models/actor'),
	Project 					: require('../models/project'),
	Activity 					: require('../models/activity'),
	Attribute 					: require('../models/attribute'),
	Objective 					: require('../models/objective'),
	Multimedia 					: require('../models/multimedia'),
	Enumeration					: require('../models/enumeration'),
	Participant 				: require('../models/participant'),
	DiagramActivity 			: require('../models/diagramActivity'),
	ClassAssociation 			: require('../models/classAssociation'),
	StorageRequirement 			: require('../models/storageRequirement'),
	UseCaseAssociation 			: require('../models/useCaseAssociation'),
	FunctionalRequirement		: require('../models/functionalRequirement'),
	NonFunctionalRequirement 	: require('../models/nonFunctionalRequirement')
};

//Load collections	
var	Collection = {
	User						: require('../collections/users'),
	Actor 						: require('../collections/actors'),
	Activity 					: require('../collections/activities'),
	Attribute					: require('../collections/attributes'),
	Objective					: require('../collections/objectives'),
	Multimedia 					: require('../collections/multimedias'),
	Enumeration	 				: require('../collections/enumerations'),
	Participant 				: require('../collections/participants'),
	DiagramActivity 			: require('../collections/diagramActivities'),
	ClassAssociation 			: require('../collections/classAssociations'),
	StorageRequirement 			: require('../collections/storageRequirements'),
	UseCaseAssociation			: require('../collections/useCaseAssociations'),
	FunctionalRequirement		: require('../collections/functionalRequirements'),
	NonFunctionalRequirement 	: require('../collections/nonFunctionalRequirements')
};
	
var app = module.exports = {
	development : true,
	collections : {},

	loadData : function(data,next){
		//Load project
		app.project=new Model.Project(app.utils.filter(data,[
			'_id', 'name', 'description', 'creationDate', 'template'
		]));
		//Load enumerations
		app.collections.enumerations = new Collection.Enumeration();
		data.enumerations.forEach(function(elem,i){
			app.collections.enumerations.add(new Model.Enumeration(elem));
		});
		//Load participants
		app.collections.participants = new Collection.Participant();
		app.collections.users = new Collection.User();
		data.participants.forEach(function(elem,i){
			app.collections.participants.add(new Model.Participant(app.utils.filter(elem,[
				'_id', 'role', 'status', 'creationDate', {
					attr 	: 'user',
					subAttr : '_id'
				}
			])));
			app.collections.users.add(new Model.User(elem.user));
		});
		//Load multimedias
		app.collections.multimedias = new Collection.Multimedia();
		data.multimedias.forEach(function(elem,i){
			app.collections.multimedias.add(new Model.Multimedia(elem));
		});
		//Load objectives
		app.collections.objectives = new Collection.Objective();
		data.objectives.forEach(function(elem,i){
			app.collections.objectives.add(new Model.Objective(elem));
		});
		//Load actors
		app.collections.actors = new Collection.Actor();
		data.actors.forEach(function(elem,i){
			app.collections.actors.add(new Model.Actor(elem));
		});
		//Load functional requirements
		app.collections.functionalRequirements = new Collection.FunctionalRequirement();
		data.functionalRequirements.forEach(function(elem,i){
			app.collections.functionalRequirements.add(new Model.FunctionalRequirement(elem));
		});
		//Load non functional requirements
		app.collections.nonFunctionalRequirements = new Collection.NonFunctionalRequirement();
		data.nonFunctionalRequirements.forEach(function(elem,i){
			app.collections.nonFunctionalRequirements.add(new Model.NonFunctionalRequirement(elem));
		});
		//Load storage requirements and attributes
		app.collections.storageRequirements = new Collection.StorageRequirement();
		app.collections.attributes = new Collection.Attribute();
		data.storageRequirements.forEach(function(elem,i){
			var attributes = elem.attributes || [];
			elem.attributes = attributes.map(function(attribute){
				app.collections.attributes.add(new Model.Attribute(attribute));	
				return attribute._id;
			});
			app.collections.storageRequirements.add(new Model.StorageRequirement(elem));
			
		});
		//Load use case associations
		app.collections.useCaseAssociations = new Collection.UseCaseAssociation();
		data.useCaseAssociations.forEach(function(elem,i){
			app.collections.useCaseAssociations.add(new Model.UseCaseAssociation(elem));
		});
		//Load class associations
		app.collections.classAssociations = new Collection.ClassAssociation();
		data.classAssociations.forEach(function(elem,i){
			app.collections.classAssociations.add(new Model.ClassAssociation(elem));
		});
		next();
	},

	loadRole : function(id,next){
		app.role = app.collections.participants.findWhere({
			user : id
		});
		app.currentUser = app.collections.users.findWhere({
			_id : id
		});
		next();
	},
	//We save the main view instance for remove it
	setCurrentView : function(newView){
		if(app.currentView){
			if(typeof app.currentView.removeViews === 'function'){
				app.currentView.removeViews();
			}
			else{
				app.currentView.remove();
			}
		}
		app.currentView = newView;
		app.$('#container').html(newView.render().el);
	}
}

if(app.development){
	window.app = app;
}
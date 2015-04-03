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
	StorageRequirement 			: require('../models/storageRequirement'),
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
	StorageRequirement 			: require('../collections/storageRequirements'),
	FunctionalRequirement		: require('../collections/functionalRequirements'),
	nonFunctionalRequirement 	: require('../collections/nonFunctionalRequirements')
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
		next();
	},

	loadRole : function(id,next){
		app.role = app.collections.participants.findWhere({
			user : id
		});
		next();
	},
	//We save the main view instance for remove it
	setCurrentView : function(newView){
		if(app.currentView){
			app.currentView.remove();
		}
		app.currentView = newView;
		app.$('#container').html(newView.render().el);
	}
}

if(app.development){
	window.app = app;
}
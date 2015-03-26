var ProjectModel 			= require('../models/project'),
	EnumerationModel		= require('../models/enumeration'),
	ParticipantModel 		= require('../models/participant'),
	UserModel 				= require('../models/user'),
	MultimediaModel 		= require('../models/multimedia'),
	ObjectiveModel 			= require('../models/objective'),
	EnumerationCollection 	= require('../collections/enumerations'),
	ParticipantCollection 	= require('../collections/participants'),
	UserCollection			= require('../collections/users'),
	MultimediaCollection 	= require('../collections/multimedias'),
	ObjectiveCollection		= require('../collections/objectives');

var app = module.exports = {
	development : true,
	collections : {},

	loadData : function(data,next){
		//Load project
		app.project=new ProjectModel(app.utils.filter(data,[
			'_id', 'name', 'description', 'creationDate', 'template'
		]));
		//Load enumerations
		app.collections.enumerations = new EnumerationCollection();
		data.enumerations.forEach(function(elem,i){
			app.collections.enumerations.add(new EnumerationModel(elem));
		});
		//Load participants
		app.collections.participants = new ParticipantCollection();
		app.collections.users = new UserCollection();
		data.participants.forEach(function(elem,i){
			app.collections.participants.add(new ParticipantModel(app.utils.filter(elem,[
				'_id', 'role', 'status', 'creationDate', {
					attr 	: 'user',
					subAttr : '_id'
				}
			])));
			app.collections.users.add(new UserModel(elem.user));
		});
		//Load multimedias
		app.collections.multimedias = new MultimediaCollection();
		data.multimedias.forEach(function(elem,i){
			app.collections.multimedias.add(new MultimediaModel(elem));
		});
		//Load objectives
		app.collections.objectives = new ObjectiveCollection();
		data.objectives.forEach(function(elem,i){
			app.collections.objectives.add(new ObjectiveModel(elem));
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
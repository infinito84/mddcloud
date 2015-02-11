var ProjectModel 			= require('../models/project'),
	EnumerationModel		= require('../models/enumeration'),
	ParticipantModel 		= require('../models/participant'),
	UserModel 				= require('../models/user'),
	EnumerationCollection 	= require('../collections/enumerations'),
	ParticipantCollection 	= require('../collections/participants'),
	UserCollection			= require('../collections/users');


var app = module.exports=window.app={
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
					subAttr : 'id'
				}
			])));
			app.collections.users.add(new UserModel(elem.user));
		});
		next();
	},

	loadRole : function(id,next){
		app.role = app.collections.participants.get(id);
		next();
	}
}
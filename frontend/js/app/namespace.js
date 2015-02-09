var ProjectModel 			= require('../models/project.js'),
	EnumerationModel		= require('../models/enumeration.js'),
	EnumerationCollection 	= require('../collections/enumerations.js')

module.exports=window.app={
	collections : {},

	loadData : function(data){
		var app=this;
		//Load project
		app.project=new ProjectModel({
			_id 			: data._id,
			name 			: data.name,
			description		: data.description,
			creationDate 	: data.creationDate,
			template		: data.template
		});
		//Load enumerations
		app.collections.enumerations = new EnumerationCollection();
		data.enumerations.forEach(function(elem,i){
			app.collections.enumerations.add(new EnumerationModel(elem));
		});
	} 
}
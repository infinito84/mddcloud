var i18next = require('i18next');

var helper = module.exports = {
	//Traslate helper
	t : function(i18n_key){
		var result = i18next.t(i18n_key) || i18n_key;
		return result;
	},
	date : function(date) {
		var d=new Date(date);
		return [d.getDate(),d.getMonth()+1,d.getFullYear()].map(function(num){
			if(num<10)return '0'+num;
			return num;
		}).join('/');
	},
	className : function(str){
		var str = helper.withoutAccents(str);
		str = str.replace(/[^-A-Za-z0-9]+/g,'-').toLowerCase();
		str = str[0].toUpperCase() + str.substr(1,str.length);
		return str.replace(/-(.)/g, function(match, group1){
			return group1.toUpperCase();
		});
	},
	variableName : function(str){
		var str = helper.withoutAccents(str);
		str = str.replace(/[^-A-Za-z0-9]+/g,'-').toLowerCase();
		return str.replace(/-(.)/g, function(match, group1){
			return group1.toUpperCase();
		});
	},
	friendlyUrl : function(str){
		var str = helper.withoutAccents(str);
		return str.replace(/[^-A-Za-z0-9]+/g,'-').toLowerCase();
	},
	withoutAccents : function(str){
		var from = "ÃÀÁÄÂÈÉËÊÌÍÏÎÒÓÖÔÙÚÜÛãàáäâèéëêìíïîòóöôùúüûÑñÇç";
		var to   = "AAAAAEEEEIIIIOOOOUUUUaaaaaeeeeiiiioooouuuunncc";
		var mapping = {};

		for(var i = 0, j = from.length; i < j; i++ ){
			mapping[ from.charAt( i ) ] = to.charAt( i );
		}

		helper.withoutAccents = function(str) {
			var ret = [];
			for( var i = 0, j = str.length; i < j; i++ ) {
				var c = str.charAt(i);
				if(mapping.hasOwnProperty(str.charAt(i))){
					ret.push(mapping[c]);
				}
				else{
					ret.push(c);
				}
			} 
			return ret.join('');
		}

		return helper.withoutAccents(str);
	},
	databaseName : function(str){
		var str = helper.withoutAccents(str);
		str = str.toLowerCase();
		return str.replace(/ /g,'_');
	},
	roleName : function(str){
		var str = helper.withoutAccents(str);
		str = str.toUpperCase();
		return str.replace(/ /g,'_');
	},
	databaseType : function(type, enumeration){
		if(type === 'ENUM'){
			return "ENUM('"+ enumeration.values.join("','") + "')";
		}
		return {
			INT 		: 'INT(10)',
			HTML 		: 'TEXT',
			FILE 		: 'VARCHAR(100)',
			IMAGE 		: 'VARCHAR(100)',
			STRING 		: 'VARCHAR(256)',
			DECIMAL 	: 'DECIMAL(10,2)',
			POSITION 	: 'VARCHAR(100)',
			TIMESTAMP 	: 'TIMESTAMP', 
			PASSWORD 	: 'VARCHAR(100)'
		}[type];
	},
	exampleType : function(type, enumeration){
		var random = parseInt(Math.random()*1000);
		return {
			INT 		: random,
			HTML 		: "'<p>Test "+ random +"</p>'",
			FILE 		: "'/test/file"+ random +".txt',",
			IMAGE 		: "'/test/image"+ random +".png'",
			STRING 		: "'Text"+ random +"'",
			DECIMAL 	: 23.84,
			POSITION 	: "'4.72|73.91'",
			TIMESTAMP 	: "NOW()", 
			PASSWORD 	: "MD5('*****')",
			ENUM 		: 1
		}[type];
	},
	roleContext : function(storageRequirements, name, options){
		for(var i = 0; i < storageRequirements.length; i++){
			var storage = storageRequirements[i];
			if(storage.special === 'ROLE'){
				storage.parentContext = name;
				return options.fn(storage);
			}
		}
	},
	userContext : function(storageRequirements, name, index, options){
		for(var i = 0; i< storageRequirements.length; i++){
			var storage = storageRequirements[i];
			if(storage.special === 'USER'){
				storage.parentContext = name;
				storage.index = index + 1;
				return options.fn(storage);
			}
		}
	},
	inc : function(n){
		return n+1;
	},
	diff : function() {
		var args = Array.prototype.slice.call(arguments);
		var options = args.pop();
		var control = true;
		var temp = args[0];
		for(var i=1; i< args.length; i++){
			control = control && (temp !== args[i]);
		}
		if(control){
			return options.fn(this);
		}
		else{
			return options.inverse(this);
		}
	},
	getSQL : function(steps){
		var sql = '';
		var where = false;
		var previousStep = null;
		var firstStep = null;
		for(var i = 0; i<steps.length; i++){
			var step = steps[i];
			var table = helper.databaseName(step.storageRequirement.name);
			if(i === 0){
				firstStep = step;
				if(step.readMethod !== 'GENERAL'){
					where = true;
				}
				sql = '\t\t$sql .= " FROM ' + table + '";\n';
			}
			if(i > 0){
				var table2 = helper.databaseName(previousStep.storageRequirement.name);
				sql += '\t\t$sql .= " INNER JOIN '+ table + ' ON ('+ table +'.'+ table2 +'_id = '+ table2 +'.id)";\n'
			}
			previousStep = step;
		}
		var table2 = helper.databaseName(previousStep.storageRequirement.name);
		sql = '$sql = "SELECT '+ table2 + '.*";	\n' + sql;
		if(where){
			var table3 = helper.databaseName(firstStep.storageRequirement.name);
			sql += '\t\t$sql .= " WHERE '+ table3 +'.id = $id";\n';
		}
		return {sql : sql, where : where};
	},
	getPlugins : function (attributes, options){
		var context = {
			tinymce 			: 'false',
			jqueryFileUpload 	: 'false',
			maps 				: 'false'
		}
		for(var i=0; i<attributes.length; i++){
			var attribute = attributes[i];
			if(attribute.type === 'HTML'){
				context.tinymce = 'true';
			}
			if(attribute.type === 'POSITION'){
				context.maps = 'true';
			}
			if(attribute.type === 'IMAGE' || attribute.type === 'FILE'){
				context.jqueryFileUpload = 'true';
			}
		}
		return options.fn(context);
	},
	console : function(value){
		console.log(value);
		return '';
	},
	eq : function(){
		var args = Array.prototype.slice.call(arguments);
		var options = args.pop();
		var control = false;
		var temp = args[0];
		for(var i=1; i< args.length; i++){
			control = control || (temp === args[i]);
		}
		if(control){
			return options.fn(this);
		}
		else{
			return options.inverse(this);
		}
	},
	ref : function(model,id, options) {
		var element = null;
		console.log(model);
		helper.root[model].forEach(function(elem){
			if(elem._id.toString() === id.toString()){
				return element = elem;
			}
		});
		element = element || {};
		return "<a href='#"+ model +"_"+ id +"'>"+ element.name + "</a>";
	},
	refUser : function(id, options) {
		var element = null;
		helper.root.participants.forEach(function(elem){
			if(elem.user._id.toString() === id.toString()){
				return element = elem.user;
			}
		});
		element = element || {};
		return "<a href='#user_"+ id +"'>"+ element.name + "</a>";
	}
}
var i18next = require('i18next');

var helper = module.exports = {
	//Traslate helper
	t : function(i18n_key){
		var result = i18next.t(i18n_key);
		if(result===''||result===null||result===undefined)return i18n_key;
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
	}
}
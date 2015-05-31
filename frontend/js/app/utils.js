var Handlebars	=	require('hbsfy/runtime'),
	i18n		=	require('i18next-client'),
	app			=	require('./namespace'),
	$			=	require('jquery');

module.exports=(function(){

	var publicUtils={
		init : function(){
			privateUtils.registerjQueryPlugins();
			privateUtils.registerHandlebarsHerlpers();
			return publicUtils;
		},
		loadHome : function(){
			var ViewHome=require('../views/index');
			new ViewHome();			
		},
		t : function(i18n_key){
			var result = i18n.t(i18n_key);
			if(result===''||result===null||result===undefined)return i18n_key;
			return result;
		},
		filter : function (obj,array){
			var temp = {};
			array.forEach(function(attr,i){
				if(typeof attr === 'string'){
					temp[attr] = obj[attr];
				}
				else{
					temp [attr.attr] = obj[attr.attr][attr.subAttr];
				}
			});
			return temp;
		},
		filterCollection : function(collection,arrayIds){
			var collection2 = collection.clone();
			collection2.reset();
			collection2.add(collection.models.filter(function(model){
				return arrayIds.indexOf(model.id) !== -1;
			}));
			return collection2;
		},
		extend : function(obj1, obj2){
			var attrs = Object.keys(obj2);
			attrs.forEach(function(attr){
				obj1[attr]=obj2[attr];
			});
		},
		dataBinding : function(view){
			//When we build views that has nested views we filter elements with
			//Differente scope (other views)
			var $notSelector = '[data] [data]';
			var elements = view.$el.find('[data]').not(view.$el.find($notSelector));
			var model = view.model;
			elements.each(function(i,el){
				var $el = $(el);				
				var data = $el.attr('data');
				var tag = el.tagName.toLowerCase();
				var isMultiple = el.className.indexOf('multiple') !== -1;
				if(['input','select','textarea'].indexOf(tag)!==-1){
					$el.change(function(){
						var value = $el.val();
						var values = {};
						if(isMultiple){							
							if(typeof value === 'string'){
								value = value.split(',')
							}
							if(value === null){
								value = [];
							}
						}
						else{
							if(tag === 'select'){
								if(value == '-1'){
									value = null;
								}
							}
						}
						values[data] = value;
						//If the model has authors, we add them by their modifications
						var authors = model.get('authors');
						if(authors instanceof Array){
							authors = authors.slice(0); 
							var user = app.role.get('user');
							if(authors.indexOf(user) === -1){
								authors.push(user);
								values.authors = authors;
							}
						}
						model.set(values);
						model.save();
						view.cacheElement = this;
					});
				}
			});
			view.listenTo(model,'change',function(){
				var changed=model.changedAttributes();
				var array=Object.keys(changed);
				for(var i=0;i<array.length;i++){
					var attr=array[i];
					view.$el.find('[data='+attr+']').not(view.$el.find($notSelector)).each(function(i,el){
						if(view.cacheElement === el){
							view.cacheElement = null;
							return;
						}
						var tag = el.tagName.toLowerCase();
						var value = changed[attr];							
						if(['input','select','textarea'].indexOf(tag)!==-1){
							var isMultiple = el.className.indexOf('multiple') !== -1;
							if(isMultiple){
								$(el).select2('val',value);
								value = value.join(',');
							}
							else{
								if(tag === 'select'){
									if(value === null){
										value = '-1';
									}
								}
							}
							el.value = value;
						}
						else{
							var isCustom = el.attributes.getNamedItem('data-custom');
							if(isCustom){
								var $el = $(el);
								var custom = $el.attr('data-custom');
								view.customRender[custom](view,$el,value);
							}
							else{
								var isMultiple = el.className.indexOf('multiple') !== -1;
								if(isMultiple){
									value = value.join(', ');
								}
								el.innerHTML = value;
							}
						}
					});
				}
			});
		},
		listeningCollection : function(view){
			var collection = view.collection;
			var attachedViews = [];
			var SubView = view.SubView;

			var addModel = function(model){
				var $collection = view.$el.find('.collection');
				var temp = new SubView({
					model : model,
					extra : view.extra //Extra params in dynamic views
				});
				if(typeof view.customAdd === 'function'){ //For dynamic views
					view.customAdd($collection,temp);
				}
				else{
					$collection.append(temp.render().$el);
				}
				attachedViews.push(temp);
			};

			var removeModel = function(model){
				attachedViews.filter(function(view){
					if(view.model === model){
						view.remove();
						return false;
					}
					return true;
				});
			}

			view.removeViews = function(){
				attachedViews.forEach(function(view,i){
					view.remove();
				});
				this.remove();
			}

			collection.forEach(function(model){
				addModel(model);
			});
			view.listenTo(collection,'add',addModel);
			view.listenTo(collection,'remove',removeModel);
		},
		helperAdjustTextSVG : function(text){
			var strings = text.split(' ');
			var result = [];
			var limit = 30;
			var temp = '';
			strings.forEach(function(item){
				if(temp.length + item.length + 1 > limit){
					result.push(temp);
					temp = '';
				}
				if(temp !== ''){
					temp += ' ';
				}
				temp += item;
			});
			if(temp !== ''){
				result.push(temp);
			}
			return result;
		},
		fixName : function(text, first){
			var from = "ÃÀÁÄÂÈÉËÊÌÍÏÎÒÓÖÔÙÚÜÛãàáäâèéëêìíïîòóöôùúüûÑñÇç";
			var to   = "AAAAAEEEEIIIIOOOOUUUUaaaaaeeeeiiiioooouuuunncc";
			var mapping = {};

			for(var i = 0, j = from.length; i < j; i++ ){
				mapping[ from.charAt( i ) ] = to.charAt( i );
			}

			app.utils.fixName = function(str, first) {
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
				str = ret.join('').replace(/[^-A-Za-z0-9]+/g,'-').toLowerCase();
				if(first){
					str = str[0].toUpperCase() + str.substr(1,str.length);
				}
				return str.replace(/-(.)/g, function(match, group1){
					return group1.toUpperCase();
				});
			}

			return app.utils.fixName(text, first);
		}
	}

	var privateUtils={
		registerjQueryPlugins:function(){
			window.jQuery = window.$ = $;
			require('../libs/jquery.nicescroll/jquery.nicescroll');
			require('../libs/jquery-file-upload/js/jquery.fileupload');
			require('../libs/select2/select2');
			require('../libs/notifyjs/dist/notify');
			require('../libs/notifyjs/dist/styles/bootstrap/notify-bootstrap');
			$.el = require('laconic');
			//Configuring AJAX
			$.ajaxSetup({
				error : function(jqXHR){
					if(!jqXHR.responseText){
						jqXHR.responseText = app.utils.t('Has ocurred an error');
					}
					$.notify(jqXHR.responseText,'error');
				}
			})

			if(!app.development){
				delete window.jQuery;
				delete window.$;
			}
		},
		registerHandlebarsHerlpers:function(){
			Handlebars.registerHelper('t', function(i18n_key) {
				var result = i18n.t(i18n_key);
				if(result===''||result===null||result===undefined)return i18n_key;
				return new Handlebars.SafeString(result);
			});

			Handlebars.registerHelper('lower', function(word) {
				return new Handlebars.SafeString(word.toLowerCase());
			});

			Handlebars.registerHelper('selected', function(attr,value) {
				var answer='value="'+value+'"';
				if(attr===value){
					answer+=' selected';
				}
				return new Handlebars.SafeString(answer);
			});

			Handlebars.registerHelper('date', function(date) {
				var d=new Date(date);
				return [d.getDate(),d.getMonth()+1,d.getFullYear()].map(function(num){
					if(num<10)return '0'+num;
					return num;
				}).join('/');
			});

			Handlebars.registerHelper('join', function(array,separator) {
				if(array instanceof Array){
					return new Handlebars.SafeString(array.join(separator));
				}
				return '';
			});

			Handlebars.registerHelper('allow', function() {
				var args = Array.prototype.slice.call(arguments);
				var options = args.pop();
				var control = false;
				args.forEach(function(role){
					control |= app.role.get('role') === role & app.role.get('status') === 'ENABLED'
				});
				if(control){
					return options.fn(this);
				}
				else{
					return options.inverse(this);
				}
			});

			//Comparators
			Handlebars.registerHelper('eq', function(v1,v2,options) {
				if(v1 === v2){
					return options.fn(this);
				}
				else{
					return options.inverse(this);
				}
			});

		}
	}

	return publicUtils.init
})();
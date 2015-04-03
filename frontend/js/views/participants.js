var Backbone			=	require("backbone"),
	$					=	require("jquery"),
	app					= 	require("../app/namespace"),
	modal				=	require("../app/modal"),
	ParticipantView  	=	require("./participant"),
	ParticipantModel 	=	require("../models/participant") ;

module.exports=  Backbone.View.extend({
	className : "participants-view",
	events : {
		"click button.add-participant" : "newParticipant"	
	},
	template : require("../templates/participantForm.hbs"),
	render : function(){
		var html=this.template({});
		this.$el.html(html);
		return this;
	},
	SubView : ParticipantView,	
	initialize : function() {
		var view = this;
		modal.show({
			title : app.utils.t("Participants"),
		},800,600,function(){
			view.removeViews();
			modal.close();
		});
		$(".modal .content").html(this.render().$el);	
		app.utils.listeningCollection(this);
	},
	newParticipant : function(){
		var input = this.$el.find("input.add-participant");
		var role = this.$el.find("select.role").val();
		var name = input.val();
		var error = false;
		if(name === ''){
			$.notify(app.utils.t('You must write a E-mail'),'error');
			error = true;
		}
		var filter=/^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
		if (!filter.test(name)){
			$.notify(app.utils.t('Verify your e-mail'),'error');
			error = true;
		}
		if(error){
			return;
		}
		input.val("");
		if(name){
			$.ajax({
				url : '/participant/add/',
				type : 'POST',
				data : {
					email 	: name,
					role 	: role,
					project : app.project.get("_id")
				}
			});
		}
		else{
			alert(app.utils.t("You must write a name"));
		}
	}
});
var Backbone   = require('backbone'),
   $        = require('jquery'),
   plugins     = require('../../app/plugins');

module.exports = Backbone.View.extend({
   initialize : function(options){
      this.svg = options.svg;
      this.listenTo(this.model, 'change:name', this.updateName, this);
      this.listenTo(this.model, 'change:x', this.updatePosition, this);
      this.listenTo(this.model, 'change:y', this.updatePosition, this);
   },
   updateName : function(){
      this.label.attr({text : this.model.get('name')});
      this.label.transform(['T',(this.group.getBBox().w / 2) - (this.label.getBBox().w / 2),',',this.group.getBBox().h + 15].join(''));
   },
   updatePosition : function(){
      this.actor.transform(['T',this.model.get('x'),',',this.model.get('y')].join(''));
   },
   render : function(){
      var svg = this.svg;
      this.group = svg.group(
         svg.circle(10,10,10).attr({stroke:'black',strokeWidth:2,fill:'white'}),
         svg.line(10,20,10,40).attr({stroke:'black',strokeWidth:2}),
         svg.line(0,30,20,30).attr({stroke:'black',strokeWidth:2}),
         svg.line(10,40,0,50).attr({stroke:'black',strokeWidth:2}),
         svg.line(10,40,20,50).attr({stroke:'black',strokeWidth:2})
      );
      this.label = svg.text(0, 0, this.model.get('name'));
      this.label.transform(['T',(this.group.getBBox().w / 2) - (this.label.getBBox().w / 2),',',this.group.getBBox().h + 15].join(''));
      this.actor = svg.group(this.group, this.label);
      
      var svgWidth = $("#container").width() - 30;
      var svgHeight = $("#container").height() - 65;
      var x = this.model.get('x') || Math.random() * svgWidth + 20;
      var y = this.model.get('y') || Math.random() * svgHeight;
      this.actor.transform(['T',x,',',y].join(''));
      this.actor.drag(this.moveDrag, this.startDrag, this.endDrag, this, this, this);

      this.model.set({x : x, y : y}).save();
      return this.actor;
   },
   moveDrag : function(dx, dy, x, y, event){
      this.nx = this.ox + dx;
      this.ny = this.oy + dy;
      this.actor.transform(['T',this.nx,',',this.ny].join(''));
   },
   startDrag : function(x, y, event){
      this.ox = this.model.get('x');
      this.oy = this.model.get('y');
   },
   endDrag : function(event){
      this.model.set({
         x : this.nx,
         y : this.ny
      }).save();
   }
});
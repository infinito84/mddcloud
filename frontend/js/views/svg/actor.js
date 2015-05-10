var Backbone   = require('backbone'),
   $        = require('jquery'),
   plugins     = require('../../app/plugins');

module.exports = Backbone.View.extend({
   initialize:function(options){
      this.svg = options.svg;
   },
   render:function(){
      var svg = this.svg;
      this.group = svg.group(
         svg.circle(10,10,10).attr({stroke:'black',strokeWidth:2,fill:'white'}),
         svg.line(10,20,10,40).attr({stroke:'black',strokeWidth:2}),
         svg.line(0,30,20,30).attr({stroke:'black',strokeWidth:2}),
         svg.line(10,40,0,50).attr({stroke:'black',strokeWidth:2}),
         svg.line(10,40,20,50).attr({stroke:'black',strokeWidth:2})
      );
      this.label = svg.text(0, 0, this.model.get('name'));
      this.label.transform(['T',(this.group.getBBox().width / 2) - (this.label.getBBox().width / 2),',',this.group.getBBox().height + 15].join(''));
      this.actor = svg.group(this.group, this.label);

      var svgWidth = $("#container").width() - 30;
      var svgHeight = $("#container").height() - 65;
      var x = this.model.get('x') || Math.random() * svgWidth + 20;
      var y = this.model.get('y') || Math.random() * svgHeight;
      this.actor.transform(['T',x,',',y].join(''));

      this.model.set({x : x, y : y}).save();
      return this.actor;
   }
});
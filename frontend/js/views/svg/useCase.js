var Backbone   = require('backbone'),
   $           = require('jquery'),
   app		   = require('../../app/namespace'),
   plugins     = require('../../app/plugins');

module.exports = Backbone.View.extend({
   initialize : function(options){
      this.svg = options.svg;
      this.listenTo(this.model, 'change:name', this.updateName, this);
      this.listenTo(this.model, 'change:x', this.updatePosition, this);
      this.listenTo(this.model, 'change:y', this.updatePosition, this);
   },
   updateName : function(){
      var strings = app.utils.helperAdjustTextSVG(this.model.get('name'));
      this.label.attr({
         text : strings,
         y : (strings.length * 6 * -1) + 12
      });
      this.label.selectAll("tspan").forEach(function(element, index){
         element.attr({x:0, dy:index===0? 0: 12});
      });
   },
   updatePosition : function(){
      this.useCase.transform(['T',this.model.get('x'),',',this.model.get('y')].join(''));
   },
   render : function(){
      var svg = this.svg;
      this.ellipse = svg.ellipse(0, 0, 100, 40).attr({stroke:'black',strokeWidth:2,fill:'white'});
      this.label = this.svg.text(0, 0, '');
      this.updateName();
      this.useCase = svg.group(this.ellipse, this.label);
      this.label.attr({x : 0, textAnchor : 'middle', fontSize : 12});
      
      var svgWidth = $("#container").width() - 30;
      var svgHeight = $("#container").height() - 65;
      var x = this.model.get('x') || Math.random() * svgWidth + 20;
      var y = this.model.get('y') || Math.random() * svgHeight;
      this.useCase.transform(['T',x,',',y].join(''));
      this.useCase.drag(this.moveDrag, this.startDrag, this.endDrag, this, this, this);

      this.model.set({x : x, y : y}).save();
      return this.useCase;
   },
   moveDrag : function(dx, dy, x, y, event){
      this.nx = this.ox + dx;
      this.ny = this.oy + dy;
      this.useCase.transform(['T',this.nx,',',this.ny].join(''));
   },
   startDrag : function(x, y, event){
      this.ox = this.model.get('x');
      this.oy = this.model.get('y');
   },
   endDrag : function(event){
      this.model.set({x : this.nx, y : this.ny}).save();
   }
});
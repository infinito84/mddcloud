var app = require('./namespace');

module.exports = {
	Snap : (function(){
		require('../libs/snap.svg/dist/snap.svg');
		var Snap = window.Snap;
		//require('../libs/snap.svg.zpd/snap.svg.zpd')
		if(!app.development){
			delete window.Snap;
		}
		return Snap;
	})()
}
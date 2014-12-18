(function(window, Tatami){

	var smileys = {
			"8-)": "/img/simple-smiley/cool.png",
			":'(": "/img/simple-smiley/crying.png",
			":(": "/img/simple-smiley/frowning.png",
			":O": "/img/simple-smiley/gasping.png",
			":D": "/img/simple-smiley/grinning.png",
			"^^": "/img/simple-smiley/happy.png",
			"-1": "/img/simple-smiley/thumbs_down.png",
			"+1": "/img/simple-smiley/thumbs_up.png",
			":P": "/img/simple-smiley/tongue_out.png",
			";)" : "/img/simple-smiley/winking.png",
			";-)" : "/img/simple-smiley/winking.png"
	};
	
    Tatami.Smileys = function(content){
    	for(var key in smileys) {
    		var reg = new RegExp("(^| )"+escapeRegExp(key)+"($| )");
    		content = content.replace(reg, " !["+key+"]("+smileys[key]+") ");
    	}
    	return content;
    };
    
    function escapeRegExp(str) {
	  return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
	};
	
})(window, Tatami);
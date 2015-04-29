define(function() {

function addGetHookIf( conditionFn, hookFn ) {
	return {
		get: function() {
			var condition = conditionFn();

			if ( condition == null ) {
				return;
			}

			if ( condition ) {
				delete this.get;
				return;
			}

			return (this.get = hookFn).apply( this, arguments );
		}
	};
}

return addGetHookIf;

});

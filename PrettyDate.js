(function() {
	Ext.ns('Ext.ux');
	Ext.ux.prettyDate = function(){
		var defaultConfig = function(){
			return{
				refreshInterval: 60
				,onErrorWriteTitle: true
				,itemSelector: 'span.prettyDate'
				,messages: {
					now: new Ext.Template("just now"),
					second: new Ext.Template("1 second ago"),
					seconds: new Ext.Template("{age} seconds ago"),
					minute: new Ext.Template("1 minute ago"),
					minutes: new Ext.Template("{age} minutes ago"),
					hour: new Ext.Template("1 hour ago"),
					hours: new Ext.Template("{age} hours ago"),
					yesterday: new Ext.Template("Yesterday"),
					days: new Ext.Template("{age} days ago"),
					weeks: new Ext.Template("{age} weeks ago"),
					forever: new Ext.Template("{age}")
				}
			}
		}
		
		function parseDate(str, formats){
			var d = null;
			for ( i = 0; i < formats.length; i++){
				d = Date.parseDate ( str, formats[i]);
				if(d) return d
			}
			
			return false;
		}

		var now = function() {
			return new Date();
		}

		var processOptions = function(config){
		    var o = defaultConfig();
	        var options = {};
	        Ext.apply(options, config, o);
	        
	        return options;
		}
		
		
		var format = function(time, options) {

			var date = new Date((time || "").replace(/-/g,"/").replace(/[TZ]/g," ")),
				diff = (now().getTime() - date.getTime()) / 1000,
				day_diff = Math.floor(diff / 86400);

			if ( isNaN(day_diff) || day_diff < 0 || day_diff >= 31 ) {
				return options.messages.forever.apply({age:Date.parseDate(time,"c").format('F j, Y')});
			}

			return day_diff == 0 && (
					diff < 1 && options.messages.now.apply() ||
					diff == 1 && options.messages.second.apply() ||
					//diff < 15 && options.messages.now.apply() ||
					diff < 60 && options.messages.seconds.apply({age:Math.floor( diff )}) ||
					diff < 120 && options.messages.minute.apply() ||
					diff < 3600 && options.messages.minutes.apply({age:Math.floor( diff / 60 )}) ||
					diff < 7200 && options.messages.hour.apply() ||
					diff < 86400 && options.messages.hours.apply({age:Math.floor( diff / 3600 )})) ||
				day_diff == 1 && options.messages.yesterday.apply() ||
				day_diff < 7 && options.messages.days.apply({age:day_diff}) ||
				day_diff < 31 && options.messages.weeks.apply({age:Math.ceil( day_diff / 7 )});
		}
		
		//public start
		return{
			options: null
			,items: []
			,init : function (config){
				this.options = processOptions(config) ;
				this.refresh();
			}
		
		    ,translate : function(str, options){
				if(!options) options = processOptions({}) ;
		    	var d = format(str, options);
		        if(d){
	                return (d);
	            }
		        return false ;
		    }
		
			,refresh: function(){
				Ext.select(this.options.itemSelector).each(function(el, item, collectionIindex){
					if (el.dom.title) {
				    	el.update(this.translate(el.dom.title, this.options));	
					}
				}, this);
				
				if(this.options.refreshInterval > 0)
					this.refresh.createDelegate(this).defer(this.options.refreshInterval * 1000)
			}
			
			,applyTo: function (domId, config){
	            var options = processOptions(config) ;
	            var el = Ext.get(domId);
				if (el.dom.title) {
			    	el.update(this.translate(el.dom.title, options));	
				}
	            
	            if(options.refreshInterval > 0)
	                this.applyTo.createDelegate(this).defer(options.refreshInterval * 1000, this, [domId, config]);
			}		
		}//public -- end
		
	};
})();
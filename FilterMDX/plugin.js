/**
 * Saiku UI Plugin Boilerplate - v0.2.0
 * A jump-start for Saiku UI plugins development.
 *
 * Made by Breno Polanski
 * Under MIT License
 */
var FilterMDX = Backbone.View.extend({
	initialize: function(args) {
		// Keep track of parent workspace
		this.workspace = args.workspace;

		// Create a ID for use as the CSS selector
        this.id = 'filterMDX';
        this.$el.attr({ id: this.id });

		// Base URL
        this.BASE_URL = 'js/saiku/plugins/FilterMDX/';

		// Maintain `this` in callbacks
		_.bindAll(this, 'add_button', 'show', 'template', 'render', 'receive_data', 
			      'process_data', 'set_localstorage_mdx');

		// Add button in workspace toolbar
		this.add_button();
		
		// Add template HTML in workspace
		this.template();

		// Set swap_axis in localstorge with row
		localStorage.setItem('swap_axis', 'row');

		// Listen to result event
		this.workspace.bind('query:result', this.receive_data);

		// Listen to adjust event
		this.workspace.bind('workspace:adjust', this.render);
	},

	add_button: function() {
		var button =
			$('<a href="#filterMDX" class="filterMDX button disabled_toolbar i18n" title="FilterMDX"></a>')
			.css({ 'background-image': 'url("' + this.BASE_URL + 'image/plugin.png")',
				   'background-repeat': 'no-repeat',
				   'background-position': '50% 50%',
				   'background-size': '16px'
				});

		var li = $('<li class="seperator"></li>').append(button);
		this.workspace.toolbar.$el.find('ul').append(li);
		this.workspace.toolbar.filterMDX = this.show;
	},

	show: function() {
		this.data.mdx = localStorage.getItem('filter_mdx');
		
		console.log(this.data.mdx);

		(new DemoModal({ data: this.data })).render().open();
	},

	template: function() {
		// Create template HTML
		this.html = _.template('<h1>Let\'s Go Rock and Roll :D</h1>');

		// Add template in this.$el
		this.$el.html(this.html);

		// Insert template in workspace results
		this.workspace.$el.find('.workspace_results').prepend(this.$el.hide());
	},

	render: function() {
		// Render results...
	},

    receive_data: function(args) {
        return _.delay(this.process_data, 1000, args);
    },

    type_validation: function(value)	{
    	if (typeof(value) !== 'number' && isNaN(value.replace(/[^a-zA-Z 0-9.]+/g,''))) {
    		return 'String';
    	}
    	else {
    		return 'Numeric';
    	}
    },

	process_data: function(args) {
        if (args.data.cellset && args.data.cellset.length > 0) {
        	var DIMENSION = ['Variavel', 'Variável'],
        		ROWS = args.data.cellset.length,
				COLUMNS = args.data.cellset[0].length;

			this.data = {
				mdx: '',
        		metadata: [],
	        	width: 0,
	        	height: 0
	        };

	        var row,
        		column;

        	for (row = 0; row < ROWS; row += 1) {
        		for (column = 0; column < COLUMNS; column += 1) {
        			if (args.data.cellset[row][column].type === 'ROW_HEADER' &&
        			    _.find(DIMENSION, function(dim) { 
    			    		return args.data.cellset[row][column].properties.dimension === dim 
        				})) {

        				this.data.metadata.push({
        					colIndex: column,
        					colName: args.data.cellset[row][column].value,
        					colType: this.type_validation(args.data.cellset[row][column].value),
        					properties: {
        						dimension: args.data.cellset[row][column].properties.dimension,
        						hierarchy: args.data.cellset[row][column].properties.hierarchy,
        						level: args.data.cellset[row][column].properties.level,
    							uniquename: args.data.cellset[row][column].properties.uniquename
        					}
        				});
        			}
        			else if (args.data.cellset[row][column].type === 'COLUMN_HEADER' &&
        					 _.find(DIMENSION, function(dim) { 
    							return args.data.cellset[row][column].properties.dimension === dim 
    						 })) {

        				this.data.metadata.push({
        					colIndex: column,
        					colName: args.data.cellset[row][column].value,
        					colType: this.type_validation(args.data.cellset[row][column].value),
        					properties: {
        						dimension: args.data.cellset[row][column].properties.dimension,
        						hierarchy: args.data.cellset[row][column].properties.hierarchy,
        						level: args.data.cellset[row][column].properties.level,
    							uniquename: args.data.cellset[row][column].properties.uniquename
        					}
        				});
        			}
        		}
        	}

        	this.data.height = ROWS;
    		this.data.width = COLUMNS;

        	// Render results
        	this.render();
        	
        	this.set_localstorage_mdx();
        }
        else {
        	this.$el.text('No results');
        }
	},

	set_localstorage_mdx: function() {
		this.workspace.query.action.get('/mdx', {
            success: function(model, response) {
            	localStorage.setItem('filter_mdx', response.mdx);
            }
        });

		// this.data.mdx = localStorage.getItem('filter_mdx');
	}
});

 /**
  * Load file CSS
  * @param {String} file - Path of file css.
  */
function loadCSS(file) {
	var headID    = document.querySelector('head');
	var cssNode   = document.createElement('link');
	cssNode.type  = 'text/css';
	cssNode.rel   = 'stylesheet';
	cssNode.href  = file;
	cssNode.media = 'screen';
	headID.appendChild(cssNode);
}

 /**
  * Load file JavaScript
  * @param {String} file - Path of file js.
  */
function loadJS(file) {
	var headID  = document.querySelector('head');
	var jsNode  = document.createElement('script');
	jsNode.type = 'text/javascript';
	jsNode.src  = file;
	headID.appendChild(jsNode);
}

 /**
  * Start Plugin
  */
Saiku.events.bind('session:new', function() {

	loadCSS('js/saiku/plugins/FilterMDX/css/plugin.css');	
	loadJS('js/saiku/plugins/FilterMDX/js/localstorage.js');
	loadJS('js/saiku/plugins/FilterMDX/js/FilterMDX.js');

	function new_workspace(args) {
		if (typeof args.workspace.filterMDX === 'undefined') {
			args.workspace.filterMDX = new FilterMDX({ workspace: args.workspace });
		}
	}

	// Add new tab content
	for (var i = 0, len = Saiku.tabs._tabs.length; i < len; i += 1) {
		var tab = Saiku.tabs._tabs[i];
		new_workspace({
			workspace: tab.content
		});
	}

	// New workspace
	Saiku.session.bind('workspace:new', new_workspace);
});

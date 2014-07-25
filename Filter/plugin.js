/**
 * Saiku UI Plugin Boilerplate - v0.1.0
 * A jump-start for Saiku UI plugins development.
 *
 * Made by Breno Polanski
 * Under MIT License
 */
var Filter = Backbone.View.extend({
	initialize: function(args) {
		// Keep track of parent workspace
		this.workspace = args.workspace;

		// Create a ID for use as the CSS selector
        this.id = 'filter';
        this.$el.attr({ id: this.id });

		// Maintain `this` in callbacks
		_.bindAll(this, 'add_button', 'show', 'template', 'render', 'receive_data', 
			      'process_data', 'event1', 'event2');

		// Add button in workspace toolbar
		this.add_button();

		// Listen to result event
		this.workspace.bind('query:result', this.receive_data);
	},

	add_button: function() {
		var button =
			$('<a href="#filter" class="filter button disabled_toolbar i18n" title="Filter"></a>')
			.css({ 'background-image': 'url("js/saiku/plugins/Filter/image/plugin.png")',
				   'background-repeat': 'no-repeat',
				   'background-position': '50% 50%',
				   'background-size': '16px'
				});

		var li = $('<li class="seperator"></li>').append(button);
		this.workspace.toolbar.$el.find('ul').append(li);
		this.workspace.toolbar.filter = this.show;
	},

	show: function() {
		// Render results in template HTML
		this.render();

		$.fancybox(this.$el, {
    		'minWidth'  : ($('body').width() - 100),
			'minHeight' : ($('body').height() - 100)
        });
	},

	template: function() {
		// Create template HTML
		this.html = _.template(
			'<div class="container_12">' +
				// #1
				'<div class="grid_12">' +
					'<div class="filter-tools">' +
						'<nav class="filter-menu">' +
							'<ul>' +
								'<li>' +
									'<a href="javascript:void(0);">' +
										'<img src="js/saiku/plugins/Filter/image/filter-new.png" alt="">' +
									'</a>' +
								'</li>' +
								'<li class="right">' +
									'<a href="javascript:void(0);">' +
										'<img src="js/saiku/plugins/Filter/image/filter-help.png" alt="">' +
									'</a>' +
								'</li>' +
							'</ul>' +
						'</nav>' +
					'</div>' +
				'</div>' +

				'<div class="clear"></div>' +

				// #2
				'<div class="grid_11">' +
					'<div class="filter-form">' +
						'<label for="">Escolha a variável para inserir na expressão</label>' +
						'<select class="form-control" name="" id="">' +
							'<% _.each(data, function(val) { %>' +
							'<option value=""><%= val.colName %></option>' +
							'<% }); %>' +
						'</select>' +
					'</div>' +
				'</div>' +
				'<div class="grid_1" style="margin-top: 18px;">' +
					'<div class="filter-form">' +
						'<button class="form-control" name="" id="">add</button>' +
					'</div>' +
				'</div>' +

				'<div class="clear"></div>' +

				// #3
				'<div class="grid_5">' +
					'<div class="filter-form">' +
						'<label for="">Lista de operadores lógicos</label>' +
						'<select class="form-control" name="" id="">' +
							'<option value=""></option>' +
							'<option value="">Igual (=)</option>' +
							'<option value="">Diferente (<>)</option>' +
							'<option value="">Maior (>)</option>' +
							'<option value="">Menor (<)</option>' +
							'<option value="">Maior ou igual (>=)</option>' +
							'<option value="">Menor ou igual (<=)</option>' +
						'</select>' +
					'</div>' +
				'</div>' +
				'<div class="grid_1" style="margin-top: 18px;">' +
					'<div class="filter-form">' +
						'<button class="form-control" name="" id="">add</button>' +
					'</div>' +
				'</div>' +

				'<div class="grid_5">' +
					'<div class="filter-form">' +
						'<label for="">Digite um valor</label>' +
						'<input type="text" class="form-control" name="" id="">' +
					'</div>' +
				'</div>' +
				'<div class="grid_1" style="margin-top: 18px;">' +
					'<div class="filter-form">' +
						'<button class="form-control" name="" id="">add</button>' +
					'</div>' +
				'</div>' +

				'<div class="clear"></div>' +

				// #4
				'<div class="grid_12">' +
					'<div class="filter-form">' +
						'<textarea class="form-control" name="" id="" cols="30" rows="10" style="height: 150px;"></textarea>' +
					'</div>' +
				'</div>' +

				'<div class="clear"></div>' +

				// #5
				'<div class="grid_12">' +
					'<p>Prévia de saída:</p>' +
				'</div>' +

				'<div class="clear"></div>' +

				// #6
				'<div class="grid_12">' +
					'<div class="filter-form">' +
						'<button class="" name="" id="">Ok</button>' +
						'<button class="" name="" id="">Cancelar</button>' +
					'</div>' +
				'</div>' +

			'</div>')({
				data: this.data.metadata
			});

		// Add template in this.$el
		this.$el.html(this.html);
	},

	render: function() {
		// Add template HTML in workspace
		this.template();
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
		// console.log(args);

        if (args.data.cellset && args.data.cellset.length > 0) {
        	var DIMENSION = 'Variavel',
        		ROWS = args.data.cellset.length,
				COLUMNS = args.data.cellset[0].length;

			this.data = {
        		metadata: [],
	        	resultset: [],
	        	width: 0,
	        	height: 0
	        };

	        var row,
        		column,
	        	record = [];

        	for (row = 0; row < ROWS; row += 1) {
        		for (column = 0; column < COLUMNS; column += 1) {
        			if (args.data.cellset[row][column].type === 'ROW_HEADER' &&
        				args.data.cellset[row][column].properties.dimension === DIMENSION) {

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
        					 args.data.cellset[row][column].properties.dimension === DIMENSION) {

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
	        		else if (args.data.cellset[row][column].type === 'DATA_CELL') {

	        			var value = args.data.cellset[row][column].value;

        				if (args.data.cellset[row][column].properties.raw && 
        					args.data.cellset[row][column].properties.raw !== 'null' && column > 0) {

    						value = parseFloat(args.data.cellset[row][column].properties.raw);
        				}
        				else if (typeof(args.data.cellset[row][column].value) !== 'number' && 
        					     parseFloat(args.data.cellset[row][column].value.replace(/[^a-zA-Z 0-9.]+/g,'')) && 
        					     column > 0) {

    						value = parseFloat(args.data.cellset[row][column].value.replace(/[^a-zA-Z 0-9.]+/g,''));
        				}
        				record.push(value);
	        		}
        		}
        	}
    		this.data.resultset.push(record);

    		this.data.width = COLUMNS;
        	this.data.height = ROWS;

        	// Render results
        	this.render();

        	// console.log(this.data);
        	// console.log(JSON.stringify(this.data));

        	// _.each(this.data.metadata, function(val) {
        	// 	console.log(val);
        	// });
        }
        else {
        	this.$el.text('No results');
        }
	},

	event1: function() {
		// Hi, you can add one event!! Let's Go :)
	},

	event2: function() {
		// Hi, you can add one event!! Let's Go :)
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

	loadCSS('js/saiku/plugins/Filter/css/960.css');	
	loadCSS('js/saiku/plugins/Filter/css/plugin.css');

	function new_workspace(args) {
		if (typeof args.workspace.filter === 'undefined') {
			args.workspace.filter = new Filter({ workspace: args.workspace });
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

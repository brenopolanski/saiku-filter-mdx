var DemoModal = Modal.extend({
    type: 'filtermdx',

    events: {
    	'click .add-to-exp': 'logical_expression'
    },

    buttons: [
    	{ text: 'Create Filter' },
    	{ text: 'Cancel', method: 'close' }
    ],
    
    initialize: function(args) {
    	this.data = args.data;

        this.options.title = 'Filter';

        this.message = _.template(
			'<div class="container_12">' +
				// #1
				'<div class="grid_5">' +
					'<div class="filtermdx-form">' +
						'<label for="">Variável</label>' +
						'<select class="form-control" name="select-var" id="select-var">' +
							'<option value="">-- Selecione --</option>' +
							'<% _.each(args.data.metadata, function(val) { %>' +
							'<option value="<%= val.properties.uniquename %>"><%= val.colName %></option>' +
							'<% }); %>' +
						'</select>' +
					'</div>' +
				'</div>' +
				'<div class="grid_1" style="margin-top: 18px;">' +
					'<div class="filtermdx-form">' +
						'<button class="form-control add-to-exp" name="add-var" id="add-var">add</button>' +
					'</div>' +
				'</div>' +

				// '<div class="grid_5">' +
				// 	'<div class="filtermdx-form">' +
				// 		'<label for="">Ano</label>' +
				// 		'<input type="text" class="form-control" name="" id="">' +
				// 	'</div>' +
				// '</div>' +
				// '<div class="grid_1" style="margin-top: 18px;">' +
				// 	'<div class="filtermdx-form">' +
				// 		'<button class="form-control" name="" id="">add</button>' +
				// 	'</div>' +
				// '</div>' +
				// #2
				'<div class="grid_5">' +
					'<div class="filtermdx-form">' +
						'<label for="">Lista de operadores lógicos</label>' +
						'<select class="form-control" name="select-log" id="select-log">' +
							'<option value="">-- Selecione --</option>' +
							'<option value="=">Igual (=)</option>' +
							'<option value="<>">Diferente (<>)</option>' +
							'<option value=">">Maior (>)</option>' +
							'<option value="<">Menor (<)</option>' +
							'<option value=">=">Maior ou igual (>=)</option>' +
							'<option value="<=">Menor ou igual (<=)</option>' +
							'<option value="and">AND</option>' +
							'<option value="or">OR</option>' +
						'</select>' +
					'</div>' +
				'</div>' +
				'<div class="grid_1" style="margin-top: 18px;">' +
					'<div class="filtermdx-form">' +
						'<button class="form-control add-to-exp" name="add-log" id="add-log">add</button>' +
					'</div>' +
				'</div>' +

				'<div class="grid_5">' +
					'<div class="filtermdx-form">' +
						'<label for="">Digite um valor</label>' +
						'<input type="text" class="form-control" name="input-val" id="input-val">' +
					'</div>' +
				'</div>' +
				'<div class="grid_1" style="margin-top: 18px;">' +
					'<div class="filtermdx-form">' +
						'<button class="form-control add-to-exp" name="add-val" id="add-val">add</button>' +
					'</div>' +
				'</div>' +
				// #3
				'<div class="grid_12">' +
					'<div class="filtermdx-form">' +
						'<div id="editor-filtermdx"><%= args.data.mdx %></div>' +
					'</div>' +
				'</div>' +
				// #4
				'<div class="grid_12">' +
					'<p>Prévia de saída:</p>' +
				'</div>' +
			'</div>'
		)({ args: args });

        this.bind('open', function() {
       		var self = this;
        	$(self.el).parents('.ui-dialog').css({ width: '550px' });
        });

        // Maintain `this` in callbacks
		_.bindAll(this, 'start_ace');

		// create function
		_.delay(this.start_ace, 1000);

		this.split_mdx();
    },

    start_ace: function() {
		var editor = ace.edit('editor-filtermdx');
		// editor.setTheme('ace/theme/monokai');
		// editor.getSession().setMode('ace/mode/java');
    },

    logical_expression: function(event) {
       	switch (event.target.id) {
		case 'add-var':
			if (this.data.exp === '') {
				this.data.exp = '(' + $('#select-var option:selected').val() + ')' + ' ';
			}
			else {
				this.data.exp += '(' + $('#select-var option:selected').val() + ')' + ' ';	
			}
			break;
		case 'add-log':
			this.data.exp += $('#select-log option:selected').val() + ' ';
			break;
		case 'add-val':
			this.data.exp += $('#input-val').val() + ' ';
			break;
    	}

    	console.log(this.data);
    },

    split_mdx: function() {
    	this.data.mdx = this.data.mdx.split('\n');

    	console.log(this.data);
    }
});
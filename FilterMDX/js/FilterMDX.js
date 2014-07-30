var DemoModal = Modal.extend({
    type: 'filtermdx',

    // add events :)

    buttons: [
    	{ text: 'Create Filter' },
    	{ text: 'Cancel' }
    ],
    
    initialize: function(args) {
        this.options.title = 'Filter';

        this.message = _.template(
			'<div class="container_12">' +
				// #1
				'<div class="grid_11">' +
					'<div class="filtermdx-form">' +
						'<label for="">Escolha a variável para inserir na expressão</label>' +
						'<select class="form-control" name="" id="">' +
							'<% _.each(args.data.metadata, function(val) { %>' +
							'<option value="">-- Selecione --</option>' +
							'<option value=""><%= val.colName %></option>' +
							'<% }); %>' +
						'</select>' +
					'</div>' +
				'</div>' +
				'<div class="grid_1" style="margin-top: 18px;">' +
					'<div class="filtermdx-form">' +
						'<button class="form-control" name="" id="">add</button>' +
					'</div>' +
				'</div>' +
				// #2
				'<div class="grid_5">' +
					'<div class="filtermdx-form">' +
						'<label for="">Lista de operadores lógicos</label>' +
						'<select class="form-control" name="" id="">' +
							'<option value="">-- Selecione --</option>' +
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
					'<div class="filtermdx-form">' +
						'<button class="form-control" name="" id="">add</button>' +
					'</div>' +
				'</div>' +

				'<div class="grid_5">' +
					'<div class="filtermdx-form">' +
						'<label for="">Digite um valor</label>' +
						'<input type="text" class="form-control" name="" id="">' +
					'</div>' +
				'</div>' +
				'<div class="grid_1" style="margin-top: 18px;">' +
					'<div class="filtermdx-form">' +
						'<button class="form-control" name="" id="">add</button>' +
					'</div>' +
				'</div>' +
				// #3
				'<div class="grid_12">' +
					'<div class="filtermdx-form">' +
						'<div id="editor-filtermdx"></div>' +
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
    },

    start_ace: function() {
		var editor = ace.edit('editor-filtermdx');
		// editor.setTheme('ace/theme/monokai');
		// editor.getSession().setMode('ace/mode/java');
    }
});
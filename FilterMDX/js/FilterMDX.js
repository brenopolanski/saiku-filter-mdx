var FilterMDX = Modal.extend({
    type: 'filtermdx',

    events: {
    	'click .add-to-exp': 'logical_expression',
    	'click #teste': 'create_exp_filter'
    },

    buttons: [
    	{ text: 'Create Filter', method: 'create_exp_filter' },
    	{ text: 'Cancel', method: 'close' }
    ],
    
    initialize: function(args) {
        this.options.title = 'Filter';

        // set this.data with object of plugin.js
    	this.data = args.data;

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

				'<div class="grid_5">' +
					'<div class="filtermdx-form">' +
						'<label for="">Ano</label>' +
						'<input type="text" class="form-control" name="" id="">' +
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
						'<div id="editor-mdx"></div>' +
					'</div>' +
				'</div>' +
				// #4
				'<div class="grid_12">' +
					'<p>Prévia de saída:</p>' +
					'<a href="javascript:void(0)" id="teste">teste</a>' +
				'</div>' +
			'</div>'
		)({ args: args });

        this.bind('open', function() {
       		var self = this;
        	$(self.el).parents('.ui-dialog').css({ width: '550px' });
        });

        // Maintain `this` in callbacks
		_.bindAll(this, 'start_editor');

		// start editor MDX
		_.delay(this.start_editor, 1000);;

		// split expression MDX
		this.split_mdx();
    },

    start_editor: function() {
		this.editor = ace.edit('editor-mdx');
		this.editor.getSession().setMode('ace/mode/text');
    },

    logical_expression: function(event) {
       	switch (event.target.id) {
		case 'add-var':
			if (this.data.exp === '') {
				this.data.exp = '(' + this.$el.find('#select-var option:selected').val() + ')' + ' ';
				this.editor.setValue(this.data.exp);
			}
			else {
				this.data.exp += '(' + this.$el.find('#select-var option:selected').val() + ')' + ' ';	
				this.editor.setValue(this.data.exp);
			}
			break;
		case 'add-log':
			this.data.exp += this.$el.find('#select-log option:selected').val() + ' ';
			this.editor.setValue(this.data.exp);
			break;
		case 'add-val':
			this.data.exp += this.$el.find('#input-val').val() + ' ';
			this.editor.setValue(this.data.exp);
			break;
    	}
    },

    split_mdx: function() {
    	if (this.data.swap_var === 'rows') {
			this.data.mdx = this.data.mdx.split('\n');
			this.data.tplmdx = this.data.mdx[1].split('NON EMPTY ');
			this.data.tplmdx = this.data.tplmdx[1].split(' ON COLUMNS,');
			this.data.tplmdx = this.data.tplmdx[0];
		}
		else {
			this.data.mdx = this.data.mdx.split('\n');
			this.data.tplmdx = this.data.mdx[2].split('NON EMPTY ');
			this.data.tplmdx = this.data.tplmdx[1].split(' ON ROWS');
			this.data.tplmdx = this.data.tplmdx[0];
		}
    },

    create_exp_filter: function() {	
		var logExp = { logical_expression: this.editor.getValue() },
			tpl = '';

		if (this.data.swap_var === 'rows') {
	    	tpl = 'NON EMPTY FILTER(' + this.data.tplmdx + ', {logical_expression})' + ' ON COLUMNS,';
	    }
	    else {
	    	tpl = 'NON EMPTY FILTER(' + this.data.tplmdx + ', {logical_expression})' + ' ON ROWS';
	    }

		tpl = tpl.replace(/{(\w+)}/g, function(m, p) {
			return logExp[p];
		});

    	if (this.data.swap_var === 'rows') {
    		this.data.mdx[1] = tpl;
    	}
    	else {
    		this.data.mdx[2] = tpl;
    	}

    	// this.data.tplmdx = this.data.mdx[0] + ' ' + this.data.mdx[1] + ' ' + this.data.mdx[2] + ' ' + this.data.mdx[3];

    	this.data.tplmdx = '';

    	for (var i = 0, len = this.data.mdx.length; i < len; i += 1) {
    		this.data.tplmdx += this.data.mdx[i];
    	}

		console.log(this.data);
    }
});
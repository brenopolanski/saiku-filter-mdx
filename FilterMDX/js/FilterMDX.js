var DemoModal = Modal.extend({
    type: 'filtermdx',
    
    initialize: function(args) {
        this.options.title = 'Filter';

        this.message = _.template(
			'<div class="container_12">' +
				// #1
				// '<div class="grid_12">' +
				// 	'<div class="filter-tools">' +
				// 		'<nav class="filter-menu">' +
				// 			'<ul>' +
				// 				'<li>' +
				// 					'<a href="javascript:void(0);">' +
				// 						'<img src="js/saiku/plugins/Filter/image/filter-new.png" alt="">' +
				// 					'</a>' +
				// 				'</li>' +
				// 				'<li class="right">' +
				// 					'<a href="javascript:void(0);">' +
				// 						'<img src="js/saiku/plugins/Filter/image/filter-help.png" alt="">' +
				// 					'</a>' +
				// 				'</li>' +
				// 			'</ul>' +
				// 		'</nav>' +
				// 	'</div>' +
				// '</div>' +

				'<div class="clear"></div>' +

				// #2
				'<div class="grid_11">' +
					'<div class="filter-form">' +
						'<label for="">Escolha a variável para inserir na expressão</label>' +
						'<select class="form-control" name="" id="">' +
							'<% _.each(data.data.metadata, function(val) { %>' +
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
						// '<textarea class="form-control" name="" id="editor-filter" cols="30" rows="10" style="height: 150px;"></textarea>' +
						'<div id="editor-filter"></div>' +
					'</div>' +
				'</div>' +

				'<div class="clear"></div>' +

				// #5
				'<div class="grid_12">' +
					'<p>Prévia de saída:</p>' +
				'</div>' +

				'<div class="clear"></div>' +

				// #6
				// '<div class="grid_12">' +
				// 	'<div class="filter-form">' +
				// 		'<button class="" name="" id="">Ok</button>' +
				// 		'<button class="" name="" id="">Cancelar</button>' +
				// 	'</div>' +
				// '</div>' +

			'</div>'
		)({ data: args });

        this.bind('open', function() {
       		var self = this;
        	$(self.el).parents('.ui-dialog').css({ width: '550px' });
        });
    }
});
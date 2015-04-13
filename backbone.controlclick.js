/**
 * Copyright (c) 2011-2014 Felix Gnass
 * Licensed under the MIT license
 */

(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        // Register as an AMD module if available...
		    define(['jquery', 'underscore', 'backbone'], function( $, _, Backbone ) {
		      // Export global even in AMD case in case this script is loaded with
		      // others that may still expect a global Backbone.
		      root.ControlClick = factory(root, $, _, Backbone);
		    });

    } else if (typeof exports === 'object') {
        // Next for Node.js, CommonJS, browserify...
        module.exports = factory(root, require('jquery'), require('underscore'), require('backbone'));
    } else {
        // Browser globals for the unenlightened...
        factory(root, jQuery, _, Backbone);
    }
}(this, function(root, $, _, Backbone) {
  "use strict";

	/**
	 * Função responsável por construir um novo objeto do plugin
	 * @author Rhaylander Mendes
	 * @param  {Object} options Opções padrões do plugin
	 */
	var ControlClick = function(options){
		this.tplBar    = "<div id='<%= options.id %>' class='controlclick footer <% if(typeof options.cssClass != 'undefined') { %> <%= options.cssClass %> <% } %>' style='display:none;'></div>";
		this.tplButton = "<button <% if(typeof options.id != 'undefined') { %> id='<%= options.id %>' <% } %> class='btn btn-info <% if(typeof options.cssClass != 'undefined') { %> <%= options.cssClass %><% } %>'><% if(typeof options.icon != 'undefined') { %> <i class='<%= options.icon %>'></i> <% } %> <% if(typeof options.text != 'undefined') { %> <%= options.text %> <% } %></button>";
		this.data      = [];
		this.defaultOptions = {
			el 			: undefined,
			id 			: undefined,
			cssClass: undefined,
			onShow 	: undefined,
			onHide 	: undefined,
			onRender: undefined,
			/**
			 * Array de botões da barra de ação. Cada botão dever ser um objeto.
			 * Valores default de um botão
			 * @type {Array}
			 * Ex:
			 * {
			 * 		id 				: string,  	-> Propriedade ID do HTML do botão
			 * 		cssClass 	: string, 	-> Classes CSS adicionais que o usuário passar para os botões
			 * 		text			: string, 	-> Descrição do botão
			 * 		icon			: string, 	-> Classe do icone do botão
			 * 		action		: function,	-> Ação do botão
			 * 		minItems	: int, 		  -> Condição de exibição de um botão. Mínimo de items selecionados necessários para a exibição do botão
			 * 		maxItems	: int, 			-> Condição de exibição de um botão. Máximo de items selecionados permitidos para a exibição do botão
			 * 		predicate	: array 		-> Condição de exibição de um botão. Aqui o usuário poderá informar um par chave e valor que restringirá a exibição do botão. Ex: {key: "key", value: "value"}
			 * }
			 */
			buttons: []
		};
		//Inicializa o método inicial do plugin.
		this.render(options);
	};

	/**
	 * A partir deste momento o restante do plugin será contruido.
	 * @type {Object}
	 */
	ControlClick.prototype = {
		/**
		 * Construtor do plugin
		 * @type {function}
		 */
    constructor: ControlClick,
    /**
     * Método responsável por realizar as primeiras configurações do plugin
     * @author Rhaylander Mendes
     * @param  {Object} options Opções passadas pelo usuário para a personalização do plugin
     * @return {Object}
     */
    render: function(options) {
			this.options = $.extend(true, this.defaultOptions, options);
    	if(typeof this.options.onRender == "function") { this.options.onRender(); }

    	return this;
    },
    /**
     * Método responsável por criar o elemento HTML da barra de ações
     * @author Rhaylander Mendes
     * @return {Object}
     */
    createBar: function() {
    	if(_.isEmpty(this.options.id)){	this.options.id = "controlclick-" + new Date().getTime(); }
			this.elBar = '#' + this.options.id;
			var $bar   = $(_.template(this.tplBar)({options: this.options}));

    	return $bar;
    },
    /**
     * Método responsável por verificar se uma barra já foi renderizada ou não. Caso não, esta será renderizada.
     * @author Rhaylander Mendes
     * @return {Object}
     */
    renderBar: function() {
    	if ( $(this.elBar).length == 0 ) { this.options.el.append(this.createBar()); }
    	else { $(this.elBar).empty(); }

    	return this;
    },
    /**
     * Método responsável por retornar a barra de ações do plugin
     * @author Rhaylander Mendes
     * @return {Object}
     */
    getBar: function() {
    	return $(this.elBar);
    },
    /**
     * Método responsável por remover a barra de ações
     * @author Rhaylander Mendes
     * @return {Object}
     */
    removeBar: function() {
    	$(this.elBar).remove();

    	return this;
    },
    /**
     * Método responsável por atualizar/adicionar novas propriedades à barra de ações
     * @author Rhaylander Mendes
     * @param  {string} prop  Nome da propriedade
     * @param  {string} value Valor da propriedade
     * @return {Object}
     */
    setProp: function(prop, value) {
    	if($(this.elBar).length > 0){
    		$(this.elBar).prop(prop, value);
    	}

    	return this;
    },
    /**
     * Método responsável por alterar a propriedade do elemento HTML da barra de ações
     * @author Rhaylander Mendes
     * @param  {string} id Novo ID
     * @return {Object}
     */
    setId: function(id) {
			this.options.id = id;
			this.elBar = '#' + this.options.id;
			this.setProp('id', this.options.id);

      return this;
    },
    /**
     * Método responsável por retornar a propriedade ID da barra de ações
     * @author Rhaylander Mendes
     * @return {string}
     */
    getId: function() {
      return this.options.id;
    },
    /**
     * Método responsável por adicionar uma nova classe CSS à barra de ações
     * @author Rhaylander Mendes
     * @param  {string} cssClass Nova classe a ser adicionada
     * @return {Object}
     */
    addCssClass: function(cssClass) {
    	if(!_.isEmpty(cssClass)) {
    		this.options.cssClass += " " + cssClass;
    		this.setProp('class', this.options.cssClass);
    	}

    	return this;
    },
    /**
     * Método responsável por atualizar as classes CSS da barra de ações
     * @author Rhaylander Mendes
     * @param  {string} cssClass Classes CSS da barra de ações
     * @return {Object}
     */
    setCssClass: function(cssClasses) {
    	this.options.cssClass = cssClass;
    	this.setProp('class', this.options.cssClass);

    	return this;
    },
    /**
     * Método responsável por retornar as classes CSS da barra de ações
     * @author Rhaylander Mendes
     * @return {string}
     */
    getCssClass: function() {
    	return this.options.cssClass;
    },
    /**
     * Método responsável por atualizar toda a coletânea de itens que estão dentro do plugin
     * @author Rhaylander Mendes
     * @param  {array} data Novos itens
     * @return {Object}
     */
    setData: function(data) {
    	if(_.isArray(data)) {
        this.data = data;
        this.workflowDisplay();
      }

      return this;
    },
    /**
     * Método responsável por retornar toda a coletânea de itens que estão dentro do plugin
     * @author Rhaylander Mendes
     * @return {array}
     */
    getData: function() {
      return this.data;
    },
    /**
     * Método responsável por adicionar um novo item ao plugin
     * @author Rhaylander Mendes
     * @param  {Object} item Item a ser adicionado
     * @return {Object}
     */
    addItem: function(newItem) {
    	var find = _.find(this.data, function(item){ return _.isEqual(item, newItem); });

    	if( _.isUndefined(find) ) {
    		this.data.push(newItem);
    		this.workflowDisplay();
    	}

    	return this;
    },

    /**
     * Método responsável por retornar o primeiro item da coletânea de itens do plugin
     * @author Rhaylander Mendes
     * @return {mixed}
     */
    getFirstItem: function() {
    	if(typeof this.data[0] != "undefined") { return this.data[0]; }

    	return null;
    },
    /**
     * Método responsável por procurar um item na coletânea de dados do plugin e retorna o primeiro que foi encontrado. Caso não seja encontrado nenhum item, é retornado nulo para o usuário.
     * @author Rhaylander Mendes
     * @param  {string} key   Chave a ser procurada
     * @param  {string} value Valor da chave que está sendo procurada
     * @return {mixed}
     */
    findItem: function(key, value) {
    	if(!_.isEmpty(key) && !_.isEmpty(value)) {
    		var items = this.findItems(key, value);
    		return items[0];
    	}
    	return null;
    },
    /**
     * Método responsável por procurar todos os itens da coletânea de itens do plugin que atendam ao par chave-valor passado.
     * @author Rhaylander Mendes
     * @param  {string} key   Chave a ser procurada
     * @param  {string} value Valor da chave que está sendo procurada
     * @return {array}
     */
    findItems: function(key, value) {
    	var items = [];
    	if(!_.isEmpty(key) && !_.isEmpty(value)) {
    		_.each(this.data, function(item, index){
    			if(!_.isEmpty(item[key]) && item[key] == value) {
    				items.push(item);
    			}
    		});
    	}
    	return items;
    },
    /**
     * Método responsável por remover um item da coletânea de itens do plugin. Para realizar esta operação, é passado um objeto (que é justamente o item a ser removido) e o plugin procura por objetos idênticos a esse, removendo-os.
     * Obs: Caso tenha itens duplicados, todos serão removidos
     * @author Rhaylander Mendes
     * @param  {Object} itemToRemove Objeto a ser removido
     * @return {Object}
     */
    removeItem: function(itemToRemove) {
    	this.data = _.reject(this.data, function(item){ return _.isEqual(item, itemToRemove); });
    	this.workflowDisplay();

    	return this;
    },
    /**
     * Método responsável por remover limpar a coletânea de itens do plugin
     * @author Rhaylander Mendes
     * @return {Object}
     */
    clearItems: function() {
    	this.data = [];

    	// Descelecionando os items selecionados da barra.
	    $('.selected').click();

    	return this;
    },
    /**
     * Método responsável por criar o objeto HTML do botão e atribui os seus eventos padrões.
     * @author Rhaylander Mendes
     * @param  {Object} options Opções de atributos do botão a ser criado
     * @return {Object}
     */
    createButton: function(options) {
    	var $button = $(_.template(this.tplButton)({options: options}));
    	if(typeof options.action != "undefined") { $button.on('click', options.action); }

    	return $button;
    },
    /**
     * Método responsável por adicionar um novo botão para a barra de ações. Ser for passado o segundo parâmetro, o novo botão ocupará a posição passada.
     * @author Rhaylander Mendes
     * @param  {Object} button 	Dados do botão
     * @param  {int} 		index 	Índice da posição do novo botão
     * @return {Object}
     */
    addButton: function(button, index) {
    	if( !_.isEmpty(button ) ) {
      	if ( !_.isEmpty(index) || !$.isNumeric(index) ){ this.options.buttons.push(button); }
      	else if ( parseInt(index) <= 0 ) { this.options.buttons.unshift(button); }
      	else {
					var self    = this;
					var buttons = self.options.buttons;
      		self.options.buttons = [];
      		_.each(buttons, function(b, i){
      			if( i == parseInt(index) ){ self.options.buttons.push(button); }
      			self.options.buttons.push(b);
      		});
      	}
        this.workflowDisplay();
      }

      return this;
    },
    /**
     * Método responsável por adicionar vários botões, passando um array de botões.
     * @author Rhaylander Mendes
     * @param  {array} buttons Array contendo objetos de botões. Ex: [button1, button2]
     * @return {Object}
     */
    addButtons: function(buttons) {
      var self = this;

      _.each(buttons, function(button, index) {
      	self.options.buttons.push(button);
      });
      self.workflowDisplay();

      return this;
    },
    /**
     * Método responsável por atualizar um botão a partir de seu index
     * @author Rhaylander Mendes
     * @param  {int} 		index  Índice do botão
     * @param  {Object} button Novos dados do botão
     * @return {Object}
     */
    setButton: function(index, button) {
    	if(typeof this.options.buttons[index] != "undefined") {
    		this.options.buttons[index] = button;
    		this.workflowDisplay();
    	}

    	return this;
    },
    /**
     * Método responsável por atualizar todos os botões do plugin, ou seja, todos os botões existentes atualmente serão perdidos
     * @author Rhaylander Mendes
     * @param  {array} buttons Array de botões, sendo cada botão um objeto. Ex: [button1, button2]
     */
    setButtons: function(buttons) {
      this.options.buttons = [];
      this.addButtons(buttons);

      return this;
    },
    /**
     * Método responsável por retornar um butão a partir de seu ID. Caso ele não seja encontrado, é retornado nulo para o usuário.
     * Obs: Aqui não só é retornado o botão, mas também seu índice.
     * @author Rhaylander Mendes
     * @param  {string} id ID do botão
     * @return {mixed}
     */
    getButton: function(id) {
    	if(!_.isEmpty(id)) {
    		_.each(this.options.buttons, function(button, index) {
    			if(button.id == id){
    				return { index: index, content: button };
    			}
    		});
    	}
      return null;
    },
    /**
     * Método responsável por retornar todos os botões adicionados ao plugin
     * @author Rhaylander Mendes
     * @return {array}
     */
    getButtons: function() {
      return this.options.buttons;
    },
    /**
     * Método responsável por remover um botão a partir de seu ID.
     * @author Rhaylander Mendes
     * @param  {string} id ID do botão
     * @return {Object}
     */
    removeButton: function(id) {
    	this.options.buttons = _.reject(this.options.buttons, function(button){ return button.id == id; });
    	this.workflowDisplay();

    	return this;
    },
    /**
     * Método responsável por remover todos os botões do plugin
     * @author Rhaylander Mendes
     * @return {Object}
     */
    clearButtons: function() {
			this.options.buttons = [];

			return this;
    },
    /**
     * Método responsável por toda a mágica do plugin. Aqui é aplicado os filtros individuais de cada botão, definindo assim se um botão deverá ou não ser exibido.
     * @author Rhaylander Mendes
     * @return {[type]} [description]
     */
    workflowDisplay: function() {
    	var self = this;

    	// Verifica se a barra já está construida no HTMls
    	self.renderBar();

    	// Armazena o número de itens existentes na coletânea de itens do plugin
			var length = self.data.length;

			// Percorre os botões aplicando a eles os filtros de exibição
    	_.each(self.options.buttons, function(button, index){
    		// Aplica o filtro de quantidade de itens mínimos ou máximos para a exibição de um botão
    		if( (typeof button.minItems === 'undefined' || length >= button.minItems)
    			&& (typeof button.maxItems === 'undefined' || length <= button.maxItems) ){
    			// Aplica o filtro de predicado do botão.
    			// Caso este possua este filtro, aplica-o. Caso contrário, apenas renderiza o botão.
    			if(!_.isEmpty(button.predicate) && _.isArray(button.predicate)) {
    				var rest = self.data;
    				// Remove os itens que atendam à condição do predicado
    				_.each(button.predicate, function(predicate, index){
    					rest = _.reject(rest, function(item) { return item[predicate.key] == predicate.value; });
    				});
    				// Verifica se o número de itens restantes é igual a 0, o que indica que todos os itens atenderam a condição e então o botão é renderizado.
      			if(rest.length == 0) { $(self.elBar).append(self.createButton(button)); }
    			}
    			else { $(self.elBar).append(self.createButton(button)); }
    		}
    	});

			//Verifica se algum botão foi renderizado, exibindo ou não a barra
    	if( $(self.elBar).children().length > 0 ) { self.show(); }
    	else { self.hide(); }

    	return this;
    },
    /**
     * Método responsável por exibir a barra de ações.
     * @author Rhaylander Mendes
     * @return {Object}
     */
    show: function() {
    	if(typeof this.options.onShow != "function") { this.options.onShow = undefined; }
    	$(this.elBar).slideDown('fast', this.options.onShow);

    	return this;
    },
    /**
     * Método responsável por ocultar a barra de ações
     * @author Rhaylander Mendes
     * @return {Object}
     */
    hide: function() {
    	if(typeof this.options.onHide != "function") { this.options.onHide = undefined; }
    	$(this.elBar).slideUp('fast', this.options.onHide);

    	return this;
    },
    /**
     * Método responsável por atualizar a função que é executada quando a barra é renderizada
     * @author Rhaylander Mendes
     * @param  {Object} onRender
     */
    setOnRender: function(onRender) {
      this.options.onRender = onRender;

      return this;
    },
    /**
     * Método responsável por atualizar a função que é executada quando a barra é exibida
     * @author Rhaylander Mendes
     * @param  {Object} onShow
     */
    setOnShow: function(onShow) {
      this.options.onShow = onShow;

      return this;
    },
    /**
     * Método responsável por atualizar a função que é executada quando a barra é ocultada
     * @author Rhaylander Mendes
     * @param  {Object} onHide
     */
    setOnHide: function(onHide) {
      this.options.onHide = onHide;

      return this;
    },
    /**
     * Método responsável por resetar a barra de ações
     * @author Rhaylander Mendes
     * @return {Object}
     */
    reset: function() {
    	this.clearItems();
    	this.clearButtons();

			this.options = {
				el 			: undefined,
				id 			: undefined,
				cssClass: undefined,
				onShow 	: undefined,
				onHide 	: undefined,
				onRender: undefined
			}

			return this;
    },
    /**
     * Método responsável por destruir a barra de ações
     * @author Rhaylander Mendes
     * @return {Object}
     */
    destroy: function() {
			this.removeBar();
			this.reset();

			return this;
    }
  };

	return window.ControlClick = ControlClick;
}))
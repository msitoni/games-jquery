'use strict';
$(document).ready(function () {

	var jsonCallback = function (data) {
		var carrinho = {"subtotal": 0, "frete": 0,"total": 0, "games": [] }, id = null, _this = this;
		data = sortByOrder(data, "score", 'desc'); 
		montarGridHtmlLoja(data);				
		
		function addCarrinho(id) {			
			var altura = 0;
			var obj =  _.find(data, function(game) { 
				return game.id == id;
			});	
			carrinho.games.push(obj);
			if(carrinho.games.length === 1) {
				$(".box-data-carrinho").empty();
				$(`<div class="lista-itens"></div>`).appendTo(".box-data-carrinho");
				$(`<div class="totalizadores-itens"></div>`).appendTo(".box-data-carrinho");
				mostarTotalizadores(carrinho);
			} else {
				altura = $(".box-pay").height();
				altura = altura + 63;
				$(".box-pay").height(altura);
			}
			atualizarTotalizadores();
			addGameGrid(obj);
			totalItensCarrinho();

		};
		function atualizarTotalizadores() {
			carrinho.subtotal = calcularSubTotal();
			carrinho.frete = calcularFrete();
			carrinho.total = calcularTotal();
			$(".valor-subtotal").text(`R$ ${usTObr(carrinho.subtotal)}`);
			$(".valor-frete").text(`R$ ${usTObr(carrinho.frete)}`);
			$(".valor-total").text(`R$ ${usTObr(carrinho.total)}`);			
		}

		function removeCarrinho(vId){
			var html = '', altura = 0;
			var games = _.filter(carrinho.games,  
                function(item){  
                    return item.id != parseInt(vId); 
            }); 
			carrinho.games  = games;
			atualizarTotalizadores();
			totalItensCarrinho();
			if(carrinho.games.length === 0) {
				$(".box-data-carrinho").empty();
				html += `<div class="box-carrinho">`;
                html += `<img class="image-add-carrinho" src="images/cart-icon.svg">`;
                html += `</div>`;
				html += `<div class="subscript-carrinho">Até o momento,<br>o seu carrinho está vazio</div>`;
				$(".box-data-carrinho").append(html);
			}
			altura = $(".box-pay").height();
			altura = altura - 63;

			if(altura < 325) {
				$(".box-pay").height(325);
			} else {
				$(".box-pay").height(altura);
			}
		};

		function totalItensCarrinho() {
			if(carrinho.games.length > 0) {
				$(".total-itens").text(` (${carrinho.games.length} itens)`);			
			} else {
				$(".total-itens").text('');
			}
		};

	
		function sortByOrder(obj, prop, order) {
			if (String(order) === "desc") {
				return _.sortBy(obj, prop).reverse();
			} else if (String(order) === "asc") {
				return _.sortBy(obj, prop);
			} else {
				return obj;
			}
		};				

		function calcularSubTotal() {
			var subTotal = 0;
			for(var x = 0; x < carrinho.games.length; x++) {
				subTotal += carrinho.games[x].price; 
			}
			return subTotal;
		};

		function calcularFrete() {
			var frete = 0;
			return frete = carrinho.subtotal < 250 ?  10 * carrinho.games.length : 0;
		};

		function calcularTotal() {
			return carrinho.frete + carrinho.subtotal;
		};

		$(".games-order").change(function(){
			var prop = $("option:selected", this).val();
			var order = $("option:selected",this).attr("data-order");
			data = sortByOrder(data, prop, order);
			montarGridHtmlLoja(data);										
		});

		$(document).on("click", ".remover-game", function () {
			var el = $(this).attr("data-id");
			$("#"+el).remove();
			removeCarrinho(el);
			atualizarTotalizadores();
			totalItensCarrinho();
		});

		function brTOus(number) {
			!number ? number = "0,00" : number = number;
			if (number.toString().indexOf(',') == -1) {
				return parseFloat(number);
			} else {
				value = parseFloat(number.replace(/[.]/g, "").replace(",", "."));
				return value;
			}
		};
	
	
		function usTObr(n) {
			n = parseFloat(n);
			if (!n) {
				n = 0;
			}
			return parseFloat(n).toFixed(2).replace('.', ',').replace(/(\d)(?=(\d{3})+\,)/g, "$1.");
		};
	
		function montarGridHtmlLoja(data) {
			$(".product-list").empty();			
			var html = '',  row = 0;
			for(var x = 0; x < data.length; x++) {
				if(x%3 === 0) {	
					row++;
					$(`<div class='div-row' id="row-${row}"></div>`).appendTo(".product-list");				
				}			
				html += `<div class='div-column'>`;
				html += 	`<div class='div-image-game' data-id = "${data[x].id}"><img class='image-game' src='images/${data[x].image}'></div>`;
				html += 	`<div class='div-data-game'>`;
				html += 	`<div class='div-name-game'>${data[x].name}</div>`;
				html += 	`<div class='div-price-game'>R$ ${usTObr(data[x].price)}</div>`;
				html += 	`</div>`;
				html += `</div>`;			
				$(`#row-${row}`).append(html);
				html = '';			
			}

			$(".div-image-game").mouseover(function() {
				t = $(this).parent().children().next().html();
				$(this).parent().children().next().html("<div class='add-carrinho'>Adicionar ao carrinho</div>");
			}).mouseout(function() {
				$(this).parent().children().next().html(t);
			}).click(function(){
				id = $(this).attr("data-id");
				addCarrinho(id);
			});
		};
	
	
		function mostarTotalizadores(carrinho) {
			var html = '';		
			html +='<div>';
			html +='<section class="grid-total">';
	
			html +='<div class="row-totalizadores subtotal">';
			html +='<div class="desc-subtotal desc-totalizador">Subtotal</div>';
			html +=`<div class="valor-subtotal valores-totalizador"></div>`;
			html +='</div>';
	
	
			html +='<div class="row-totalizadores frete">';
			html +='<div class="desc-frete desc-totalizador">Frete</div>';
			html +=`<div class="valor-frete valores-totalizador"></div>`;
			html +='</div>';
	
			html +='<div class="row-totalizadores total">';		
			html +='<div class="desc-total desc-totalizador">Total</div>';
			html +=`<div class="valor-total"></div>`;
			html +='</div>';
	
			html +='</section>';
			html +='<div class="botao-finalizar-compra">';
			html += "<button class='finalizar-compra'>Finalizar Compra</button>";		
			html +='</div>';
			html +='</div>';
			$('.totalizadores-itens').append(html);		
		};
	
		function addGameGrid(obj){
			var html = '';				
			html +=	`<div class="item" id="${obj.id}">`;
			html +=		`<div class = "leftbox">`;
			html +=			`<div class="item-img"><img class='image-game-thumb' src="images/${obj.image}" ></div>`;
			html +=		`</div>`;
			html +=		`<div class = "rightbox">`;
			html +=			`<div class = "rightbox1">`;
			html +=				`<div class="item-desc">${obj.name}</div>`;  
			html +=			`<div>`;
			html +=  		`<div class = "rightbox2">`;
			html +=				`<div class="item-valor">R$ ${usTObr(obj.price)}</div>`;
			html +=			`</div>`;
			html +=		`</div>`;
			html +=		`<div class= "rightbox3">`;
			html +=			`<div class="remover-game" data-id="${obj.id}">x</div>`;
			html +=		`</div>`;
	
			html +=`</div>`;                        
			$(".lista-itens").append(html);				
		};
	};
    
		var url =   "http://www.mocky.io/v2/5d3c78a23200002019afcfd4";
		var t = '';	
		$.ajax({            
			type: 'GET',
			url: url,			
			dataType: 'jsonp',
			contentType: 'application/json'
		}).done(jsonCallback)
			.fail(function (xhr) {
				alert("error" + xhr.responseText);
		});			
});

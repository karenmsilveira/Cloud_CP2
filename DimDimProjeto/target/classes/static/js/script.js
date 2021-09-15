function salvarCliente(){
	var nome = $("#nome").val();
	var dtNasc = $("#dtNasc").val();
	var cpf = $("#cpf").val();
	var senha = $("#senha").val();
	
	
	
	var formData = { 
		'nome' 			: nome,
		'dtNasc' 		: dtNasc,
		'cpf' 			: cpf,
		'senha' 		: senha
		
	 };
	 console.log(formData);
	$.ajax({
		type		    : 'POST',
		url				: '/api/cadastro/',
		contentType   	: 'application/json',
		data		    : JSON.stringify(formData),
		dataType	    : 'json',
		encode		: true,
		success: function(data) {
			if(data.erro){
				alerta(data.message);
			}else{

				try{
					window.location = "/";
				}catch(e){
					alertaSucess(data.message,"");
				}


			}
		},
		error: function(result) {
			alerta(result.responseJSON.message);
		}
	});
	return false;
}

function formataValor(){
	var vl = $("#valorPagamento").html();
	var vl2 = formatReal(parseFloat(vl));
	$("#valorPagamento").html(vl2);
}
function mostraDisponiveis(){

	$(".valorNumPendentes").hide();
	$(".valorNumAtivos").hide();

	$(".valorNum").show();
}

$(document).ready(function(){
	var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
	var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
	  return new bootstrap.Tooltip(tooltipTriggerEl)
	})

	$("#formCompra").submit(function(e){
		e.preventDefault();
		var nome = $("#nome").val();
		var email = $("#email").val();
		var cpf = $("#cpf").val();
		cpf = cpf.replace(".","");
		cpf = cpf.replace("-","");
		cpf = cpf.replace("/","");
		
		
		var cpfValido = validaCpf(cpf);
		
		if(!cpfValido){
			alerta("CPF INVÁLIDO");
			return false;
		}
		
		var telefone = $("#telefone").val();
		var dtNasc = $("#dtNasc").val();
	
		var rifa = $("#rifa").val();
	
		if(numerosEscolhidos.length == 0){
			alerta("Nenhum número selecionado");
			return false;
		}
		
		var dataHoje = new Date();
		dataHoje.setFullYear( dataHoje.getFullYear() - 18 );
		var dataExp = dtNasc.split("-");
		
		var dataEscolhida = new Date(dataExp[0],dataExp[1]-1,dataExp[2]);
		
		console.log(dataHoje);
		console.log(dataEscolhida);
		
		if(dataHoje <= dataEscolhida){
			alerta("Permitido só para maior de 18 anos");
			return false;
		}
		
		var numerosEnvia = [];
		for(var i =0; i<numerosEscolhidos.length; i++){
	
			var arrayN = {"numero":numerosEscolhidos[i]};
			numerosEnvia.push(arrayN);
	
		}
		
		var formData = { 
			'nome' : nome,
			'email' : email,
			'cpf' : cpf,
			'telefone' : telefone,
			'dtNasc':dtNasc,
			'numerosEscolhidos' : JSON.stringify(numerosEnvia),
			'rifa' : rifa
		 };
		$.ajax({
			type		    : 'POST',
			url				: '/api/gerarPedido',
			contentType   	: 'application/json',
			data		    : JSON.stringify(formData),
			dataType	    : 'json',
			encode			: true,
			success: function(data) {
				window.location = "/pagamento/"+data.idPedido;
			},
			error: function(data) {
				console.log("erro");
				console.log(data);
				
			}
		});
		return false;
		
	
	})
});
var numerosEscolhidos = [];
function validaCpf(cpf){
    cpf = cpf.replace(/\D/g, '');
    if(cpf.toString().length != 11 || /^(\d)\1{10}$/.test(cpf)) return false;
    var result = true;
    [9,10].forEach(function(j){
        var soma = 0, r;
        cpf.split(/(?=)/).splice(0,j).forEach(function(e, i){
            soma += parseInt(e) * ((j+2)-(i+1));
        });
        r = soma % 11;
        r = (r <2)?0:11-r;
        if(r != cpf.substring(j, j+1)) result = false;
    });
    return result;
}


function selecionarNumero(obj){

	var numero = $(obj).data("valor");
	var continua = true;
	
	for(var i =0; i<numerosEscolhidos.length; i++){
	
		if(numero == numerosEscolhidos[i]){
			continua = false;
			break;
		}
	
	}
	
	var classe = $(obj).attr("class");
	if(continua && classe == "valorNum"){
		$(obj).removeClass("valorNum");
		$(obj).addClass("valorNumEscolhido");
		numerosEscolhidos.push(numero);
		var idRifa = $("#rifa").val();
		
		var divVai = "";
		
		for(var i =0; i<numerosEscolhidos.length; i++){
			divVai += "<div class='numeroSelecionado'>"+numerosEscolhidos[i]+"</div>";
		}
		$(".conteudoFinalizar").html(divVai);
		$(".conteudoEscondido").show();
	}else if(classe == "valorNumEscolhido"){
		$(obj).removeClass("valorNumEscolhido");
		$(obj).addClass("valorNum");
		var novoArray = [];
		for(var i =0; i<numerosEscolhidos.length; i++){
			if(numero != numerosEscolhidos[i]){
				novoArray.push(numerosEscolhidos[i]);
			}
		}
		numerosEscolhidos = novoArray;
		var divVai = "";
		
		for(var i =0; i<numerosEscolhidos.length; i++){
			divVai += "<div class='numeroSelecionado'>"+numerosEscolhidos[i]+"</div>";
		}
		$(".conteudoFinalizar").html(divVai);
		$(".conteudoEscondido").show();
	}
	
}
function abreModal(){
	var divVai = "";
		
	for(var i =0; i<numerosEscolhidos.length; i++){
		divVai += "<div class='numeroPagamento'>"+numerosEscolhidos[i]+"</div>";
	}
	$(".numeroSelecionado8").html(divVai);
	var valorNumRifa =  $("#valorNumRifa").val();

	$("#valorTotal").html(formatReal(numerosEscolhidos.length*valorNumRifa));

	$('.modal').show();
	$('.conteudoEscondido').hide();
}
function fechaModal(){

	 $('.modal').hide();
	 $('.conteudoEscondido').show();
}
function fechaSpan(){
	$('.conteudoEscondido').hide();

}

function teste(){
	alert("testes");
}

function adicionarUsuario(tokenNavigation){
	var dtNacimento = $("#dtNacimento").val();
	var email = $("#email").val();
	var cpf = $("#cpf").val();
	var nome = $("#nome").val();
	var itensPorPagina = $("#itensPorPagina").val();
	
	var token = JSON.parse(getCookie("token"));
	
	var formData = { 
		'dtNacimento' : dtNacimento,
		'email' : email,
		'cpf' : cpf,
		'nome' : nome,
		'itensPorPagina':itensPorPagina
	 };
	$.ajax({
		type		    : 'POST',
		url				: '/api/salvarUsuario/'+tokenNavigation,
		contentType   	: 'application/json',
		data		    : JSON.stringify(formData),
		dataType	    : 'json',
		beforeSend: function (xhr) { xhr.setRequestHeader('Authorization', token.tipo + " " + token.token); },
		encode		: true,
		success: function(data) {
			if(data.erro){
				alerta(data.message);
			}else{

				try{
					if(data.usuario.tokenNavigation != undefined){
						alertaSucess(data.message,"/paginas/editar/usuario/"+data.usuario.tokenNavigation);
					}
				}catch(e){
					alertaSucess(data.message,"");
				}


			}
		},
		error: function(result) {
			alerta(result.responseJSON.message);
		}
	});
	return false;
}

function buscarBilhetes(){
	var nrCpf = $("#nrCpf").val();
	
	var formData = { 
		'nrCpf' 	   : nrCpf
	 };
	$.ajax({
		type		    : 'POST',
		url				: '/api/buscarBilhetes',
		contentType   	: 'application/json',
		data		    : JSON.stringify(formData),
		dataType	    : 'json',
		encode			: true,
		success: function(data) {
			setBilhetes(data);
		},
		error: function(result) {
			console.log(result);
			alerta(result.responseJSON.erro);
		}
	});
	return false;
}

function adicionarRifa(tokenNavigation){
	var produto = $("#produto").val();
	var valorRifa = $("#valorRifa").val();
	var rangeIniRifa = $("#rangeIniRifa").val();
	var rangeFinRifa = $("#rangeFinRifa").val();
	var dataInicio = $("#dataInicio").val();
	var dataFinal = $("#dataFinal").val();
	
	var token = JSON.parse(getCookie("token"));
	
	var formData = { 
		'produto' 	   : produto,
		'valorRifa'    : valorRifa,
		'rangeIniRifa' : rangeIniRifa,
		'rangeFinRifa' : rangeFinRifa,
		'dataInicio'   : dataInicio,
		'dataFinal'    : dataFinal,
		
	 };
	$.ajax({
		type		    : 'POST',
		url				: '/api/salvarRifa/'+tokenNavigation,
		contentType   	: 'application/json',
		data		    : JSON.stringify(formData),
		dataType	    : 'json',
		beforeSend: function (xhr) { xhr.setRequestHeader('Authorization', token.tipo + " " + token.token); },
		encode		: true,
		success: function(data) {
			if(data.erro){
				alerta(data.message);
			}else{

				try{
					window.location = "/paginas/listarifas";
				}catch(e){
					alertaSucess(data.message,"");
				}


			}
		},
		error: function(result) {
			alerta(result.responseJSON.message);
		}
	});
	return false;
}
function editarPedido(tokenNavigation, tokenEditar){
	var status = $("#status").val();
	
	
	
	
	var token = JSON.parse(getCookie("token"));
	
	
	
	var formData = { 
	
		'status' 	   : status
		
		
	 };
	 
	$.ajax({
		type		    : 'POST',
		url				: '/api/editarPedido/'+tokenNavigation,
		contentType   	: 'application/json',
		data		    : JSON.stringify(formData),
		dataType	    : 'json',
		beforeSend: function (xhr) { xhr.setRequestHeader('Authorization', token.tipo + " " + token.token); xhr.setRequestHeader('AccessKey', tokenEditar); },
		encode		: true,
		success: function(data) {
			if(data.erro){
				alerta(data.message);
			}else{

				alertaSucess(data.message,"");


			}
		},
		error: function(result) {
			alerta(result.responseJSON.message);
		}
	});
	return false;
}

function editarRifa(tokenNavigation, tokenEditar){
	var produto = $("#produto").val();
	var valorRifa = $("#valorRifa").val();
	var rangeIniRifa = $("#rangeIniRifa").val();
	var rangeFinRifa = $("#rangeFinRifa").val();
	var dataInicio = $("#dataInicio").val();
	var dataFinal = $("#dataFinal").val();
	
	
	
	var token = JSON.parse(getCookie("token"));
	
	
	
	var formData = { 
	
		'produto' 	   : produto,
		'valorRifa'    : valorRifa,
		'rangeIniRifa' : rangeIniRifa,
		'rangeFinRifa' : rangeFinRifa,
		'dataInicio'   : dataInicio,
		'dataFinal'    : dataFinal,
		
	 };
	 
	$.ajax({
		type		    : 'POST',
		url				: '/api/editarRifa/'+tokenNavigation,
		contentType   	: 'application/json',
		data		    : JSON.stringify(formData),
		dataType	    : 'json',
		beforeSend: function (xhr) { xhr.setRequestHeader('Authorization', token.tipo + " " + token.token); xhr.setRequestHeader('AccessKey', tokenEditar); },
		encode		: true,
		success: function(data) {
			if(data.erro){
				alerta(data.message);
			}else{

				try{
					window.location = "/paginas/listarifas";
				}catch(e){
					alertaSucess(data.message,"");
				}


			}
		},
		error: function(result) {
			alerta(result.responseJSON.message);
		}
	});
	return false;
}

function editarProduto(tokenNavigation,tokenEditar){
	var nomeProd = $("#nomeProd").val();
	var valorProd = $("#valorProd").val();
	var linkYT = $("#linkYT").val();
	var dataInsercao = $("#dataInsercao").val();
	var descProd = $("#descProd").val();
	var bannerProduto = $("#bannerProduto").val();
	var imgProduto = $("#imgProduto").val();
	
	var token = JSON.parse(getCookie("token"));
	
	var formData = { 
		'nomeProd' 		: nomeProd,
		'valorProd' 	: valorProd,
		'linkYT' 		: linkYT,
		'dataInsercao' 	: dataInsercao,
		'descProd'		: descProd,
		'bannerProduto' : bannerProduto,
		'imgProduto'	: imgProduto
	 };
	$.ajax({
		type		    : 'POST',
		url				: '/api/editarProduto/'+tokenNavigation,
		contentType   	: 'application/json',
		data		    : JSON.stringify(formData),
		dataType	    : 'json',
		beforeSend: function (xhr) { xhr.setRequestHeader('Authorization', token.tipo + " " + token.token); xhr.setRequestHeader('AccessKey', tokenEditar); },
		encode		: true,
		success: function(data) {
			if(data.erro){
				alerta(data.message);
			}else{

				try{
					window.location = "/paginas/produtos";
				}catch(e){
					alertaSucess(data.message,"");
				}


			}
		},
		error: function(result) {
			alerta(result.responseJSON.message);
		}
	});
	return false;
}


function adicionarProduto(tokenNavigation){
	var nomeProd = $("#nomeProd").val();
	var valorProd = $("#valorProd").val();
	var linkYT = $("#linkYT").val();
	var dataInsercao = $("#dataInsercao").val();
	var descProd = $("#descProd").val();
	var bannerProduto = $("#bannerProd").val();
	var imgProduto = $("#imgProd").val();
	
	var token = JSON.parse(getCookie("token"));
	
	var formData = { 
		'nomeProd' 		: nomeProd,
		'valorProd' 	: valorProd,
		'linkYT' 		: linkYT,
		'dataInsercao' 	: dataInsercao,
		'descProd'		: descProd,
		'bannerProduto' : bannerProduto,
		'imgProduto'	: imgProduto
	 };
	 console.log(formData);
	$.ajax({
		type		    : 'POST',
		url				: '/api/salvarProduto/'+tokenNavigation,
		contentType   	: 'application/json',
		data		    : JSON.stringify(formData),
		dataType	    : 'json',
		beforeSend: function (xhr) { xhr.setRequestHeader('Authorization', token.tipo + " " + token.token); },
		encode		: true,
		success: function(data) {
			if(data.erro){
				alerta(data.message);
			}else{

				try{
					window.location = "/paginas/produtos";
				}catch(e){
					alertaSucess(data.message,"");
				}


			}
		},
		error: function(result) {
			alerta(result.responseJSON.message);
		}
	});
	return false;
}

function formatarCpf(){
	$(".cpf").each(function() {
		$("#maskField").val($(this).text());
		$("#maskField").mask("999.999.999-99");
	    $(this).text($("#maskField").val())
	    $("#maskField").val("")
	});
}
function formatarCnpjCepMatriz(){
	console.log("formatando dados");
	$(".cnpj").each(function() {
		$("#maskField").val($(this).text());
		$("#maskField").mask("99.999.999/9999-99");
	    $(this).text($("#maskField").val())
	    $("#maskField").val("")
	});
	
	$(".cep").each(function() {
		$("#maskField").val($(this).text());
		$("#maskField").mask("99999-999");
	    $(this).text($("#maskField").val())
	    $("#maskField").val("")
	});
}
function adicionarMatriz(accessToken){
	var token = JSON.parse(getCookie("token"));
	var value = $("#listaEstado").val();
	var option = $("#estado").find("[value='" + value + "']");
	var idEstado = option.data("id");
	
	value = $("#listaCidade").val();
	option = $("#cidade").find("[value='" + value + "']");
	
	var idCidade = option.data("id");
	var razao = $("#razao").val();
	var cnpj = $("#cnpj").val();
	var bairro = $("#bairro").val();
	var endereco = $("#endereco").val();
	var cep = $("#cep").val();
	var numero = $("#numero").val();
	var complemento = $("#complemento").val();
	
	var formData = { 
		'idEstado' : idEstado,
		'idCidade' : idCidade,
		'nome' : razao,
		'cnpj' : cnpj,
		'cep':cep,
		'bairro' : bairro,
		'endereco' : endereco,
		'numero' : numero,
		'complemento' : complemento
	 };
	console.log(formData);
	$.ajax({
		type		    : 'POST',
		url				: '/api/salvarEstrutura',
		contentType   	: 'application/json',
		data		    : JSON.stringify(formData),
		dataType	    : 'json',
		beforeSend: function (xhr) { xhr.setRequestHeader('Authorization', token.tipo + " " + token.token); xhr.setRequestHeader('AccessKey', accessToken); },
		encode		: true,
		success: function(data) {
			if(data.erro){
				alerta(data.message);
			}else{
				alertaSucess(data.message,"paginas/matriz");
			}
		},
		error: function(result) {
			alerta(result.responseJSON.message);
		}
	});
	return false;
}



function getCookie(cname) {
  var name = cname + "=";
  var ca = document.cookie.split(';');
  for(var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

function carregaCidades(){
	var token = JSON.parse(getCookie("token"));
	var value = $("#listaEstado").val();
	var option = $("#estado").find("[value='" + value + "']");
	var idEstado = option.data("id");

	var formData = { 'idEstado' : idEstado };
	$.ajax({
		type		    : 'POST',
		url				: '/api/getCidade',
		contentType   	: 'application/json',
		data		    : JSON.stringify(formData),
		dataType	    : 'json',
		beforeSend: function (xhr) { xhr.setRequestHeader('Authorization', token.tipo + " " + token.token); },
		encode		: true,
		success: function(data) {
			var html = "";
			for(var i = 0;i<data.cidades.length; i++){
				var cidade = data.cidades[i];
				html += "<option data-id=\""+cidade.id+"\" value=\""+cidade.nome+"\"></option>";
			}// fim do loop
			$("#listaCidade").prop("disabled",false);
			$("#listaCidade").val("");
			$("#cidade").html(html);
		},
		error: function(result) {
			console.log(result);
			alerta(result.responseJSON.message);
		}
	});
	
}
function alerta(mensagem){
	console.log("alerta: "+mensagem);

	$("#alertaErro").html(mensagem);
	$("#alertaErro").fadeIn()
		.css({bottom:-100,position:'fixed', display:'flex!important'})
		.animate({bottom:30}, 800, function() {
	    
		$("#alertaErro").fadeOut(3000);
		
	})
}
function alertaSucess(mensagem){
	console.log("alertaSucess: "+mensagem);
	$("#alertaSucess").html(mensagem);
	$("#alertaSucess").fadeIn()
		.css({bottom:-100,position:'fixed', display:'flex!important'})
		.animate({bottom:30}, 800, function() {
		
		$("#alertaSucess").fadeOut(3000);
		
	})
}
var paginaAtual = 0;				

function proximo(pagina, accessToken, tipoAbertura){
	var paginaEnviar = pagina - 1;
	if(paginaAtual != paginaEnviar){
		console.log("removendo")
		$("#paginas span a").removeClass("selecionado");
		$("#paginas span a").removeClass("n-selecionado");
		$("#paginas span a").addClass("n-selecionado");
		$("#pagina_"+pagina).removeClass("n-selecionado");
		$("#pagina_"+pagina).addClass("selecionado");
		
		var token = JSON.parse(getCookie("token"));
		var itensPorPagina = $("#itensPorPagina").val();
		var formData = { 'pagina' : paginaEnviar, 'itensPorPagina' : itensPorPagina };
		$.ajax({
			type		    : 'POST',
			url				: '/api/getPagina',
			contentType   	: 'application/json',
			data		    : JSON.stringify(formData),
			dataType	    : 'json',
			beforeSend: function (xhr) { xhr.setRequestHeader('Authorization', token.tipo + " " + token.token); xhr.setRequestHeader('AccessKey', accessToken); },
			encode		: true,
			success: function(data) {
				paginaAtual = paginaEnviar;
				if(tipoAbertura == "listarifas"){
					setRifa(data);
				}else if(tipoAbertura == "usuario"){
					setUsuario(data);
				}else if(tipoAbertura == "produtos"){
					setProduto(data);
				}else if(tipoAbertura == "pendentes" || tipoAbertura == "aprovados" || tipoAbertura == "naoaprovados"){
					setPedido(data);
				}
			},
			error: function(result) {
				console.log(result);
				alerta(result.responseJSON.message);
			}
		});
	}
}

function setUsuario(data){
	var html = "";
	var htmlAcoes = "";
	for(var i = 0; i<data.acoes.length;i++){
		var acao = data.acoes[i];
		htmlAcoes += "<span class=\"acao\"> <a href=\"javascript: carregarPagina('"+acao.link+"',"+acao.tipo+", '##EST##') \">"+acao.nome+"</a> </span>";
	}
	for(var i = 0; i<data.usuarios.length;i++){
		var usuario = data.usuarios[i];
		html += "<div class=\"row padrao\">";
		html += "	<div class=\"col-2\">"+usuario.nome+"</div>";
		html += "	<div class=\"col-2 cpf\">"+usuario.cpf+"</div>";
		html += "	<div class=\"col-3\">"+usuario.email+"</div>";
		html += "	<div class=\"col-2\">"+usuario.dataNascimento+"</div>";
		html += "	<div class=\"col-1\">";
		html += 		htmlAcoes.replace("##EST##",usuario.tokenNavigation);					
		html += "	</div>";
		html += "</div>";
	}
	console.log(html);
	$("#conteudoPaginacao").html(html);
	formatarCpf();
}

function setBilhetes(data){
	var html = "";
	
	
	
	html += " <div class=\"nomeCliente\">"+data.nomeCli+"</div>";
	
	html += "	<div class=\"row padrao\">";
	html += "	<div class=\"col-3 nmProd\">Nome do produto</div>";
	html += "	<div class=\"col-2 vlProd\">Valor do Produto</div>";
	html += "	<div class=\"col-3 vlRifa\">Valor Rifa</div>";
	html += "	<div class=\"col-3 nrEsc\">Numeros escolhidos</div>";
	html += "	</div>";
	
	console.log(data.arrayPed);
	for(var i = 0; i<data.arrayPed.length;i++){
		var bilhete = data.arrayPed[i];
		html += "<div class=\"row padrao\">";
		
		html += "	<div class=\"col-3 nmProd\">"+bilhete.nomeProd+"</div>";
		html += "	<div class=\"col-2 vlProd\">"+formatReal(bilhete.valorProd)+"</div>";
		html += "	<div class=\"col-3 vlRifa\">"+formatReal(bilhete.valorRifa)+"</div>";
		html += "	<div class=\"col-3 nrEsc2\">";
		for(var i = 0; i<bilhete.nrEsc.length;i++){
			var nr = bilhete.nrEsc[i];
			html += "<p class=\"nrEsc1\">"+nr.nrEsc+"</p>";
		}	
		html += "	</div>";
		html += "</div>";
	}
	console.log(html);
	$("#conteudoBilhete").html(html);

}

function formatReal( valor )
{
	/*
        var tmp = vl+'';
        tmp = tmp.replace(/([0-9]{2})$/g, ",$1");
        if( tmp.length > 6 )
                tmp = tmp.replace(/([0-9]{3}),([0-9]{2}$)/g, ".$1,$2");
		
		
        return tmp;
	*/
	return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}


function setPedido(data){
	var html = "";
	var htmlAcoes = "";
	for(var i = 0; i<data.acoes.length;i++){
		var acao = data.acoes[i];
		htmlAcoes += "<span class=\"acao\"> <a href=\"javascript: carregarPagina('"+acao.link+"',"+acao.tipo+", '##EST##') \">"+acao.nome+"</a> </span>";
	}
	console.log(data.pedidos);
	for(var i = 0; i<data.pedidos.length;i++){
		var pedido = data.pedidos[i];
		html += "<div class=\"row padrao\">";
		html += "	<div class=\"col-3\">"+pedido.nome+"</div>";
		html += "	<div class=\"col-2\">"+pedido.nrCpf+"</div>";
		html += "	<div class=\"col-3\">"+pedido.email+"</div>";
		html += "	<div class=\"col-2\">"+pedido.dtCompra+"</div>";
		html += "	<div class=\"col-1\">";
		html += 		htmlAcoes.replace("##EST##",pedido.tokenNavigation);					
		html += "	</div>";
		html += "</div>";
	}
	console.log(html);
	$("#conteudoPaginacao").html(html);

}

function setProduto(data){
	var html = "";
	var htmlAcoes = "";
	for(var i = 0; i<data.acoes.length;i++){
		var acao = data.acoes[i];
		htmlAcoes += "<span class=\"acao\"> <a href=\"javascript: carregarPagina('"+acao.link+"',"+acao.tipo+", '##EST##') \">"+acao.nome+"</a> </span>";
	}
	console.log(data.produtos);
	for(var i = 0; i<data.produtos.length;i++){
		var produto = data.produtos[i];
		html += "<div class=\"row padrao\">";
		html += "	<div class=\"col-2\">"+produto.nomeProduto+"</div>";
		html += "	<div class=\"col-2\">"+formatReal(produto.valorProduto)+"</div>";
		html += "	<div class=\"col-3\">"+produto.linkYtube+"</div>";
		html += "	<div class=\"col-2\">"+produto.dataInsercao+"</div>";
		html += "	<div class=\"col-1\">";
		html += 		htmlAcoes.replace("##EST##",produto.tokenNavigation);					
		html += "	</div>";
		html += "</div>";
	}
	console.log(html);
	$("#conteudoPaginacao").html(html);

}

function setRifa(data){
	var html = "";
	var htmlAcoes = "";
	for(var i = 0; i<data.acoes.length;i++){
		var acao = data.acoes[i];
		htmlAcoes += "<span class=\"acao\"> <a href=\"javascript: carregarPagina('"+acao.link+"',"+acao.tipo+", '##EST##') \">"+acao.nome+"</a> </span>";
	}
	for(var i = 0; i<data.rifas.length;i++){
		var rifa = data.rifas[i];
		html += "<div class=\"row padrao\">";
		html += "	<div class=\"col-2\">"+rifa.produto+"</div>";
		html += "	<div class=\"col-2\">"+formatReal(rifa.valorRifa)+"</div>";
		html += "	<div class=\"col-2\">"+rifa.dataInicio+"</div>";
		html += "	<div class=\"col-2\">"+rifa.dataFinal+"</div>";
		html += "	<div class=\"col-1\">";
		html += 		htmlAcoes.replace("##EST##",rifa.tokenNavigation);					
		html += "	</div>";
		html += "</div>";
	}
	console.log(html);
	$("#conteudoPaginacao").html(html);

}
function carregarPagina(link,tipoAbertura, tokenAbertura){
	if(tipoAbertura == 1){
		window.location = link+"/"+tokenAbertura;
	}
}
function adicionarBotao(obj){
	var token = JSON.parse(getCookie("token"));
	
	var tokenNavigation = $("#tokenNavigation").val();
	var tokenEditar = $("#tokenEditar").val();
	var botaoNav = $(obj).val();
	var tokenNavigation = $("#tokenNavigation").val();
	var tokenNavigation = $("#tokenNavigation").val();
	var tokenNavigation = $("#tokenNavigation").val();
	
	var formData = { 
		'botaoNav':botaoNav
	 };
	
	$.ajax({
		type		    : 'POST',
		url				: '/api/editarPermissaoUsuario/'+tokenNavigation,
		contentType   	: 'application/json',
		data		    : JSON.stringify(formData),
		dataType	    : 'json',
		beforeSend: function (xhr) { xhr.setRequestHeader('Authorization', token.tipo + " " + token.token);xhr.setRequestHeader('AccessKey', tokenEditar); },
		encode		: true,
		success: function(data) {
			if(data.erro){
				alerta(data.message);
			}else{
				alertaSucess(data.message,"");
			}
		},
		error: function(result) {
			alerta(result.responseJSON.message);
		}
	});
	
}

function adicionarBotaoInterno(obj){
	var token = JSON.parse(getCookie("token"));
	
	var tokenNavigation = $("#tokenNavigation").val();
	var tokenEditar = $("#tokenEditar").val();
	var botaoNav = $( obj ).data( "botao" );
	var botaoInternoNav = $( obj ).val();
	var tokenNavigation = $("#tokenNavigation").val();
	var tokenNavigation = $("#tokenNavigation").val();
	var tokenNavigation = $("#tokenNavigation").val();
	
	var formData = { 
		'botaoNav':botaoNav,
		'botaoInternoNav':botaoInternoNav
	 };
	
	$.ajax({
		type		    : 'POST',
		url				: '/api/editarPermissaoInternaUsuario/'+tokenNavigation,
		contentType   	: 'application/json',
		data		    : JSON.stringify(formData),
		dataType	    : 'json',
		beforeSend: function (xhr) { xhr.setRequestHeader('Authorization', token.tipo + " " + token.token);xhr.setRequestHeader('AccessKey', tokenEditar); },
		encode		: true,
		success: function(data) {
			if(data.erro){
				alerta(data.message);
			}else{
				alertaSucess(data.message,"");
			}
		},
		error: function(result) {
			alerta(result.responseJSON.message);
		}
	});
	
}

function editarUsuario(idUsuario, tokenEditar){
	var dtNacimento = $("#dtNacimento").val();
	var email = $("#email").val();
	var cpf = $("#cpf").val();
	var nome = $("#nome").val();
	var itensPorPagina = $("#itensPorPaginaUsuario").val();
	
	var token = JSON.parse(getCookie("token"));
	
	var formData = { 
		'dtNacimento' : dtNacimento,
		'email' : email,
		'cpf' : cpf,
		'nome' : nome,
		'itensPorPagina':itensPorPagina
	 };
	$.ajax({
		type		    : 'POST',
		url				: '/api/editarUsuario/'+idUsuario,
		contentType   	: 'application/json',
		data		    : JSON.stringify(formData),
		dataType	    : 'json',
		beforeSend: function (xhr) { xhr.setRequestHeader('Authorization', token.tipo + " " + token.token);xhr.setRequestHeader('AccessKey', tokenEditar); },
		encode		: true,
		success: function(data) {
			if(data.erro){
				alerta(data.message);
			}else{
				alertaSucess(data.message,"");
			}
		},
		error: function(result) {
			alerta(result.responseJSON.message);
		}
	});
	return false;
}

function editarMatriz(idMatriz, tokenEditar){
	
	console.log("Editar Matriz: "+idMatriz);
	
	var token = JSON.parse(getCookie("token"));
	var value = $("#listaEstado").val();
	var option = $("#estado").find("[value='" + value + "']");
	var idEstado = option.data("id");
	
	value = $("#listaCidade").val();
	option = $("#cidade").find("[value='" + value + "']");
	
	var idCidade = option.data("id");
	var razao = $("#razao").val();
	var cnpj = $("#cnpj").val();
	var bairro = $("#bairro").val();
	var endereco = $("#endereco").val();
	var cep = $("#cep").val();
	var numero = $("#numero").val();
	var complemento = $("#complemento").val();
	
	var formData = { 
		'idEstado' : idEstado,
		'idCidade' : idCidade,
		'nome' : razao,
		'cnpj' : cnpj,
		'cep':cep,
		'bairro' : bairro,
		'endereco' : endereco,
		'numero' : numero,
		'complemento' : complemento
	 };
	console.log(formData);
	$.ajax({
		type		    : 'POST',
		url				: '/api/editarEstrutura/'+idMatriz,
		contentType   	: 'application/json',
		data		    : JSON.stringify(formData),
		dataType	    : 'json',
		beforeSend: function (xhr) { xhr.setRequestHeader('Authorization', token.tipo + " " + token.token);xhr.setRequestHeader('AccessKey', tokenEditar); },
		encode		: true,
		success: function(data) {
			if(data.erro){
				alerta(data.message);
			}else{
				alertaSucess(data.message,"paginas/matriz");
			}
		},
		error: function(result) {
			alerta(result.responseJSON.message);
		}
	});
	return false;
}
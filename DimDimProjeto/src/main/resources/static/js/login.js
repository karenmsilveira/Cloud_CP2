function logar(){
	var cpf = $("#cpf").val();
	var senha = $("#senha").val();
	var conectado = false;
	
	var formData = {
		'cpf' : cpf,
		'senha'  : senha,
		'conectado' : conectado
	  };
	  $.ajax({
		type		    : 'POST', // define the type of HTTP verb we want to use (POST for our form)
		url			: 'auth/autenticar', // the url where we want to POST
		contentType   : 'application/json',
		data		    : JSON.stringify(formData), // our data object
		dataType	    : 'json', // what type of data do we expect back from the server
		encode		: true,
		success: function(data) {
			document.cookie = "token="+JSON.stringify(data);
		    window.location="/home";
		},
		error: function(result) {
		    alerta();
		}
	  });
}

function alerta(){
	$(".alerta-centro").fadeIn()
		.css({bottom:-100,position:'fixed', display:'flex!important'})
		.animate({bottom:30}, 800, function() {
	    $(".alerta-centro").fadeOut(3000);
	})
}
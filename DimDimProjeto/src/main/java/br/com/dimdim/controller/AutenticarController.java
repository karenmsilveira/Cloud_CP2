package br.com.dimdim.controller;

import javax.servlet.http.HttpSession;
import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import br.com.dimdim.bo.ClienteBo;
import br.com.dimdim.dto.LoginDto;
import br.com.dimdim.dto.TokenDto;
import br.com.dimdim.repository.ClienteRepository;
import br.com.dimdim.security.TokenService;
import net.sf.json.JSONObject;

@RestController
@RequestMapping("/auth")
public class AutenticarController {
	
	@Autowired
	ClienteRepository clienteRepository;
	
	@Autowired
	private AuthenticationManager authManager;
	
	@Autowired
	private HttpSession session;
	
	@Autowired
	private TokenService tokenService; 
	
	@CrossOrigin
	@RequestMapping(value="/autenticar",method=RequestMethod.POST)
	public ResponseEntity<TokenDto> autenticar(@RequestBody @Valid LoginDto form) {
		session.invalidate();
		UsernamePasswordAuthenticationToken dadosLogin = form.converter();
		try {
			Authentication authentication = authManager.authenticate(dadosLogin);
			String token = tokenService.gerarToken(authentication, form);
			System.out.println(token);
			ClienteBo cbo = this.getInstanceClienteBo();
			JSONObject json = cbo.carregaCliente(form);
			System.out.println(session.getId());
			session.setAttribute("nome", json.getString("nome"));
			session.setAttribute("idCliente", json.getInt("id"));
			session.setAttribute("cpf", json.getString("cpf"));
			
			return ResponseEntity.ok(new TokenDto(token, "Bearer"));
		} catch (AuthenticationException e) {
			return ResponseEntity.badRequest().build();
		}
	}
	
	@CrossOrigin
	@RequestMapping(value="/paginas/index",method=RequestMethod.POST)
	public String logout() {
		session.invalidate();
		return "../";
	}

	public ClienteBo getInstanceClienteBo() {
		return new ClienteBo(this.clienteRepository);
	}

}

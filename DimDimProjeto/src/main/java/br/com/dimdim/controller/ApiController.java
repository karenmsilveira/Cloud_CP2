package br.com.dimdim.controller;

import java.text.SimpleDateFormat;
import java.util.Date;

import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.view.RedirectView;

import br.com.dimdim.bo.ClienteBo;
import br.com.dimdim.bo.ContaBo;
import br.com.dimdim.model.Cliente;
import br.com.dimdim.model.Conta;
import br.com.dimdim.model.Movimentacao;
import br.com.dimdim.model.TipoConta;
import br.com.dimdim.repository.ClienteRepository;
import br.com.dimdim.repository.ContaRepository;
import br.com.dimdim.repository.MovimentacaoRepository;
import net.sf.json.JSONObject;

@Controller
@RequestMapping("/api")
public class ApiController {
	final String paginaDeslogado = "paginas/index";
	
	@Autowired
	ClienteRepository clienteRepository;
	
	@Autowired
	ContaRepository contaRepository;
	
	@Autowired
	MovimentacaoRepository movimentacaoRepository;
	
	@Autowired
	HttpSession session;
	
	public boolean validaClienteLogado() {
		try {
			Object cli = session.getAttribute("idCliente");
			Integer idCliente = Integer.parseInt(cli.toString());
			
			if(idCliente != null) {
				return true;
			}
		}catch(NullPointerException e) {}
		return false;
		
	}
	
	@RequestMapping(value="/deposito",method=RequestMethod.POST)
	public RedirectView  depositar(@RequestParam("deposito") double deposito) {
		if(this.validaClienteLogado()) {
			
			Integer idCliente = Integer.parseInt(session.getAttribute("idCliente").toString());
			Cliente cli = this.clienteRepository.findByIdCliente(idCliente);
			Conta conta = this.contaRepository.findByCliente(cli);
			conta.deposito(deposito);
			this.contaRepository.save(conta);
			Movimentacao mov = new Movimentacao();
			mov.setConta(conta);
			mov.setDataMov(new Date());
			mov.setTipoMov(1);
			mov.setValorMov(deposito);
			movimentacaoRepository.save(mov);
			
			return new RedirectView("/home?sucesso=true");
		}else {
			return new RedirectView("/home?erro=true");
		}
	}
	
	@RequestMapping(value="/saque",method=RequestMethod.POST)
	public RedirectView  saque(@RequestParam("saque") double saque) {
		if(this.validaClienteLogado()) {
			
			Integer idCliente = Integer.parseInt(session.getAttribute("idCliente").toString());
			Cliente cli = this.clienteRepository.findByIdCliente(idCliente);
			Conta conta = this.contaRepository.findByCliente(cli);
			boolean isSaque = conta.saque(saque);
			if(!isSaque) {
				return new RedirectView("/saque?erro=-1");
			}
			this.contaRepository.save(conta);
			Movimentacao mov = new Movimentacao();
			mov.setConta(conta);
			mov.setDataMov(new Date());
			mov.setTipoMov(2);
			mov.setValorMov(saque);
			movimentacaoRepository.save(mov);
			
			return new RedirectView("/home?sucesso=true");
		}else {
			return new RedirectView("/home?erro=true");
		}
	}
	@CrossOrigin
	@RequestMapping(value="/cadastro",method=RequestMethod.POST, produces = {"application/json"})
	public ResponseEntity<?> salvarCliente(@RequestBody(required = true) JSONObject estruturaJson) throws Exception {
		JSONObject json = new JSONObject();
			Cliente cliente = new Cliente();
			cliente.setNome(estruturaJson.getString("nome"));
			cliente.setCpf(estruturaJson.getString("cpf"));
			
			SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
			cliente.setDtNasc(sdf.parse(estruturaJson.getString("dtNasc")));
			
			
			
			String senha = new BCryptPasswordEncoder().encode(estruturaJson.getString("senha"));
			cliente.setSenha(senha);
			
			try {
				ClienteBo cBo = this.getInstanceClienteBo();
				Cliente c = cBo.salvarCliente(cliente);
				Conta conta =  new Conta();
				conta.setCliente(c);
				conta.setNumeroAgencia("1");
				conta.setNumeroConta(c.getIdCliente());
				conta.setSaldo(0.00);
				conta.setTipoConta(TipoConta.CORRENTE);
				conta.setDigitoConta(Integer.parseInt(c.getIdCliente().toString().substring(0,1)));
				
				ContaBo contaBo = new ContaBo(contaRepository);
				contaBo.salvarConta(conta);
				json.put("erro", false);
			}catch (Exception e) {
				json.put("erro", true);
			}
				
			if(json.getBoolean("erro")) {
				return ResponseEntity.badRequest().body(json);
			}else {
				return ResponseEntity.ok(json);
			}
		
			
	}
	public ClienteBo getInstanceClienteBo() {
		return new ClienteBo(this.clienteRepository);
	}
	
}

package br.com.dimdim.controller;

import java.util.Date;

import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.view.RedirectView;

import br.com.dimdim.model.Cliente;
import br.com.dimdim.model.Conta;
import br.com.dimdim.model.Movimentacao;
import br.com.dimdim.repository.ClienteRepository;
import br.com.dimdim.repository.ContaRepository;
import br.com.dimdim.repository.MovimentacaoRepository;

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
	
}

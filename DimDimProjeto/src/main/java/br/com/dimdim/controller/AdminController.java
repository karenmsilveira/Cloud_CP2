package br.com.dimdim.controller;

import java.util.List;

import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import br.com.dimdim.model.Cliente;
import br.com.dimdim.model.Movimentacao;
import br.com.dimdim.repository.ClienteRepository;
import br.com.dimdim.repository.ContaRepository;
import br.com.dimdim.repository.MovimentacaoRepository;
import br.com.dimdim.security.TokenService;

@Controller
public class AdminController {

	final String paginaDeslogado = "paginas/index";

	@Autowired
	ClienteRepository clienteRepository;

	@Autowired
	ContaRepository contaRepository;

	@Autowired
	MovimentacaoRepository movimentacaoRepository;

	@Autowired
	HttpSession session;

	@Autowired
	TokenService tokenService;

	public boolean validaClienteLogado() {
		try {
			Object cli = session.getAttribute("idCliente");
			Integer idCliente = Integer.parseInt(cli.toString());

			if (idCliente != null) {
				return true;
			}
		} catch (NullPointerException e) {
		}
		return false;

	}

	@RequestMapping(value = "/", method = RequestMethod.GET)
	public String inicio() {
		if (this.validaClienteLogado()) {
			return "paginas/index";
		} else {
			return paginaDeslogado;
		}
	}

	@RequestMapping(value = "/cadastro", method = RequestMethod.GET)
	public String cadastro() {

		return "paginas/cadastro";
	}

	@RequestMapping(value = "/home", method = RequestMethod.GET)
	public String home(Model model) {
		if (this.validaClienteLogado()) {

			Integer idCliente = Integer.parseInt(session.getAttribute("idCliente").toString());
			Cliente cli = this.clienteRepository.findByIdCliente(idCliente);

			model.addAttribute("cliente", cli);

			return "paginas/home";
		} else {
			return paginaDeslogado;
		}
	}

	@RequestMapping(value = "/deposito", method = RequestMethod.GET)
	public String deposito(Model model) {
		if (this.validaClienteLogado()) {
			Integer idCliente = Integer.parseInt(session.getAttribute("idCliente").toString());
			Cliente cli = this.clienteRepository.findByIdCliente(idCliente);

			model.addAttribute("cliente", cli);
			return "paginas/deposito";
		} else {
			return paginaDeslogado;
		}
	}

	@RequestMapping(value = "/saque", method = RequestMethod.GET)
	public String saque(Model model) {
		if (this.validaClienteLogado()) {
			Integer idCliente = Integer.parseInt(session.getAttribute("idCliente").toString());
			Cliente cli = this.clienteRepository.findByIdCliente(idCliente);

			model.addAttribute("cliente", cli);
			return "paginas/saque";
		} else {
			return paginaDeslogado;
		}
	}

	@RequestMapping(value = "/extrato", method = RequestMethod.GET)
	public String extrato(Model model) {
		if (this.validaClienteLogado()) {

			Integer idCliente = Integer.parseInt(session.getAttribute("idCliente").toString());
			Cliente cli = this.clienteRepository.findByIdCliente(idCliente);
			model.addAttribute("cliente", cli);

			List<Movimentacao> lst = this.movimentacaoRepository.findByConta(cli.getConta());
			model.addAttribute("lst", lst);
			return "paginas/extrato";
		} else {
			return paginaDeslogado;
		}
	}

}

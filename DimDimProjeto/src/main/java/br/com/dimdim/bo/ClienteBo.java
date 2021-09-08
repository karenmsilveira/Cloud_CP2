package br.com.dimdim.bo;

import java.text.ParseException;
import java.text.SimpleDateFormat;

import javax.validation.Valid;

import br.com.dimdim.dto.LoginDto;
import br.com.dimdim.model.Cliente;
import br.com.dimdim.repository.ClienteRepository;
import net.sf.json.JSONObject;

public class ClienteBo {

	private ClienteRepository clienteRepository;

	public ClienteBo(ClienteRepository clienteRepository) {
		this.clienteRepository = clienteRepository;
	}

	public Cliente salvarCliente(Cliente c) {
		return this.clienteRepository.save(c);
	}

	public Cliente alteraCliente(JSONObject novoCliente) throws ParseException {
		Integer idCliente = novoCliente.getInt("idCliente");
		SimpleDateFormat sdf = new SimpleDateFormat("dd/MM/yyyy");

		Cliente clienteAlterar = this.clienteRepository.findByIdCliente(idCliente);
		clienteAlterar.setNome(novoCliente.getString("nome"));
		clienteAlterar.setCpf(novoCliente.getString("cpf"));
		clienteAlterar.setDtNasc(sdf.parse(novoCliente.getString("dtNasc")));

		return this.clienteRepository.save(clienteAlterar);

	}

	
	public JSONObject carregaCliente(@Valid LoginDto form) {

		Cliente cli = this.clienteRepository.findByCpf(form.getCpf());
		JSONObject json = cli.toJsonSimple();

		return json;
	}
}

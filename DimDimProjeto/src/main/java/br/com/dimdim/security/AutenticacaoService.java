package br.com.dimdim.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import br.com.dimdim.model.Cliente;
import br.com.dimdim.repository.ClienteRepository;

@Service
public class AutenticacaoService implements UserDetailsService {

	@Autowired
	private ClienteRepository clienteRepository;
	
	@Override
	public UserDetails loadUserByUsername(String cpf) throws UsernameNotFoundException {
		Cliente cliente = clienteRepository.findByCpf(cpf);
		if (cliente != null) {
			return cliente;
		}
		
		throw new UsernameNotFoundException("Dados inválidos!");
	}
}

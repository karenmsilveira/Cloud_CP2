package br.com.dimdim.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import br.com.dimdim.model.Cliente;

@Repository
public interface ClienteRepository extends JpaRepository<Cliente, Integer>{
	
	Cliente findByIdCliente (Integer idCliente);
	Cliente findByCpf (String cpf);
	

}

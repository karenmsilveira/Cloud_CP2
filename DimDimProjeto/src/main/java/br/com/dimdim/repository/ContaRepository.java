package br.com.dimdim.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import br.com.dimdim.model.Cliente;
import br.com.dimdim.model.Conta;

public interface ContaRepository extends JpaRepository<Conta, Integer>{
	
	Conta findByIdConta (Integer idConta);
	Conta findByNumeroContaAndDigitoConta (Integer numeroConta, Integer digitoConta);
	Conta findByCliente (Cliente cliente);

}

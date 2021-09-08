package br.com.dimdim.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import br.com.dimdim.model.Conta;
import br.com.dimdim.model.Movimentacao;

public interface MovimentacaoRepository extends JpaRepository <Movimentacao, Integer>{
	
	List<Movimentacao> findByConta (Conta conta);

}

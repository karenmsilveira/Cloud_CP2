package br.com.dimdim.bo;

import br.com.dimdim.model.Movimentacao;
import br.com.dimdim.repository.MovimentacaoRepository;

public class MovimentacaoBo {

	private MovimentacaoRepository movimentacaoRepository;
	
	public MovimentacaoBo(MovimentacaoRepository movimentacaoRepository) {
		this.movimentacaoRepository = movimentacaoRepository;
	}
	
	public Movimentacao salvarMov (Movimentacao m) {
		return this.movimentacaoRepository.save(m);
	}
}

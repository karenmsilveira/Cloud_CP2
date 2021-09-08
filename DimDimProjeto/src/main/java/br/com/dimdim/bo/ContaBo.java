package br.com.dimdim.bo;

import br.com.dimdim.model.Conta;
import br.com.dimdim.repository.ContaRepository;
import net.sf.json.JSONObject;

public class ContaBo {
	
	private ContaRepository contaRepository;
	
	public ContaBo(ContaRepository contaRepository) {
		this.contaRepository = contaRepository;
	}
	
	public Conta salvarConta (Conta c) {
		return this.contaRepository.save(c);
	}
	
	public Conta adicionaSaldo (JSONObject novoSaldo) {
		Integer idConta = novoSaldo.getInt("idConta");
		
		Conta saldoAlterar = this.contaRepository.findByIdConta(idConta);
		saldoAlterar.deposito(novoSaldo.getDouble("deposito"));
		
		return this.contaRepository.save(saldoAlterar);
	}
	
	public Conta retiraSaldo (JSONObject novoSaldo) {
		Integer idConta = novoSaldo.getInt("idConta");
		
		Conta saldoAlterar = this.contaRepository.findByIdConta(idConta);
		saldoAlterar.saque(novoSaldo.getDouble("saque"));
		
		return this.contaRepository.save(saldoAlterar);
	}

}

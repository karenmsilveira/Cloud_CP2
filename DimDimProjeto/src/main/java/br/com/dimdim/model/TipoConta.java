package br.com.dimdim.model;

public enum TipoConta {
	POUPANCA(1), CORRENTE(2);

	public int tipoConta;

	TipoConta(int tipo) {
		tipoConta = tipo;
	}
	public int getTipo() {
		return tipoConta;
	}
}

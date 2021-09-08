package br.com.dimdim.model;

import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.OneToMany;
import javax.persistence.OneToOne;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;

@Entity
@Table(name = "dimdim_tb_conta")
@SequenceGenerator(sequenceName = "sq_dimdim_tb_conta", name = "conta", allocationSize = 1)
public class Conta {

	@Id
	@Column(name = "id_conta")
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "conta")
	private Integer idConta;
	
	@Column(name = "numero_conta")
	private Integer numeroConta;
	@Column(name = "digito_conta")
	private Integer digitoConta;
	@Column(name = "numero_agencia")
	private String numeroAgencia;
	@Column(name = "saldo")
	private double saldo;
	
	@OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "cliente", referencedColumnName = "id_cliente")
	private Cliente cliente;
	@Column(name = "tipo_conta")
	private TipoConta tipoConta;

	@OneToMany(mappedBy = "conta", cascade = CascadeType.ALL)
	private List<Movimentacao> movimentacoes;

	

	public Integer getIdConta() {
		return idConta;
	}

	public void setIdConta(Integer idConta) {
		this.idConta = idConta;
	}

	public Integer getNumeroConta() {
		return numeroConta;
	}

	public void setNumeroConta(Integer numeroConta) {
		this.numeroConta = numeroConta;
	}

	public Integer getDigitoConta() {
		return digitoConta;
	}

	public void setDigitoConta(Integer digitoConta) {
		this.digitoConta = digitoConta;
	}

	public String getNumeroAgencia() {
		return numeroAgencia;
	}

	public void setNumeroAgencia(String numeroAgencia) {
		this.numeroAgencia = numeroAgencia;
	}

	

	public double getSaldo() {
		return saldo;
	}

	public void setSaldo(double saldo) {
		this.saldo = saldo;
	}

	public TipoConta getTipoConta() {
		return tipoConta;
	}

	public void setTipoConta(TipoConta tipoConta) {
		this.tipoConta = tipoConta;
	}

	public boolean saque(double valorSaque) {
		if (valorSaque > 0 && valorSaque <= this.saldo ) {
		
			this.saldo -= valorSaque;
			return true;
		}
		return false;
		
	}
	
	public boolean deposito(double valorDeposito) {
		if (valorDeposito > 0) {
		
			this.saldo += valorDeposito;
			return true;
		}
		return false;
		
		
	}

	public Cliente getCliente() {
		return cliente;
	}

	public void setCliente(Cliente cliente) {
		this.cliente = cliente;
	}

}

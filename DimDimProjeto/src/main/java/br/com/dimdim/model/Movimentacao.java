package br.com.dimdim.model;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;
@Entity
@Table(name = "dimdim_tb_movimentacao")
@SequenceGenerator(sequenceName = "sq_dimdim_tb_movimentacao", name = "movimentacao", allocationSize = 1)
public class Movimentacao {
	
	@Id
	@Column(name = "id_mov")
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "movimentacao")	
	private Integer idMov;
	
	@ManyToOne
    @JoinColumn(name = "id_conta")
	private Conta conta;
	
	@Column(name = "data_mov")
	private Date dataMov;
	
	@Column(name = "tipo_mov")
	private Integer tipoMov;

	@Column(name = "valor_mov")
	private double valorMov;

	
	public Integer getIdMov() {
		return idMov;
	}
	public void setIdMov(Integer idMov) {
		this.idMov = idMov;
	}
	public Conta getConta() {
		return conta;
	}
	public void setConta(Conta conta) {
		this.conta = conta;
	}
	public Date getDataMov() {
		return dataMov;
	}
	public void setDataMov(Date dataMov) {
		this.dataMov = dataMov;
	}
	public Integer getTipoMov() {
		return tipoMov;
	}
	public void setTipoMov(Integer tipoMov) {
		this.tipoMov = tipoMov;
	}
	public double getValorMov() {
		return valorMov;
	}
	public void setValorMov(double valorMov) {
		this.valorMov = valorMov;
	}
	
	
	

}

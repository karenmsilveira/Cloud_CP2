package br.com.dimdim.model;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.OneToOne;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;

import org.springframework.security.core.GrantedAuthority;

@Entity
@Table(name="perfil_navegacao")
@SequenceGenerator(sequenceName = "sq_dimdim_tb_perfil_navegacao", name = "perfil_navegacao", allocationSize = 1)
public class Perfil implements GrantedAuthority{
	
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	@Id
	@Column(name = "id_perfil_navegacao")
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "perfil_navegacao")
	private Integer idPerfilNavegacao;
	
	@OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_cliente")
	private Cliente cliente;
	
	@Column(name="data_insercao")
	private Date dataInsercao;
	
	

	public Integer getIdPerfilNavegacao() {
		return idPerfilNavegacao;
	}



	public void setIdPerfilNavegacao(Integer idPerfilNavegacao) {
		this.idPerfilNavegacao = idPerfilNavegacao;
	}



	public Cliente getCliente() {
		return cliente;
	}



	public void setCliente(Cliente cliente) {
		this.cliente = cliente;
	}



	public Date getDataInsercao() {
		return dataInsercao;
	}



	public void setDataInsercao(Date dataInsercao) {
		this.dataInsercao = dataInsercao;
	}



	@Override
	public String getAuthority() {
		return this.getCliente().getCpf();
	}

}

package com.canfer.app.dto;

import java.time.LocalDateTime;

public class DetFormularioCajaChicaDTO {
	
	private Long idFormulario;
	private Long idClasificacion;
	private Float monto; 
	private LocalDateTime fechaDet;
	private String beneficiario;
	private String folio;
	
	public DetFormularioCajaChicaDTO() {
	}

	public Long getIdFormulario() {
		return idFormulario;
	}

	public void setIdFormulario(Long idFormulario) {
		this.idFormulario = idFormulario;
	}

	public Long getIdClasificacion() {
		return idClasificacion;
	}

	public void setIdClasificacion(Long idClasificacion) {
		this.idClasificacion = idClasificacion;
	}

	public Float getMonto() {
		return monto;
	}

	public void setMonto(Float monto) {
		this.monto = monto;
	}

	public LocalDateTime getFechaDet() {
		return fechaDet;
	}

	public void setFechaDet(LocalDateTime fechaDet) {
		this.fechaDet = fechaDet;
	}

	public String getBeneficiario() {
		return beneficiario;
	}

	public void setBeneficiario(String responsable) {
		this.beneficiario = responsable;
	}

	public String getFolio() {
		return folio;
	}

	public void setFolio(String folio) {
		this.folio = folio;
	}
	
	
	 

}

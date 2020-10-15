package com.canfer.app.service;

import java.util.List;
import java.util.Optional;

import javax.persistence.EntityExistsException;

import org.apache.commons.lang.NullArgumentException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.canfer.app.model.Proveedor;
import com.canfer.app.dto.ProveedorDTO;
import com.canfer.app.repository.EmpresaRepository;
import com.canfer.app.repository.ProveedorRepository;
import com.canfer.app.security.IAuthenticationFacade;
import com.canfer.app.security.UserPrincipal;

import javassist.NotFoundException;

@Service
public class ProveedorService {
	
	@Autowired
	private EmpresaRepository empresaRepository;
	@Autowired
	private ProveedorRepository proveedorRepository;
	@Autowired
	private IAuthenticationFacade authenticationFacade;
	
	public List<Proveedor> findAll() {
		return proveedorRepository.findAll();
	}
	
	public List<Proveedor> findAllById(List<Long> ids) {
		return proveedorRepository.findAllById(ids);
	}
	
	public Proveedor findById(Long id) throws NotFoundException {
		Optional<Proveedor> proveedor = proveedorRepository.findById(id);
		if (proveedor.isEmpty()) {
			throw new NotFoundException("El proveedor no existe en el catalogo.");
		}
		return proveedor.get();
	}
	
	public boolean exist(Long id) {
		Optional<Proveedor> proveedor = proveedorRepository.findById(id);
		return proveedor.isPresent(); 
	}
	
	public Proveedor save(ProveedorDTO proveedor) {
		
		Proveedor saveProveedor;
		Proveedor checkProveedor = proveedorRepository.findByRfc(proveedor.getRfc());
		
		if(checkProveedor != null && proveedor.getIdProveedor() == 0L) {
			throw new EntityExistsException("La proveedor que desea registrar ya existe en el catálogo.");
		} else if (checkProveedor != null && proveedor.getIdProveedor() != 0L) {
			saveProveedor = checkProveedor;			
		} else {
			//Get user principal to fill the user creation field.
			UserPrincipal userDetails = (UserPrincipal) authenticationFacade.getAuthentication().getPrincipal();
			saveProveedor = new Proveedor(userDetails.getUserId());
		}
		
		if (proveedor.getRfc().isEmpty() || proveedor.getClaveProv().isEmpty()) {
			throw new NullArgumentException("La clave de proveedor o el RFC no es válido");
		}

		try {
			
			//Transfer the information form the DTO object.
			saveProveedor.setCalle(proveedor.getCalle());
			saveProveedor.setColonia(proveedor.getColonia());
			saveProveedor.setContacto(proveedor.getContacto());
			saveProveedor.setCorreo(proveedor.getCorreo());
			saveProveedor.setCp(proveedor.getCp());
			saveProveedor.setLocalidad(proveedor.getLocalidad());
			saveProveedor.setNombre(proveedor.getNombre());
			saveProveedor.setNumExt(proveedor.getNumExt());
			saveProveedor.setNumInt(proveedor.getNumInt());
			saveProveedor.setPaginaWeb(proveedor.getPaginaWeb());
			saveProveedor.setReferencia(proveedor.getReferencia());
			saveProveedor.setRfc(proveedor.getRfc());
			saveProveedor.setTelefono(proveedor.getTelefono());
			saveProveedor.setMunicipio(proveedor.getMunicipio());
			
			//additional attributes for supplier
			saveProveedor.setClaveProv(proveedor.getClaveProv());
			saveProveedor.setSerie(proveedor.getSerie());
			saveProveedor.setEmpresas(empresaRepository.findAllById(proveedor.getIdEmpresas()));
			saveProveedor.setMoneda(proveedor.getMoneda());
			
		} catch (Exception e) {
			throw new UnknownError("Ocurrio un error inesperado.");
		}
		
		return proveedorRepository.save(saveProveedor);
		
	}
	
	public void delete(Long id) throws NotFoundException {
		// check if supplier exists
		if (!exist(id)) {
			throw new NotFoundException("El proveedor que desea eliminar no existe.");	
		}
		empresaRepository.deleteById(id);
	}
	

}

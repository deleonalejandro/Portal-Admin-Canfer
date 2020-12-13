package com.canfer.app.model;



import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import javax.servlet.http.HttpServletResponse;

import org.apache.commons.io.FileExistsException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import com.canfer.app.cfd.Comprobante;
import com.canfer.app.dto.ComprobanteFiscalDTO;
import com.canfer.app.mail.EmailSenderService;
import com.canfer.app.model.Archivo.ArchivoPDF;
import com.canfer.app.model.Archivo.ArchivoXML;
import com.canfer.app.model.ComprobanteFiscal.ComplementoPago;
import com.canfer.app.model.ComprobanteFiscal.Factura;
import com.canfer.app.model.ComprobanteFiscal.NotaDeCredito;
import com.canfer.app.service.RepositoryService;

import javassist.NotFoundException;

@Component
public class DocumentosNacionalesActions extends ModuleActions {
	
	@Autowired
	private EmailSenderService emailSender; 
	
	@Override
	public boolean upload(ArchivoXML fileXML, ArchivoPDF filePDF) throws FileExistsException, NotFoundException {
		
		Documento doc;
		
		if (fileXML.businessValidation()) {
			
			if (filePDF == null) {
				
				doc = new Documento(fileXML);
			}
			
			doc = new Documento(fileXML, filePDF);
			
			ComprobanteFiscal cfd = makeCfd(doc);
			
			// fill the object with XML information
			cfd.fill();
			
			// use the PAC to validate the CFD
			cfd.validateInvoiceOne();
			
			// accept the CFD
			cfd.accept();
			
			// persist the entities into DB,
			superRepo.save(cfd);
			
			// match CFD type P with other CFD.
			if (cfd instanceof ComplementoPago) {
				
				matchFacturaWithComplemento((ComplementoPago) cfd);
				
			}
			
			emailSender.sendEmailNewDoc(cfd);
			return true;
			
		} else {
			
			fileXML.discard();
			filePDF.discard();
			
			return false;
		}
		
		
	}
	
	public ResponseEntity<Resource> download(String method, String repo, Long id, String action) {
		
		Optional<Pago> valuePago;
		Optional<ComprobanteFiscal> valueComprobante;
		ComprobanteFiscal comprobante;
		
		IModuleEntity entity = null;
		
		// switching the repository strategies for single files.
		switch (repo) {
		
		case "Pago":
			
			valuePago = superRepo.findPagoById(id);
			
			if (valuePago.isPresent()) {
				
				entity = valuePago.get();
			}
				
			break;
			
		case "ComprobanteFiscal":
			
			valueComprobante =  superRepo.findComprobanteById(id);
			
			if (valueComprobante.isPresent()) {
				
				entity = valueComprobante.get();
			}
			
			break;

		default:
			break;
		}
		
		// switching the method strategies for single files.
		switch (method) {
		
		case "singleXML":
			
			return dowloadManager.download(entity.fetchXML(), action);

		case "singlePDF":
			
			return dowloadManager.download(entity.fetchPDF(), action);
			
		case "singlePayment":
			
			comprobante = (ComprobanteFiscal) entity;
			
			return dowloadManager.download(comprobante.getPago().fetchPDF(), action);
			
		case "singleComplemento":
			
			comprobante = (ComprobanteFiscal) entity;
			
			return dowloadManager.download(((Factura) comprobante).getComplemento().fetchXML(), action);
			
		default:
			break;
			
		}
		
		return null;
	}
	
	public ResponseEntity<byte[]> download(String method, String repo, List<Long> ids) {
			
			List<Archivo> files = new ArrayList<>();
			List<ComprobanteFiscal> comprobantes = new ArrayList<>();
			
			// switching the repository strategies for single files.
			switch (repo) {
	
			case "ComprobanteFiscal":
				
				comprobantes = superRepo.findAllComprobanteById(ids);
				
				break;
	
			default:
				break;
			}
			
			switch (method) {
			
			case "zipXML":
				
				for (ComprobanteFiscal comprobanteFiscal : comprobantes) {
					
					files.add(comprobanteFiscal.fetchXML());
					
				}
				
				break;
				
			case "zipPDF":
				
				for (ComprobanteFiscal comprobanteFiscal : comprobantes) {
	
					files.add(comprobanteFiscal.fetchPDF());
	
				}
	
				break;
				
			case "zip":
				
				for (ComprobanteFiscal comprobanteFiscal : comprobantes) {
					
					files.add(comprobanteFiscal.fetchXML());
					files.add(comprobanteFiscal.fetchPDF());
	
				}
	
				break;
	
			default:
				break;
			}
				
			return dowloadManager.downloadZip(files);
			
		}

	@Override
	public boolean delete(Long id) {
		
		Optional<ComprobanteFiscal> value;
		ComprobanteFiscal comprobanteFiscal = null;
		
		value = superRepo.findComprobanteById(id);
		
		if (value.isPresent()) {
			
			comprobanteFiscal = value.get();
			
			if(comprobanteFiscal instanceof ComplementoPago) {
				clearComplemento((ComplementoPago) comprobanteFiscal);
			}
			
			superRepo.delete(comprobanteFiscal);
			
			return true;
		}
		
		return false;
		
	}

	@Override
	public boolean deleteAll(List<Long> ids) {
		//TODO usar el remove complemento
		List<ComprobanteFiscal> comprobantes = new ArrayList<>();
				
		try {
			
			comprobantes = superRepo.findAllComprobanteById(ids);
			
			comprobantes.forEach(comprobante -> comprobante.delete());
			
			return true;
			
		} catch (Exception e) {
			
			return false;
		}
		
	}
	
	public boolean updateCfdFile(MultipartFile file, Long id) {
		
		ComprobanteFiscal comprobante;
		Optional<ComprobanteFiscal> value = superRepo.findComprobanteById(id);
		
		if (value.isPresent()) {
			
			comprobante = value.get();
			
			comprobante.fetchPDF().actualizar(file);
			
			return true;
		
		}else {
			
			return false;
		}
	}
	
	public boolean updateCfdInformation(ComprobanteFiscalDTO documento) {
		
		Optional<Proveedor> proveedor = null;
		Optional<ComprobanteFiscal> comprobante = superRepo.findComprobanteById(documento.getIdComprobanteFiscal());
		
		if (comprobante.isPresent()) {
			
			//Checar que la clave del proveedor del comprobante sea consistente 	
			if(documento.getIdProveedor() != null) {

				proveedor = superRepo.findProveedorById(documento.getIdProveedor());
			}
			
			try {
				
				if(comprobante.get().actualizar(documento, proveedor)) {
					
					superRepo.save(comprobante.get());
					
					return true;
					
				} else {
					
					return false;
				}
				
			} catch (Exception e) {
				
				Log.activity("Error al actualizar CFDI: " +documento.getUuid(), comprobante.get().getEmpresaNombre(), "ERROR");
				return false;
			}
			
			
		} else {
			
			return false;
		}
		
	}
	

	
	public boolean refreshEstatusSat(Long id) {
		
		Optional<ComprobanteFiscal> comprobante = superRepo.findComprobanteById(id);
		
		if(comprobante.isPresent()) {
			
			if(comprobante.get().verificaSat()) {
				
				superRepo.save(comprobante.get());
				
				return true;
				
			} else {
				
				return false;
			}

			
		} else {
			
			return false;
		}
		
	}
	
	
	
	
	
	
	private ComprobanteFiscal makeCfd(Documento documento) throws NotFoundException {
		
		ComprobanteFiscal comprobanteFiscal;
		Comprobante model;
		String tipoComprobante;
		Empresa receptor;
		Proveedor emisor;
		Consecutivo consecutivo;
		List<Proveedor> proveedores;
		
		model = documento.getArchivoXML().toCfdi();
		tipoComprobante = model.getTipoDeComprobante();
		
		receptor = empresaRepo.findByRfc(model.getReceptorRfc());
		proveedores = proveedorRepo.findAllByEmpresasAndRfc(receptor, model.getEmisorRfc());
		
		// get the proper provider
		if (proveedores.size() > 1 || proveedores.isEmpty()) {
			// more than one found in the query for PROVEEDOR, use PROVEEDOR GENERICO
			// instead.
			emisor = proveedorRepo.findByEmpresasAndNombre(receptor, "PROVEEDOR GENÉRICO");
		} else {
			emisor = proveedores.get(0);
		}

		// use the proper sequence for the company and module
		consecutivo = consecutivoRepo.findByEmpresaAndModulo(receptor, "Documentos Fiscales");
		
		if (tipoComprobante.equalsIgnoreCase("I")) {
			
			comprobanteFiscal = new Factura(documento);
			
		} else if (tipoComprobante.equalsIgnoreCase("E")) {
			
			comprobanteFiscal = new NotaDeCredito(documento); 
			
		} else if (tipoComprobante.equalsIgnoreCase("P")) {
			
			comprobanteFiscal = new ComplementoPago(documento);
			
		} else {
			// throw error since no document type was found
			throw new NotFoundException("No se encontro el tipo de documento para procesar el comprobante fiscal. ("+tipoComprobante+")");
		}
		
		// assigning base values to the CFD
		comprobanteFiscal.setEmpresa(receptor);
		comprobanteFiscal.setProveedor(emisor);
		comprobanteFiscal.setIdNumSap(consecutivo.getNext());
		
		consecutivoRepo.save(consecutivo);
		
		return comprobanteFiscal;
		
	}
	
	private void matchFacturaWithComplemento (ComplementoPago complementoPago) {
		
		Factura factura;
		
		try {
			
			// the related document is identified by a string variable containing the UUID for a particular invoice.
			for (String docRelacionado : complementoPago.getUuidRelacionadosList()) {
				
				factura = facturaRepo.findByUuid(docRelacionado);
				
				if (factura != null) {
					
					factura.setComplemento(complementoPago);
					
					superRepo.save(factura);
					
				}
			}
			
		} catch (NullPointerException e) {
			
			Log.falla(e.getMessage(), "ERROR");
		}
		
		
	}
	
	private boolean clearComplemento(ComplementoPago complementoPago) {
	    
	    List<Factura> facturas = facturaRepo.findAllByComplemento(complementoPago);

	    if (!facturas.isEmpty()) {
	    	
	      facturas.forEach(factura -> factura.removeComplemento());
	      
	      facturaRepo.saveAll(facturas);
	    }
	    
	    return true;

	  }
	


	

	

}

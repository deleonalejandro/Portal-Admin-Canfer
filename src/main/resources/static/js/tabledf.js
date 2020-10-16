	//Formato para rows tipo child	  
  function format(d){
	        if (d.complemento == null) {
	         // `d` is the original data object for the row
	         return '<table class="" style="text-align: left">' +
	             '<tr>' +
	            	'<a class="btn btn-datatable btn-icon btn-transparent-dark float-left btn-xl" href="/documentosFiscalesClient/preview/pdf/'+d.idComprobanteFiscal+'"><i class="fa fa-file-pdf fa-2x" style="color:red"></i></a>' +
					'<a class="btn btn-datatable btn-icon btn-transparent-dark float-left btn-xl" href="/documentosFiscalesClient/preview/xml/'+d.idComprobanteFiscal+'"><i class="fas fa-file-code fa-2x" style="color:green"></i></a>'+
					'<span class="ml-0 float-left fa-stack fa-2x"><i class="fas fa-file-invoice-dollar fa-stack-1x " style="color:teal"></i><i class="fas fa-slash fa-stack-1x" style="color:red"></i></span>'+
	             '</tr>' +
	         '</table>';  
	         } else{
	         return '<table class="" style="text-align: left">' +
	             '<tr>' +
	            	'<a class="btn btn-datatable btn-icon btn-transparent-dark float-left btn-xl" href="/documentosFiscalesClient/preview/pdf/'+d.idComprobanteFiscal+'"><i class="fa fa-file-pdf fa-2x" style="color:red"></i></a>' +
					'<a class="btn btn-datatable btn-icon btn-transparent-dark float-left btn-xl" href="/documentosFiscalesClient/preview/xml/'+d.idComprobanteFiscal+'"><i class="fas fa-file-code fa-2x" style="color:green"></i></a>'+
					'<a class="btn btn-datatable btn-icon btn-transparent-dark float-left btn-xl" href="/documentosFiscalesClient/preview/xml/'+d.complemento.getIdComprobanteFiscal()+'"><i class="fas fa-file-invoice-dollar fa-2x" style="color:teal"></i></a>'+	
	             '</tr>' +
	         '</table>';
	         
	         }
	    };
	    
        //Tabla en si
		
		$(document).ready(function () {
			
		         var table = $('#facturas').DataTable({
		         
			         buttons: [
				        'csv'
				    ],
					ajax: {
		            url: "/documentosFiscalesApi?empresa=" + $("#selectedCompany").text(),
					dataSrc:""
		        	},
					scrollX:true,
					"language": {
			            "url": "//cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/Spanish.json"
			        },
			             "columns": [
			              {
			                "className":  'select-control', 
			                "orderable":  false,
			                "data": null,
			                "defaultContent": '',
							"render": function () {
		                        return '<a class="btn btn-datatable btn-icon btn-transparent-dark"><i data-feather="check-circle"></i><script> feather.replace()</script></a>' ;
		                     },
			            },
					        {
			                "className":      'details-control', 
			                "orderable":      false,
			                "data":           null,
			                "defaultContent": '',
							"render": function () {
		                        return '<a class="btn btn-datatable btn-icon btn-chevrons btn-transparent-dark m-0"><i data-feather="chevrons-down"></i><script> feather.replace()</script></a>' ;
		                     },
			            },
							{
		                     "className": 'modal-control',
		                     "orderable": false,
							"bSortable": false,
		                     "data": null,
		                     "defaultContent": '',
		                     "render": function () {
		                        return '<a class="btn btn-datatable btn-icon btn-transparent-dark m-0"><i data-feather="list"></i><script> feather.replace()</script></a>'
							 },
		                 },
						{
		                     "className": 'delete-control',
		                     "orderable": false,
							 "bSortable": false,
		                     "data": null,
		                     "defaultContent": '',
		                     "render": function () {
		                        return '<a class="btn btn-datatable btn-icon btn-transparent-dark m-0"><i data-feather="trash"></i><script> feather.replace()</script></a>' ;
		                     },
		                 },
		
		                { data : "idNumSap" },
		                { data : "bitRS" ,
		                    "render": function(data) {
		                        if(data == false) {
		                            return '<i class="far fa-square" ></i>';
		                        }
		                        if(data == true) {
		                            return '<i class="far fa-check-square" ></i>';
		                        }
							}
						 },
		                { data : "folio" },
						{ data : "proveedor.claveProv"},
						{ data : "proveedor.nombre" },
						{ data : "rfcProveedor" },
						{ data : "tipoDocumento",
		                    "render": function(data) {
		                        if(data == 'I') {
		                            return '<button class="btn btn-pink btn-icon btn-xs" type="button">I</button>';
		                        }
		                        if(data == 'E') {
		                            return '<button class="btn btn-indigo btn-icon btn-xs" type="button">E</button>';
		                        }
								if(data == 'P') {
								    return '<button class="btn btn-teal btn-icon btn-xs" type="button">P</button>';
								}
						     }
						},
						{ data : "total" },
						{ data: "estatusPago",
		                    "render": function(data) {
		                        if(data == 'EN PROCESO') {
		                            return '<span class="badge badge-orange">En Proceso</span>';
		                        }
		                        if(data == 'PAGADO') {
		                            return '<span class="badge badge-green">Pagado</span>';
		                        }
								if(data == 'CANCELADO') {
								    return '<span class="badge badge-red">Cancelado</span>';
								}
						     }
						},
						{ data : "fechaEmision" },
						{ data : "fechaEmision" },
						{ data : "total" },
						{ data : "fechaEmision" }
		             ],
		             "order": [[4, 'asc']],
					
		 });
 			
			// IMPROVE METHODS
			$('#reloadTableBtn').on('click', function() {
				var proveedor = "proveedor=" + $("#inputFiltroProveedor").val();
				var empresa = "empresa=" + $("#selectedCompany").text();
				var fechaInicial = "registeredBefore=" + $("#inputFiltroProveedor").text();
				var fechaFinal = "registeredAfter=" + $("#inputFiltroProveedor").text();
				var folioInicial = "sequenceAfter=" + $("#inputFiltroFolioInicial").val();
				var folioFinal = "sequenceBefore=" + $("#inputFiltroFolioFinal").val();
				var importeInicial = "totalAfter=" + $("#inputFiltroImporteDesde").val();
				var importeFinal = "totalBefore=" + $("#inputFiltroImporteHasta").val();
				var uuid = "uuid=" + $("#inputFiltroUUID").val();
				var numSap = "idNumSap=" + $("#inputFiltroIdSap").val();
				var estatus = "estatusPago=" + $("#inputFiltroEstatus").val();
				var rs = "checkSap=" + $("#checkRS").val();
				if($("#checkGenerico").val() == true){
					var generico = "generico" 
				}
				var link = "/documentosFiscalesApi?"
							+ empresa + "&"
							+ proveedor + "&"
							+ uuid + "&"
							+ numSap + "&"
							+ estatus + "&"
							+ rs + "&";
							
				table.ajax.url(link).load();
			
			});
			
			
 			// Funcion para monitorear si esta cerrado o abierto
					
		         $('#facturas tbody').on('click', 'td.details-control', function () {
		             var tr = $(this).closest('tr');
		             var row = table.row(tr);
		             if (row.child.isShown()) {
		                 // Esta abierto, se cierra
		                 row.child.hide();
		                 tr.removeClass('shown')
		             }
		             else {
		                 //Esta cerrado, se abre
		                 row.child(format(row.data())).show();
		                 tr.addClass('shown')
		                 tr.a.find('.svg').hide();		             
		             }	
		
				});
				
				// Funcion para monitorear si esta cerrado o abierto
					
		         $('#btn-prev-pdf tbody').on('click', function () {
		          
		             var tr = $(this).closest('tr');
		             var row = table.row(tr);
		             if (row.child.isShown()) {
		                 // Esta abierto, se cierra
		                 row.child.hide();
		                 tr.removeClass('shown')
		             }
		             else {
		                 //Esta cerrado, se abre
		                 row.child(format(row.data())).show();
		                 tr.addClass('shown'); 
		                 $("svg.feather.feather-chevrons-down").replaceWith(feather.icons.square.toSvg());		             
		             }	
		
				});
				
				// Funcion para modal
					
		         $('#facturas tbody').on('click', 'td.modal-control', function () {
					var tr = $(this).closest('tr');
		            var data = table.row($(this).parents(tr)).data();
					var modData = JSON.stringify(data);
					var jsonData = JSON.parse(modData);
					
					
					$('.detailsForm #uuid').val(jsonData.uuid)
					$('.detailsForm #idNumSap').val(jsonData.idNumSap)
					$('.detailsForm #empresa').val(jsonData.empresa.nombre)
					$('.detailsForm #proveedor').val(jsonData.proveedor.nombre)
					$('.detailsForm #serie').val(jsonData.serie)
					$('.detailsForm #folio').val(jsonData.folio)
					
					$('.detailsForm #rfcEmpresa').val(jsonData.rfcEmpresa)
					$('.detailsForm #rfcProveedor').val(jsonData.rfcProveedor)
					$('.detailsForm #fechaEmision').val(jsonData.fechaEmision)
					$('.detailsForm #fechaTimbre').val(jsonData.fechaTimbre)
					$('.detailsForm #noCertificadoEmpresa').val(jsonData.noCertificadoEmpresa)
					$('.detailsForm #noCertificadoSAT').val(jsonData.noCertificadoSat)
					$('.detailsForm #versionCFD').val(jsonData.versionCfd)
					$('.detailsForm #versionTimbre').val(jsonData.versionTimbre)
					$('.detailsForm #moneda').val(jsonData.moneda)
					$('.detailsForm #total').val(jsonData.total)
					$('.detailsForm #tipoDocumento').val(jsonData.tipoDocumento)
					$('.detailsForm #estatusPago').val(jsonData.estatusPago)
					$('.detailsForm #estatusSAT').val(jsonData.estatusSAT)
					$('.detailsForm #respuestaValidacion').val(jsonData.respuestaValidacion)
					$('.detailsForm #errorValidacion').val(jsonData.errorValidacion)
					$('.detailsForm #comentario').val(jsonData.comentario)
					         
			        $('.detailsForm #bitRSusuario').prop("checked", jsonData.bitRSusuario);
			        $('.detailsForm #bitRS').prop("checked", jsonData.bitRS);
					$('.detailsForm #bitValidoSAT').prop("checked", jsonData.bitValidoSAT);
					
					$('.detailsForm .refreshBtn').attr("href","/documentosFiscalesClient/getVigencia/"+jsonData.idComprobanteFiscal)
					
					$('.detailsForm #facturaNotaComplemento').val(jsonData.facturaNotaComplemento)
					
					$('.detailsForm .pdfBtn').attr("href","/documentosFiscalesClient/download/pdf/"+jsonData.idComprobanteFiscal)
					$('.detailsForm .xmlBtn').attr("href","/documentosFiscalesClient/download/xml/"+jsonData.idComprobanteFiscal)
					
					
					$(' .detailsForm #detailsModal').modal('show');
					
				});
				
				
						
				// Funcion para delete
					
		         $('#facturas tbody').on('click', 'td.delete-control', 'tr', function (event) {
			
					event.preventDefault();
					
					var tr = $(this).closest('tr');
		            var data = table.row($(this).parents(tr)).data();
					var modData = JSON.stringify(data);
					var jsonData = JSON.parse(modData);
					
					$('.deleteForm .delBtn').attr("href","/documentosFiscalesClient/delete/"+jsonData.idComprobanteFiscal)
					$('#deleteModal').modal('show');
				});
				
				//Funcion para seleccionar
				
				$('#facturas tbody').on('click', 'td.select-control', function () {
		             var tr = $(this).closest('tr');
		             if ($(tr).hasClass('selected')) {
		                 tr.removeClass('selected')
		             }
		             else {
		                 tr.addClass('selected')
						
		             }	
		
				});
			 
					
				    // Handle click on "Expand All" button
				    $('#btn-show-all-children').on('click', function(){
				        // Enumerate all rows
				        table.rows().every(function(){
				            if(!this.child.isShown()){
				                // Open this row
				                this.child(format(this.data())).show();
				                $(this.node()).addClass('shown');
				            }
				        });
				    });
				
				    // Handle click on "Collapse All" button
				    $('#btn-hide-all-children').on('click', function(){
				        // Enumerate all rows
				        table.rows().every(function(){
				            if(this.child.isShown()){
				                // Collapse row details
				                this.child.hide();
				                $(this.node()).removeClass('shown');
				            }
				        });
				    });
				    

					// Boton de borrar varios
				    $('#btn-del-mul').on('click', function(){
					if ( table.rows( '.selected' ).any() ) {
				        // Enumerate all rows
						var ids = [];
						table.rows().every(function(){
				            if ($(this.node()).hasClass('selected')) {
							var data = this.data()
							var jsonData = JSON.parse(JSON.stringify(data)).idComprobanteFiscal;
									ids.push(jsonData);
				 		  }
				       });
					$('.deleteForm .delBtn').attr("href","/documentosFiscalesClient/deleteMultipleFacturas?ids="+ids)
					$('#deleteModal').modal('show');
					}
				});
				
				
				// Boton de descargar varios
				    $('#xml').on('click', function(){
					if ( table.rows( '.selected' ).any() ) {
				        // Enumerate all rows
						var ids = [];
						table.rows().every(function(){
				            if ($(this.node()).hasClass('selected')) {
							var data = this.data()
							var jsonData = JSON.parse(JSON.stringify(data)).idComprobanteFiscal;
									ids.push(jsonData);
				 		  }
				       });
					$('#xml').attr("href","/documentosFiscalesClient/download/xml?ids="+ids)
					}
				});
				
				$('#pdf').on('click', function(){
					if ( table.rows( '.selected' ).any() ) {
				        // Enumerate all rows
						var ids = [];
						table.rows().every(function(){
				            if ($(this.node()).hasClass('selected')) {
							var data = this.data()
							var jsonData = JSON.parse(JSON.stringify(data)).idComprobanteFiscal;
									ids.push(jsonData);
				 		  }
				       });
					$('#pdf').attr("href","/documentosFiscalesClient/download/pdf?ids="+ids)
					}
				});
				
				$('#csv').on('click', function(){
					if ( table.rows( '.selected' ).any() ) {
				        // Enumerate all rows
						var ids = [];
						table.rows().every(function(){
				            if ($(this.node()).hasClass('selected')) {
							var data = this.data()
							var jsonData = JSON.parse(JSON.stringify(data)).idComprobanteFiscal;
									ids.push(jsonData);
				 		  }
				       });
					$('#csv').attr("href","/documentosFiscalesClient/csv?ids="+ids)
					}
				});
				
				
				
				$('#comprimir').on('click', function(){
					if ( table.rows( '.selected' ).any() ) {
				        // Enumerate all rows
						var ids = [];
						table.rows().every(function(){
				            if ($(this.node()).hasClass('selected')) {
							var data = this.data()
							var jsonData = JSON.parse(JSON.stringify(data)).idComprobanteFiscal;
									ids.push(jsonData);
				 		  }
				       });
					$('#comprimir').attr("href","/documentosFiscalesClient/zip-download?cfdId="+ids)
					}
				});
				
				$("#selectAll").on( "click", function(e) {
				
			    if ($(this).is( ":checked" )) {
			        table.rows( { search: 'applied' } ).select();        
			    } else {
			        table.rows(  ).deselect(); 
			    }
				});
				
				
				//PASTEÑAS DEL SIDE NAV BAR
				
				$("#pestañaFacturas").on( "click", function() {
				table.rows().every(function(){($(this.node()).removeClass('selected'))});
				$("#pestañaFacturas").addClass("active")
				$("#pestañaInicio, #pestañaAvisos, #pestañaNotas, #pestañaCompl").removeClass("active") 
				table
					table
					    .columns( 10 )
					    .search( 'I' )
					    .draw();
				
			});
			
			$("#pestañaInicio").on( "click", function() {
				table.rows().every(function(){($(this.node()).removeClass('selected'))});
				$("#pestañaInicio").addClass("active")
				$("#pestañaFacturas, #pestañaAvisos, #pestañaNotas, #pestañaCompl").removeClass("active") 
				table
					table
					    .columns( 10 )
					    .search( '' )
					    .draw();
			});
			
			$("#pestañaCompl").on( "click", function() {
				table.rows().every(function(){($(this.node()).removeClass('selected'))});
				$("#pestañaCompl").addClass("active")
				$("#pestañaInicio, #pestañaAvisos, #pestañaNotas, #pestañaFacturas").removeClass("active") 
				table
					table
					    .columns( 10 )
					    .search( 'P' )
					    .draw();
			});
			
			$("#pestañaNotas").on( "click", function() {
				table.rows().every(function(){($(this.node()).removeClass('selected'))});
				$("#pestañaNotas").addClass("active")
				$("#pestañaFacturas, #pestañaAvisos, #pestañaInicio, #pestañaCompl").removeClass("active") 
				table
					table
					    .columns( 10 )
					    .search( 'E' )
					    .draw();
			});
			
			
				
		});
				
			
 
		
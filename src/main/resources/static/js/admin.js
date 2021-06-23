$(document).ready(function() {
	// Tabla de proveedores
	var tableProveedor = $('#proveedorTable').DataTable({
		select: true,
		ajax: {
			url: "/catalogsAPI/getSuppliers",
			dataSrc: ""
		},
		scrollX: true,
		"language": {
			"url": "//cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/Spanish.json"
		},
		columns: [
			{
				"className": 'delete-control',
				"orderable": false,
				"bSortable": false,
				"data": null,
				"defaultContent": '',
				"render": function() {
					return '<a class="deleteBtn btn btn-datatable btn-icon btn-transparent-dark m-0"><i data-feather="trash-2"></i></a><script>feather.replace()</script>';

				},
			},
			{
				"className": 'edit-control',
				"orderable": false,
				"bSortable": false,
				"data": null,
				"defaultContent": '',
				"render": function() {
					return '<a class="editBtn btn btn-datatable btn-icon btn-transparent-dark m-0"><i data-feather="edit"></i></a><script>feather.replace()</script>';

				},
			},
			{ data: "nombreEmpresa" },
			{ data: "nombre" },
			{ data: "claveProv" },
			{ data: "rfc" },
			{ data: "serie" },
			{ data: "moneda" },
			{ data: "bitActivo" },
			{ data: "contacto" },
			{ data: "correo" },
			{ data: "telefono" },
			{ data: "paginaWeb" },
			{ data: "localidad" },
		],
		"order": [[3, 'asc']],
	});
	
	// Select y creacion de sucursales
	
	$('#proveedorTable tbody').on( 'click', 'tr', function () {
        if ( $(this).hasClass('selected') ) {
            $(this).removeClass('selected');
        }
        else {
            tableProveedor.$('tr.selected').removeClass('selected');
            $(this).addClass('selected');
        }
    } );
 
    $('#provToSuc').click( function () {
        jsonData = tableProveedor.row('.selected').data();
        
        var addSuc = $.ajax({
								  url: "/addsucursal?idProveedor="+jsonData.idProveedor,
								  cache: false,
								  contentType: false,
								  processData: false,
								  type: 'GET',
								});
				
				addSuc.done(function(upload) {
		
			if (upload == true) {
				$('#alert-addsuc').prop('hidden', false);
			} else {
				$('#alert-error-addsuc').prop('hidden', false);
			} 

			setTimeout(function() {
				$('.alert').prop('hidden', true);

			}, 6000);


		});
    } );
    

	// Tabla de usuarios	
	var tableUsuario = $('#userTable').DataTable({
		ajax: {
			url: "/catalogsAPI/getUsersPA",
			dataSrc: ""
		},
		scrollX: true,
		"language": {
			"url": "//cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/Spanish.json"
		},
		columns: [
			{
				"className": 'delete-control',
				"orderable": false,
				"bSortable": false,
				"data": null,
				"defaultContent": '',
				"render": function() {
					return '<a class="deleteBtn btn btn-datatable btn-icon btn-transparent-dark m-0"><i data-feather="trash-2"></i></a><script>feather.replace()</script>';

				},
			},
			{
				"className": 'edit-control',
				"orderable": false,
				"bSortable": false,
				"data": null,
				"defaultContent": '',
				"render": function() {
					return '<a class="editBtn btn btn-datatable btn-icon btn-transparent-dark m-0"><i data-feather="edit"></i></a><script>feather.replace()</script>';

				},
			},
			{ data: "empresasNombre"},
			{ data: "type"},
			{ data: "nombre" },
			{ data: "apellido" },
			{ data: "username" },
			{ data: "correo" },
			{ data: "rol" },
			{ data: "permisos" },
			{ data : "activo" ,
	            "render": function(data) {
	                if(data == false) {
	                    return '<i class="far fa-square" ></i>';
	                }
	                if(data == true) {
	                    return '<i class="far fa-check-square" ></i>';
	                }
				}
			 },
		],
		"order": [[3, 'asc']],
	});
	
	// Tabla de usuario proveedor
	var tableUsuarioProveedor = $('#userProveedorTable').DataTable({
		ajax: {
			url: "/catalogsAPI/getUsersPP",
			dataSrc: ""
		},
		scrollX: true,
		"language": {
			"url": "//cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/Spanish.json"
		},
		columns: [
			{
				"className": 'delete-control',
				"orderable": false,
				"bSortable": false,
				"data": null,
				"defaultContent": '',
				"render": function() {
					return '<a class="deleteBtn btn btn-datatable btn-icon btn-transparent-dark m-0"><i data-feather="trash-2"></i></a><script>feather.replace()</script>';

				},
			},
			{
				"className": 'edit-control',
				"orderable": false,
				"bSortable": false,
				"data": null,
				"defaultContent": '',
				"render": function() {
					return '<a class="editBtn btn btn-datatable btn-icon btn-transparent-dark m-0"><i data-feather="edit"></i></a><script>feather.replace()</script>';

				},
			},
			{ data: "empresasNombre"},
			{ data: "rfcProveedor"},
			{ data: "type"},
			{ data: "nombre" },
			{ data: "apellido" },
			{ data: "username" },
			{ data: "correo" },
			{ data: "rol" },
			{ data: "permisos" },
			{ data : "activo" ,
	            "render": function(data) {
	                if(data == false) {
	                    return '<i class="far fa-square" ></i>';
	                }
	                if(data == true) {
	                    return '<i class="far fa-check-square" ></i>';
	                }
				}
			 },
		],
		"order": [[3, 'asc']],
	});
	
	// Tabla de empresa
	var tableEmpresa = $('#empresaTable').DataTable({
		scrollX: true,
		"language": {
			"url": "//cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/Spanish.json"
		}
		
	});

	/****** Funciones para las tablas: elimar, editar *******/

	// Funciona para editar tabla usuarios
	$('#userTable tbody').on('click', '.editBtn', function() {
		var tr = $(this).closest('tr');
		var data = tableUsuario.row($(this).parents(tr)).data();
		var modData = JSON.stringify(data);
		var user = JSON.parse(modData);

		$("#userId").val(user.idUsuario);
		$("#inputUsername").val(user.username);
		$("#inputFirstName").val(user.nombre);
		$("#inputLastName").val(user.apellido);
		$("#dropdownRoles").val(user.rol);
		$("#dropdownPermisos").val(user.permisos.split(','));
		$("#inputEmailAddress").val(user.correo);
		$("#dropdownEmpresas").val(user.empresasId.join());
		$("#checkActivo").prop('checked', user.activo);


		$('#editModal').modal('show');

	});

	// Funcion para delete usuarios
	$('#userTable tbody').on('click', 'td.delete-control', 'tr', function(event) {

		event.preventDefault();

		var tr = $(this).closest('tr');
		var data = tableUsuario.row($(this).parents(tr)).data();
		var modData = JSON.stringify(data);
		var jsonData = JSON.parse(modData);

		$('.deleteForm .delBtn').attr("href", "user/delete/" + jsonData.idUsuario)
		$('#deleteModal').modal("show");
	});
	
		// Funciona para editar tabla usuarios proveedor
	$('#userProveedorTable tbody').on('click', '.editBtn', function() {
		var tr = $(this).closest('tr');
		var data = tableUsuarioProveedor.row($(this).parents(tr)).data();
		var modData = JSON.stringify(data);
		var user = JSON.parse(modData);

		$("#userId").val(user.idUsuario);
		$("#inputUsername").val(user.username);
		$("#inputFirstName").val(user.nombre);
		$("#inputLastName").val(user.apellido);
		$("#dropdownRoles").val(user.rol);
		$("#dropdownPermisos").val(user.permisos.split(','));
		$("#inputEmailAddress").val(user.correo);
		$("#dropdownEmpresas").val(user.empresasId.join());
		$("#checkActivo").prop('checked', user.activo);


		$('#editModal').modal('show');

	});

	// Funcion para delete usuarios proveedor
	$('#userProveedorTable tbody').on('click', 'td.delete-control', 'tr', function(event) {

		event.preventDefault();

		var tr = $(this).closest('tr');
		var data = tableUsuarioProveedor.row($(this).parents(tr)).data();
		var modData = JSON.stringify(data);
		var jsonData = JSON.parse(modData);

		$('.deleteForm .delBtn').attr("href", "user/delete/" + jsonData.idUsuario)
		$('#deleteModal').modal("show");
	});


	// Funcion para editar proveedores

	$('#proveedorTable tbody').on('click', '.editBtn', function() {
		
		var tr = $(this).closest('tr');
		var data = tableProveedor.row($(this).parents(tr)).data();
		var modData = JSON.stringify(data);
		var jsonData = JSON.parse(modData);

		$("#idProveedor").val(jsonData.idProveedor);
		$("#inputEmpresa").val(jsonData.nombreEmpresa);
		$("#inputRfc").val(jsonData.rfc);
		$("#inputClaveProv").val(jsonData.claveProv);
		$("#inputNombre").val(jsonData.nombre);
		$("#inputCorreo").val(jsonData.correo);
		$("#inputCalle").val(jsonData.calle);
		$("#inputExterior").val(jsonData.numExt);
		$("#inputInterior").val(jsonData.numInt);
		$("#inputLocalidad").val(jsonData.localidad);
		$("#inputReferencia").val(jsonData.referencia);
		$("#inputMoneda").val(jsonData.moneda);
		$("#inputPaginaWeb").val(jsonData.paginaWeb);
		$("#checkActivo").prop('checked', jsonData.bitActivo);
		$("#dropdownEmpresas").val(jsonData.empresasId);
		$("#inputTelefono").val(jsonData.telefono);
		$("#inputContacto").val(jsonData.contacto);
		


		$('#editModal').modal('show');

	});

	// Funcion para delete en proveedores

	$('#proveedorTable tbody').on('click', 'td.delete-control', 'tr', function(event) {

		event.preventDefault();

		var tr = $(this).closest('tr');
		var data = tableProveedor.row($(this).parents(tr)).data();
		var modData = JSON.stringify(data);
		var jsonData = JSON.parse(modData);

		$('.deleteForm .delBtn').attr("href", "supplier/delete/" + jsonData.idProveedor)
		$('#deleteModal').modal("show");
	});
	
	
	// Funcion para editar empresas

	$('#empresaTable .editBtn').on('click', function(event) {
		
		event.preventDefault();
		var href = $(this).attr('href');
		
		$.get(href, function(empresa, status){
			
			$("#idEmpresa").val(empresa.idEmpresa);
			$("#inputNombre").val(empresa.nombre);
			$("#inputRfc").val(empresa.rfc);
			$("#inputContacto").val(empresa.contacto);
			$("#inputCorreo").val(empresa.correo);
			$("#inputCalle").val(empresa.calle);
			$("#inputExterior").val(empresa.numExt);
			$("#inputColonia").val(empresa.colonia);
			$("#inputLocalidad").val(empresa.localidad);
			$("#inputReferencia").val(empresa.referencia);
			$("#inputCp").val(empresa.cp);
			$("#inputPaginaWeb").val(empresa.paginaWeb);
			$("#inputColor").val(empresa.color);
			
			
		})



		$('#editModal').modal('show');

	});
	
	// Clear cookies before when changing company
	$("#dashboardButton").on( "click", function() {
		
		Cookies.remove('fltr_on');
		
		Cookies.remove('fltr_proveedor');
		Cookies.remove('fltr_idNumSap');
		Cookies.remove('fltr_uuid');
		Cookies.remove('fltr_estatusPago');
		Cookies.remove('fltr_uploadAfter');
		Cookies.remove('fltr_uploadBefore');
		Cookies.remove('fltr_upload');
		Cookies.remove('fltr_registeredAfter');
		Cookies.remove('fltr_registeredBefore');
		Cookies.remove('fltr_register');
		Cookies.remove('fltr_sequenceAfter');
		Cookies.remove('fltr_sequenceBefore');
		Cookies.remove('fltr_totalAfter');
		Cookies.remove('fltr_totalBefore');
		Cookies.remove('fltr_generico');
		Cookies.remove('fltr_checkSap');
		Cookies.remove('fltr_hasComplemento');
		
		
	});







});

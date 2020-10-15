$(document).ready(function() {
	// Tabla de proveedores
	var tableProveedor = $('#proveedorTable').DataTable({
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

	// Tabla de usuarios	
	var tableUsuario = $('#userTable').DataTable({
		ajax: {
			url: "/catalogsAPI/getUsers",
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
			{ data: "nombre" },
			{ data: "apellido" },
			{ data: "username" },
			{ data: "password" },
			{ data: "correo" },
			{ data: "rol" },
			{ data: "permisos" },
			{ data: "activo" },
		],
		"order": [[3, 'asc']],
	});
	
	// Tabla de proveedores
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
		$("#inputExterior").val(jsonData.numInt);
		$("#inputEstado").val(jsonData.estado);
		$("#inputMunicipio").val(jsonData.municipio);
		$("#inputLocalidad").val(jsonData.localidad);
		$("#inputReferencia").val(jsonData.referencia);
		$("#inputMoneda").val(jsonData.moneda);
		$("#inputPaginaWeb").val(jsonData.paginaWeb);
		$("#checkActivo").prop('checked', jsonData.bitActivo);
		


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
			$("#inputEstado").val(empresa.estado);
			$("#inputMunicipio").val(empresa.municipio);
			$("#inputLocalidad").val(empresa.localidad);
			$("#inputReferencia").val(empresa.referencia);
			$("#inputCp").val(empresa.cp);
			$("#inputPaginaWeb").val(empresa.paginaWeb);
			
		})



		$('#editModal').modal('show');

	});







});
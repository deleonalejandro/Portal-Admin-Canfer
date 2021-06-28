$(document).ready(function() {
	// Tabla de proveedores
	var tableclas = $('#clasCCTable').DataTable({
		"pageLength": 25,
		select: true,
		ajax: {
			url: "/cajachicaclient/getclasificaciones",
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
				"render": function(row) {
					return '<a href="/cajachicaclient/removeclasificacion?id=' + row.idClasificacionCajaChica  +'" class="text-reset deleteBtn btn btn-datatable btn-icon btn-transparent-dark m-0"><i class="text-muted" data-feather="trash-2"></i></a><script>feather.replace()</script>';

				},
			},
			{ data: "clasificacion" },
		],
		"columnDefs": [
			{ "width": "2%", "targets": [0] }
		]
	});
	
	
 
	$('#añadirClassCC').on('click', function(){
		
		$('#newModal').modal('show')
	
	})

});
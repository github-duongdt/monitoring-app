// Call the dataTables jQuery plugin
$(document).ready(function () {
  setTimeout(() => {
    var table = $('#dataTable').DataTable(
      {
        select: true,
        dom: '<"row"<"col-sm-12 col-md-6"B><"col-sm-12 col-md-3"l><"col-md-3"f>>rt<"row"<"col-sm-12 col-md-6"i><"col-sm-12 col-md-6"p>>',
        lengthMenu: [
          [10, 50, 100, -1],
          ['10', '50', '100', 'All']
        ],
        buttons: [
          {
            extend: 'copyHtml5',
            text: '<i class="far fa-copy"></i> Copy',
            titleAttr: 'Copy'
          },
          {
            extend: 'excelHtml5',
            text: '<i class="far fa-file-excel"></i> Export EXCEL',
            titleAttr: 'Excel'
          },
          {
            extend: 'csvHtml5',
            text: '<i class="fas fa-file-csv"></i> Export CSV',
            titleAttr: 'CSV'
          },
        ],
        ajax: {
          url: '/ajax/table',
          dataSrc: '',
          method: 'GET',
          error: (msg) => alert('Failed to update table'),
        },
        columns: [
          { data: "TimeStamp", title: "Time Stamp", width: "20%" },
          { data: "temperature", title: "Temperature", width: "16%" },
          { data: "humidity", title: "Humidity", width: "16%" },
          { data: 'illuminance', title: "Illuminance", width: "16%" },
          { data: "ghi", title: "GHI", width: "16%" },
        ]
      }
    );

    setInterval(() => {
      table.ajax.reload(null, false)
    }, 30000);
  }, 1000);

});

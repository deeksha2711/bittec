function data()
{
    $.ajax({
        url: "http://52.51.206.46/arlo/data",
        cache: false,
        type: "POST",
        dataType: 'json',
        contentType: false,
        processData: false,
        timeout: 60000,
        success: function (result) {
            if (result.status == true)
            {
               var table = $('#example').DataTable({
                   lengthMenu:[
                       [10,25,50,100,-1],[10,25,50,100,'All']
                   ],
                   dom: 'lBfrtip',
        buttons: [
            {
                extend: 'pdfHtml5',
                orientation: 'landscape',
                pageSize: 'LEGAL'
            }
        ],
    columns: [
        {
            name: 'first',
            title: 'Device',
        },
        {
            name: 'second',
            
            title: 'Base Station ID',
        },
	{
            name: 'third',
            title: 'Device Type',
        },
        {
            title: 'Task',
        }, 
        {
            title: 'Start Time',
        },
	{
            title: 'Stop Time',
        },
	{
            title: 'Location',
        },
	{
            title: 'Alarm',
        },
	{
            title: 'Status',
        },
    ],
    data: result.data,
    rowsGroup: [
      'first:name',
      'second:name',
      'third:name',
    ],
    pageLength: '20',
    });
               
            } 
        },
        error: function (xhr, textStatus, errorThrown) {

            if (textStatus === 'timeout') {
                alert("Timeout. Please try again.", function () {

                });
            } else {
                alert("There is some problem. Please try again!!!", function () {

                });
            }
        }
    });
}

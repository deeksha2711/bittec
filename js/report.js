/*
 
 * Date: 07/29/2016
 * @Copyright VVDN Technologies Pvt Ltd
 * @author Deeksha Agarwal
 
 */
var windowURL = location.origin;
var basepath = "" + windowURL + "/arlo/";
var starttime = 0;//starttime variable for datepicker 
var endtime = 0;//endtime variable for datepicker
var Country;
var chartAlarms;
var chartWorkNon;
var chartDevice;
//function for datepicker

$(function () {
    
    $('#reportrange').daterangepicker({
        timePicker: true,
        timePickerIncrement: 30,
        locale: {
            format: 'YYYY/MM/DD h:mm A'
        }
    }, function (start, end)
    {
        
        var startTime = start.format('YYYY MM DD h:mm A');
        var endTime = end.format('YYYY MM DD h:mm A');
        var dateParts = startTime.split(' ');
        var timeParts = dateParts[3].split(':');
        if (dateParts[4].toString() == "pm" || dateParts[4].toString() == "PM")
        {
            var h = parseInt(timeParts[0]) + 12;
            timeParts[0] = h.toString();
        }
        var startdate = new Date(dateParts[0], parseInt(dateParts[1], 10) - 1, dateParts[2], timeParts[0], timeParts[1]);
        starttime = (startdate.getTime() / 1000);
        var datePartsEnd = endTime.split(' ');
        var timePartsEnd = datePartsEnd[3].split(':');
        if (datePartsEnd[4].toString() == "pm" || datePartsEnd[4].toString() == "PM")
        {
            var h = parseInt(timePartsEnd[0]) + 12;
            timePartsEnd[0] = h.toString();
        }
        var endDate = new Date(datePartsEnd[0], parseInt(datePartsEnd[1], 10) - 1, datePartsEnd[2], timePartsEnd[0], timePartsEnd[1]);
        endtime = (endDate.getTime() / 1000);
    }

    );
});

//Function for creating report on report page

function report()
{
    
    $.blockUI({message: '<img src="images/loader.gif" />', css: {backgroundColor: 'transparent', border: 'none'}});
    $.ajax({
         url: basepath + "report",
        cache: false,
        type: "GET",
        dataType: 'json',
        success: function (result) {
            $.unblockUI();
            if (result.status == true)
            {
                
                var working = result.report.working;//Working result
                var nonWorking = result.report.non_working;//Non Working result
                var critical = result.alarms.critical;//Critical result
                var major = result.alarms.major;//MAjor result
                var minor = result.alarms.minor;//Minor result
                var chart = result.chart;//Chart result
                var device = result.device;//Devices whole values
                // var arloGen3 = result.device.Arlo_Gen_3;//Device result
                //var arloO = result.device.ArloO;//Device result
                var lengthReport = Object.keys(chart).length;//Report length
                var countryArray = new Array();//Country Array
                for (var i = 0; i < result.country.length; i++)
                {
                    var CountrySelect = result.country[i]; //country values
                    countryArray.push(CountrySelect);//push values into Country Array
                    $("#location").append("<option class='countryVal' name='country' value=" + CountrySelect + ">" + CountrySelect + "</option>");

                }
                $('#location').multiselect({
                    includeSelectAllOption: true,
                    nonSelectedText: 'Select Zone'
                });
                var devicesSerialNo = new Array();//Device Type Serial Array
                var devicePassNo = new Array();//Device Pass Array
                var deviceFailNo = new Array();//Device Fail Array
                var workingNonWorkingReport = new Array();//Working Non working array
                var alarms = new Array();//Alarms array
                var devices = new Array();//Devices Array
                var devicesName = new Array();//Devices name for function
                var deviceBackgroundColor = new Array();//Devices Background Colour Array
                var deviceHoverColour = new Array();//Device hover Colour Array
                $("#working").append("" + working + "");//append working value on html
                $("#nonworking").append("" + nonWorking + "");//append nonworking value on html
                $("#major").append("" + major + "");//append major alarms value on html
                $("#minor").append("" + minor + "");//append minor alarms value on html
                $("#critical").append("" + critical + "");//append critical alarms value on html
                var l = 0;
                for (var obj in device)
                {
                    devicesName.push(obj);
                    // var arrayy1 = device[obj];
                    var deviceValues = device[obj][0];
                    var backgroundcolor = device[obj][1];
                    deviceBackgroundColor.push(backgroundcolor);
                    var hovercolor = device[obj][2];
                    deviceHoverColour.push(hovercolor);
                    $("#devicesName").append("<tr><td><p><i id='coloricon" + l + "' class='fa fa-square'></i>" + obj + " </p></td><td id='Gen'> " + deviceValues + "</td></tr>")
                    devices.push(deviceValues);//Push values  into array 
                    $("#coloricon" + l + "").css("color", "" + backgroundcolor + "");
                    l++;
                }
                // $("#Gen3").append("" + arloGen3 + "");//append arlogen3 device value on html
//                $("#notavailable").append("" + + "");
                // $("#arlo0").append("" + arloO + "");//append device value on html
                workingNonWorkingReport.push(working, nonWorking);//Push values into array
                WorkingNonworkingReport(workingNonWorkingReport);//Call Report Function
                alarms.push(major, minor, critical);//push values into array
                Alarms(alarms);//Call Alarms Function 
                devicesReport(devices, devicesName, deviceBackgroundColor, deviceHoverColour);//Call device report function
                deviceBackgroundColor = [];
                deviceHoverColour = [];
                for (var obj  in chart)// for loop for calculating highchart data 
                {
                    devicesSerialNo.push(obj);
                    report_device = obj;
                    var arrayy = chart[obj];
                    var pass = arrayy.pass;
                    devicePassNo.push(pass);
                    var fail = arrayy.fail;
                    deviceFailNo.push(fail);
                }
                createCameraReports(devicesSerialNo, devicePassNo, deviceFailNo);//call camera report function

            }
        },
        error: function (xhr, textStatus, errorThrown) {

            if (textStatus === 'timeout') {
                bootbox.alert("Timeout. Please try again.", function () {

                });
            } else {
                bootbox.alert("There is some problem. Please try again!!!", function () {

                });
            }
        }
    });
    $(".report").addClass('active');
     $(".logs,.index").removeClass('active');
     //$('html,body').scrollTop(0);
$('html, body').animate({ scrollTop: 0 }, 'fast');
}
//Function for working nonworking report
function WorkingNonworkingReport(workingNonWorkingReport)
{

    var options = {
        legend: false,
        responsive: false
    };

    chartWorkNon = new Chart(document.getElementById("canvas1"), {
        type: 'doughnut',
        tooltipFillColor: "rgba(51, 51, 51, 0.55)",
        data: {
            labels: [
                "Working",
                "Non-Working"
            ],
            datasets: [{
                    data: workingNonWorkingReport,
                    backgroundColor: [
                        "#9B59B6",
                        "#3498DB"
                    ],
                    hoverBackgroundColor: [
                        "#CFD4D8",
                        "#36CAAB",
                    ]
                }]
        },
        options: options
    });
}
//Function for creating alarms canvas
function Alarms(alarms)
{
    var options = {
        legend: false,
        responsive: false
    };
    chartAlarms = new Chart(document.getElementById("canvas2"), {
        type: 'doughnut',
        tooltipFillColor: "rgba(51, 51, 51, 0.55)",
        data: {
            labels: [
                "Major",
                "Minor",
                "Critical"
            ],
            datasets: [{
                    data: alarms,
                    backgroundColor: [
                        "violet",
                        "#3498DB",
                        "red"
                    ],
                    hoverBackgroundColor: [
                        "#CFD4D8",
                        "#36CAAB",
                        "#E95E4F"
                    ]
                }]
        },
        options: options
    });
}
//Function for creating devicereport
function devicesReport(devices, devicesName, deviceBackgroundColor, deviceHoverColour)
{
    var options = {
        legend: false,
        responsive: false
    };

    chartDevice = new Chart(document.getElementById("canvas3"), {
        type: 'doughnut',
        tooltipFillColor: "rgba(51, 51, 51, 0.55)",
        data: {
            labels: devicesName,
            datasets: [{
                    data: devices,
                    backgroundColor: deviceBackgroundColor,
                    hoverBackgroundColor: deviceHoverColour
                }]
        },
        options: options
    });

}

//Function for camera report
function createCameraReports(devicesSerialNo, devicePassNo, deviceFailNo)
{
    $('#cameragraph').highcharts({
        chart: {
            type: 'column'
        },
        title: {
            text: ''
        },
        xAxis: {
            categories: devicesSerialNo
        },
        yAxis: {
            min: 0,
            title: {
                text: 'Test Cases Report'
            }
        },
        tooltip: {
            headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
            pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                    '<td style="padding:0"><b>{point.y:.1f}</b></td></tr>',
            footerFormat: '</table>',
            shared: true,
            useHTML: true
        },
        plotOptions: {
            column: {
                maxPointWidth: 30,
                //pointPadding: 0.1,
                groupPadding: 0.3,
                borderWidth: 0
            }
        },
        series: [{
                name: 'Pass',
                data: devicePassNo,
                color: '#4caf50'

            }, {
                name: 'Fail',
                data: deviceFailNo,
                color: 'red'

            }, ]
    });
}
//function for 24 hour dataTable
function data()
{
    $.ajax({
        url: basepath + "data",
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
                    lengthMenu: [
                        [10, 25, 50, 100, -1], [10, 25, 50, 100, 'All']
                    ],
                    dom: 'lBfrtip',
                    buttons: [
                        {
                            extend: 'pdfHtml5',
                            text: 'Download',
                            orientation: 'landscape',
                            pageSize: 'LEGAL',
                            title: 'NTGU_ARLO_TESTSUITE_RESULT'
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
//                    pageLength: '20',
                });

            }
        },
        error: function (xhr, textStatus, errorThrown) {

            if (textStatus === 'timeout') {
                bootbox.alert("Timeout. Please try again.", function () {

                });
            } else {
                bootbox.alert("There is some problem. Please try again!!!", function () {

                });
            }
        }
    });
}
function showReportSubmit()
{
    

    $.blockUI({message: '<img src="images/loader.gif" />', css: {backgroundColor: 'transparent', border: 'none'}});
    var table = $('#example').DataTable();
    table.destroy();
    $('#example').empty();
    var countryValue = ($('#location').val());
    if (countryValue == null)
    {
        data = {starttime: starttime, endtime: endtime};
    } else
    {
        data = {country: countryValue, starttime: starttime, endtime: endtime};
    }
    data = JSON.stringify(data);
    setTimeout(callAjax("http://52.51.206.46/arlo/report", 'POST', data, showreportCallback), 1000);
    setTimeout(callAjax("http://52.51.206.46/arlo/data", 'POST', data, showrecordCallback), 5000);
}

//Callback function for report
function showreportCallback(result)
{
    
    $.unblockUI();
    $("#working,#nonworking,#major,#minor,#critical").html("");//empty fields
    $("#devicesName").html("");//empty table fields
    // chartDevice.destroy();
    chartAlarms.destroy();
    chartWorkNon.destroy();
    chartDevice.destroy();
    $("#canvas1,#canvas2,#canvas3").removeData();//remove canvas data
    if (result.status == true)
    {
        var working = result.report.working;//Working result
        var nonWorking = result.report.non_working;//Non Working result
        var critical = result.alarms.critical;//Critical result
        var major = result.alarms.major;//MAjor result
        var minor = result.alarms.minor;//Minor result
        var chart = result.chart;//Chart result
        var device = result.device;//Devices whole values
        // var arloGen3 = result.device.Arlo_Gen_3;//Device result
        //var arloO = result.device.ArloO;//Device result
        var lengthReport = Object.keys(chart).length;//Report length
        var devicesSerialNo = new Array();//Device Type Serial Array
        var devicePassNo = new Array();//Device Pass Array
        var deviceFailNo = new Array();//Device Fail Array
        var workingNonWorkingReport = new Array();//Working Non working array
        var alarms = new Array();//Alarms array
        var devices = new Array();//Devices Array
        var devicesName = new Array();//Devices name for function
        var deviceBackgroundColor = new Array();//Devices Background Colour Array
        var deviceHoverColour = new Array();//Device hover Colour Array
        $("#working").append("" + working + "");//append working value on html
        $("#nonworking").append("" + nonWorking + "");//append nonworking value on html
        $("#major").append("" + major + "");//append major alarms value on html
        $("#minor").append("" + minor + "");//append minor alarms value on html
        $("#critical").append("" + critical + "");//append critical alarms value on html
        var l = 0;
        for (var obj in device)
        {
            devicesName.push(obj);
            // var arrayy1 = device[obj];
            var deviceValues = device[obj][0];
            var backgroundcolor = device[obj][1];
            deviceBackgroundColor.push(backgroundcolor);
            var hovercolor = device[obj][2];
            deviceHoverColour.push(hovercolor);
            $("#devicesName").append("<tr><td><p><i id='coloricon" + l + "' class='fa fa-square'></i>" + obj + " </p></td><td id='Gen'> " + deviceValues + "</td></tr>")
            devices.push(deviceValues);//Push values  into array 
            $("#coloricon" + l + "").css("color", "" + backgroundcolor + "");
            l++;
        }
        workingNonWorkingReport.push(working, nonWorking);//Push values into array
        WorkingNonworkingReport(workingNonWorkingReport);//Call Report Function
        alarms.push(major, minor, critical);//push values into array
        Alarms(alarms);//Call Alarms Function 
        devicesReport(devices, devicesName, deviceBackgroundColor, deviceHoverColour);//Call device report function
//devices.push(arloGen3, arloO);//Push values  into array 
        //devicesReport(devices);//Call device report function
        for (var obj  in chart)// for loop for calculating highchart data
        {
            devicesSerialNo.push(obj);
            report_device = obj;
            var arrayy = chart[obj];
            var pass = arrayy.pass;
            devicePassNo.push(pass);
            var fail = arrayy.fail;
            deviceFailNo.push(fail);
        }
        createCameraReports(devicesSerialNo, devicePassNo, deviceFailNo);//call camera report function
    }
}

//CallBack function for datatable
function showrecordCallback(result)
{
    

    $.unblockUI();
    if (result.status == true)
    {
        var table = $('#example').DataTable({
            //destroy: true,
            //paging: false,
            //filter: false,
            // savestate: true,
            lengthMenu: [
                [10, 25, 50, 100, -1], [10, 25, 50, 100, 'All']
            ],
            dom: 'lBfrtip',
            buttons: [
                {
                    extend: 'pdfHtml5',
                    text: 'Download',
                    orientation: 'landscape',
                    pageSize: 'LEGAL',
                    title: 'NTGU_ARLO_TESTSUITE_RESULT'
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
//            pageLength: '20',
        });
    }
}
//Function for sending email
function email()
{
    var emailvalue = $("#inputEmail3").val();
    var emailArray = [];
    var splitComma = emailvalue.split(",");
    for (var i = 0; i < splitComma.length; i++)
    {
        var text = splitComma[i];
        emailArray.push(text);
    }
    var countryValue = $('#location').val();
    if (countryValue == null)
    {
        dataa = {mailData: {to_email: emailArray, starttime: starttime, endtime: endtime}};

    } else
    {
        dataa = {mailData: {country: countryValue, to_email: emailArray, starttime: starttime, endtime: endtime}};
    }

    data = JSON.stringify(dataa);

    setTimeout(callAjax("http://52.51.206.46/arlo/send_mail", 'POST', data , emailCallback), 1000);
    //$("#showText").html("Email send Successfully").css("color", "red");
    setTimeout(function ()
    {
        $("#myModalHorizontal").modal('hide');
    }, 1000);


    // $("#myModalHorizontal").modal('hide');
}
//Call Ajax function
var callAjax = function (url, type, data, callback)
{
    url = url;
    $.ajax({
        type: type,
        url: url,
        data: data,
        cache: false,
        dataType: "json",
        beforeSend: function (XMLHttpRequest) {
        },
        success: function (result) {
            //Validate Response				
            if (result.status == false) {

                bootbox.alert("No data");
            } else {
                //Success 
                callback(result);
            }
        },
        error: function () {
            bootbox.alert("There is some problem. Please try again!!!");
        }
    });
};
function emailCallback(result)
{
    
    if (result == 1)
    {
        bootbox.alert("Successfully send");
    }
}
function hideContent()
{
    $("#inputEmail3").val("");
}
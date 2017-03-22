/*
 
 * Date: 07/29/2016
 * @Copyright VVDN Technologies Pvt Ltd
 * @author Deeksha Agarwal
 
 */

//Global Variables
var chinaNonWorking = 0;
var chinaWorking = 0;
var northAmericaNonWorking = 0;
var northAmericaWorking = 0;
var europeNonWorking = 0;
var europeWorking = 0;
var asiaPacificNonWorking = 0;
var asiaPacificWorking = 0;

//CircleGraphic  Function
var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-36251023-1']);
_gaq.push(['_setDomainName', 'jqueryscript.net']);
_gaq.push(['_trackPageview']);

(function () {
    var ga = document.createElement('script');
    ga.type = 'text/javascript';
    ga.async = true;
    ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
    var s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(ga, s);
})();

var windowURL = location.origin;
var basepath = "" + windowURL + "/arlo/";

//for session
function session()
{
    $.ajax({
        url: basepath + "session_check",
        type: "GET",
        dataType: 'json',
        success: function (result)
        {
            if (result.status == true)
            {
            } else {
                bootbox.alert("Session Expired!!");
                location.href = "http://52.51.206.46/netgear-arlo/login.html"
            }
        },
        error: function () {
        }
    });
}
//Login Function
$("#pwd").keypress(function (e) {
    if (e.which == 13) {
        LogIN();
    }
});
function LogIN()
{
    if ($('#email1').val() === '' || $('#pwd').val() === '')
    {
        bootbox.alert('Please Fill the Email/Password');
        return false;
    }
    var e_mail = $("#email1").val();//Fetch email value
    var pass = $("#pwd").val();//Fetch password value
    var form = $('form')[0];//form data
    var formData = new FormData(form);
    $.ajax({
        url: basepath + "login",
        cache: false,
        type: "POST",
        data: formData,
        dataType: 'json',
        contentType: false,
        processData: false,
        success: function (result) {
            if (result.status == false)
            {
                bootbox.alert('Invalid Email or Password');
            } else {

                location.href = "http://52.51.206.46/netgear-arlo/index.html";
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

//Function for Index page on pageload
function home()
{
    $.blockUI({message: '<img src="images/loader.gif" />', css: {backgroundColor: 'transparent', border: 'none'}});
    $.ajax({
        url: basepath + "home",
        cache: false,
        type: "GET",
        dataType: 'json',
        success: function (result) {
            $.unblockUI();
            if (result.status == true)
            {
                var length = result.data.length;//Data length
                var dataCamera = new Array();//Camera data array
                var seriesValue = new Array();//Series value array
                var CmaeraIdValue = new Array();//Camera id array
                //Array for Graph Camera Id
                var cameraIdGraphValue = new Array();//Camera id for graph
                var red_color = new Array();//Color array for graph
                //cameraIdGraphValue.push('');
                for (var i = 0; i < length; i++)
                {
                    var countryName = result.data[i].country;//Country name
                    var alarm = result.data[i].alarm;//Alarm data
                    var accountHolderName = result.data[i].account_holder_name;//Account holder name
                    var cameraLength = Object.keys(result.data[i].graph[0]).length;//Camera length
                    cameraIdGraphValue.push(Object.keys(result.data[i].graph[0]));//push values into array
                    var tableDataLength = Object.keys(result.data[i].table_data[0]).length;//Camera id for table
                    var nonWorking = result.data[i].non_working;//Non working camera data
                    var working = result.data[i].working;//Working camera data
                    var totalCamera = result.data[i].total_camera;//Total camera data
                    $("#history_table").append("<tr style:'overflow-x: hidden'><td><i class='fa fa-plus-circle fa-2x down" + i + "' aria-hidden='true' onclick=togglefunction(\"" + i + "\"); ></i></td><td id='setTextColour'>" + countryName + "</td><td id='setTextColour'>" + accountHolderName + "</td><td id='setTextColour'>" + totalCamera + "</td><td style='color:#4caf50;font-size:15px'><b>" + working + "</b></td><td style='color:red;font-size:15px'><b>" + nonWorking + "</b></td><td id='setTextColour'>" + alarm + " </td></tr><tr class='group' id='row_map" + i + "' style='display:none;'><td colspan='4' class='map camreport' id='chartContainer" + i + "' style='padding-top: 35px; height: 250px; width:55%; color:red; fill:'red'></td><td colspan='3' ><table class='table' style = 'height:250px; overflow-y:hidden;'><thead><tr id='changeBackgroundColor'><th style='text-align: center'>Mac Address</th><th style='text-align: center'>Name</th><th style='text-align: center'>Pass</th><th style='text-align: center'>Fail</th></tr></thead><tbody id='idtable" + i + "'></tbody></table></td></tr>");
                    for (var j = 0; j < cameraLength; j++)
                    {
                        var graphValue = result.data[i].graph[j];//Graph value
                        var cameraId = Object.keys(result.data[i].graph[0])[j];//Graph Camera id
                        for (var obj  in graphValue)
                        {
                            var Grapharray = graphValue[obj];
                            for (var k = 0; k < Grapharray.length; k++)
                            {
                                var value1 = Grapharray[k][0];//Get serial number
                                var value2 = Grapharray[k][1];//Get timestamp
                                var time_s = (new Date(value2 * 1000));
                                var hours = time_s.getHours();//Get hours
                                var min = time_s.getMinutes();//Get minutes
                                if (min < 10)
                                {
                                    var min = "0" + min;
                                }
                                CmaeraIdValue.push(value2);//push values
                                var value3 = Grapharray[k][2];//Get pass values
                                var value4 = Grapharray[k][3];//Get fail values
                                red_color.push(value4);//Push colour
                                if (value3 == 4)
                                {
                                    var color = "green";
                                } else if (value4 == 4)
                                {
                                    var color = "red";
                                } else if (value4 < 4)
                                {
                                    var color = "yellow";
                                }
                                var date = new Date(value2);
                                //var hours = date.getHours();
                                var name = '<b><span style="color:green;font-size:12px;">Pass Test:' + value3 + '</span>,<span  style="color:red;font-size:12px;"> Fail Test:' + value4 + '</span></b><br>\n\
								<b><span style="font-size:12px;">' + hours + ':' + min + '</span></b>';
                                dataCamera.push({
                                    x: value2,
                                    y: value1,
                                    color: color,
                                    name: name,
                                })
                            }
                            seriesValue.push({name: obj, data: dataCamera});//Push values into graph

                            dataCamera = [];
                        }
                    }
                    timeLineGraph(seriesValue, cameraIdGraphValue, red_color, i);//Call timeline graph
                    seriesValue = [];
                    cameraIdGraphValue = [];
                    red_color = [];
                    for (var l = 0; l < tableDataLength; l++)
                    {
                        var table_Data = result.data[i].table_data[l];//Table data
                        for (var obj  in table_Data)
                        {
                            var cameratableDataId = obj;//Camera Id value
                            var arrayyPassFail = table_Data[obj];//pass fail value
                            var pass = arrayyPassFail.pass;//Pass value
                            var name = arrayyPassFail.name;//Camera Name value
                            var fail = arrayyPassFail.fail;//Fail value
                            $("#idtable" + i + "").append("<tr> <td id='setTextColour'>" + cameratableDataId + "</td><td id='setTextColour'>" + name + "</td><td id='setTextColour'>" + arrayyPassFail.pass + "</td><td id='setTextColour'>" + arrayyPassFail.fail + "</td></tr>");
                        }
                    }
                }
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
    $(".logs").addClass('active');
    $(".index,.report,.help").removeClass('active');
}
function dashboard()
{
    $.blockUI({message: '<img src="images/loader.gif" />', css: {backgroundColor: 'transparent', border: 'none'}});
    $.ajax({
        url: basepath + "dashboard",
        // url: "http://54.193.54.234/arlo/home",
        cache: false,
        type: "GET",
        dataType: 'json',
        success: function (result) {
            $.unblockUI();
            if (result.status == true)
            {
                var length = result.data.length;//Data length
                var c = 0;
                for (var i = 0; i < length; i++)
                {
                    var countryName = result.data[i].country;//Country name
                    var tableDataLength = Object.keys(result.data[i].table_data).length;
                    var table_Data = result.data[i].table_data;//Table data
                    //var cameratableDataId = Object.keys(result.data[i].table_data[i])[l];
                    
                    for (var obj  in table_Data)
                    {
                        var cameratableDataId = obj;//Camera Id value
                        var testCaseData = table_Data[obj];//test case value
                        var Live = testCaseData.a;//live value
                        var Record = testCaseData.c;//Record value
                        var CVR = testCaseData.d;//CVR value
                        var Screen = testCaseData.b;//Screen value
                        if (Live === undefined)
                        {
                            Live = "fail";
                        }
                        if (Record === undefined)
                        {
                            Record = "fail";
                        }
                        if (Screen === undefined)
                        {
                            Screen = "fail";
                        }
                        if (CVR === undefined)
                        {
                            CVR = "fail";
                        }
                        $("#dashboard_table").append("<tr style:'overflow-x: hidden'><td style='font-size:15px' id='setTextColour'>" + countryName + "</td><td style='font-size:15px' id='setTextColour'>" + cameratableDataId + "</td><td style='font-size:15px;' id='setLiveColour" + c + "'><b>" + Live + "</b></td><td style='font-size:15px' id='setScreenColour" + c + "'><b>" + Screen + "</b></td><td style='font-size:15px' id='setRecordColour" + c + "'><b>" + Record + "</b></td><td style='font-size:15px' id='setCVRColour" + c + "'><b>" + CVR + "</b></td></tr>");
                        if (Live == "pass")
                        {
                            $("#setLiveColour" + c + "").css({"color": "green"});
                        } else
                        {
                            $("#setLiveColour" + c + "").css({"color": "red"});
                        }
                        if (Record == "pass")
                        {
                            $("#setRecordColour" + c + "").css({"color": "green"});
                        } else
                        {
                            $("#setRecordColour" + c + "").css({"color": "red"});
                        }
                        if (CVR == "pass")
                        {
                            $("#setCVRColour" + c + "").css({"color": "green"});
                        } else
                        {
                            $("#setCVRColour" + c + "").css({"color": "red"});
                        }
                        if (Screen == "pass")
                        {
                            $("#setScreenColour" + c + "").css({"color": "green"});
                        } else
                        {
                            $("#setScreenColour" + c + "").css({"color": "red"});
                        }
                        c++;
                    }
                }
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
     $(".index").addClass('active');
     $(".logs,.report").removeClass('active');
}

//Toggle function
function togglefunction(i)
{

    if ($(".down" + i + "").hasClass("fa-plus-circle"))
    {
        $(".down" + i + "").removeClass("fa-plus-circle").addClass("fa-minus-circle");
    } else
    {
        $(".down" + i + "").removeClass("fa-minus-circle").addClass("fa-plus-circle");
    }
    $("#row_map" + i + "").slideToggle();
}

//TimeLineGraph function

function timeLineGraph(seriesValue, cameraIdValue, value4, i)
{
    if (!Date.now) {
        Date.now = function () {
            return new Date().getTime();
        }
    }
    var categories = [];
    for (var m = 1; m <= cameraIdValue[0].length; m++)
        categories[m] = cameraIdValue[0][m - 1]
    var time_all = seriesValue[0].data[0].x;
    var max_time = Math.floor(Date.now() / 1000)
    var min_time = (max_time - (60 * 60 * 12));
    
    $("#chartContainer" + i + "").highcharts({
        chart: {
            type: 'spline',
            spacingBottom: 0,
            spacingTop: 0,
            spacingLeft: 10,
        },
        colors: ['#333333', '#555555'],
        title: {
            text: 'Camera Report (last 12 Hours)',
            x: -275,
            y: 10,
            style: {
                color: 'green',
                fill: 'green',
                font: '400 16px Helvetica',
                marginTop: '50px',
            }
        },
        xAxis: {
            type: 'datetime',
            labels: {
                formatter: function () {
                    var date = new Date(this.value * 1000);
                    // var dat = date.getDate();
                    // var month = date.getMonth();
                    // var year = date.getFullYear();
                    var hours = date.getHours();

                    var minutes = date.getMinutes();
                    if (minutes < 10)
                    {
                        var minutes = "0" + minutes;
                    }
                    var formattedTime = +hours + ":" + minutes;
                    //var formattedTime = hours + ":00";
                    return formattedTime;
                }
            },
            title: {
                text: 'Time',
                style: {
                    color: 'black',
                    font: 'bold 12px Helvetica',
                }
            }
        },
        yAxis: {
            categories: categories,
            title: {
                text: 'Camera Id',
                style: {
                    color: 'black',
                    font: 'bold 12px Helvetica',
                }
            },
        },
        plotOptions: {
            spline: {
                marker: {
                    enabled: true,
                    symbol: 'circle',
                },
            }
        },
        series: seriesValue

    });
}

//logout

function logOut() {
    $.blockUI({message: '<img src="./images/loader.gif" />', css: {backgroundColor: 'transparent', border: 'none'}});
    $.ajax({
        url: basepath + "logout",
        type: "GET",
        timeout: 60000,
        cache: false,
        success: function (result) {
            $.unblockUI();
            var parseJson = $.parseJSON(result);

            if (parseJson.status == true)
            {
                sessionStorage.clear();
                localStorage.clear();
                location.href = "http://52.51.206.46/netgear-arlo/login.html";
            } else {
                bootbox.alert("Unable to Logout. Please try again!!!");
            }

        },
        error: function (jqXHR, textStatus)
        {
            $.unblockUI();
            if (textStatus === 'timeout') {
                bootbox.alert("Timeout. Please try again.", function () {

                });
            } else {
                bootbox.alert("There is some Error, please try again!!");

            }
        },
    });
}
;

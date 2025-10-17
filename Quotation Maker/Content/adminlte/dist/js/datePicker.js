$(document).ready(function () {
    GetDatePicker();    
    GetScoringTime();
   
});

function GetDatePicker()
{
    //Date and time picker
    $('#scoringTimeFrom').datetimepicker({
        icons: {
            time: 'far fa-clock'
        },
        class: {
            time: 'datetimepicker-input'
        }
    });

    $('#scoringTimeTo').datetimepicker({
        icons: {
            time: 'far fa-clock'
        }
    });

    $('#scoringExtensionTime').datetimepicker({
        icons: {
            time: 'far fa-clock'
        }
    });
}

function InsScoringTime() {
    var entityArray = [];
    var entity = {};

        entity.scoringStartTime = $('#scoringTimeFrom').val(),
        entity.scoringEndTime = $('#scoringTimeTo').val(),
        entity.scoringExtensionTime = $('#scoringExtensionTime').val(),
        entity.scoringLockStatus = $('#scoringLockStatus').val(),

    entityArray.push(entity);
    console.log(entity);
    console.log(entityArray);

    var table = $.ajax({
        /*type: "POST",*/
        data: JSON.stringify(entityArray),
        url: "/Maintenance/InsScoringTime",
        cache: false,
        contentType: "application/json; charset=utf-8",
        success: function () {
            alert("Successfull enter Scoring Time");

            /*ajax.reload();*/
        },
        errr: function () { 
            alert("Error creating Scoring Time");
        }
    });
}

function GetScoringTime() {
    $.ajax({
        type: "POST",
        url: "/Maintenance/DispScoringTime",
        data: '{}',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: displayScoringTime,
        error: function () {
            alert("Error getting Scoring Time.");
        }
    });
}
function displayScoringTime (listofScoringTime){
    console.log(listofScoringTime);

    //$('#myInput').val(myData);
    $('#scoringTimeFrom').val(listofScoringTime[0].scoringStartTime);

    $('#scoringTimeTo').val(listofScoringTime[0].scoringEndTime);

    $('#scoringExtensionTime').val(listofScoringTime[0].scoringExtensionTime);

    $('#scoringLockStatus').val(listofScoringTime[0].scoringLockStatus);

    remainingTime();

}

function remainingTime() {
    /*$('#saveTime').click(function () {*/
        var startTime = $('#scoringTimeFrom').val();
        var endTime = $('#scoringTimeTo').val();
        var start = new Date(startTime);
        var end = new Date(endTime);

        var timeDiff = new Date(end - start);
        console.log(timeDiff);
        var minutes = Math.floor((timeDiff / 1000 / 60) % 60);
        var hours = Math.floor((timeDiff / (1000 * 60 * 60)) % 24);
        var days = Math.floor((timeDiff / (1000 * 60 * 60 * 24)));

        var counter = 1000;

        var interval = setInterval(function () {
            //counter+-;
            timeDiff = timeDiff - counter;

            var seconds = Math.floor((timeDiff / 1000) % 60);
            var minutes = Math.floor((timeDiff / 1000 / 60) % 60);
            var hours = Math.floor((timeDiff / (1000 * 60 * 60)) % 24);
            var days = Math.floor((timeDiff / (1000 * 60 * 60 * 24)));
            console.log(seconds);

            if (timeDiff >= 0) {

                var result = days + " Days " + hours  + ":" + minutes + ":" + seconds;
            }
            else {
                clearInterval(interval);
            }
            
            $('#countdownTimer').html(result);
            console.log(timeDiff);
            console.log(result);
        }, 1000);
    /*});*/
}

function countDown() {
    var countdown = 60;
    var interval = setInterval(function () {
        countdownSeconds--;

        if (countdownSeconds >= 0) {
            var minutes = Math.floor(countdownSeconds / 60);
            var seconds = countdownSeconds % 60;

            $('#countdownTimer').html(minutes + "minutes" + seconds + "seconds");
        }
        else {
            clearInterval(interval);
            $('#countdownTimer').html("countdown finished!")
        }
    }, 1000);
}

//function GetScoringTime() {
//    $.ajax({
//        type: "POST",
//        url: "/Maintenance/GetScoringTimeByID",
//        data: '{}',
//        contentType: "application/json; charset=utf-8",
//        dataType: "json",
//        success: getScoringTime,        
//        error: function () {
//            alert("Error scoringTime.");
//        }
//    });
//    console.log(getScoringTime);
//}

//function getScoringTime(ScoringTime) {
//    console.log(ScoringTime);

//}

//function UpdScoringTIme(ScoringTimeID) {
//    console.log(ScoringTimeID);

//    $.ajax({
//        type: "GET",
//        url: "/",
//        contentType: 'application/json; charset=utf-8',
//        dataType: 'json',
//        data: { ScoringTimeID: ScoringTimeID },
//        success: getUpdScoringTime,
//        erorr: function () {
//            alert("Error update Scoring Time.");
//        }
//    });
//}

//function getUpdScoringTime(_data) {
//    console.log(_data);
//    $("#ScoringTimeFrom").val($.trim(_data[0].scoringTimeFrom));
//    $("#ScoringTimeTo").val($.trim(_data[0].scoringTimeTo));
//    $("#ScoringExtensionTime").val($.trim(_data[0].scoringExtensionTime));
//    $("ScoringLockStatus").val($.trim(_data[0].scoringLockStatus));
//}
//function SaveScoringTimeByID() {
//    var scoringTimeIDArray = [];
//    var scoringTimeByID = {};
//    scoringTimeByID.ScoringTimeFrom = $("#ScoringTimeFrom").val();
//    scoringTimeByID.ScoringTimeTo = $("#ScoringTimeTo").val();
//    scoringTimeByID.scoringExtensionTime = $("#ScoringExtensionTime").val();
//    scoringTimeByID.scoringLockStatus = $("#ScoringLockStatus").val();
//    scoringTimeIDArray.push(scoringTimeByID);
//    console.log(scoringTimeByID);
//    console.log(scoringTimeIDArray);

//    var wew = $.ajax({
//        type: "POST",
//        url: "",    
//        cache: false,
//        data: JSON.stringify(scoringTimeIDArray),
//        contentType: 'application/json; charset=utf-8',

//        success: function () {
//            alert("Upadated");
//            table.ajax.reload();
//        },
//        error: function () {
//            alert("Error.");
//        }
//    });
//}
// Write your JavaScript code.

$(document).ready(function () {


    $("#email").hide();
    $("#EmailCheckbox").click(function () {
        $("#email").toggle();

        if ($('#EmailCheckbox').is(':unchecked')) {
            $("#email").val("false");
            console.log("false");
        }

    }); 
});
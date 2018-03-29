//import { userInfo } from "os";

// Write your JavaScript code.

$(document).ready(function () {

    $("#email").hide();
    $("#EmailCheckbox").click(function () {
        $("#email").toggle();

        if ($(".ingelogd").data('ingelogd') == "loggedin") {
            if ($('#EmailCheckbox').is(':unchecked')) {
                $("#email").val("false");
                console.log("false");
            }
            else
            {
                $("#email").val("true");
            }
        }
    }); 
});
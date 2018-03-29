//Variabelen die later in de code gevuld worden;

var url = "";


//Laad de map in
function initMap() {
    url = "https://geodata.nationaalgeoregister.nl/locatieserver/v3/free?lat=53.1641642&lon=5.7817542";

    var fryslan = { lat: 53.1641642, lng: 5.7817542 };
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 10,
        center: fryslan
    });
    var icon = {
        url: "/images/Pompebledblauw.png",
        scaledSize: new google.maps.Size(35, 35), // scaled size
        origin: new google.maps.Point(0, 0), // origin
        anchor: new google.maps.Point(0, 0) // anchor
    };

    Locationmarker = new google.maps.Marker({
        map: map,
        draggable: true,
        animation: google.maps.Animation.DROP,
        position: fryslan,
        icon: icon
    });
    Locationmarker.addListener('click', toggleBounce);
    Locationmarker.addListener('drag', Ondrag);
    Locationmarker.addListener('dragend', Ondrag);



    var input = document.getElementById('pac-input');

    var autocomplete = new google.maps.places.Autocomplete(input);
    autocomplete.bindTo('bounds', map);

    map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

    var infowindow = new google.maps.InfoWindow();
    var infowindowContent = document.getElementById('infowindow-content');
    infowindow.setContent(infowindowContent);


    autocomplete.addListener('place_changed', function () {



        infowindow.close();
        var place = autocomplete.getPlace();
        if (!place.geometry) {
            return;
        }

        if (place.geometry.viewport) {
            map.fitBounds(place.geometry.viewport);
        } else {
            map.setCenter(place.geometry.location);
            map.setZoom(17);
        }

        // Set the position of the marker using the place ID and location.
        Locationmarker.setPosition(place.geometry.location);



        infowindowContent.children['place-name'].textContent = place.name;
        infowindowContent.children['place-address'].textContent =
            place.formatted_address;
        infowindow.open(map, Locationmarker);




        $("#nieuwlat").val(place.geometry.location.lat());
        $("#nieuwlong").val(place.geometry.location.lng());


        url = "https://geodata.nationaalgeoregister.nl/locatieserver/v3/free?lat=" + place.geometry.location.lat() + "&lon=" + place.geometry.location.lng();



        console.log(url);

    });
 }

function toggleBounce() {


    if (Locationmarker.getAnimation() !== null) {
        Locationmarker.setAnimation(null);
    } else {
        Locationmarker.setAnimation(google.maps.Animation.BOUNCE);
    }
}


function Ondrag(event) {


    lat = event.latLng.lat();
    lng = event.latLng.lng();

    $("#nieuwlat").val(lat);
    $("#nieuwlong").val(lng);




    url = "https://geodata.nationaalgeoregister.nl/locatieserver/v3/free?lat=" + lat + "&lon=" + lng;




}
$("#meldingsubmit").click(function () {

    $(".loader").show();

});


$("#submit").submit(function (e) {


    form = this;

    event.preventDefault();

   

    var gemeentenaam = "";

    $.getJSON(url, function (result) {
        $.each(result, function (i, field) {
            console.log(field.docs[0]);
            gemeentenaam = field.docs[0].gemeentenaam;

            $("#gemeente").val(gemeentenaam);

            if (field.docs[0].provincienaam !== "Friesland") {
                alert("Kies een gemeente binnen Friesland");
                $(".loader").hide();

            } else {
                form.submit();
            }




        });
    });
    
});





//Variabelen die later in de code gevuld worden;

var Locationmarker;
var lat = "";
var lng = "";

//Laad de map in
function initMap() {

    function getLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(SetPosistion);
        } else {
            x.innerHTML = "Geolocation is not supported by this browser.";
        }
    }


    //Vult de marker met de huidige locatie
    function SetPosistion(position) {

        lat = position.coords.latitude;
        lng = position.coords.longitude;

        $("#nieuwlat").val(lat);
        $("#nieuwlong").val(lng);
        var map = new google.maps.Map(document.getElementById('map'), {
            zoom: 16,
            center: { lat: lat, lng: lng }
        });

        Locationmarker = new google.maps.Marker({
            map: map,
            draggable: true,
            animation: google.maps.Animation.DROP,
            position: { lat: position.coords.latitude, lng: position.coords.longitude}
        });
        Locationmarker.addListener('click', toggleBounce);
        Locationmarker.addListener('drag', Ondrag);
        Locationmarker.addListener('dragend', Ondrag);

        //Input uit textbox
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

            console.log(place.geometry.location.lat());

        });

    }

    getLocation();

 }
//toggle
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

    console.log(lat);
    console.log(lng);
}



 

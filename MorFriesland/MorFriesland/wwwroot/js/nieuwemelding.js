//Variabelen die later in de code gevuld worden;



getLocation();

function getLocation() {

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(SetPosistion);
    } else {

    }
}

navigator.permissions.query({ name: 'geolocation' })
    .then(function (permissionStatus) {
        if (permissionStatus.state == "denied") {
            defaultMap();
        } else if (permissionStatus.state == "prompt") {
            defaultMap();
        }


        permissionStatus.onchange = function () {
            if (this.state == "denied")
            {
                defaultMap();
            }
            //console.log('geolocation permission state has changed to ', this.state);
        };
    });



//Laad de map in
function initMap() {

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


}


function SetPosistion(position) {

    lat = position.coords.latitude;
    lng = position.coords.longitude;

    $("#nieuwlat").val(lat);
    $("#nieuwlong").val(lng);
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 16,
        center: { lat: lat, lng: lng }
    });
    var icon = {
        url: "/images/Pompebledblauw.png",
        scaledSize: new google.maps.Size(35, 35), // scaled size
        origin: new google.maps.Point(0, 0), // origin
        anchor: new google.maps.Point(0, 0) // anchor
    };
    var icon2 = {
        url: "/images/Pompebled.png",
        scaledSize: new google.maps.Size(35, 35), // scaled size
        origin: new google.maps.Point(0, 0), // origin
        anchor: new google.maps.Point(0, 0) // anchor
    };

    Locationmarker = new google.maps.Marker({
        map: map,
        draggable: true,
        animation: google.maps.Animation.DROP,
        position: { lat: position.coords.latitude, lng: position.coords.longitude },
        icon: icon
    });
    Locationmarker.addListener('click', toggleBounce);
    Locationmarker.addListener('drag', Ondrag);
    Locationmarker.addListener('dragend', Ondrag);

    $('#meldingen[data-lat]').each(function () {

        var latdata = $(this).data('lat');
        var lngdata = $(this).data('lng');

        var marker = new google.maps.Marker({
            position: { lat: latdata, lng: lngdata },
            title: 'Home Center',
            map: map,
            icon: icon2
        });

    });

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
 
function defaultMap() {
    var fryslan = { lat: 53.1641642, lng: 5.7817542 };
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 10,
        center: fryslan
    })
    var icon = {
        url: "/images/Pompebledblauw.png",
        scaledSize: new google.maps.Size(35, 35), // scaled size
        origin: new google.maps.Point(0, 0), // origin
        anchor: new google.maps.Point(0, 0) // anchor
    };

    var icon2 = {
        url: "/images/Pompebled.png",
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

    $('#meldingen[data-lat]').each(function () {

        var latdata = $(this).data('lat');
        var lngdata = $(this).data('lng');

        var marker = new google.maps.Marker({
            position: { lat: latdata, lng: lngdata },
            title: 'Home Center',
            map: map,
            icon: icon2

        });

    });

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
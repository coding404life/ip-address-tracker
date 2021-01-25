'use strict'

//ipify key
const key = 'at_Hlx4pvDR7vRvSvhFkyiW25Hi7aTqp'
const url = `https://geo.ipify.org/api/v1?apiKey=${key}`

// appending the ip data to the DOM
const appendToDom = (data) => {
    //output the data of [ip-address, region, timezone, isp]
    $('#ip-address').text(data.ip);
    $('#region').text(`${data.location.country} , ${data.location.region}`);
    $('#timezone').text('UTC ' + data.location.timezone);
    $('#isp').text(data.as.name);
}
//map
const map = (lat, lng) => {
    //remove map if exist
    $('#map #mapid').remove();
    $('#map').append('<div id=mapid></div>');

    let mymap = L.map('mapid').setView([lat, lng], 15);
    //map tiler
    L.tileLayer('https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=N1G66AEsmvdXauZnxmxV', {
        attribution: '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>',
        maxZoom: 18,
        id: 'mapbox/streets-v11',
        tileSize: 512,
        zoomOffset: -1,
        accessToken: 'your.mapbox.access.token'
    }).addTo(mymap);
    //map marker
    L.marker([lat, lng]).addTo(mymap);
}

//fetching ip function
const fetchIp = async (inputVal) => {
    try {
        let res;
        if (inputVal) {
            res = await axios.get(`${url}&ipAddress=${inputVal}`);
        } else {
            res = await axios.get(url);
        }
        //1. API data
        const data = res.data
        //2. append to Dom
        appendToDom(data)
        //3. passing lat and lng to the map 
        map(data.location.lat, data.location.lng);

    } catch (err) {
        console.log(err)
    }
}

//get input ip val on btn click
$('#inputBtn').click(function () {
    const inputVal = $('#ip-value').val();
    //pass value into ip fun
    fetchIp(inputVal)
});

//init ip Function
fetchIp();
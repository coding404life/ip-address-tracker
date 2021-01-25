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

//fetching ip function
const fetchIp = async (inputVal) => {
    try {
        let res;
        if (inputVal) {
            res = await axios.get(`${url}&ipAddress=${inputVal}`);
        } else {
            res = await axios.get(url);
        }
        const data = res.data
        //append to Dom
        appendToDom(data)
        console.log(data)

    } catch (err) {
        console.log(err)
    }
}

//get input ip val on btn click
$('#inputBtn').click(function () {
    const inputVal = $('#ip-value').val();
    //pass value into ip fun
    fetchIp(inputVal);
});

//init ip Function
fetchIp();

//init map 
var mymap = L.map('mapid').setView([51.505, -0.09], 13);
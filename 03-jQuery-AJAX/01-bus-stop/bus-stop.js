function getInfo() {
    let stopId = $('#stopId').val().trim();
    let busStopName = $('#stopName');
    let busList = $('#buses');
    const url = "https://judgetests.firebaseio.com/businfo/" + stopId + ".json";

    let request = {
        method: "GET",
        url: url
    };
    $.ajax(request)
        .then(displayBusses)
        .catch(displayError);

    function displayError(error) {
        busList.empty();
        busStopName.text('Error');
    }

    function displayBusses(stopId) {
        if (!stopId || !stopId.hasOwnProperty('name') || !stopId.hasOwnProperty('buses')) {
            displayError();
        } else {
            busList.empty();
            busStopName.text(stopId.name);

            let busses = Object.keys(stopId.buses);
            for (let bus of busses) {
                busList.append(
                    $('<li>').text(`Bus ${bus} arrives in ${stopId.buses[bus]} minutes`));
            }
        }
    }
}

// my tests:
// const url = "https://js-apps-exercises.firebaseio.com/businfo/" + stopId + ".json";
// valid stopIds: 2334 & 1287,
// invalid stopId: 1111 {different obj props},
// invalid stopId: 1 - null
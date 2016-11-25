function attachEvents() {
    const locationsUrl = "https://judgetests.firebaseio.com/locations";
    const forecastUrl = "https://judgetests.firebaseio.com/forecast/";

    $('#submit').click(requestLocation);

    function requestLocation() {
        let forecast = $('#forecast');
        let current = $('#current');
        let upcoming = $('#upcoming');
        let locationName = $('#location').val().trim();

        if (locationName) {
            let getLocationsRequest = {
                method: "GET",
                url: locationsUrl + ".json"
            };
            $.ajax(getLocationsRequest)
                .then(requestLocationForecast)
                .catch(displayError);
            // $('#location').val('');
        }

        function requestLocationForecast(locations) {
            forecast.css('display', 'inline');
            current.css('display', 'inline');
            upcoming.css('display', 'inline');

            current.find('span.condition').remove();
            upcoming.find('span.upcoming').remove();

            let locationCode;
            for (let location of locations) {
                if (locationName === location.name) {
                    locationCode = location.code;
                    break;
                }
            }
            if (locationCode) {
                let todaysForecastRequest = $.ajax({
                    method: "GET",
                    url: forecastUrl + "today/" + locationCode + ".json"
                });
                let upcomingForecastRequest = $.ajax({
                    method: "GET",
                    url: forecastUrl + "upcoming/" + locationCode + ".json"
                });
                Promise.all([todaysForecastRequest, upcomingForecastRequest])
                    .then(displayForecast)
                    .catch(displayError);
            } else
                displayError();
        }

        function displayForecast([todaysForecast, upcomingForecast]) {
            let symbols = {
                'Sunny':        '&#x2600;',  // ☀
                'Partly sunny': '&#x26C5;',  // ⛅
                'Overcast':     '&#x2601;',  // ☁
                'Rain':         '&#x2614;',  // ☂
                'Degrees':      '&#176;'     // °
            };
            let deg = symbols['Degrees'];
            displayCurrentForecast();
            displayUpcomingForecast();

            function displayCurrentForecast() {
                let name = todaysForecast.name;
                let low = todaysForecast.forecast.low + deg;
                let high = todaysForecast.forecast.high + deg;
                let condition = todaysForecast.forecast.condition;
                let conditionSymbol = symbols[condition];

                $('<span>').addClass('condition symbol').html(conditionSymbol)
                    .appendTo(current);
                $('<span>').addClass('condition')
                    .append($('<span>').addClass('forecast-data').text(name))
                    .append($('<span>').addClass('forecast-data').html(`${low}/${high}`))
                    .append($('<span>').addClass('forecast-data').text(condition))
                    .appendTo(current);
            }

            function displayUpcomingForecast() {
                for (let forecast of upcomingForecast.forecast) {
                    let low = forecast.low + deg;
                    let high = forecast.high + deg;
                    let condition = forecast.condition;
                    let conditionSymbol = symbols[condition];

                    $('<span>').addClass('upcoming')
                        .append($('<span>').addClass('forecast-data').html(conditionSymbol))
                        .append($('<span>').addClass('forecast-data').html(`${low}/${high}`))
                        .append($('<span>').addClass('forecast-data').text(condition))
                        .appendTo(upcoming);
                }
            }
        }

        function displayError(error) {
            forecast.css('display', 'inline');
            current.css('display', 'none');
            upcoming.css('display', 'none');

            let errorDiv = $('<div>').text('Error')
                .prependTo(forecast);
            setTimeout(function () {
                errorDiv.fadeOut(function () {
                    errorDiv.remove();
                });
            }, 2000);
        }
    }
}
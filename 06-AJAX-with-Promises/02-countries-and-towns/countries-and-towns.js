function attachEvents() {
    const appKey = 'kid_Sko3oFwMx';
    const username = 'guest';
    const password = 'guest';
    const base64login = btoa(username + ':' + password);
    const authHeaders = {Authorization: 'Basic ' + base64login};
    const serviceUrl = 'https://baas.kinvey.com';
    const dataUrl = `${serviceUrl}/appdata/${appKey}`;

    $('#btnAddCountry').click(addCountry);
    $('#btnAddTown').click(addTown);
    $('#btnLoadCountries').click(loadCountries);
    $('#btnViewTowns').click(loadTowns);

    loadCountries();
    loadTowns();

    function loadCountries() {
        $.get({
            url: `${dataUrl}/countries`,
            headers: authHeaders
        })
            .then(displayCountries)
            .catch(displayError);
    }

    function displayCountries(countries) {
        countries.sort((a, b) => a.name.localeCompare(b.name));
        displayCountriesInTable();
        displayCountriesInDropDown();

        function displayCountriesInTable() {
            let table = $('#countries');
            table.find('tr.country').remove();
            for (let country of countries) {
                $('<tr>').addClass('country').attr('id', country._id)
                    .append($('<td>').append($('<input>').addClass('countryName').val(country.name)))
                    .append($('<td>')
                        .append($('<button>').text('Edit').click(() => editCountry(country._id)))
                        .append($('<span>').text(' '))
                        .append($('<button>').text('Delete').click(() => deleteCountry(country._id))))
                    .appendTo(table);
            }
        }

        function displayCountriesInDropDown() {
            let selectCountry = $('#selectCountry');
            selectCountry.empty();

            // Select All Towns
            $('<option>').text('All countries').val(null) // no country
                .appendTo(selectCountry);

            // Select Town in Country
            for (let country of countries) {
                $('<option>').text(country.name).val(country.name)
                    .appendTo(selectCountry);
            }
        }
    }

    function addCountry() {
        let countryName = $('#countryName').val().trim();
        $('#countryName').val('');
        if (countryName) {
            let data = {
                name: countryName
            };
            $.post({
                url: `${dataUrl}/countries`,
                headers: authHeaders,
                contentType: 'application/json',
                data: JSON.stringify(data)
            })
                .then(loadCountries)
                .catch(displayError);
        }
    }

    function deleteCountry(id) {
        $.ajax({
            method: 'DELETE',
            url: `${dataUrl}/countries/${id}`,
            headers: authHeaders
        })
            .then(loadCountries)
            .catch(displayError);
    }

    function editCountry(id) {
        let countryName = $('#countries').find(`[id=${id}]`).find('input.countryName').val().trim();
        if (countryName != '') {
            let data = {
                name: countryName
            };
            $.ajax({
                method: 'PUT',
                url: `${dataUrl}/countries/${id}`,
                headers: authHeaders,
                contentType: 'application/json',
                data: JSON.stringify(data)
            })
                .then(loadCountries)
                .catch(displayError);
        } else loadCountries();
    }

    function loadTowns() {
        let townsUrl = `${dataUrl}/towns`; // listing all towns regardless of country
        let selectedCountryName = $('#selectCountry').val();
        if (selectedCountryName)
            townsUrl = `${dataUrl}/towns?query={"country":"${selectedCountryName}"}`;

        $.get({
            url: townsUrl,
            headers: authHeaders
        })
            .then(displayTowns)
            .catch(displayError);
    }

    function displayTowns(towns) {
        let table = $('#towns');
        table.find('tr.town').remove();
        towns.sort((a, b) => a.name.localeCompare(b.name));

        for (let town of towns) {
            $('<tr>').addClass('town').attr('id', town._id)
                .append($('<td>').append($('<input>').addClass('townName').val(town.name)))
                .append($('<td>').append($('<input>').addClass('countryName').val(town.country)))
                .append($('<td>')
                    .append($('<button>').text('Edit').click(() => editTown(town._id)))
                    .append($('<span>').text(' '))
                    .append($('<button>').text('Delete').click(() => deleteTown(town._id))))
                .appendTo(table);
        }
    }

    function addTown() {
        let townName = $('#townName').val().trim();
        let countryName = $('#townCountryName').val().trim();
        $('#townName').val('');
        $('#townCountryName').val('');

        if (townName && countryName) {
            let data = {
                name: townName,
                country: countryName
            };
            $.post({
                url: `${dataUrl}/towns`,
                headers: authHeaders,
                contentType: 'application/json',
                data: JSON.stringify(data)
            })
                .then(loadTowns)
                .catch(displayError);
        }
    }

    function deleteTown(id) {
        $.ajax({
            method: 'DELETE',
            url: `${dataUrl}/towns/${id}`,
            headers: authHeaders
        })
            .then(loadTowns)
            .catch(displayError);
    }

    function editTown(id) {
        let town = $('#towns').find(`[id=${id}]`);
        let townName = town.find('input.townName').val().trim();
        let countryName = town.find('input.countryName').val().trim();

        if (townName != '' && countryName != '') {
            let data = {
                name: townName,
                country: countryName
            };
            $.ajax({
                method: 'PUT',
                url: `${dataUrl}/towns/${id}`,
                headers: authHeaders,
                contentType: 'application/json',
                data: JSON.stringify(data)
            })
                .then(loadTowns)
                .catch(displayError);
        } else loadTowns();
    }

    function displayError(error) {
        let errorDiv = $('<div>').text('Error')
            .prependTo($('body'));
        setTimeout(function () {
            errorDiv.fadeOut(function () {
                errorDiv.remove();
            });
        }, 2000);
    }
}
function attachEvents() {
    const appKey = 'kid_BJvxdAUGx';
    const username = 'guest';
    const password = 'guest';
    const base64login = btoa(username + ':' + password);
    const authHeaders = {Authorization: 'Basic ' + base64login}; // 0/100 with Kinvey authtoken
    const serviceUrl = 'https://baas.kinvey.com';
    const dataUrl = `${serviceUrl}/appdata/${appKey}/biggestCatches`;

    $('button.load').click(loadCatches);
    $('button.add').click(addCatch);

    function loadCatches() {
        let loadRequest = {
            method: 'GET',
            url: dataUrl,
            headers: authHeaders
        };
        $.ajax(loadRequest)
            .then(displayCatches)
            .catch(displayError);
    }

    function displayCatches(data) {
        let dataContainer = $('#catches');
        dataContainer.empty();

        for (let item of data) {
            $('<div>').addClass('catch').attr('data-id', item._id)
                .append($('<label>').text('Angler'))
                .append($('<input>').attr('type', 'text').addClass('angler').val(item.angler))
                .append($('<label>').text('Weight'))
                .append($('<input>').attr('type', 'number').addClass('weight').val(item.weight))
                .append($('<label>').text('Species'))
                .append($('<input>').attr('type', 'text').addClass('species').val(item.species))
                .append($('<label>').text('Location'))
                .append($('<input>').attr('type', 'text').addClass('location').val(item.location))
                .append($('<label>').text('Bait'))
                .append($('<input>').attr('type', 'text').addClass('bait').val(item.bait))
                .append($('<label>').text('Capture Time'))
                .append($('<input>').attr('type', 'number').addClass('captureTime').val(item.captureTime))
                .append($('<button>').addClass('update').text('Update').click(() => updateCatch(item._id)))
                .append($('<button>').addClass('delete').text('Delete').click(() => deleteCatch(item._id)))
                .appendTo(dataContainer);
        }
    }

    function readData(selector) {
        let angler = $(selector).find('.angler').val().trim();
        let weight = $(selector).find('.weight').val().trim();
        let species = $(selector).find('.species').val().trim();
        let location = $(selector).find('.location').val().trim();
        let bait = $(selector).find('.bait').val().trim();
        let captureTime = $(selector).find('.captureTime').val().trim();
        let data;
        if (angler && weight && species && location && bait && captureTime) {
            data = {
                angler: angler,
                weight: Number(weight),
                species: species,
                location: location,
                bait: bait,
                captureTime: Number(captureTime)
            };
        }
        return data;
    }

    function addCatch() {
        let selector = $('#addForm');
        let data = readData(selector);
        if (data) {
            let createRequest = {
                method: 'POST',
                url: dataUrl,
                headers: authHeaders,
                contentType: 'application/json',
                data: JSON.stringify(data)
            };
            $.ajax(createRequest)
                .then(loadCatches)
                .catch(displayError);
        }
    }

    function updateCatch(id) {
        let selector = $('#catches').find(`[data-id=${id}]`);
        let data = readData(selector);
        if (data) {
            let updateRequest = {
                method: 'PUT',
                url: `${dataUrl}/${id}`,
                headers: authHeaders,
                contentType: 'application/json',
                data: JSON.stringify(data)
            };
            $.ajax(updateRequest)
                .then(loadCatches)
                .catch(displayError);
        }
    }

    function deleteCatch(id) {
        let deleteRequest = {
            method: 'DELETE',
            url: `${dataUrl}/${id}`,
            headers: authHeaders
        };
        $.ajax(deleteRequest)
            .then(loadCatches)
            .catch(displayError);
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
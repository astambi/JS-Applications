// Valid dates for testing: "23-11", "24-11", "25-11", "26-11" and "27-11"
// Do not change date format

function attachEvents() {
    const appKey = 'kid_BJ_Ke8hZg';
    const username = 'guest';
    const password = 'pass';
    const base64login = btoa(username + ':' + password);
    const authHeaders = {Authorization: 'Basic ' + base64login};
    const serviceUrl = 'https://baas.kinvey.com';
    const dataUrl = `${serviceUrl}/appdata/${appKey}`;
    const calendarUrl = `${serviceUrl}/rpc/${appKey}/custom/calendar`;
    const purchaseUrl = `${serviceUrl}/rpc/${appKey}/custom/purchase`;
    const infoContainer = $('#venue-info');

    $('#getVenues').click(getVenuesByDate);

    function getVenuesByDate() {
        let date = $('#venueDate').val();
        $.post({
            url: `${calendarUrl}?query=${date}`,
            headers: authHeaders,
            contentType: 'application/json'
        })
            .then(loadVenues)
            .catch(displayError);
    }

    function loadVenues(venueIds) {
        // console.dir(venueIds);
        infoContainer.empty();
        for (let venueId of venueIds) {
            $.get({
                url: `${dataUrl}/venues/${venueId}`,
                headers: authHeaders,
                contentType: 'application/json'
            })
                .then(displayVenue)
                .catch(displayError);
        }
    }

    function displayVenue(venue) {
        // console.dir(venues);
        let select = $('<select>').addClass('quantity');
        for (let i = 1; i <= 5; i++) {
            $('<option>').text(i).val(i)
                .appendTo(select);
        }
        let table = $('<table>').append($('<tbody>')
            .append($('<tr>')
                .append($('<th>').text('Ticket Price'))
                .append($('<th>').text('Quantity'))
                .append($('<th>').text('')))
            .append($('<tr>')
                .append($('<td>').addClass('venue-price').text(`${venue.price.toFixed(2)} lv`))
                .append($('<td>').append(select))
                .append($('<td>')
                    .append($('<input>').addClass('purchase')
                        .attr('type', 'button').val('Purchase')
                        .click(() => confirmPurchase(venue._id, venue.name, venue.price, select.val()))))));
        $('<div>').addClass('venue').attr('id', venue._id)
            .append($('<span>').addClass('venue-name')
                .append($('<input>').addClass('info')
                    .attr('type', 'button').attr('value', 'More info')
                    .click(() => toggleMoreInfo(venue._id)))
                .append(venue.name))
            .append($('<div>').addClass('venue-details').css('display', 'none')
                .append(table)
                .append($('<span>').addClass('head').text('Venue description'))
                .append($('<p>').addClass('description').text(venue.description))
                .append($('<p>').addClass('description').text(`Starting time: ${venue.startingHour}`)))
            .appendTo(infoContainer);
    }

    function confirmPurchase(venueId, venueName, price, quantity) {
        // console.log(quantity + ' x ' + price);
        infoContainer.empty();
        let cost = price * quantity;
        $('<span>').addClass('head').text('Confirmation purchase')
            .appendTo(infoContainer);
        $('<div>').addClass('purchase-info')
            .append($('<span>').text(venueName))
            .append($('<span>').text(`${quantity} x ${price.toFixed(2)}`))
            .append($('<span>').text(`Total: ${cost.toFixed(2)} lv`))
            .append($('<input>').attr('type', 'button').val('Confirm')
                .click(() => purchaseTickets(venueId, quantity)))
            .appendTo(infoContainer);
    }

    function purchaseTickets(venueId, quantity) {
        $.post({
            url: `${purchaseUrl}?venue=${venueId}&qty=${quantity}`,
            headers: authHeaders,
            contentType: 'application/json'
        })
            .then(printTicket)
            .catch(displayError);
    }

    function printTicket(ticket) {
        // console.dir(ticket);
        infoContainer.empty();
        infoContainer
            .text('You may print this page as your ticket')
            .append(ticket.html);
    }

    function toggleMoreInfo(venueId) {
        // console.log(venueId);
        infoContainer.find('div.venue-details').css('display', 'none');
        $(`#${venueId}`).find('div.venue-details').css('display', 'block');
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
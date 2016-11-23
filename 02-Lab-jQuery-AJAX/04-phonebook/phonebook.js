function attachEvents() {
    $('#btnLoad').click(loadContacts);
    $('#btnCreate').click(createContact);
    const baseUrl = "https://phonebook-demo-c2f0c.firebaseio.com/phonebook";

    function loadContacts() {
        $('#phonebook').empty();
        $.ajax({
            url: baseUrl + ".json",
            success: displayContacts,
            error: displayError
        });
    }

    function createContact() {
        let newContact = {
            person: $('#person').val(),
            phone: $('#phone').val()
        };
        let postRequest = {
            method: "POST",
            url: baseUrl + ".json",
            data: JSON.stringify(newContact)
        };
        $.ajax(postRequest)
            .then(loadContacts)
            .catch(displayError);
        $('#person').val('');
        $('#phone').val('');
    }

    function deleteContact(key) {
        let deleteRequest = {
            method: "DELETE",
            url: baseUrl + "/" + key + ".json"
        };
        $.ajax(deleteRequest)
            .then(loadContacts)
            .catch(displayError);
    }

    function displayContacts(contacts) {
        let keys = Object.keys(contacts);
        for (let key of keys) {
            let contact = contacts[key];
            if (contact.person) {
                let contactText = contact.person + ": " + contact.phone + " ";
                $('<li>').text(contactText)
                    .append($('<a>').text('[Delete]').attr('href', "#")
                        .click(function () {
                            deleteContact(key)
                        }))
                    .appendTo($('#phonebook'));
            }
        }
    }

    function displayError(error) {
        $('#phonebook').append($("<li>").text('Error'));
    }
}
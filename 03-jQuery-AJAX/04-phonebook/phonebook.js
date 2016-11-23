function attachEvents() {
    $('#btnLoad').click(loadContacts);
    $('#btnCreate').click(createContact);
    let phonebookContainer = $('#phonebook');
    // const serviceUrl = "https://js-apps-exercises.firebaseio.com/phonebook";
    const serviceUrl = "https://phonebook-nakov.firebaseio.com/phonebook";

    function loadContacts() {
        phonebookContainer.empty();
        $.ajax({
            url: serviceUrl + ".json",
            success: displayContacts,
            error: displayError
        });
    }

    function createContact() {
        let person = $('#person').val().trim();
        let phone = $('#phone').val().trim();

        if (person && phone) {
            let newContact = {
                person: person,
                phone: phone
            };
            let postRequest = {
                method: "POST",
                url: serviceUrl + ".json",
                data: JSON.stringify(newContact)
            };
            $.ajax(postRequest)
                .then(loadContacts)
                .catch(displayError);

            $('#person').val('');
            $('#phone').val('');
        }
    }

    function deleteContact(key) {
        let deleteRequest = {
            method: "DELETE",
            url: serviceUrl + "/" + key + ".json"
        };
        $.ajax(deleteRequest)
            .then(loadContacts)
            .catch(displayError);
    }

    function displayContacts(contacts) {
        let contactsKeys = Object.keys(contacts);
        for (let key of contactsKeys) {
            let contact = contacts[key];
            if (contact.person) {
                let contactText = contact.person + ": " + contact.phone + " ";
                let contactLi = $('<li>').text(contactText)
                    .append($('<button>').text('[Delete]')
                        .click(function () {
                            deleteContact(key)
                        }));
                phonebookContainer.append(contactLi);
            }
        }
    }

    function displayError(error) {
        phonebookContainer.append($("<li>").text('Error'));
    }
}
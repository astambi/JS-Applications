function attachEvents() {
    $('#refresh').click(refreshMessages);
    $('#submit').click(createMessage);
    let msgContainer = $('#messages');
    const serviceUrl = "https://js-apps-exercises.firebaseio.com/messenger";

    function refreshMessages() {
        let getRequest = {
            method: "GET",
            url: serviceUrl + ".json"
        };
        $.ajax(getRequest)
            .then(displayMessages)
            .catch(displayError);

        function displayMessages(messages) {
            msgContainer.empty();
            let msgEntries = Object.keys(messages);
            let msgs = [];
            for (let entry of msgEntries) {
                let msgText = messages[entry].author + ": " + messages[entry].content;
                msgs.push({
                    timestamp: messages[entry].timestamp,
                    text: msgText
                });
            }
            msgs.sort((a, b) => a.timestamp - b.timestamp);
            for (let msg of msgs) {
                msgContainer.append(msg.text + "\n");
            }
        }
    }

    function createMessage() {
        let author = $('#author').val().trim();
        let msgContent = $('#content').val().trim();

        if (author && msgContent) {
            let newMsg = {
                author: author,
                content: msgContent,
                timestamp: Date.now()
            };
            let createMsgRequest = {
                method: "POST",
                url: serviceUrl + ".json",
                data: JSON.stringify(newMsg)
            };
            $.ajax(createMsgRequest)
                .then(refreshMessages)
                .catch(displayError);
        }
    }

    function displayError(error) {
        msgContainer.text('Error');
    }
}
function solve() {
    let currentId = 'depot';
    let currentName = undefined;

    function depart() {
        let url = "https://judgetests.firebaseio.com/schedule/" + currentId + ".json";
        let request = {
            method: "GET",
            url: url
        };
        $.ajax(request)
            .then(displaySchedule)
            .catch(displayError);
        updateButtons('#depart', '#arrive');

        function displaySchedule(busStopData) {
            currentName = busStopData.name;
            $('#info').find('span').text(`Next stop ${currentName}`);
            currentId = busStopData.next;
        }

        function displayError(error) {
            $('#info').find('span').text('Error');
            disableButtons();
        }
    }

    function arrive() {
        $('#info').find('span').text(`Arriving at ${currentName}`);
        updateButtons('#arrive', '#depart');
    }

    function updateButtons(buttonToDisable, buttonToEnable) {
        $(buttonToEnable).removeAttr('disabled');
        $(buttonToDisable).attr('disabled', true); // prop does not work in Judge
    }

    function disableButtons() {
        $('#arrive').attr('disabled', true);
        $('#depart').attr('disabled', true);
    }

    return {
        depart,
        arrive
    }
}
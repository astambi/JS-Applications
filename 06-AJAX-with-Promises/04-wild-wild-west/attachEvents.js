function attachEvents() {
    const appKey = 'kid_Sko3oFwMx';
    const username = 'guest';
    const password = 'guest';
    const base64login = btoa(username + ':' + password);
    const authHeaders = {Authorization: 'Basic ' + base64login};
    const serviceUrl = 'https://baas.kinvey.com';
    const dataUrl = `${serviceUrl}/appdata/${appKey}/players`;
    const playersContainer = $('#players');
    const buttonsContainer = $('#buttons');
    let currentPlayer = undefined;

    loadPlayers();
    $('#addPlayer').click(addPlayer);
    $('#save').click(saveProgress);
    $('#reload').click(reloadPlayer);

    function loadPlayers() {
        playersContainer.empty();
        $.get({
            url: dataUrl,
            headers: authHeaders
        })
            .then(displayPlayers)
            .catch(displayError);
    }

    function displayPlayers(players) {
        // console.dir(players);
        for (let player of players) {
            $('<div>').addClass('player').attr('data-id', player._id)
                .append($('<div>').addClass('row')
                    .append($('<label>').text('Name:'))
                    .append($('<label>').addClass('name').text(player.name)))
                .append($('<div>').addClass('row')
                    .append($('<label>').text('Money:'))
                    .append($('<label>').addClass('name').text(player.money)))
                .append($('<div>').addClass('row')
                    .append($('<label>').text('Bullets:'))
                    .append($('<label>').addClass('name').text(player.bullets)))
                .append($('<button>').addClass('play').text('Play')
                    .click(() => startPlaying(player))) // todo
                .append($('<button>').addClass('delete').text('Delete')
                    .click(() => deletePlayer(player._id)))
                .appendTo(playersContainer);
        }
    }

    function addPlayer() {
        let playerName = $('#addName').val().trim();
        $('#addName').val('');
        if (playerName) {
            let data = {
                name: playerName,
                money: 500,
                bullets: 6
            };
            $.post({
                url: dataUrl,
                headers: authHeaders,
                contentType: 'application/json',
                data: JSON.stringify(data)
            })
                .then(loadPlayers)
                .catch(displayError);
        }
    }

    function deletePlayer(id) {
        $.ajax({
            method: 'DELETE',
            url: `${dataUrl}/${id}`,
            headers: authHeaders
        })
            .then(loadPlayers)
            .catch(displayError);
    }

    function saveProgress() {
        // console.dir(currentPlayer);
        if (currentPlayer) {
            let id = currentPlayer.id;
            let data = currentPlayer.gameData;
            $.ajax({
                method: 'PUT',
                url: `${dataUrl}/${id}`,
                headers: authHeaders,
                contentType: 'application/json',
                data: JSON.stringify(data)
            })
                .then(loadPlayers)
                .catch(displayError);
        }
        $('body').find('canvas').css('display', 'none');
        buttonsContainer.find('button').css('display', 'none');
        clearInterval(canvas.intervalId);
        currentPlayer = undefined;
        // console.dir('canvas interval ' + canvas.intervarId);
    }

    function reloadPlayer() {
        currentPlayer.gameData.money -= 60;
        currentPlayer.gameData.bullets = 6;
    }

    function startPlaying(player) {
        saveProgress();
        $('body').find('canvas').css('display', 'inline');
        buttonsContainer.find('button').css('display', 'inline');
        let playerGameData = {
            name: player.name,
            money: player.money,
            bullets: player.bullets
        };
        currentPlayer = {
            id: player._id,
            gameData: playerGameData
        };
        loadCanvas(playerGameData);
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
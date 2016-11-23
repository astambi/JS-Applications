function loadRepos() {
    $('#repos').empty();

    let username = $('#username').val();
    let url = 'https://api.github.com/users/' + username + '/repos';
    $.ajax({
        url,
        success: displayRepos,
        error: displayError
    });

    // $.get(url)
    //     .then(displayRepos)
    //     .catch(displayError);

    // let request = {
    //     method: "GET",
    //     url: url,
    //     contentType: "application/json",
    //     success: displayRepos,
    //     error: displayError
    // };
    // $.ajax(request);

    function displayRepos(repos) {
        for (let repo of repos) {
            let link = $('<a>').text(repo.full_name)
                        .attr('href', repo.html_url);
            $('#repos').append($('<li>').append(link));
        }
    }

    function displayError(error) {
        $("#repos").append($("<li>Error</li>"));
    }
}

// TODO 50/100 ???
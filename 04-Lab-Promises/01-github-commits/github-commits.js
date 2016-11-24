function loadCommits() {
    const serviceUrl = "https://api.github.com/repos/";

    let username = $('#username').val().trim();
    let repository = $('#repo').val().trim();
    let commitsContainer = $('#commits');
    commitsContainer.empty();

    let getRequest = {
        method: "GET",
        url: serviceUrl + username + "/" + repository + "/commits"
    };
    $.ajax(getRequest)
        .then(displayCommits)
        .catch(displayError);

    function displayCommits(commits) {
        for (let entry of commits) {
            let commit = entry.commit;
            if (commit.author && commit.message) {
                let commitText = commit.author.name + ": " + commit.message;
                commitsContainer.append($('<li>').text(commitText));
            }
        }
    }

    function displayError(error) {
        let errorMsg = 'Error: ';
        if (error.status && error.statusText)
            errorMsg += `${error.status} (${error.statusText})`;
        else if (error.name && error.message)
            errorMsg += `${error.name} (${error.message})`;
        commitsContainer.append($('<li>').text(errorMsg));
    }
}
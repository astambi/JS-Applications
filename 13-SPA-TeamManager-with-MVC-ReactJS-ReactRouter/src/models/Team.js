import * as KinveyRequester from './KinveyRequester';

function create(teamName, description, callback) {
    let teamData = {
        teamName: teamName,
        description: description
    };
    return KinveyRequester
        .post('appdata', 'teams', 'kinvey', teamData)
        .then(createSuccess)
        .catch(() => callback(false));

    function createSuccess(teamInfo) {
        // console.log(teamInfo);
        callback(true);
    }
}

function loadTeams(callback) {
    return KinveyRequester
        .get('appdata', 'teams', 'kinvey')
        .then(loadSuccess)
        .catch(() => callback(false));

    function loadSuccess(teamsInfo) {
        // console.log(teamsInfo);
        callback(teamsInfo);
    }
}

function loadDetails(teamId, callback) {
    return KinveyRequester
        .get('appdata', 'teams/' + teamId, 'kinvey')
        .then(loadDetailsSuccess)
        .catch(() => callback(false));

    function loadDetailsSuccess(teamInfo) {
        // console.log(teamInfo);
        callback(teamInfo);
    }
}

function edit(teamId, teamName, description, callback) {
    let teamData = {
        teamName: teamName,
        description: description
    };
    return KinveyRequester
        .update('appdata', 'teams/' + teamId, 'kinvey', teamData)
        .then(editSuccess)
        .catch(() => callback(false));
    function editSuccess(teamInfo) {
        callback(teamInfo);
    }
}

export {create, loadTeams, loadDetails, edit}

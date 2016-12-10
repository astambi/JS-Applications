import $ from 'jquery';

const kinveyAppKey = 'kid_Sk3JjEw7g';
const kinveyAppSecret = '6bca6d150eda46f1bee4c90c80e3e307';
const kinveyBaseUrl = 'https://baas.kinvey.com';

function getAuthHeaders(auth) {
    let headers = {};
    if (auth === 'basic')
        headers['Authorization'] = 'Basic ' + btoa(kinveyAppKey + ':' + kinveyAppSecret);
    else // 'kinvey'
        headers['Authorization'] = 'Kinvey ' + sessionStorage.getItem('authToken');
    return headers;
}

function getUrl(dataCollection, urlModule) {
    return kinveyBaseUrl + '/' + dataCollection + '/' + kinveyAppKey + '/' + urlModule;
}

function get(dataCollection, urlModule, auth) {
    return $.ajax({
        method: 'GET',
        url: getUrl(dataCollection, urlModule),
        headers: getAuthHeaders(auth),
        contentType: 'application/json'
    });
}

function post(dataCollection, urlModule, auth, data) {
    // request without data
    let request = {
        method: 'POST',
        url: getUrl(dataCollection, urlModule),
        headers: getAuthHeaders(auth),
        contentType: 'application/json'
    };
    if (data)
        request.data = JSON.stringify(data);
    return $.ajax(request);
}

function update(dataCollection, urlModule, auth, data) {
    let request = {
        method: 'PUT',
        url: getUrl(dataCollection, urlModule),
        headers: getAuthHeaders(auth),
        contentType: 'application/json',
        data: JSON.stringify(data)
    };
    return $.ajax(request);
}

export {get, post, update};
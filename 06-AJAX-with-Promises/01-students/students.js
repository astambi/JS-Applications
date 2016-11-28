function students() {
    const appKey = 'kid_BJXTsSi-e';
    const username = 'guest';
    const password = 'guest';
    const base64login = btoa(username + ':' + password);
    const serviceUrl = 'https://baas.kinvey.com';
    const dataUrl = `${serviceUrl}/appdata/${appKey}/students`;
    const authHeaders = {
        Authorization: 'Basic ' + base64login,
        contentType: 'application/json'
    };

    $('#addBtn').click(addStudent);
    loadStudents();

    function addStudent() {
        let studentData = readFormData();
        if (studentData) {
            $.post({
                url: dataUrl,
                headers: authHeaders,
                contentType: 'application/json',
                data: JSON.stringify(studentData)
            })
                .then(loadStudents)
                .catch(displayError);
        }
    }

    function readFormData() {
        let id = $('#studentId').val().trim();
        let firstName = $('#firstName').val().trim();
        let lastName = $('#lastName').val().trim();
        let facultyNumber = $('#facultyNumber').val().trim();
        let grade = $('#grade').val().trim();
        let numberRegex = /^\d+$/;

        let studentData;
        if (id && firstName && lastName && facultyNumber && grade &&
            Number(id) && Number(grade) && numberRegex.test(facultyNumber)) {
            studentData = {
                ID: Number(id),
                FirstName: firstName,
                LastName: lastName,
                FacultyNumber: facultyNumber,
                Grade: Number(grade)
            };
        }
        return studentData;
    }

    function loadStudents() {
        $.get({
            url: dataUrl,
            headers: authHeaders
        })
            .then(displayStudents)
            .catch(displayError);
    }

    function displayStudents(students) {
        let table = $('#results');
        table.find('tr.data-student').remove();
        students.sort((a, b) => a.ID - b.ID);

        for (let student of students) {
            $('<tr>').addClass('data-student')
                .append($('<td>').text(student.ID))
                .append($('<td>').text(student.FirstName))
                .append($('<td>').text(student.LastName))
                .append($('<td>').text(student.FacultyNumber))
                .append($('<td>').text(student.Grade))
                .appendTo(table);
        }
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
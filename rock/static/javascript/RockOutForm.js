
RockOutForm = function() {

    $.template('updateTemplate',
        'Update was a success. <br />' +
        'Click here to view it ' +
        '<a href="/rock/entry/${id}">/rock/entry/${id}</a><br />' +
        'or stay here to make more updates.'
    );

    $.template('createTemplate',
        'Creation was a success. <br />' +
        'Click here to view it ' +
        '<a href="/rock/entry/${id}">/rock/entry/${id}</a><br />' +
        'or stay here to add more rock.'
    );

    // setup tagit for the tags input
    $('#tags').tagit({
        singleField: true,
        singleFieldNode: $('#inputTags')
    });
};

RockOutForm.prototype.clear = function() {
    $('#inputTitle').val('');
    $('#inputAuthor').val('');
    $('#inputContent').val('');
    $('#inputTags').val('');
    $('#tags').tagit('removeAll');
};

RockOutForm.prototype.setupCreate = function() {
    formEl = $('#addRockEntryForm');
    form = this;
    formEl.bind('submit', function() {
        $('#rockSubmit').prop('value', 'Rocking Out...');
        $('#rockSubmit').prop('disabled', true);
        form.submitCreate();
        return false;
    });
};

RockOutForm.prototype.submitCreate = function() {
    $('#error_msg').hide();
    var title = $('#inputTitle').val();
    var author = $('#inputAuthor').val();
    var content = $('#inputContent').val();
    var tags = $('#inputTags').val();
    
    var rockForm = this;

    $.ajax({
        url: '/rock/create',
        type: 'post',
        dataType: 'json',
        data: {
            'title': title,
            'author': author,
            'content': content,
            'tags': tags
        },
        success: function(response, status, xhr) {
            //var json = $.parseJSON(response);
            if (response.success) {
                rockForm.clear();
                $('#update_msg').hide();
                var eid = response.msg;
                $('#update_msg').html('');
                $.tmpl('createTemplate', {
                    'id': eid
                }).appendTo('#update_msg');
                $('#update_msg').fadeIn('slow');
            }
            else {
                console.log('An error occurred!');
                $('#error_msg').html(response.msg);
                $('#error_msg').fadeIn('slow');
            }
        },
        error: function() {
            //console.log('Error!');
        }
    });
    
    // Set the form back...
    $('#rockSubmit').prop('value', 'Let There Be Rock!');
    $('#rockSubmit').prop('disabled', false);
};

RockOutForm.prototype.setupEdit = function() {
    formEl = $('#addRockEntryForm');
    form = this;
    formEl.bind('submit', function() {
        $('#rockSubmit').prop('value', 'Rocking Out...');
        $('#rockSubmit').prop('disabled', true);
        form.submitEdit();
        return false;
    });
    
    // setup the tags
    $('.current_tag').each(function(index) {
        $('#tags').tagit('createTag', $(this).text());
    });
};

RockOutForm.prototype.submitEdit = function() {
    $('#error_msg').hide();
    var title = $('#inputTitle').val();
    var author = $('#inputAuthor').val();
    var content = $('#inputContent').val();
    var tags = $('#inputTags').val();
    var id = $('#inputId').val();
    
    $.ajax({
        url: '/rock/update',
        type: 'post',
        dataType: 'json',
        data: {
            'id': id,
            'title': title,
            'author': author,
            'content': content,
            'tags': tags
        },
        success: function(response, status, xhr) {
            if (response.success) {
                var eid = response.msg;
                $('#update_msg').hide();
                $('#update_msg').html('');
                $.tmpl('updateTemplate', {
                    'id': eid
                }).appendTo('#update_msg');
                $('#update_msg').fadeIn('slow');
            }
            else {
                console.log('An error occurred!');
                $('#error_msg').html(response.msg);
                $('#error_msg').fadeIn('slow');
            }
        },
        error: function() {
            //console.log('Error!');
        }
    });
    
    // Set the form back...
    $('#rockSubmit').prop('value', 'Let There Be Rock!');
    $('#rockSubmit').prop('disabled', false);
};

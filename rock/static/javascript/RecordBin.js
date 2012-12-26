
RecordBin = function() {
    $.template('tagLinkTemplate', 
        '<li class="browse_list_item browse_tag" ' +
        'id="${tag}">${tag}</li>'
    );

    $.template('entryLinkTemplate',
        '<li class="browse_list_item browse_record" ' +
        'id="${id}">${title}</li>'
    );

    $.template('entryTemplate',
        '<div class="entry" id="entry_${id}">' +
        '<h2><a href="/rock/entry/${id}">${title}</a></h2>' +
        '<div class="entry_info">By ${author} on ${date_created}</div>' +
        '<div class="entry_tags" id="entry_${id}_tags"></div>' +
        '<div class="entry_content" id="entry_${id}_content"></div></div>'
    );
    $.template('tagTemplate',
        '<div class="entry_tag"><a href="/rock/tag/${tag}">${tag}</a></div>'
    );

    this.setSize();
};

RecordBin.prototype.htmlDecode = function(input) {
    var e = document.createElement('div');
    e.innerHTML = input;
    return e.childNodes.length === 0 ? "" : e.childNodes[0].nodeValue;
};

RecordBin.prototype.init = function() {
    var bin = this;
    $('#tags_spinner').show();
    $.ajax({
        url: '/rock/tags/all',
        type: 'get',
        dataType: 'json',
        success: function(response, status, xhr) {
            bin.loadTags(response);
        },
        error: function() {
        }
    });
};

RecordBin.prototype.loadRecord = function(entry_id) {
    $('#record_content').html('');
    $('#content_spinner').show();
    var bin = this;
    $.ajax({
        url: '/rock/entry/json/' + entry_id,
        type: 'get',
        dataType: 'json',
        success: function(response, status, xhr) {
            bin.showRecord(response);
        },
        error: function() {
        }
    });
};

RecordBin.prototype.loadTag = function(tag_name) {
    $('#records').html('');
    $('#records_spinner').show();
    var bin = this;
    $.ajax({
        url: '/rock/by/tag/' + tag_name,
        type: 'get',
        dataType: 'json',
        success: function(response, status, xhr) {
            $('#records_spinner').hide();
            $.tmpl('entryLinkTemplate', 
                response.entries).appendTo('#records');
            $('.browse_record').click(function() {
                var id = $(this).attr('id');
                bin.loadRecord(id);
            });
        }
    });
};

RecordBin.prototype.loadTags = function(tags) {
    var len = tags.length;
    var i, tag;
    var bin = this;
    $('#tags_spinner').hide();
    for (i = 0; i < len; i++) {
        tag = tags[i];
        $.tmpl('tagLinkTemplate', {
            'tag': tag
        }).appendTo('#tags');
    }
    $('.browse_tag').click(function() {
        var tag = $(this).attr('id');
        bin.loadTag(tag);
    });
};

RecordBin.prototype.setSize = function() {
    var pageHeight = $(document).height();
    var classHeight = $('#rock_class_ctr').height();
    var navHeight = $('#rock_nav_ctr').height();
    $('#rock_content_ctr').height(
        pageHeight - (classHeight + navHeight)
    );
};

RecordBin.prototype.showRecord = function(entry) {
    var ts = [];
    var len = entry.tags.length;
    var i, t;
    for (i = 0; i < len; i++) {
        t = entry.tags[i];
        if ('' !== t) {
            ts.push({'tag': t});
        }
    }
    $('#content_spinner').hide();
    $.tmpl('entryTemplate', entry).appendTo('#record_content');
    var tag_ctr = '#entry_' + entry.id + '_tags';
    $.tmpl('tagTemplate', ts).appendTo(tag_ctr);
    // hack to fix the floating tags...
    $('<div style="clear: both"></div>').appendTo(tag_ctr);
    // decode the content so embedded html shows up
    // yes, I know this is dangerous :-/
    var contentEl = $('#entry_' + entry.id + '_content');
    contentEl.append(this.htmlDecode(entry.content));
};

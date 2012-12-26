RockOutList = function() {
    this.MAX_HEIGHT = 77;
    this.LEFT_COL = '#left_col';
    this.RIGHT_COL = '#right_col';
    this.current_col = this.LEFT_COL;
    
    $.template('entryTemplate',
        '<div class="entry" id="entry_${id}">' +
        '<h3><a href="/rock/entry/${id}">${title}</a></h3>' +
        '<div class="entry_info">By ${author} on ${date_created}</div>' +
        '<div class="entry_tags" id="entry_${id}_tags"></div>' +
        '<div class="entry_content" id="entry_${id}_content"></div></div>'
    );
    $.template('tagTemplate',
        '<div class="entry_tag"><a href="/rock/tag/${tag}">${tag}</a></div>'
    );
    $.template('moreTemplate',
        '<div class="entry_more" id="entry_${id}_more">' +
        '<a href="/rock/entry/${id}">Read more...</a></div>'
    );
};

RockOutList.prototype.loadTagPage = function() {
    var list = this;
    var tag_name = $('#tag_name').html();
    $.ajax({
        url: '/rock/by/tag/' + tag_name,
        type: 'get',
        dataType: 'json',
        success: function(response, status, xhr) {
            list.loadResponse(response['entries']);
            var count = 0;
            if (typeof response['entry_count'] !== 'undefined') {
                count = response['entry_count'];
            }
            $('#entry_count').html(count);
        }
    });
};

RockOutList.prototype.loadHomePage = function() {
    var list = this;
    $.ajax({
        url: '/rock/list',
        type: 'get',
        dataType: 'json',
        success: function(response, status, xhr) {
            list.loadResponse(response);
        }
    });
};

RockOutList.prototype.loadResponse = function(entries) {
    this.clearList();
    var len = entries.length;
    var i, entry;
    for (i = 0; i < len; i++) {
        entry = entries[i];
        this.showEntry(entry);
    }
};

RockOutList.prototype.htmlDecode = function(input) {
    var e = document.createElement('div');
    e.innerHTML = input;
    return e.childNodes.length === 0 ? "" : e.childNodes[0].nodeValue;
};

RockOutList.prototype.showEntry = function(entry) {
    var ts = [];
    var len = entry.tags.length;
    var i, t;
    for (i = 0; i < len; i++) {
        t = entry.tags[i];
        if ('' !== t) {
            ts.push({'tag': t});
        }
    }

    $.tmpl('entryTemplate', entry).appendTo(this.current_col);
    var tag_ctr = '#entry_' + entry.id + '_tags';
    $.tmpl('tagTemplate', ts).appendTo(tag_ctr);
    // hack to fix the floating tags...
    $('<div style="clear: both"></div>').appendTo(tag_ctr);
    // decode the content so embedded html shows up
    // yes, I know this is dangerous :-/
    var contentEl = $('#entry_' + entry.id + '_content');
    contentEl.append(this.htmlDecode(entry.content));
    
    var contentHeight = contentEl.height();
    if (contentHeight > this.MAX_HEIGHT) {
        contentEl.css('overflow', 'hidden');
        contentEl.height(this.MAX_HEIGHT);
        // add a read more link
        $.tmpl('moreTemplate', entry).appendTo('#entry_' + entry.id);
        $('#entry_' + entry.id + '_more').click(function() {
            window.location = '/rock/entry/' + entry.id;
        });
    }
    
    
    if (this.current_col === this.LEFT_COL) {
        this.current_col = this.RIGHT_COL;
    }
    else {
        this.current_col = this.LEFT_COL;
    }
};

RockOutList.prototype.clearList = function() {
    $(this.LEFT_COL).html('');
    $(this.RIGHT_COL).html('');
    this.current_col = this.LEFT_COL;
};

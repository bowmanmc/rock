from django.conf.urls import patterns, url

urlpatterns = patterns('',

    #### HTML
    # /rock
    url(r'^rock/?$', 'rock.views.html.home'),
    # /rock/add - html form
    url(r'^rock/add/?$', 'rock.views.html.add'),
    # /rock/entry/1234 - detail view page
    url(r'^rock/entry/(?P<entry_id>\d+)/?$', 'rock.views.html.detail'),
    # /rock/tag/tag_name - list of entries with tag_name
    url(r'^rock/tag/(?P<tag_name>\w+)/?$', 'rock.views.html.tag'),
    # /rock/edit/1234 - edit entry html form
    url(r'^rock/edit/(?P<entry_id>\d+)/?$', 'rock.views.html.edit'),
    # /rock/browse - browse entries by tag
    url(r'^rock/browse/?$', 'rock.views.html.browse'),

    #### JSON
    # /rock/create - where /rock/add posts to
    url(r'^rock/create/?$', 'rock.views.json.create'),
    # /rock/update - where /rock/edit posts to
    url(r'^rock/update/?$', 'rock.views.json.update'),
    # /rock/list - json list of entries sorted by date desc
    url(r'^rock/list/?$', 'rock.views.json.list_entries'),
    # /rock/by/tag - json list of entries with passed in tag name
    url(r'^rock/by/tag/(?P<tag_name>\w+)/?$', 'rock.views.json.list_by_tag'),
    # /rock/tags/all - json list of tags (distinct & alphabetical)
    url(r'^rock/tags/all/?$', 'rock.views.json.list_tags'),
    # /rock/entry/json/1234 - entry as json
    url(r'^rock/entry/json/(?P<entry_id>\d+)/?$', 'rock.views.json.entry'),
)

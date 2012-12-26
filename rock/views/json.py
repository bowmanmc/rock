'''
 ' Rock JSON Views
'''
from django.http import HttpResponse
from django.shortcuts import get_object_or_404
from django.utils import simplejson
from django.utils.html import escape
from rock.models import Entry, Tag
import logging
import utils

log = logging.getLogger(__name__)


def update(request):
    success = True
    msg = ''

    entry_id = escape(request.POST.get('id', ''))
    entry = Entry.objects.get(pk=entry_id)

    title = escape(request.POST.get('title', ''))
    author = escape(request.POST.get('author', ''))
    content = escape(request.POST.get('content', ''))
    tagsIn = escape(request.POST.get('tags', ''))
    tags = [x.strip() for x in tagsIn.split(',')]

    if entry is None:
        success = False
        msg = 'Entry with id %s not found.' % entry_id
    elif ('' == title):
        success = False
        msg = 'Please enter a title for your rock anthem.'
    elif ('' == content):
        success = False
        msg = 'Please jot down the lyrics for your jam.'
    else:
        # update the entry
        entry.title = title
        entry.author = author
        entry.content = content
        ## delete the current tags and add them back
        for tag in entry.tags.all():
            tag.delete()
        for tag in tags:
            tag = tag.lower()
            # lookup the tag, create it if necessary, and add it to the entry
            t = Tag()
            t.name = tag
            t.save()
            entry.tags.add(t)
        entry.save()
        success = True
        msg = entry_id

    data = {}
    data['success'] = success
    data['msg'] = msg
    out = simplejson.dumps(data)
    return HttpResponse(out, mimetype="application/json")


def create(request):
    success = True
    msg = ''

    title = escape(request.POST.get('title', ''))
    author = escape(request.POST.get('author', ''))
    content = escape(request.POST.get('content', ''))
    tagsIn = escape(request.POST.get('tags', ''))
    tags = [x.strip() for x in tagsIn.split(',')]

    if ('' == title):
        success = False
        msg = 'Please enter a title for your rock anthem.'
    elif ('' == content):
        success = False
        msg = 'Please jot down the lyrics for your jam.'
    else:
        entry = Entry(
            title=title,
            author=author,
            content=content
        )
        entry.save()

        for tag in tags:
            tag = tag.lower()
            # lookup the tag, create it if necessary, and add it to the entry
            t = Tag()
            t.name = tag
            t.save()
            entry.tags.add(t)
        entry.save()
        success = True
        msg = entry.id

    data = {}
    data['success'] = success
    data['msg'] = msg
    out = simplejson.dumps(data)
    return HttpResponse(out, mimetype="application/json")


def list_entries(request):
    entries = Entry.objects.all()
    results = []

    for entry in entries:
        results.append(utils.getEntryDTO(entry))

    out = simplejson.dumps(results)
    return HttpResponse(out, mimetype='application/json')


def list_by_tag(request, tag_name):
    results = []
    inner = Tag.objects.filter(name=tag_name)
    entries = Entry.objects.filter(tags__in=inner)
    for entry in entries:
        results.append(utils.getEntryDTO(entry))
    out = simplejson.dumps({
        'entries': results,
        'entry_count': len(entries)
    })
    return HttpResponse(out, mimetype='application/json')


def entry(request, entry_id):
    entry = get_object_or_404(Entry, pk=entry_id)
    e = utils.getEntryDTO(entry)
    out = simplejson.dumps(e)
    return HttpResponse(out, mimetype='application/json')


def list_tags(request):
    results = []
    tags = Tag.objects.values('name').distinct()
    name = ''
    for tag in tags:
        name = tag['name']
        if '' != name:
            results.append(name)
    out = simplejson.dumps(results)
    return HttpResponse(out, mimetype='application/json')

'''
 ' Rock HTML Views
'''
from django.shortcuts import render_to_response, get_object_or_404
from rock.models import Entry
import utils


def add(request):
    return render_to_response('add.html', {})


def browse(request):
    return render_to_response('browse.html', {})


def detail(request, entry_id):
    entry = get_object_or_404(Entry, pk=entry_id)
    return render_to_response('detail.html', {
        'entry': utils.getEntryDTO(entry)
    })


def edit(request, entry_id):
    entry = get_object_or_404(Entry, pk=entry_id)
    return render_to_response('edit.html', {
        'entry': utils.getEntryDTO(entry)
    })


def home(request):
    return render_to_response('home.html', {})


def tag(request, tag_name):
    return render_to_response('tag.html', {
        'tag_name': tag_name
    })

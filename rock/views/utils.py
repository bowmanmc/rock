

def getEntryDTO(entry):
    time_format = '%A, %B %d, %Y at %H:%M %Z'

    e_tags = []
    for tag in entry.tags.all():
        e_tags.append(tag.name)

    return {
        u'id': entry.id,
        u'title': entry.title,
        u'content': entry.content,
        u'author': entry.author,
        u'tags': e_tags,
        u'date_created': entry.date_created.strftime(time_format),
        u'last_updated': entry.last_updated.strftime(time_format)
    }

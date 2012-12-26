from django.utils import unittest
from rock.models import Entry, Tag


class EntryTestCase(unittest.TestCase):

    def test_entry_save(self):
        title = 'Testing Entry Save'
        author = 'test'
        content = 'No worries... this is just a unit test'

        entry = Entry(
            title=title,
            author=author,
            content=content
        )
        entry.save()

        t1 = Tag()
        t1.name = 'test01'
        t1.save()

        entry.tags.add(t1)
        entry.save()

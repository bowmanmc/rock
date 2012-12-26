'''
 ' Model classes for the rock app
'''
from django.db import models


class Tag(models.Model):
    name = models.TextField(max_length=64)

    class Meta:
        db_table = 'tags'
        verbose_name_plural = 'tags'
        ordering = ('name',)


class Entry(models.Model):
    title = models.CharField(
        max_length=256,
        db_index=True
    )
    content = models.TextField()
    author = models.CharField(
        max_length=128,
        null=True
    )
    date_created = models.DateTimeField(
        auto_now_add=True,
        db_index=True
    )
    last_updated = models.DateTimeField(
        auto_now=True,
        db_index=True
    )
    tags = models.ManyToManyField(Tag, related_name='entry_tags')

    def __unicode__(self):
        return self.title

    class Meta:
        db_table = 'entries'
        verbose_name_plural = 'entries'
        ordering = ('-date_created',)
        get_latest_by = 'date_created'


# class Comment(models.Model):
#    entry_id = models.IntegerField()
#    content = models.TextField()
#    author = models.CharField(
#        max_length=128,
#        null=True
#    )
#    date_created = models.DateTimeField(
#        auto_now_add=True,
#        db_index=True
#    )
#    last_updated = models.DateTimeField(
#        auto_now=True,
#        db_index=True
#    )
#
#    class Meta:
#        db_table = 'comments'
#        verbose_name_plural = 'comments'
#        ordering = ('-date_created',)
#        get_latest_by = 'date_created'

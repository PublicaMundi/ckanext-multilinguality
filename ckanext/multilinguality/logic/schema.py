import json

import ckan.plugins as p
import ckan.lib.navl.dictization_functions as df

get_validator = p.toolkit.get_validator

not_missing = get_validator('not_missing')
not_empty = get_validator('not_empty')
resource_id_exists = get_validator('resource_id_exists')
package_id_exists = get_validator('package_id_exists')
package_id_or_name_exists = get_validator('package_id_or_name_exists')
ignore_missing = get_validator('ignore_missing')
empty = get_validator('empty')
boolean_validator = get_validator('boolean_validator')
int_validator = get_validator('int_validator')
OneOf = get_validator('OneOf')

def rename(old, new):
    '''
    Rename a schema field from old to new.
    Should be used in __after or __before.
    '''
    def rename_field(key, data, errors, context):
        index = max([int(k[1]) for k in data.keys()
                     if len(k) == 3 and k[0] == new] + [-1])

        for field_name in data.keys():
            if field_name[0] == old and data.get(field_name):
                new_field_name = list(field_name)
                new_field_name[0] = new

                if len(new_field_name) > 1:
                    new_field_name[1] = int(new_field_name[1]) + index + 1

                data[tuple(new_field_name)] = data[field_name]
                data.pop(field_name)

    return rename_field

def list_of_strings_or_lists(key, data, errors, context):
    value = data.get(key)
    if not isinstance(value, list):
        raise df.Invalid('Not a list')
    for x in value:
        if not isinstance(x, basestring) and not isinstance(x, list):
            raise df.Invalid('%s: %s' % ('Neither a string nor a list', x))


def list_of_strings_or_string(key, data, errors, context):
    value = data.get(key)
    if isinstance(value, basestring):
        return
    list_of_strings_or_lists(key, data, errors, context)

def json_validator(value, context):
    if isinstance(value, dict) or isinstance(value, list):
        return value
    try:
        value = json.loads(value)
    except ValueError:
        raise df.Invalid('Cannot parse JSON')
    return value


def translate_resource_create_schema():
    schema = {
        'package_id': [not_missing, not_empty, unicode, package_id_or_name_exists],
        'resource_id': [not_missing, not_empty, unicode, resource_id_exists],
        'mode': [ignore_missing, unicode, OneOf(
            ['automatic', 'manual', 'transcription'])],
        'language': [not_missing, unicode
            #OneOf(
            #['en', 'el','es', 'de', 'fr'])
            ],
        '__junk': [empty],
        '__before': [rename('id', 'resource_id')]
    }
    return schema

def translate_resource_update_schema():
    schema = {
        'resource_id': [not_missing, not_empty, unicode],
        'language': [not_missing, unicode],
        'column_name': [not_missing, not_empty, unicode],
        'title_translation': [ignore_missing, unicode],
        'force': [ignore_missing, boolean_validator],
        'mode': [not_missing, unicode, OneOf(
            ['automatic', 'manual', 'transcription', 'title'])],
        'translation': [ignore_missing, unicode],
        '__junk': [empty],
        '__before': [rename('id', 'resource_id')]
    }
    return schema

def translate_resource_delete_schema():
    schema = {
        'resource_id': [not_missing, not_empty, resource_id_exists, unicode],
        'language': [not_missing, unicode],
        'column_name': [ignore_missing, unicode],
        'force': [ignore_missing, boolean_validator],
        '__junk': [empty],
        '__before': [rename('id', 'resource_id')]
    }
    return schema

def translate_resource_publish_schema():
    schema = {
        'resource_id': [not_missing, not_empty, unicode, resource_id_exists],
        'language': [not_missing, unicode],
        '__junk': [empty],
        '__before': [rename('id', 'resource_id')]
    }
    return schema

def translate_resource_search_schema():
    schema = {
        'resource_id': [not_missing, not_empty, resource_id_exists, unicode],
        'language': [not_missing, unicode],
        'q': [ignore_missing, unicode],
        'plain': [ignore_missing, boolean_validator],
        'filters': [ignore_missing, json_validator],
        'limit': [ignore_missing, int_validator],
        'offset': [ignore_missing, int_validator],
        'fields': [ignore_missing, list_of_strings_or_string],
        'sort': [ignore_missing, list_of_strings_or_string],
        '__junk': [empty],
        '__before': [rename('id', 'resource_id')]
    }
    return schema



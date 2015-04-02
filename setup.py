from setuptools import setup, find_packages

version = '0.1'

setup(
    name='ckanext-multilinguality',
    version=version,
    description="A CKAN extension that modifies recline and provides api calls for multilinguality purposes",
    long_description="""\
    """,
    classifiers=[],  # Get strings from http://pypi.python.org/pypi?%3Aaction=list_classifiers
    keywords='ckan, multilinguality, preview',
    author='Me',
    author_email='',
    url='',
    license='AGPL',
    packages=find_packages(exclude=['ez_setup', 'examples', 'tests']),
    namespace_packages=['ckanext', 'ckanext.multilinguality'],
    include_package_data=True,
    zip_safe=False,
    install_requires=[
    ],
    entry_points=\
    """
    [ckan.plugins]
    recline_multilinguality=ckanext.multilinguality.plugin:ReclinePreviewMultilinguality
    """,
)
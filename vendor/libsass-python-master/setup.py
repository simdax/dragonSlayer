from __future__ import print_function, with_statement

import ast
import atexit
import distutils.cmd
import distutils.log
import distutils.sysconfig
import os.path
import platform
import shutil
import subprocess
import sys
import tempfile

from setuptools import Extension, setup

LIBSASS_SOURCE_DIR = os.path.join('libsass', 'src')

if (
        not os.path.isfile(os.path.join('libsass', 'Makefile')) and
        os.path.isdir('.git')
):
    print(file=sys.stderr)
    print('Missing the libsass sumbodule.  Try:', file=sys.stderr)
    print('  git submodule update --init', file=sys.stderr)
    print(file=sys.stderr)
    exit(1)


# Determine the libsass version from the git checkout
if os.path.exists(os.path.join('libsass', '.git')):
    proc = subprocess.Popen(
        (
            'git', '-C', 'libsass', 'describe',
            '--abbrev=4', '--dirty', '--always', '--tags',
        ),
        stdout=subprocess.PIPE,
    )
    out, _ = proc.communicate()
    assert not proc.returncode, proc.returncode
    with open('.libsass-upstream-version', 'wb') as libsass_version_file:
        libsass_version_file.write(out)

# The version file should always exist at this point
with open('.libsass-upstream-version', 'rb') as libsass_version_file:
    libsass_version = libsass_version_file.read().decode('UTF-8').strip()
    if sys.platform == 'win32':
        # This looks wrong, but is required for some reason :(
        version_define = r'/DLIBSASS_VERSION="\"{0}\""'.format(libsass_version)
    else:
        version_define = '-DLIBSASS_VERSION="{0}"'.format(libsass_version)

sources = ['pysass.cpp']
headers = []
for directory in (
        os.path.join('libsass', 'src'),
        os.path.join('libsass', 'include')
):
    for pth, _, filenames in os.walk(directory):
        for filename in filenames:
            filename = os.path.join(pth, filename)
            if filename.endswith(('.c', '.cpp')):
                sources.append(filename)
            elif filename.endswith('.h'):
                headers.append(filename)

if sys.platform == 'win32':
    from distutils.msvc9compiler import get_build_version
    vscomntools_env = 'VS{0}{1}COMNTOOLS'.format(
        int(get_build_version()),
        int(get_build_version() * 10) % 10
    )
    try:
        os.environ[vscomntools_env] = os.environ['VS140COMNTOOLS']
    except KeyError:
        distutils.log.warn('You probably need Visual Studio 2015 (14.0) '
                           'or higher')
    from distutils import msvccompiler, msvc9compiler
    if msvccompiler.get_build_version() < 14.0:
        msvccompiler.get_build_version = lambda: 14.0
    if get_build_version() < 14.0:
        msvc9compiler.get_build_version = lambda: 14.0
        msvc9compiler.VERSION = 14.0
    flags = ['/Od', '/EHsc', '/MT']
    link_flags = []
else:
    flags = [
        '-fPIC', '-std=gnu++0x', '-Wall', '-Wno-parentheses', '-Werror=switch',
    ]
    platform.mac_ver()
    if platform.system() in ['Darwin', 'FreeBSD']:
        os.environ.setdefault('CC', 'clang')
        os.environ.setdefault('CXX', 'clang++')
        orig_customize_compiler = distutils.sysconfig.customize_compiler

        def customize_compiler(compiler):
            orig_customize_compiler(compiler)
            compiler.compiler[0] = os.environ['CC']
            compiler.compiler_so[0] = os.environ['CXX']
            compiler.compiler_cxx[0] = os.environ['CXX']
            compiler.linker_so[0] = os.environ['CXX']
            return compiler
        distutils.sysconfig.customize_compiler = customize_compiler
        flags.append('-stdlib=libc++')
        if platform.system() == 'Darwin':
            flags.append('-mmacosx-version-min=10.7',)
            if tuple(map(int, platform.mac_ver()[0].split('.'))) >= (10, 9):
                flags.append(
                    '-Wno-error=unused-command-line-argument-hard-error-in-future',  # noqa
                )
        # Dirty workaround to avoid link error...
        # Python distutils doesn't provide any way to configure different
        # flags for each cc and c++.
        cencode_path = os.path.join(LIBSASS_SOURCE_DIR, 'cencode.c')
        cencode_body = ''
        with open(cencode_path) as f:
            cencode_body = f.read()
        with open(cencode_path, 'w') as f:
            f.write('''
                #ifdef __cplusplus
                extern "C" {
                #endif
            ''')
            f.write(cencode_body)
            f.write('''
                #ifdef __cplusplus
                }
                #endif
            ''')

        @atexit.register
        def restore_cencode():
            if os.path.isfile(cencode_path):
                with open(cencode_path, 'w') as f:
                    f.write(cencode_body)

    flags = ['-c', '-O3'] + flags

    if platform.system() == 'FreeBSD':
        link_flags = ['-fPIC', '-lc++']
    else:
        link_flags = ['-fPIC', '-lstdc++']

sass_extension = Extension(
    '_sass',
    sources,
    include_dirs=[os.path.join('.', 'libsass', 'include')],
    depends=headers,
    extra_compile_args=flags + [version_define],
    extra_link_args=link_flags,
)

install_requires = ['six']


def version(sass_filename='sass.py'):
    with open(sass_filename) as f:
        tree = ast.parse(f.read(), sass_filename)
    for node in tree.body:
        if isinstance(node, ast.Assign) and \
           len(node.targets) == 1:
            target, = node.targets
            if isinstance(target, ast.Name) and target.id == '__version__':
                return node.value.s


def readme():
    try:
        with open(os.path.join(os.path.dirname(__file__), 'README.rst')) as f:
            return f.read()
    except IOError:
        pass


class upload_doc(distutils.cmd.Command):
    """Uploads the documentation to GitHub pages."""

    description = __doc__
    user_options = []

    def initialize_options(self):
        pass

    def finalize_options(self):
        pass

    def run(self):
        path = tempfile.mkdtemp()
        build = os.path.join(os.path.dirname(os.path.abspath(__file__)),
                             'build', 'sphinx', 'html')
        os.chdir(path)
        os.system('git clone -b gh-pages --depth 5 '
                  'git@github.com:dahlia/libsass-python.git .')
        os.system('git rm -r .')
        os.system('touch .nojekyll')
        os.system('cp -r ' + build + '/* .')
        os.system('git stage .')
        os.system('git commit -a -m "Documentation updated."')
        os.system('git push origin gh-pages')
        shutil.rmtree(path)


setup(
    name='libsass',
    description='SASS for Python: '
                'A straightforward binding of libsass for Python.',
    long_description=readme(),
    version=version(),
    ext_modules=[sass_extension],
    packages=['sassutils'],
    py_modules=['sass', 'sassc', 'sasstests'],
    package_data={
        '': [
            'README.rst',
            'test/*.sass'
        ]
    },
    scripts=['sassc.py'],
    license='MIT License',
    author='Hong Minhee',
    author_email='minhee' '@' 'dahlia.kr',
    url='http://hongminhee.org/libsass-python/',
    download_url='https://github.com/dahlia/libsass-python/releases',
    entry_points={
        'distutils.commands': [
            'build_sass = sassutils.distutils:build_sass'
        ],
        'distutils.setup_keywords': [
            'sass_manifests = sassutils.distutils:validate_manifests'
        ],
        'console_scripts': [
            ['sassc = sassc:main']
        ]
    },
    install_requires=install_requires,
    extras_require={
        'upload_appveyor_builds': [
            'twine == 1.5.0',
        ],
    },
    classifiers=[
        'Development Status :: 5 - Production/Stable',
        'Environment :: Web Environment',
        'Intended Audience :: Developers',
        'License :: OSI Approved :: MIT License',
        'Operating System :: OS Independent',
        'Programming Language :: C',
        'Programming Language :: C++',
        'Programming Language :: Python :: 2.7',
        'Programming Language :: Python :: 3',
        'Programming Language :: Python :: 3.4',
        'Programming Language :: Python :: 3.5',
        'Programming Language :: Python :: 3.6',
        'Programming Language :: Python :: Implementation :: CPython',
        'Programming Language :: Python :: Implementation :: PyPy',
        'Programming Language :: Python :: Implementation :: Stackless',
        'Topic :: Internet :: WWW/HTTP',
        'Topic :: Internet :: WWW/HTTP :: Dynamic Content',
        'Topic :: Software Development :: Code Generators',
        'Topic :: Software Development :: Compilers'
    ],
    cmdclass={'upload_doc': upload_doc}
)

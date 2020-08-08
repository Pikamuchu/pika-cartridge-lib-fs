/* eslint-disable no-console */
const path = require('path');
const { existsSync, lstatSync, readdirSync, readFileSync, writeFileSync } = require('fs');
const { spawnSync } = require('child_process');
const replace = require('replace');

const REPLACE_REQUIRE_REGEX = /require\s*\(['"`]([^`"'.\\/]+)[`'"]\)/;
const FIND_REPLACE_REQUIRE_REGEX = /.*require\s*\(['"`]([^`"'.\\/]+)[`'"]\)/g;
const IGNORE_MODULE_DEPENDENCIES = ['.bin'];
const BABEL_IGNORE_FILES = ['**/test.js', '**/*.test.js', '**/*.min.js', '**/Gruntfile.js'];

const main = () => {
    const args = process.argv.slice(2);
    const moduleName = args[0];
    if (!moduleName) {
        console.log('No moduleName arg. Exiting.');
        return;
    }

    console.log(`** Building node module "${moduleName}" code as sfra cartridge lib.\n`);

    let source = `node_modules/${moduleName}`;
    let cartridgePath = `cartridges/lib_${moduleName}/cartridge/scripts/lib`;
    let destination = `${cartridgePath}/${moduleName}`;

    babelTransform(source, destination);
    createModuleIndex(source, destination);

    while (isDirectory(`${source}/node_modules`)) {
        const currentDirectory = `${source}/node_modules`;
        let directories = getDirectories(currentDirectory);
        directories.forEach(directory => {
            try {
                const dependencyName = directory && /([^\\/]+$)/.exec(directory)[1];
                if (dependencyName && !IGNORE_MODULE_DEPENDENCIES.includes(dependencyName)) {
                    console.log(`\n* Processing dependency module "${dependencyName}"...`);
                    source = `${directory}`;
                    destination = `${cartridgePath}/${dependencyName}`;
                    babelTransform(source, destination);
                    createModuleIndex(source, destination);
                }
            } catch (e) {
                console.error(e);
            }
        });
        if (currentDirectory === `${source}/node_modules`) {
            // No more dependencies
            break;
        }
    }

    // workaround in case babel presets not correctly detected
    npmBabel();

    requireReplace(cartridgePath);

    prettier();

    console.log('\n** ϞϞ(๑⚈‿‿⚈๑)∩ - Done!!\n');
};

const babelTransform = (source, destination) => {
    console.log(`Babel Transforming module "${source}" to "${destination}"...`);
    const babel = path.sep === '/' ? 'babel' : 'babel.cmd';
    const only = [`${source}/*.js`, `${source}/lib`, `${source}/main`];
    const result = spawnSync(babel, [source, '-d', destination, '--only', only, '--ignore', BABEL_IGNORE_FILES]);
    if (result.error && result.error.errno) {
        console.error(result.error);
    }
    console.log(String(result.stderr));
    console.log(String(result.stdout));
};

const npmBabel = () => {
    const npm = path.sep === '/' ? 'npm' : 'npm.cmd';
    const result = spawnSync(npm, ['run', 'babel']);
    if (result.error && result.error.errno) {
        console.error(result.error);
    }
    console.log(String(result.stderr));
    console.log(String(result.stdout));
};

const createModuleIndex = (source, destination) => {
    const sourceIndexFile = `${source}/index.js`;
    const indexFile = `${destination}/index.js`;
    if (!existsSync(sourceIndexFile)) {
        console.log(`Creating index file for module "${destination}"...`);
        const modulePackage = readFileSync(`${source}/package.json`);
        let moduleMainFile = modulePackage && JSON.parse(modulePackage).main;
        if (moduleMainFile && !moduleMainFile.startsWith('./')) {
            moduleMainFile = `./${moduleMainFile}`;
        }
        writeFileSync(indexFile, `module.exports = require('${moduleMainFile}');`);
    }
};

const requireReplace = cartridgePath => {
    console.log(`Transforming require cartridge on "${cartridgePath}"...`);
    replace({
        regex: FIND_REPLACE_REQUIRE_REGEX,
        replacement: (str, p1) => {
            return str.match(/^\s*\*/)
                ? str
                : str.replace(REPLACE_REQUIRE_REGEX, `require('*/cartridge/scripts/lib/${p1}/index')`);
        },
        paths: [cartridgePath],
        recursive: true,
        silent: true
    });
};

const prettier = () => {
    console.log('Prettier generated code...');
    const npm = path.sep === '/' ? 'npm' : 'npm.cmd';
    const result = spawnSync(npm, ['run', 'prettier']);
    if (result.error && result.error.errno) {
        console.error(result.error);
    }
    console.log(String(result.stdout));
};

const isDirectory = source => existsSync(source) && lstatSync(source).isDirectory();

const getDirectories = source =>
    readdirSync(source)
        .map(name => [source, name].join('/'))
        .filter(isDirectory);

main();

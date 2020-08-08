const sinon = require('sinon');
const { assert } = require('chai');
const searchquire = require('searchquire');

describe('fs library', () => {
    let fs;

    before(() => {
        // initialize test config and spies
        fs = searchquire(
            '*/cartridge/scripts/lib/fs/index',
            {
                basePath: '../cartridges/lib_fs/cartridge',
                pattern: '*/cartridge/(.*)',
                maxSearchModuleIterations: 20
            },
            {}
        );
    });

    beforeEach(() => {
        // reset spies
    });

    describe('fs initialization', () => {
        it('fs defined', () => {
            assert.isDefined(fs);
        });
    });
});

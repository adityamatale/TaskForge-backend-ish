// load a separate vitest config for testing on test db
import {defineConfig} from "vitest/config";

export default defineConfig({
    test: {
        env: {
            NODE_ENV: 'test',
        },
        setupFiles: ['./src/tests/setup.js'],      // setup file for tests - functions that run before and after the test to keep the database clean
        fileParallelism: false                  // disable parallel test running to avoid db conflicts & twice loading of the setup.js file
    }
})
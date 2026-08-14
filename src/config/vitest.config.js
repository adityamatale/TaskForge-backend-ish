// load a separate vitest config for testing on test db
import {defineConfig} from "vitest/config";

export default defineConfig({
    test: {
        env: {
            NODE_ENV: 'test',
        }
    }
})
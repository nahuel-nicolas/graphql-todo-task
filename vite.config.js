import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
    plugins: [react()],
    test: {
        environment: 'happy-dom',
        exclude: ['./db/mongodata', './node_modules']
    },
    // logLevel: true
})
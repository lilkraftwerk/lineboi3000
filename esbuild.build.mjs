#!/usr/bin/env node
'use strict';

/**
 * Usage:
 *   node ./esbuild.build.mjs               production build (minified)
 *   node ./esbuild.build.mjs --dev         development build (sourcemaps)
 *   node ./esbuild.build.mjs --dev --watch development build, watching for changes
 */

import { resolve, join, dirname } from 'node:path';
import { cpSync, mkdirSync } from 'node:fs';
import { context, build } from 'esbuild';
import cssModulesPlugin from 'esbuild-css-modules-plugin';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname);
const OUTDIR = join(ROOT, 'dist');
const JSCONFIG = join(ROOT, 'jsconfig.json'); 

const args = process.argv.slice(2);
const isDev = args.includes('--dev');
const isWatch = args.includes('--watch');

function copyStaticFiles() {
    mkdirSync(OUTDIR, { recursive: true });
    cpSync(join(ROOT, 'src/assets'), join(OUTDIR, 'assets'), { recursive: true });
    cpSync(join(ROOT, 'src/index.html'), join(OUTDIR, 'index.html') );
    cpSync(
        join(ROOT, 'src/backgroundWindow/background.html'),
        join(OUTDIR, 'background.html'),
    );
}

const buildOptions = {
    entryPoints: {
        main: join(ROOT, 'src/index.js'),
        background: join(ROOT, 'src/backgroundWindow/background.js'),
    },
    outdir: OUTDIR,
    bundle: true,
    // 'node' (not 'browser'): the original config used webpack's `target: 'electron-renderer'`,
    // which bundles like a browser but leaves Node core modules (fs, path, ...) as externals
    // since Electron's renderer (with nodeIntegration) has `require` available at runtime.
    // esbuild's 'node' platform gives us that same "core modules stay external" behavior.
    platform: 'node',
    // Loaded via <script src="..."> in an HTML page, not require()'d or import()'d,
    // so it needs to be a self-executing bundle rather than a CJS/ESM module.
    format: 'iife',
    target: 'es2025',
    // 'electron' itself isn't a Node core module, so it needs to be listed explicitly.
    // Add any other native modules the renderer code requires directly (e.g. if
    // 'serialport' ends up imported here rather than only used by the separate
    // cncserver process) — esbuild can't bundle native .node addons anyway.
    external: ['electron'],
    jsx: 'automatic',
    tsconfig: JSCONFIG,
    loader: {
        '.js': 'jsx',
        '.jsx': 'jsx',
        '.png': 'file',
        '.jpg': 'file',
        '.jpeg': 'file',
        '.gif': 'file',
        '.svg': 'file',
        '.eot': 'file',
        '.ttf': 'file',
        '.woff': 'file',
        '.woff2': 'file',
    },
    sourcemap: isDev,
    minify: !isDev,
    metafile: true,
    logLevel: 'info',
    define: {
        'process.env.NODE_ENV': JSON.stringify(isDev ? 'development': 'production'),
    },
    plugins: [
        cssModulesPlugin({
            inject: true, // auto-injects generated CSS into <head>, replacing style-loader
            filter: /\.css$/i,
        }),
    ],
};

async function run() {
    copyStaticFiles();

    if (isWatch) {
        const ctx = await context(buildOptions);
        await ctx.watch();
        console.log('[esbuild] watching for changes...');
        return;
    }

    const result = await build(buildOptions);
    if (result.errors.length) process.exitCode = 1;
    console.log(`[esbuild] build complete${isDev ? '' : ' (production)'}`);
}

run().catch((err) => {
    console.error(err);
    process.exit(1);
});

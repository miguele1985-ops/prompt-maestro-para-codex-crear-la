const fs = require('node:fs');
const path = require('node:path');
const Module = require('node:module');
const ts = require('typescript');
const resolve = Module._resolveFilename;
Module._resolveFilename = function (name, ...args) {
  return resolve.call(this, name.startsWith('@/') ? path.resolve('src', name.slice(2)) : name, ...args);
};
require.extensions['.ts'] = (module, file) => module._compile(ts.transpile(fs.readFileSync(file, 'utf8'), { module: ts.ModuleKind.CommonJS, esModuleInterop: true }), file);
const { blogPosts } = require('../src/content/blog.ts');
if (require.main === module) console.log(JSON.stringify(blogPosts.map(({slug,image,imageAlt})=>({slug,image,imageAlt})), null, 2));
module.exports = blogPosts;

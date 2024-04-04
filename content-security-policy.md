# Content Security Policy

The Multi-Finder Pro extension adheres to a strict Content Security Policy (CSP) to enhance security and protect against potential vulnerabilities. The following CSP directives are implemented:

## Extension Pages
- `script-src 'self'`: Allows loading scripts only from the extension's own package.
- `object-src 'self'`: Allows loading objects (e.g., plugins) only from the extension's own package.

## Content Scripts
- `script-src 'self'`: Allows loading scripts only from the extension's own package.
- `object-src 'self'`: Allows loading objects (e.g., plugins) only from the extension's own package.

These CSP directives restrict the extension pages and content scripts to only load resources from the extension's own package, preventing the execution of inline scripts and the loading of resources from external sources. This mitigates the risk of cross-site scripting (XSS) attacks and other security vulnerabilities.

Note: The CSP directives are defined in the `manifest.json` file under the `"content_security_policy"` field.
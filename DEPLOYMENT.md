# Domain deployment

Upload the complete site to the domain's document root, including the root `.htaccess` file and the tracked `images/` directory. The custom domain currently returns 404 for `/images/...`; uploading only HTML, CSS, and JavaScript files will leave pictures missing.

The `.htaccess` rules redirect legacy `.html` page URLs to clean URLs and serve each existing HTML page at its extensionless URL. The hosting account must process Apache-compatible rewrite rules. If the site is served directly by Nginx and `.htaccess` is ignored, configure the equivalent redirects and rewrites in the hosting control panel or ask the provider to enable them.

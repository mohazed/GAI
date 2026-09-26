# Security

The site is static: no server, no database, no accounts, no runtime secrets. The areas that matter are the build pipeline, the GitHub Actions workflows, the deploy credentials and the integrity of the published data (hashes, manifest, archived copies).

## Reporting a vulnerability

Report privately through GitHub: the repository's **Security** tab, then **Report a vulnerability**. If that option is not shown, open an issue titled "Security contact request" with no details, and the maintainer will reply with a private channel. Do not describe a vulnerability in a public issue.

Include what is affected, how to reproduce it and the impact you expect. You will get an acknowledgement within 7 days. Fixes are published in the commit history; if the issue affected published data, it is also logged on the corrections page.

## Data integrity

If you find a source whose archived copy does not match its recorded SHA-256, or a published file that does not match `manifest.json`, report it with the **Report an error** issue form; it is a data question, not a secret.

#!/usr/bin/env bash
# Optional mirror of the built site on the author's server (docs/04 §5, D-06): rsync over SSH of
# the same out/ folder Cloudflare Pages serves. Off by default: deploy.yml and nightly.yml run it
# only when the repository variable GAI_MIRROR is "true", with three Actions secrets:
#   MIRROR_SSH_KEY      private key of a deploy-only user (ed25519, no passphrase)
#   MIRROR_KNOWN_HOSTS  the server's line(s) from `ssh-keyscan -t ed25519 <host>`
#   MIRROR_TARGET       user@host:/path/to/webroot/ (the web server serves that folder and applies
#                       the rules of _headers itself; see docs/04 §5)
#
#   .github/scripts/mirror.sh <dir>
set -euo pipefail
dir=${1%/}
: "${MIRROR_SSH_KEY:?}" "${MIRROR_KNOWN_HOSTS:?}" "${MIRROR_TARGET:?}"
ssh_dir=$(mktemp -d)
trap 'rm -rf "$ssh_dir"' EXIT
printf '%s\n' "$MIRROR_SSH_KEY" > "$ssh_dir/key"
printf '%s\n' "$MIRROR_KNOWN_HOSTS" > "$ssh_dir/known_hosts"
chmod 600 "$ssh_dir/key"
rsync --archive --delete --checksum --human-readable --stats \
  -e "ssh -i $ssh_dir/key -o UserKnownHostsFile=$ssh_dir/known_hosts -o StrictHostKeyChecking=yes -o IdentitiesOnly=yes" \
  "$dir/" "$MIRROR_TARGET"

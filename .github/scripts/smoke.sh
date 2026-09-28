#!/usr/bin/env bash
# After an upload: waits until the deployment at <url> serves the manifest just built (same commit
# and build date; the edge may take a few seconds), then checks a few pages and headers that must
# never regress (docs/04 §3): both languages answer 200, a page carries the CSP, the API carries
# CORS, a hashed asset is immutable without the page-level headers.
#
#   .github/scripts/smoke.sh <url> <local manifest.json>
set -euo pipefail
url=${1%/} local=$2
want=$(jq -r '"\(.git.sha) \(.build_date)"' "$local")
for i in $(seq 1 36); do
  got=$(curl -fsS "$url/api/v1/manifest.json" 2>/dev/null | jq -r '"\(.git.sha) \(.build_date)"' || true)
  [ "$got" = "$want" ] && break
  [ "$i" = 36 ] && { echo "$url serves manifest '$got', expected '$want'" >&2; exit 1; }
  sleep 5
done
fail=0
check() { # <description> <command…>
  local what=$1; shift
  if "$@"; then echo "ok   $what"; else echo "FAIL $what" >&2; fail=1; fi
}
status() { curl -sS -o /dev/null -w '%{http_code}' "$url$1"; }
headers() { curl -sS -D - -o /dev/null "$url$1" | tr -d '\r'; }
check "/en/ 200" test "$(status /en/)" = 200
check "/fr/ 200" test "$(status /fr/)" = 200
check "/en/ has a Content-Security-Policy" grep -qi '^content-security-policy:' <(headers /en/)
check "/api/v1/manifest.json has CORS" grep -qi '^access-control-allow-origin: \*' <(headers /api/v1/manifest.json)
asset=$(grep -oE '/_next/static/[^"]+\.js' apps/web/out/en/index.html | head -n 1)
check "$asset immutable" grep -qi '^cache-control: public, max-age=31536000, immutable' <(headers "$asset")
check "$asset without page CSP" bash -c "! grep -qi '^content-security-policy:' <<<\"\$1\"" _ "$(headers "$asset")"
exit $fail

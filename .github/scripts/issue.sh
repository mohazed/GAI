#!/usr/bin/env bash
# Opens an issue with this title, or comments on the open one that has it (one issue per problem,
# however many runs fail). Used by nightly.yml and wayback.yml with the workflow's GITHUB_TOKEN.
#
#   .github/scripts/issue.sh open  "<title>" <body-file>
#   .github/scripts/issue.sh close "<title>" <body-file>   # comment and close, if one is open
set -euo pipefail
action=$1 title=$2 body=$3
# Only an issue the workflows opened themselves (author github-actions[bot]) counts: anyone can open
# an issue with the same title, and the reports must not land in, or close, someone else's (P-19).
number=$(gh issue list --state open --author "app/github-actions" \
  --search "\"$title\" in:title" --json number,title \
  --jq "map(select(.title == \"$title\")) | first | .number // empty")
case "$action" in
  open)
    if [ -n "$number" ]; then
      gh issue comment "$number" --body-file "$body"
    else
      gh issue create --title "$title" --body-file "$body"
    fi
    ;;
  close)
    if [ -n "$number" ]; then
      gh issue comment "$number" --body-file "$body"
      gh issue close "$number"
    fi
    ;;
  *)
    echo "usage: issue.sh open|close <title> <body-file>" >&2
    exit 2
    ;;
esac

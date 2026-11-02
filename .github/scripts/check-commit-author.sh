#!/usr/bin/env bash
# check-commit-author.sh: 커밋에 AI 도구 표시(작성자, 커미터, 공동 작성자 줄 등)가 있으면 실패시킨다.
# 사용법: bash .github/scripts/check-commit-author.sh <커밋 범위>
#   예) origin/main..HEAD   (이번 PR에서 새로 만든 커밋만)
#   예) HEAD                (기록 전체)
set -euo pipefail

range="${1:?커밋 범위를 넣어 주세요. 예: origin/main..HEAD}"
bad=0

while IFS= read -r sha; do
  [ -z "$sha" ] && continue

  # 1) 작성자 / 커미터의 이름과 이메일
  ident="$(git log -1 --format='작성자: %an <%ae> / 커미터: %cn <%ce>' "$sha")"
  if printf '%s' "$ident" | grep -qiE 'claude|anthropic'; then
    echo "✗ ${sha:0:7}  $ident"
    bad=1
  fi

  # 2) 커밋 메시지의 Claude 표시 (공동 작성자 줄, 세션 줄, claude.ai/code 링크)
  hit="$(git log -1 --format='%B' "$sha" | grep -iE '^(co-authored-by:.*(claude|anthropic)|claude-session:)|claude\.ai/code' || true)"
  if [ -n "$hit" ]; then
    echo "✗ ${sha:0:7}  커밋 메시지에 Claude 표시가 있습니다:"
    printf '%s\n' "$hit" | sed 's/^/      /'
    bad=1
  fi
done < <(git rev-list "$range")

if [ "$bad" -ne 0 ]; then
  echo
  echo "Claude 흔적이 있는 커밋이 있어서 중단합니다."
  echo "작성자는 git config user.name / user.email 을 확인하고,"
  echo "이미 만든 커밋은 git commit --amend --reset-author (최근 1개) 등으로 고친 뒤 다시 올려 주세요."
  exit 1
fi

echo "✓ Claude 흔적 0건 ($range)"

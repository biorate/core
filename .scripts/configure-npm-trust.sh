#!/usr/bin/env bash
#
# configure-npm-trust.sh — массовая настройка npm trusted publishers (OIDC)
# для всех публикуемых пакетов @biorate/* репозитория.
#
# Зачем: публикация переводится на npm trusted publishing через GitHub Actions
# (workflow .github/workflows/publish.yml). Для каждого пакета нужно создать
# trust-конфиг, который разрешает публикацию именно из этого workflow.
#
# Требования окружения (жёсткие): npm >= 11.15.0, node >= 22.14.0.
#
# ВАЖНО (первый запуск): первый реальный вызов `npm trust` запускает
# интерактивную 2FA — npm открывает окно «skip 2FA» на 5 минут. Весь
# bulk-прогон (55 пакетов + паузы между вызовами) нужно уложиться в это окно.
#
# ВАЖНО: trust-конфиги, созданные после 2026-09-03, по умолчанию stage-only,
# поэтому флаг --allow-publish обязателен в каждом вызове (скрипт ставит его
# всегда).
#
# Использование:
#   DRY_RUN=1 bash .scripts/configure-npm-trust.sh   # только печать команд, без сети
#   bash .scripts/configure-npm-trust.sh             # реальный прогон (2FA на первом пакете)
#   VERIFY=1 bash .scripts/configure-npm-trust.sh    # проверка после прогона: OK: 55/55
#
# Переменные окружения:
#   NPM_TRUST_REPO (по умолчанию biorate/core)
#   NPM_TRUST_WORKFLOW_FILE (по умолчанию publish.yml)
#   DRY_RUN (по умолчанию 0), VERIFY (по умолчанию 0)

set -euo pipefail

REPO="${NPM_TRUST_REPO:-biorate/core}"
WORKFLOW_FILE="${NPM_TRUST_WORKFLOW_FILE:-publish.yml}"
DRY_RUN="${DRY_RUN:-0}"
VERIFY="${VERIFY:-0}"
SLEEP_SECONDS=2

# version_ge CURRENT REQUIRED — выход 0, если CURRENT >= REQUIRED (числовое
# сравнение версий, не строковое).
version_ge() {
  [ "$(printf '%s\n%s\n' "$2" "$1" | sort -V | tail -n 1)" = "$1" ]
}

# Preflight — только для реальных прогонов (DRY_RUN=1 пропускает его целиком).
# Порядок строгий: все локальные проверки ДО сетевого npm whoami.
preflight() {
  local workflow_path=".github/workflows/${WORKFLOW_FILE}"
  if [ ! -f "$workflow_path" ]; then
    echo "ERROR: workflow file not found: ${workflow_path}" >&2
    echo "commit the workflow file first: ${workflow_path}, then re-run this script." >&2
    exit 1
  fi

  local node_ver npm_ver
  node_ver="$(node -v | sed 's/^v//')"
  if ! version_ge "$node_ver" "22.14.0"; then
    echo "ERROR: node >= 22.14.0 is a hard requirement for npm trusted publishing (found: ${node_ver})." >&2
    echo "Hint: install node >= 22.14, e.g. via nvm: nvm install 22.14 && nvm use 22.14" >&2
    exit 1
  fi

  npm_ver="$(npm -v)"
  if ! version_ge "$npm_ver" "11.15.0"; then
    echo "ERROR: npm >= 11.15.0 is required for 'npm trust' (found: ${npm_ver})." >&2
    echo "Hint: npm i -g npm@^11.15.0" >&2
    exit 1
  fi

  # Только после всех локальных проверок — сетевой вызов.
  if ! npm whoami; then
    echo "ERROR: not authenticated to the npm registry." >&2
    echo "Hint: run 'npm login', then re-run this script." >&2
    exit 1
  fi
}

# Режим VERIFY=1: владельцем запускается после массового прогона.
# Успех по пакету = вывод `npm trust list` содержит 'github' и имя workflow.
# Формат вывода npm trust list не задокументирован — сырой вывод печатается
# под строкой статуса, чтобы владелец мог просмотреть глазами.
run_verify() {
  local ok=0 total="${#PACKAGES[@]}" pkg output
  for pkg in "${PACKAGES[@]}"; do
    output="$(npm trust list "$pkg" 2>&1)" || output="$output
    ERROR: 'npm trust list ${pkg}' exited non-zero (output above/below)."
    if printf '%s\n' "$output" | grep -q 'github' && printf '%s\n' "$output" | grep -qF "$WORKFLOW_FILE"; then
      echo "OK: ${pkg}"
      ok=$((ok + 1))
    else
      echo "FAIL: ${pkg}"
    fi
    # Сырой вывод для визуальной проверки владельцем.
    printf '%s\n' "$output" | sed 's/^/    /'
    echo
  done
  echo "OK: ${ok}/${total}"
  [ "$ok" -eq "$total" ] || exit 1
}

# Список пакетов: lerna сам учитывает ignore из lerna.json → ровно публикуемые
# 55 пакетов. Жёстко закреплённых имён нет.
mapfile -t PACKAGES < <(npx lerna list --loglevel silent)
if [ "${#PACKAGES[@]}" -eq 0 ]; then
  echo "ERROR: 'npx lerna list --loglevel silent' returned no packages." >&2
  exit 1
fi

if [ "$VERIFY" = "1" ]; then
  preflight
  run_verify
  exit 0
fi

if [ "$DRY_RUN" = "1" ]; then
  # DRY_RUN: без preflight, без единого вызова npm/сети — только печать команд.
  for pkg in "${PACKAGES[@]}"; do
    echo "npm trust github $pkg --file $WORKFLOW_FILE --repo $REPO --allow-publish --yes"
  done
  exit 0
fi

preflight

# Реальный прогон. stderr npm trust пробрасывается как есть (текст ошибок
# не классифицируется — его формулировка не зафиксирована).
for i in "${!PACKAGES[@]}"; do
  pkg="${PACKAGES[$i]}"
  # Пауза между реальными вызовами (не перед первым).
  if [ "$i" -gt 0 ]; then
    sleep "$SLEEP_SECONDS"
  fi
  if ! npm trust github "$pkg" --file "$WORKFLOW_FILE" --repo "$REPO" --allow-publish --yes; then
    echo "ERROR: 'npm trust' failed for ${pkg}; stderr above is passed through as-is." >&2
    echo "Replace recipe: npm trust list ${pkg} -> npm trust revoke --id <id> ${pkg} -> re-run this script." >&2
    exit 1
  fi
done

echo "Done: ${#PACKAGES[@]} trusted publisher configs processed."

# =============================================================================
# Makefile — Portfolio Web (Vue 3 + Vite + TypeScript)
#
# Uso:  make            -> lista los objetivos disponibles
#       make help       -> idem, con detalle
#
# Requisitos: node >= 18, npm >= 8  (opcionalmente docker para los targets docker:*)
# =============================================================================

# --- Configuración -----------------------------------------------------------
NODE        ?= node
NPM         ?= npm
COMPOSE     ?= docker compose

DEV_PORT    ?= 5173
DEV_HOST    ?= 0.0.0.0
DOCKER_PORT ?= 8080

# URL del preview de producción (base '/website/' en modo production)
PREVIEW_URL ?= http://localhost:4173/website/

.DEFAULT_GOAL := help
.PHONY: help install setup env dev build preview test test-watch test-ci coverage \
        lint lint-fix typecheck check clean docker-build docker-up docker-down \
        docker-logs docker-shell docker-clean docker-prod-build docker-prod-up \
        docker-prod-down verify-env

# --- Ayuda -------------------------------------------------------------------
help: ## Muestra esta ayuda
	@echo ""
	@echo "  Portfolio Web — objetivos disponibles"
	@echo "  ─────────────────────────────────────"
	@grep -E '^[a-zA-Z0-9_-]+:.*?## .*$$' $(MAKEFILE_LIST) \
		| sort \
		| awk 'BEGIN {FS = ":.*?## "} {printf "  \033[36m%-16s\033[0m %s\n", $$1, $$2}'
	@echo ""
	@echo "  Ejemplo: make install && make dev"

# --- Comprobaciones previas --------------------------------------------------
verify-env: ## Verifica que node y npm estén disponibles
	@command -v $(NODE) >/dev/null 2>&1 || { echo "✗ node no encontrado (instala Node >= 18)"; exit 1; }
	@command -v $(NPM) >/dev/null 2>&1 || { echo "✗ npm no encontrado (instala npm >= 8)"; exit 1; }
	@echo "✓ node $$($(NODE) -v) | npm $$($(NPM) -v)"

# --- Instalación -------------------------------------------------------------
install: verify-env ## Instala dependencias (npm ci si hay lockfile) y prepara .env.local
	@if [ -f package-lock.json ]; then \
		echo "→ npm ci (instalación reproducible desde package-lock.json)"; \
		$(NPM) ci; \
	else \
		echo "→ npm install (no se encontró package-lock.json)"; \
		$(NPM) install; \
	fi
	@$(MAKE) --no-print-directory env
	@echo "✓ Dependencias listas. Ejecuta 'make dev' para levantar el entorno."

env: ## Crea .env.local a partir de .env.example si no existe
	@if [ -f .env.local ]; then \
		echo "→ .env.local ya existe (no se sobreescribe)"; \
	else \
		cp .env.example .env.local && echo "✓ .env.local creado desde .env.example"; \
	fi

setup: install ## Alias de 'install' (preparación completa del entorno)

# --- Desarrollo --------------------------------------------------------------
dev: verify-env ## Levanta el servidor de desarrollo de Vite (host 0.0.0.0)
	@$(MAKE) --no-print-directory env
	@echo "→ Vite dev server en http://localhost:$(DEV_PORT)"
	$(NPM) run dev -- --host $(DEV_HOST) --port $(DEV_PORT)

build: verify-env ## Compila el bundle de producción en dist/
	$(NPM) run build
	@echo "✓ Build generado en dist/ (base '/website/')"

preview: verify-env ## Sirve el build de producción con vite preview
	@echo "→ Preview en $(PREVIEW_URL)"
	$(NPM) run preview -- --host $(DEV_HOST) --port 4173

# --- Calidad ----------------------------------------------------------------
lint: verify-env ## Ejecuta ESLint sobre src/ y tests/
	$(NPM) run lint

lint-fix: verify-env ## Ejecuta ESLint con auto-corrección
	$(NPM) run lint -- --fix

typecheck: verify-env ## Verifica tipos con TypeScript (sin emitir)
	$(NPM) exec tsc -- --noEmit

test: verify-env ## Ejecuta la suite de tests con Jest
	$(NPM) test

test-watch: verify-env ## Ejecuta Jest en modo watch
	$(NPM) test -- --watch

test-ci: verify-env ## Ejecuta Jest en modo CI con coverage y maxWorkers=2
	$(NPM) run test:ci

coverage: verify-env ## Genera el reporte de coverage
	$(NPM) test -- --coverage

check: lint typecheck test-ci ## Check completo: lint + typecheck + tests con coverage

# --- Docker ------------------------------------------------------------------
docker-build: ## Construye la imagen de producción (Dockerfile multi-stage → nginx)
	$(COMPOSE) build

docker-up: ## Levanta el stack de desarrollo en Docker (http://localhost:8080)
	$(COMPOSE) up --build -d
	@echo "→ http://localhost:$(DOCKER_PORT)"

docker-down: ## Detiene el stack de Docker, limpia la red y resetea el volumen node_modules
	$(COMPOSE) down --remove-orphans --volumes

docker-logs: ## Muestra los logs del stack de Docker
	$(COMPOSE) logs -f

docker-shell: ## Abre una shell dentro del contenedor de desarrollo
	$(COMPOSE) exec app sh

docker-clean: ## Elimina contenedores, imágenes y volúmenes de este stack
	$(COMPOSE) down -v --rmi local

docker-prod-build: ## Construye la imagen de producción (Dockerfile multi-stage → nginx)
	docker build -f Dockerfile -t website-prod:latest .

docker-prod-up: ## Levanta la imagen de producción en http://localhost:8081/website/
	docker rm -f website-prod >/dev/null 2>&1 || true
	docker run -d --name website-prod -p 8081:80 website-prod:latest
	@echo "→ http://localhost:8081/website/"

docker-prod-down: ## Detiene y elimina el contenedor de producción
	docker rm -f website-prod >/dev/null 2>&1 || true

# --- Utilidades --------------------------------------------------------------
clean: ## Elimina dist/, coverage/ y cachés de build
	rm -rf dist coverage node_modules/.vite node_modules/.cache
	@echo "✓ Artefactos de build eliminados"

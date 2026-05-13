SONAR_HOST_URL ?= http://172.17.0.4:9000
SONAR_TOKEN    ?= sqa_43845013c172dd2d21f5726127126fb5fc107b71

.PHONY: up down sonar

up:
	docker compose up

down:
	docker compose down

sonar:
	docker run --rm \
		-v $(PWD):/usr/src:z \
		-e SONAR_HOST_URL=$(SONAR_HOST_URL) \
		-e SONAR_TOKEN=$(SONAR_TOKEN) \
		sonarsource/sonar-scanner-cli \
		-Dsonar.projectKey=website \
		-Dsonar.projectName=website \
		-Dsonar.projectVersion=0.1.0 \
		-Dsonar.sources=/usr/src/src \
		-Dsonar.tests=/usr/src/tests \
		-Dsonar.exclusions="src/**/*.backup,node_modules/**,dist/**,coverage/**" \
		-Dsonar.sourceEncoding=UTF-8

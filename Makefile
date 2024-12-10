.DEFAULT_GOAL := help
.EXPORT_ALL_VARIABLES:

AWS_ACCOUNT		= 767398097913
OWNER			= sociate
SERVICE_NAME 	= landing

ENV 			?= prod
DEPLOY_REGION 	?= eu-west-2
DOCKER_NETWORK 	= $(OWNER)_network
PROJECT_NAME	= $(OWNER)-$(ENV)-$(SERVICE_NAME)
TAG_DEPLOY		?= 20240526213421

# Deploy vars
TERRAFORM_BUCKET	?= $(OWNER).$(ENV).infrastructure
TERRAFORM_REGION	?= eu-west-2
TERRAFORM_KEY 		?=terraform/${OWNER}/${ENV}/$(SERVICE_NAME)/terraform.tfstate
DEPLOY_VARS			=-var environment="$(ENV)" \
					 -var owner="${OWNER}" \
					 -var service_name="${SERVICE_NAME}" \
					 -var tag="$(TAG_DEPLOY)" \
					 -var aws_account="${AWS_ACCOUNT}" \
					 -var aws_region="${DEPLOY_REGION}"


container.image: ## Create a Docker image with the dependencies packaged
	docker build -f Dockerfile --no-cache \
		-t $(PROJECT_NAME) .

container.install: ## Run a container to install npm dependencies
	@docker run --rm -t \
		-v ${PWD}:/app \
		$(PROJECT_NAME) \
		npm install -d

container.build: ## Run a container to build a code in dist folder
	@docker run --rm -t \
		-v ${PWD}:/app \
		$(PROJECT_NAME) \
		npm run build

container.up: ## Run a container to up local
	@docker run --rm -t \
		-v ${PWD}:/app \
		-p 4321:4321 \
		$(PROJECT_NAME) \
		npm run start

deploy.init:
	@terraform version
	terraform init \
		-backend-config "bucket=$(TERRAFORM_BUCKET)" \
		-backend-config "region=$(TERRAFORM_REGION)" \
		-backend-config "key=$(TERRAFORM_KEY)" \
		$(DEPLOY_VARS)

deploy: deploy.init ## Infrastructure deploy
	terraform plan $(DEPLOY_VARS)
	terraform apply -auto-approve $(DEPLOY_VARS)

destroy: deploy.init ## Infrastructure destroy
	terraform plan -destroy $(DEPLOY_VARS)
	terraform destroy -auto-approve $(DEPLOY_VARS)

verify_network: ## Verify the local network was created in docker, normalLy created before up container service: make verify_network
	@if [ -z $$(docker network ls | grep $(DOCKER_NETWORK) | awk '{print $$2}') ]; then\
		(docker network create $(DOCKER_NETWORK));\
	fi

## HELP TARGET ##
help:
	@printf "\033[31m%-22s %-59s %s\033[0m\n" "Target" " Help" "Usage"; \
	printf "\033[31m%-22s %-59s %s\033[0m\n"  "------" " ----" "-----"; \
	grep -hE '^\S+:.*## .*$$' $(MAKEFILE_LIST) | sed -e 's/:.*##\s*/:/' | sort | awk 'BEGIN {FS = ":"}; {printf "\033[32m%-22s\033[0m %-58s \033[34m%s\033[0m\n", $$1, $$2, $$3}'

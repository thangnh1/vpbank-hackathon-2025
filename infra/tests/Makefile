.PHONY: fmt validate test

fmt:
	terraform fmt -recursive ..

validate:
	terraform -chdir=../envs/dev init -backend=false
	terraform -chdir=../envs/dev validate
	terraform -chdir=../envs/prod init -backend=false
	terraform -chdir=../envs/prod validate

test:
	go test ./terratest -timeout 30m

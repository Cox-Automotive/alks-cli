TOKEN = --build-arg REFRESH_TOKEN
USER = --build-arg USERNAME=shfinkel

CI_MODE = false
ifeq ($(CI_MODE),true)
	IT_FLAGS =
else
	IT_FLAGS = -it
endif

build:
	@echo "Building tester..."
	docker build $(TOKEN) $(USER) -t alks-cli-test -f Dockerfile ..

test: build
	@echo "running intg tests..."
	docker run $(CI_MODE) --rm alks-cli-test

test-shell: build
	@echo "running intg tests...currently opening an interactive shell"
	docker run -it --rm --entrypoint /bin/bash --rm alks-cli-test

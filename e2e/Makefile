TOKEN = --build-arg REFRESH_TOKEN
USER = --build-arg USERNAME=shfinkel

build:
	@echo "Building tester..."
	docker build $(TOKEN) $(USER) -t alks-cli-test -f Dockerfile ..

test: build
	@echo "running intg tests..."
	docker run -it --rm alks-cli-test

test-shell: build
	@echo "running intg tests...currently opening an interactive shell"
	docker run -it --entrypoint /bin/bash --rm alks-cli-test

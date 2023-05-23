TOKEN = --build-arg REFRESH_TOKEN
USERNAME = --build-arg USERNAME=shfinkel


build:
	@echo "Building tester..."
	docker build $(TOKEN) $(USERNAME) -t alks-cli-test -f Dockerfile ..

enter-test-container: build
	@echo "running intg tests...currently opening an interactive shell"
	docker run -it --entrypoint /bin/bash --rm alks-cli-test

test: build
	@echo "running intg tests..."
	docker run -it --rm alks-cli-test
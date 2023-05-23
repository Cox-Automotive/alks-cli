TOKEN = --build-arg REFRESH_TOKEN
USERNAME = --build-arg USERNAME=shfinkel


build:
	@echo "Building tester..."
	docker build $(TOKEN) $(USERNAME) -t alks-cli-test -f Dockerfile ..

test: build
	@echo "running intg tests...currently opening an interactive shell"
	docker run -it --entrypoint /bin/bash --rm alks-cli-test
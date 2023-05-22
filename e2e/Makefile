build:
	@echo "Building tester..."
	docker build -t alks-cli-test .

test: build
	@echo "running intg tests...currently opening an interactive shell"
	docker run -it --entrypoint /bin/bash --rm alks-cli-test
TOKEN = --build-arg REFRESH_TOKEN
USER = --build-arg USERNAME

CI_MODE = false
ifeq ($(CI_MODE),true)
	IT_FLAGS =
else
	IT_FLAGS = -it
endif

ifneq ($(TAGS),)			
	FILTER_TAGS = --filter-tags $(TAGS)
endif

ifeq ($(VERBOSE),true)
	V_V = -x --trace
endif

build:
	@echo "Building tester..."
	docker build $(TOKEN) $(USER) -t alks-cli-test -f Dockerfile ..

test: build
	@echo "running intg tests..."
	docker run $(IT_FLAGS) --rm alks-cli-test $(FILTER_TAGS) $(V_V)

test-shell: build
	@echo "running intg tests...currently opening an interactive shell"
	docker run $(IT_FLAGS) --rm --entrypoint /bin/bash --rm alks-cli-test $(FILTER_TAGS) $(V_V)

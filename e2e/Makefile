TOKEN = --build-arg REFRESH_TOKEN=$(REFRESH_TOKEN)
USER = --build-arg USERNAME=$(USERNAME)

# NPM_AUTH_TOKEN is optional - if not provided, will use public npm registry
ifneq ($(NPM_AUTH_TOKEN),)
	NPM_AUTH = --build-arg NPM_AUTH_TOKEN=$(NPM_AUTH_TOKEN)
endif

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
	docker build --no-cache $(TOKEN) $(USER) $(NPM_AUTH) -t alks-cli-test -f Dockerfile ..

test: build
	@echo "running intg tests..."
	docker run $(IT_FLAGS) --rm alks-cli-test $(FILTER_TAGS) $(V_V)

test-shell: build
	@echo "running intg tests...currently opening an interactive shell"
	docker run $(IT_FLAGS) --rm --entrypoint /bin/bash --rm alks-cli-test

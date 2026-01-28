ARG NODE_VERSION=18

FROM node:${NODE_VERSION}

# build and install cli from source
COPY . /alks
WORKDIR /alks

# Remove any .npmrc that might have Artifactory config
RUN rm -f .npmrc

# Configure npm registry (defaults to public npm, can be overridden for Artifactory)
ARG NPM_REGISTRY=https://registry.npmjs.org/
ARG NPM_AUTH_TOKEN
RUN if [ -n "$NPM_AUTH_TOKEN" ] && [ "$NPM_REGISTRY" != "https://registry.npmjs.org/" ]; then \
      npm config set registry ${NPM_REGISTRY} && \
      npm config set //artifactory.coxautoinc.com/artifactory/api/npm/cai-npm/:_authToken ${NPM_AUTH_TOKEN}; \
    else \
      npm config set registry https://registry.npmjs.org/; \
    fi

# Install dependencies and build the local code
RUN npm install --registry=https://registry.npmjs.org/
RUN npm run build
RUN npm pack --pack-destination /root

RUN npm install -g /root/alks-*.tgz

# install e2e test dependencies
RUN apt-get update && apt-get install -y \
 expect \ 
 vim \
 jq

WORKDIR /alks/e2e
RUN npm install
RUN node_modules/bats/install.sh /usr/local

ARG REFRESH_TOKEN
ENV REFRESH_TOKEN=${REFRESH_TOKEN}
ARG USERNAME
ENV USERNAME=${USERNAME}

ARG DEVELOPER_CONFIGURE=scripts/configure.exp
RUN chmod +x ${DEVELOPER_CONFIGURE}
# automated run of alks developer configure
RUN ./${DEVELOPER_CONFIGURE}

ENTRYPOINT [ "./test.bats" ]

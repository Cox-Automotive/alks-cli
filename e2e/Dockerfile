ARG NODE_VERSION=18

FROM node:${NODE_VERSION}

# build and install cli from source
COPY . /alks
WORKDIR /alks
RUN npm install
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
ARG AD_NAME
ENV USERNAME=${AD_NAME}

ARG DEVELOPER_CONFIGURE=scripts/configure.exp
RUN chmod +x ${DEVELOPER_CONFIGURE}
# automated run of alks developer configure
RUN ./${DEVELOPER_CONFIGURE}

ENTRYPOINT [ "./test.bats" ]

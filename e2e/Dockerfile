ARG NODE_VERSION=16

FROM node:${NODE_VERSION}

# build and intall cli
COPY . /alks
WORKDIR /alks
RUN npm install
RUN npm run build
RUN npm pack --pack-destination /root

RUN npm install -g /root/alks-*.tgz

# install e2e test dependencies
RUN apt-get update && apt-get install -y expect

WORKDIR /alks/e2e
RUN npm install
RUN node_modules/bats/install.sh /usr/local

ARG REFRESH_TOKEN
ENV REFRESH_TOKEN=${REFRESH_TOKEN}
ARG USERNAME
ENV USERNAME=${USERNAME}

# giving execution permission to alks developer configure exp script
RUN chmod +x configure.exp
# automated run of alks developer configure
RUN ./configure.exp

ENTRYPOINT [ "./test.bats" ]




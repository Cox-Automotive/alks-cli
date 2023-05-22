ARG NODE_VERSION=16

FROM node:${NODE_VERSION}

# build and intall cli
COPY .. /alks
WORKDIR /alks
RUN npm install
RUN npm run build
RUN npm pack --pack-destination /root

RUN npm install -g /root/alks-*.tgz

# install e2e test dependencies
WORKDIR /alks/e2e
RUN apt-get update && apt-get install -y expect
RUN npm i




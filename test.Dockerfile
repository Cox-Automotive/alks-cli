FROM node:9.4.0

RUN apt-get update && \
    apt-get install libgnome-keyring-dev -y

COPY . /

RUN rm -r node_modules/

RUN npm install --no-optional alks -g

ENTRYPOINT ["/bin/bash"]

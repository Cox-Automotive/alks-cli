FROM node:14

RUN apt-get update && \
    apt-get install libgnome-keyring-dev -y

COPY . /

RUN npm install --no-optional . -g

ENTRYPOINT ["/bin/bash"]

FROM ubuntu:latest

RUN apt update && \
    apt install -y libgnome-keyring-dev curl
RUN curl -L https://raw.githubusercontent.com/tj/n/master/bin/n -o n
RUN bash n lts

COPY . /root/alks-cli

WORKDIR /root/alks-cli

RUN npm install --no-optional . -g

ENTRYPOINT ["/bin/bash"]

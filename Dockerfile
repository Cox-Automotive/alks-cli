FROM node:9.4.0

RUN apt-get update && \
    apt-get install libgnome-keyring-dev -y

RUN npm install --no-optional alks -g

ENTRYPOINT ["/usr/local/bin/alks"]
CMD ["help"]
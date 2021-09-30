FROM node:16

RUN npm install -g alks

ENTRYPOINT ["/usr/local/bin/alks"]
CMD ["help"]
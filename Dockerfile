FROM node:argon

RUN apt-get update && apt-get install libgnome-keyring-dev -y

RUN npm install alks -g

ENTRYPOINT ["/usr/local/bin/alks"]
CMD ["help"]
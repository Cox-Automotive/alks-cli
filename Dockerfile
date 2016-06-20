FROM node:argon

RUN npm install alks -g

ENTRYPOINT ["/usr/local/bin/alks"]
CMD ["help"]
FROM node:21-slim

RUN apt update && apt install -y openssl procps 

RUN npm install -g @nestjs/cli@10.3.2

RUN usermod -u 180603453 node 

USER node

WORKDIR /home/node/app

CMD tail -f /dev/null

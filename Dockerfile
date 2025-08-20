FROM node:lts

COPY . /usr/src/app
WORKDIR /usr/src/app
RUN npm ci
RUN npm run build

CMD ["npm", "run", "start"]

FROM node:lts

COPY . /usr/src/app
RUN npm ci
RUN npm run build

WORKDIR /usr/src/app
CMD ["npm", "run", "start"]

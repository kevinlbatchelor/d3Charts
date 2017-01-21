# superheroapps/services/battlecardservice
FROM node:6.3

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY . /usr/src/app
RUN npm install

EXPOSE 3000

CMD [ "npm", "start" ]
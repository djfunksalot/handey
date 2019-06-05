FROM node:8
# Create app directory
WORKDIR containers/nodejs/app
# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY containers/nodejs/app/package.json ./

RUN npm install
COPY containers/nodejs/app ./

EXPOSE 8386
CMD [ "npm", "start" ]

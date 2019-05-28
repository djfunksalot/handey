FROM node:8
# Create app directory
WORKDIR /app
# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY app/package.json ./

RUN npm install
COPY app ./

EXPOSE 8080
CMD [ "npm", "start" ]

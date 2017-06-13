FROM node:7-alpine

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Bundle app source
COPY . /usr/src/app

# Install all dependencies, executes post-install script
RUN npm install && npm cache clean

EXPOSE 3000

CMD [ "npm", "start" ]

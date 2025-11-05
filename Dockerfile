#use node base image 
FROM node:20-alpine

#create app directory
WORKDIR /app

#copy package.json and package-lock.json
COPY package*.json ./

#install app prod dependencies
RUN npm install --production

#copy app source code
COPY . .

#Expsoe port
EXPOSE 3000

#Start App
CMD [ "node", "index.js" ]
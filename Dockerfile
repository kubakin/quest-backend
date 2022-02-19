FROM node:16-alpine

# Create app directory
#WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)


COPY package*.json ./

RUN npm i

# Bundle app source
COPY . .
RUN npm run prebuild
RUN npm run build

CMD ["node", "dist/main"]
EXPOSE 3000


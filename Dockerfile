FROM node:lts-alpine
ENV NODE_ENV=production
WORKDIR /usr/src/app
COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]
RUN npm install --production=false
COPY . .
ENV MONGODB_URI=${MONGODB_URI}
EXPOSE 5000
RUN npm run build
RUN chown -R node /usr/src/app
USER node
CMD ["npm", "start"]
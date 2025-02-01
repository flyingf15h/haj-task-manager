FROM node:lts-alpine
ENV NODE_ENV=production
WORKDIR /usr/src/app
COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]
RUN npm install --omit=dev
COPY . .
COPY .env .env
EXPOSE 8080
RUN chown -R node /usr/src/app
USER node
CMD ["npm", "start"]

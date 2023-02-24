FROM node:15.13-alpine
WORKDIR /react
COPY package.json .
RUN npm i --legacy-peer-deps
COPY . .
RUN npm run build
CMD ["npm", "run", "preview"]
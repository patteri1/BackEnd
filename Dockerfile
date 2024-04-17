FROM node:20-alpine

WORKDIR /app
 
COPY package*.json ./

# set npm cache directory to avoid problems in deployment
ENV NPM_CONFIG_CACHE=/app/.npm

RUN npm ci

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]

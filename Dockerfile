FROM node:alpine

COPY package*.json ./

RUN npm install --production

COPY . .

RUN chmod +x ./entrypoint.sh

CMD ["./entrypoint.sh"]
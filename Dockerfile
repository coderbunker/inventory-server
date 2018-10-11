FROM node:alpine

COPY package*.json ./

RUN npm install

COPY . .

RUN chmod +x ./entrypoint.sh

CMD ["./entrypoint.sh"]
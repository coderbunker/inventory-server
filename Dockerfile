FROM node:alpine

COPY package*.json ./

RUN npm install --production

COPY . .

RUN chmod +x ./script/entrypoint.sh

CMD ["./script/entrypoint.sh"]

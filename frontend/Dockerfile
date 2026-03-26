FROM node:alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

EXPOSE 5555

CMD ["npx", "vite", "preview", "--host", "0.0.0.0", "--port", "5555"]
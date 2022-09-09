FROM node:17.4 as builder

WORKDIR /usr/app

COPY package*.json .

RUN npm install

COPY . .

RUN npm run build

FROM nginx:1.19

RUN apt-get update && apt-get install -y npm

COPY ./nginx/nginx.conf /etc/nginx/nginx.conf

COPY --from=builder /usr/app/build /usr/share/nginx/html
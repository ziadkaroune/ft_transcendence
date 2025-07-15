FROM node:20-alpine

WORKDIR /app

COPY frontend ./frontend
WORKDIR /app/frontend

RUN npm install
RUN npm run build

RUN npm install -g serve

CMD ["serve", "-s", "dist", "-l", "443", "--ssl-cert", "/certs/cert.pem", "--ssl-key", "/certs/key.pem"]

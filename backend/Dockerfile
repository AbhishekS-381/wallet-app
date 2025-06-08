FROM node:18-slim
WORKDIR /app
COPY package.json ./
RUN npm install --omit=dev && npm audit fix --force
COPY . .
EXPOSE 3001
CMD ["npm", "start"]

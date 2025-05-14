FROM node:18
WORKDIR /app

# Copy package files and tsconfig
COPY package.json package-lock.json tsconfig.json ./
RUN npm install

# Copy source
COPY . .

# Build TypeScript into /app/dist
RUN npm run build

EXPOSE 5000
CMD ["npm", "start"]

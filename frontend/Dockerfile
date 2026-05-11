FROM node:20-alpine AS base
WORKDIR /app
COPY package*.json ./

# Development stage
FROM base AS development
RUN npm install
COPY . .
EXPOSE 5173
CMD ["npm", "run", "dev"]

# Build stage
FROM base AS build
# VITE_API_KEY precisa ser passada em tempo de BUILD, não de runtime.
# O Vite bake a variável no JS estático durante `npm run build`.
ARG VITE_API_KEY
ENV VITE_API_KEY=${VITE_API_KEY}
RUN npm ci
COPY . .
RUN npm run build

# Production stage (nginx)
FROM nginx:alpine AS production
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

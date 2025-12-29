# ---- Build stage ----
    FROM node:22-alpine AS build
    WORKDIR /app
    
    # Install deps with good caching
    COPY Frontend/package*.json ./
    RUN npm ci
    
    # Copy source and build
    COPY Frontend/ ./
    RUN npm run build
    
    # ---- Runtime stage ----
    FROM nginx:1.27-alpine AS runtime
    
    # Remove default nginx static assets
    RUN rm -rf /usr/share/nginx/html/*
    
    # Copy Vite build output
    COPY --from=build /app/dist /usr/share/nginx/html
    
    # Container Apps will route traffic to the container port you configure.
    # Nginx listens on 80 by default.
    EXPOSE 80
    
    # Use nginx default entrypoint/cmd
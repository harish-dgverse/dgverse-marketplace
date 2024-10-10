# Multi-stage
# 1) Node image for building frontend assets
# 2) nginx stage to serve frontend assets

# Name the node stage "builder"
FROM node:18.15.0-alpine3.16 as builder

# Set working directory
WORKDIR /usr/src/app

# Copy json package
COPY package*.json ./

# Install dependencies
RUN yarn install

# Copy all files from current directory to working directory
COPY ./ .

# install node modules and build
RUN yarn run build

# nginx state for serving content
FROM nginx:1.23.3-alpine

# Set working directory to nginx asset directory
WORKDIR /usr/share/nginx/html

# Remove default nginx static assets
RUN rm -rf ./*

#copy nginx config file from host to container
COPY ./nginx/nginx.conf /etc/nginx/conf.d/default.conf

# Copy static assets from builder stage
COPY --from=builder /usr/src/app/ .

# Copy static assets from builder stage
COPY --from=builder /usr/src/app/build .

# Containers run nginx with global directives and daemon off
ENTRYPOINT ["nginx", "-g", "daemon off;"]

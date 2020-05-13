# Step 1: Build angular application
FROM node:12-alpine AS base

# switch to new workdir
WORKDIR /app

# set unsafe permissions
RUN npm config set unsafe-perm true

# copy all files
COPY . .

# install dependencies
RUN npm install

# build application
RUN npm run start

# Step 2: Copy built artifact and serve app with nginx
FROM nginx:stable-alpine
LABEL version="1.0"

# copy nginx config file
COPY nginx.conf /etc/nginx/nginx.conf

# Copy build version of the application to nginx folder
WORKDIR /usr/share/nginx/html

# replace path for your application
COPY --from=base /app/dist/devproject/ .

# expose port 80 and run nginx
EXPOSE 4200
CMD ["nginx", "-g", "daemon off;"]

# Build stage
FROM node:lts-alpine AS build

# Setting up the work directory
WORKDIR /app

# Installing dependencies
COPY ./package.json /app
RUN npm install

# Copying all the files in our project
COPY . .

# Building the app
RUN npm run build

# Check the contents of the /app directory to debug
RUN ls -la /app

# Production stage
FROM nginx:stable-alpine

# Copying only the built app files to the final image
COPY --from=build /app/dist  /usr/share/nginx/html

# Check the contents of the /usr/share/nginx/html directory to debug
RUN ls -la /usr/share/nginx/html

COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf
# Expose port 80
EXPOSE 80

# Starting the nginx server
CMD ["nginx", "-g", "daemon off;"]
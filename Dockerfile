# Use an official Node.js runtime as a parent image
FROM node:18.16.1

# Set the working directory in the container
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Copy package.json and package-lock.json files
COPY package*.json ./

# Install dependencies
COPY package.json /usr/src/app/
RUN npm install

# Copy the rest of the application code
COPY . /usr/src/app

# Expose the port the app runs on
EXPOSE 3000

# Define the command to run the application
CMD ["npm", "start"]
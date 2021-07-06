FROM node:14

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
RUN apt-get update
RUN apt-get install -y apt-transport-https ca-certificates curl 
RUN curl -fsSLo /usr/share/keyrings/kubernetes-archive-keyring.gpg https://packages.cloud.google.com/apt/doc/apt-key.gpg
RUN echo "deb [signed-by=/usr/share/keyrings/kubernetes-archive-keyring.gpg] https://apt.kubernetes.io/ kubernetes-xenial main" | tee /etc/apt/sources.list.d/kubernetes.list
RUN apt-get update
RUN apt-get install -y kubectl
 # set ~/.kube for kubectl
 RUN mkdir ~/.kube ; exit 0
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY . .

# run set up
RUN ls
RUN npm run setKubectl

# compile TS
RUN npm run prestart

EXPOSE 3001
CMD [ "npm", "run", "start" ]
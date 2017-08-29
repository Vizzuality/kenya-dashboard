FROM node:8.1.2
MAINTAINER david.inga@vizzuality.com

ENV NODE_ENV production
ENV USER kenya-dashboard
ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update && apt-get install -y \
      bash git build-essential automake autoconf make g++ libtool apt-transport-https python \
      ca-certificates curl gnupg python apt-utils \
      --no-install-recommends
RUN curl -sSL https://dl.google.com/linux/linux_signing_key.pub | apt-key add - \
	  && echo "deb [arch=amd64] https://dl.google.com/linux/chrome/deb/ stable main" > /etc/apt/sources.list.d/google-chrome.list \
    && apt-get clean && apt-get autoremove && apt-get update \
    && apt-get install -y \
      google-chrome-stable \
      --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*
RUN npm install -g node-gyp --loglevel warn

# Adding user
RUN groupadd -r $USER && useradd -r -g $USER -G audio,video $USER \
    && mkdir -p /home/$USER && chown -R $USER:$USER /home/$USER
RUN mkdir -p /home/$USER

WORKDIR /home/$USER/app

# Install app dependencies
COPY package.json /home/$USER/app
COPY yarn.lock /home/$USER/app
RUN yarn install --production

# Bundle app source
COPY . /home/$USER/app
RUN chown $USER:$USER /home/$USER
RUN yarn run build

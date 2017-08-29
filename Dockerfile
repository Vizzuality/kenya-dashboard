FROM node:8.1.2
MAINTAINER david.inga@vizzuality.com

ENV NODE_ENV production
ENV USER kenya-dashboard

RUN apt-get update && apt-get install -y \
      bash git build-essential automake autoconf make g++ libtool apt-transport-https \
      ca-certificates curl gnupg python apt-utils \
      --no-install-recommends \
    && curl -sSL https://dl.google.com/linux/linux_signing_key.pub | apt-key add - \
	  && echo "deb [arch=amd64] https://dl.google.com/linux/chrome/deb/ stable main" > /etc/apt/sources.list.d/google-chrome.list \
    && apt-get update && apt-get install -y \
      google-chrome-stable \
      --no-install-recommends \
    && apt-get autoremove \
    && rm -rf /var/lib/apt/lists/* \
    && npm install -g node-gyp --loglevel warn

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

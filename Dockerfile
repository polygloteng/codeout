FROM node:14-slim

WORKDIR /usr/src/app

COPY package*.json yarn.lock ./

# should not use --production option
RUN yarn install --frozen-lockfile --non-interactive

COPY assets/ ./assets/
COPY components/ ./components/
COPY composables/ ./composables/
COPY layouts/ ./layouts/
COPY lib/ ./lib/
COPY middleware/ ./middleware/
COPY pages/ ./pages/
COPY plugins/ ./plugins/
COPY store/ ./store/
COPY types/ ./types/
COPY .babelrc nuxt.config.js tsconfig.json ./

RUN yarn build

ENV HOST 0.0.0.0

CMD [ "yarn", "start" ]

FROM node:14.17-bullseye-slim as manager-build
ENV NODE_ENV=development
WORKDIR /home/node/app
COPY . /home/node/app
RUN yarn install:all

FROM "cypress/included:9.6.0" as cypress-runner
ENV NODE_ENV=development
WORKDIR /app
COPY --from=0 /home/node/app /app
EXPOSE 3000/tcp
ENTRYPOINT yarn cy:ci

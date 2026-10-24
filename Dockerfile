FROM node:22-bookworm-slim

RUN apt-get update \
  && apt-get install -y --no-install-recommends ca-certificates git \
  && rm -rf /var/lib/apt/lists/*

ARG GIT_REPO=https://github.com/gurroz/footpro.git
ARG GIT_REF=main

# The commits API response changes when the branch moves, so the clone is not cached stale.
ADD "https://api.github.com/repos/gurroz/footpro/commits/${GIT_REF}" /tmp/repo-head.json

WORKDIR /app

RUN git clone --depth 1 --branch "${GIT_REF}" "${GIT_REPO}" .

ENV CI=1 \
    EXPO_NO_TELEMETRY=1

RUN npm install

RUN npx expo export --platform web

RUN npx playwright install --with-deps chromium

RUN npm run test:web

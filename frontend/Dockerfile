FROM node:20 AS builder

WORKDIR /app

RUN corepack enable
ENV CI=true

COPY package.json pnpm-lock.yaml ./
COPY . .

RUN pnpm install --frozen-lockfile
RUN pnpm build

FROM nginx:alpine

RUN rm /etc/nginx/conf.d/default.conf

COPY nginx.frontend.conf /etc/nginx/conf.d/default.conf

COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

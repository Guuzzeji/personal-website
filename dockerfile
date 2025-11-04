# build stage for app
FROM node:22-alpine3.21
WORKDIR /build
RUN npm install -g pnpm
COPY package.json pnpm-lock.yaml ./
RUN pnpm install
COPY . .
RUN pnpm build

# build stage for static-server and run
FROM golang:tip-alpine3.22
WORKDIR /app
COPY --from=0 /build/dist /app/dist
COPY static-server.go static-server.go
RUN go build static-server.go
EXPOSE 3000
CMD ["./static-server"]

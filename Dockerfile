FROM node:alpine

RUN	apk add --no-cache \
  bash \
  ca-certificates \
  curl \
  wget \
  aria2 \
  rclone

COPY fetch_github_asset.sh /fetch_github_asset.sh

ENTRYPOINT ["/fetch_github_asset.sh"]

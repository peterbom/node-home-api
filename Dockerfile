# https://getintodevops.com/blog/building-your-first-docker-image-with-jenkins-2-guide-for-developers
FROM node:8.7-onbuild

# set a health check
HEALTHCHECK \
    --interval=5s \
    --timeout=5s \
    CMD curl -f http://127.0.0.1:80 || exit 1

# tell docker what port to expose
EXPOSE 80

#!/bin/sh

cat > /etc/nginx/nginx.conf <<EOF
events {
  worker_connections 1024;
}

http {
  charset       utf-8;
  include       /etc/nginx/mime.types;
  server_tokens off;

  gzip              on;
  gzip_vary         on;
  gzip_proxied      any;
  gzip_comp_level   6;
  gzip_buffers 16   8k;
  gzip_http_version 1.1;
  gzip_min_length   256;
  gzip_types        text/plain text/css application/json application/x-javascript
                    text/javascript application/javascript text/xml application/xml
                    application/xml+rss application/vnd.ms-fontobject
                    application/x-font-ttf font/opentype image/svg+xml
                    image/x-icon;

  server {
    listen 80;
    root /usr/share/nginx/html;

    location /healthz/alive {
      add_header Content-Type text/plain;
      return 200 'alive';
    }
    location /healthz/ready {
      add_header Content-Type text/plain;
      return 200 'ready';
    }
    location /version {
      add_header Content-Type text/plain;
      return 200 '$APP_VERSION';
    }

    location /static/ {
      if (\$http_x_forwarded_proto != "https") {
        return 301 https://\$host\$request_uri;
      }

      expires   max;
      try_files \$uri =404;
    }

    location / {
      if (\$http_x_forwarded_proto != "https") {
        return 301 https://\$host\$request_uri;
      }

      expires   -1;
      try_files \$uri /index.html;
    }
  }
}
EOF

cat /etc/nginx/nginx.conf
exec nginx -g 'daemon off;'

server {
    listen 80;
    server_name optovik-auto-him.ru www.optovik-auto-him.ru;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl;
    server_name optovik-auto-him.ru www.optovik-auto-him.ru;

    ssl_certificate /etc/letsencrypt/live/optovik-auto-him.ru-0001/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/optovik-auto-him.ru-0001/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

    location /api/ {
        proxy_pass http://backend:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location / {
        proxy_pass http://frontend:5555;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}

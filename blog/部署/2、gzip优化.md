上一节中已经将项目部署到本地nginx服务器上，现在做一些优化，对静态资源文件进行gzip压缩处理，上一节中vhost/react.music.com.conf的配置如下：
```
server {
        listen       80;
        server_name  react.music.com;

		error_log c:/access.log debug;

		location /api/ {
		    rewrite  ^/apis\//(.*)$ /$1 break; 
	     	    proxy_pass http://127.0.0.1:3111;
	            proxy_set_header Host $host;
	            proxy_set_header X-Real-IP $remote_addr;
	            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for; 
        }

		location ~ .*?\.(js|css|jpg|png|jpeg|less|sass){                
	    	root C:\static\music; 
        }	

        location / {
            root   C:\static\music;
            index  index.html index.htm;
	    	try_files $uri $uri/ @rewrites;
        }

		location @rewrites {
            rewrite ^(.+)$ /index.html last;
        }
    }
```
开启gzip并分别对js文件，css文件，以及jpg、png、svg等图片进行压缩处理，在server字段下添加如下命令：

```
	gzip on;
	gzip_disable "msie6";

	gzip_vary on;
	gzip_proxied any;
	gzip_comp_level 6;
	gzip_buffers 16 8k;
	gzip_http_version 1.1;
	gzip_min_length 256;
	gzip_types text/plain text/css application/json application/javascript text/javascript image/svg+xml image/jpeg image/gif image/png;
```
结果验证：
首先对比静态文件的大小可以看到静态文件的体积减小，同时response响应头`Content-Encoding: gzip`。

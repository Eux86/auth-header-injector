# To run the code on the local machine just run:
```
npm run start
```

# To run the proxy in a docker container then:
- first: 
```
docker build -t eux86/auth-header-injector .
```
- then run it with the required configuration:
```
docker run -p 3002:8080 --name=auth_proxy_header_injector \
  -e "AUTH_URL=http://www.token-provider.net/" \
  -e "PROXY_TARGET=https://www.target-url.net/" \
  -e "CLIENT_ID=someid" \
  -e "CLIENT_SECRET=somesecret" \
  -d eux86/auth-header-injector
```
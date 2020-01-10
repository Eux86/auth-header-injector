require('dotenv').config()
const express = require('express')
const proxy = require('http-proxy-middleware')
var request = require('request');

let token = '';
updateToken();


async function updateToken() {
    const clientId = process.env.CLIENT_ID;
    const clientSeecret = process.env.CLIENT_SECRET;
    const result = await new Promise((res, rej) => {
        request.post(process.env.AUTH_URL, {
            form: {
                grant_type: "client_credentials",
                client_id: clientId,
                client_secret: clientSeecret,
            }
        }, (err, response, body) => res([err, response, body]));
    });

    token = JSON.parse(result[2]).access_token;
}

const app = express();

const apiProxy = proxy({
    target: process.env.PROXY_TARGET, logLevel: 'debug',
    changeOrigin: true,
    onProxyReq: (proxyReq, req, socket, options, head) => {
        try {
            const tokenString = 'Bearer ' + token;
            proxyReq.setHeader('authorization', tokenString);
        } catch (error) {
            console.error(error);
        }
    },
    onProxyRes: (proxyRes, req, res) => {
        if (proxyRes.statusCode === 401) {
            updateToken();
            res.redirect('/');
        }
    },
});


app.use(apiProxy)
app.listen(8080);
## About

This repository is made to provide code samples used in the post I created for [wannabedev.io](https://wannabedev.io/) titled "_Everything you need to know about JSON Web Token_". You can find the [whole blog post here](https://wannabedev.io/guides/everything-you-need-to-know-about-json-web-token).

![Everything you need to know about JSON Web Token](/everything-you-need-to-know-about-json-web-token.png)

## How to run

I recommend reading the article first and then coming back to experiment with the code. This example uses the `jose` npm module. Make sure to install the required dependencies by running:

```bash
npm install
```

RSA keys are already created and stored in the `keys` directory. There, you can find public and private keys.

```bash
keys
├── private.pem
└── public.pem
```

In case you want to create new RSA keys, you can use `generate-rsa-key-pair.js` and generate a new pair by running:

```bash
node generate-rsa-key-pair.js
```

To get the fresh JWT, run the following command:

```bash
node authentication-server.js
```

Copy the token and modify `userToken` by providing the newly generated token. After that, run the following command to verify the token:

```bash
node application-server.js
```

Feel free to experiment with token configurations in `authentication-server.js` and see how they affect token verification in `application-server.js`.


_This repository is only made for learning purposes; do not use it in production or commercial projects._

## Misc

Follow WANNABEDEV: [GitHub](https://github.com/wannabedevio), [Twitter (X)](https://twitter.com/wannabedev_io), [Instagram](https://www.instagram.com/wannabedev.io/), [TikTok](https://www.tiktok.com/@wannabedev.io), 

[© WANNABEDEV 2023](https://wannabedev.io)

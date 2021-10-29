Static files are served out of the public directory.

```
$ curl http://localhost:{{PORT}}/placeholder.txt
$ # result -> Put your static files in this directory and then delete this file.
```

You can have un-authorized routes.

```
$ curl http://localhost:{{PORT}}/unauthorized
$ # result -> true
```

Trying authorized routes without a JWT will result in a 401.

```
$ curl http://localhost:{{PORT}}/authorized
$ # result -> {"statusCode":401,"message":"Unauthorized"}                                 
```

Use the `/auth/login` route to login.

```
$ # POST /auth/login
$ curl -X POST http://localhost:{{PORT}}/auth/login -d '{"username": "maria", "password": "123"}' -H "Content-Type: application/json"
$ # result -> {"access_token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2Vybm... }
```

Send the JWT to authorized routes using the `Authorization` header and prefixing the JWT with `Bearer `.

```
$ # GET /profile using access_token returned from previous step as bearer code
$ curl http://localhost:{{PORT}}/authorized -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2Vybm..."
$ # result -> {"userId":2}
```

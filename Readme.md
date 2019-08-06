## To do

   - [x] dotenv modules and Joi validation for configs
   - [x] Use modular configurations
   - [ ] OAuth2:
       - [x] Authorization Code 
       - [ ] Implicit Grant type 
       - [x] Resource Owner Password 
       - [x] Client Credentials 
       - [x] Refresh Token
   - [x] Logout User
   - [x] Disable clients from using user resource
   - [x] add scope to users and client
   - [x] optimize all gates to only be passed mongoose.lean() model

## Postman
   Postman API is located [here](https://www.getpostman.com/collections/3f7ccd0a89fd32640211)

## Set up 
1. Configs are located [here](./config/default.js) and its components are [here](./config/modules)
2. Change the configs to your interest
3. Setup mongo database based on your configuration. Default configuration ([here](./config/modules/mongo.config.js)) are

    ```
    host: localhost
    port: 27017
    database: oauth
    authentication: no
    ```
    
4. Run the server by `npm start`
5. If you want to seed (development only) then run `npm start client`. It will seed 2 clients in database.

    ```
    clientId: authServer
    clientSecret: secret
    grants: 
        - password
        - refresh_token
    redirectUris: empty            
    ``` 
    
    ```
    clientId: application
    clientSecret: secret
    grants: 
        - authorization_code
        - refresh_token
    redirectUris: 
        - http://localhost:3000/oauth/callback            
    ``` 
    
6. The server it self is a client so you should register it with **only password grants**

## Model Status
Most models use soft delete with these status to filter
 - 0: Not Activated
 - 1: Activated
 - 2: Locked
 - 3: Deleted

## Available Paths

All **POST** requests must have headers `Content-Type:application/x-www-form-urlencoded`

### A. Users

1. Register User - `POST /users/register`

    Body:
    
      |                 | Required |     Type     | Min | Max | Default |                 Note                 |
      |:---------------:|:--------:|:------------:|:---:|:---:|:-------:|:------------------------------------:|
      |    `username`   |   true   |    String    |  6  |  20 |         |                                      |
      |    `password`   |   true   |    String    |  8  | 100 |         |                                      |
      |      `name`     |   true   |    String    |  5  |  30 |         |                                      |
      |     `email`     |   true   | String/email |     |     |         |                                      |
      |     `status`    |          |    Number    |     |     |    0    |            Detail [here](#model-status)           |
      | `mobile_number` |          |    String    |     |     |         |        Detailed Regex [here](./server/api/users/user.validation.js#L3)       |
      |      `code`     |   true   |    String    |  5  |     |         |                                      |
      |     `gender`    |          |    String    |     |     |         | Allow "male", "female", or "unknown" |
      |      `dob`      |          |     Date     |     | now |         |             Date of birth            |
      |    `id_card`    |   true   |    String    |     |     |         |                                      |
      |    `address`    |          |    String    |     |     |         |                                      |
      |      `note`     |          |    String    |     |     |         |                                      |


    Expected result:
    
      {
          "status": "success",
          "data": {
              "code": "quy012345",
              "name": "quy trinh",
              "email": "quy012345@admin.com"
          }
      }
    
2. Resource Lookup - ``
    

2. Login to the server

    `POST http://localhost:3000/oauth/token?client_id=authServer&grant_type=password&username=admin&password=12345678`
    
    with Headers
    
    `Content-Type:application/x-www-form-urlencoded`
    
    Expected result:
    ```
    {
        "access_token": "a55c975e87868bed9a6a6fbdfa19b7e3e15d8f24",
        "token_type": "Bearer",
        "expires_in": 3599,
        "refresh_token": "e2598e3c27af9406a705cb0647e48d3807dada13"
    }
    ```
    
    Test Token:
    
    `GET http://localhost:3000/users/me?include=client`
    
    with Headers
    
    `Authorization: Bearer c4966ff2050a91b6f33042224af5e1a17cd04a72`
    
    Expected result:
    
    ```
    {
        "status": "success",
        "data": {
            "name": "My name is Admin",
            "client": "authServer"
        }
    }
    ```
3. Authorize an index

    `GET http://localhost:3000/oauth/authorize?client_id=application&allowed=true&redirect_uri=http://localhost:3000/oauth/callback&state=antiCSRF&response_type=code`
    
    with Headers
    `Authorization: Bearer a55c975e87868bed9a6a6fbdfa19b7e3e15d8f24`
    
    Expected Redirect:
    
    `GET /oauth/callback?code=840a080b6517c3f31448d31d7d3326e6767cb289&state=antiCSRF`
    
    Query from client to server
    
    `POST http://localhost:3000/oauth/token?grant_type=authorization_code&code=840a080b6517c3f31448d31d7d3326e6767cb289&redirect_uri=http://localhost:3000/oauth/callback`
    
    with Headers
    
    `Authorization: Basic YXBwbGljYXRpb246c2VjcmV0` 
    
    * Base64 of application **(clientId)**:secret **(clientSecret)** = YXBwbGljYXRpb246c2VjcmV0
    
    `Content-Type: application/x-www-form-urlencoded`
    
    Expected Result:
    
    ```
    {
        "access_token": "b052d74a796c499f8b2ea7a1ec35120422adecf1",
        "token_type": "Bearer",
        "expires_in": 3599,
        "refresh_token": "e20527199cd0f3962124df8ea5fff8752af62af7"
    }
    ```
    
    Test Token:
    
    `GET http://localhost:3000/users/me?include=client`
        
    with Headers
        
    `Authorization: Bearer b052d74a796c499f8b2ea7a1ec35120422adecf1`
    
    Expected Result:
    
    ```
    {
        "status": "success",
        "data": {
            "name": "My name is Admin",
            "client": "application"
        }
    }
    ```

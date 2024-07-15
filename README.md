# shopping-api
Microservices Nest.js Api for managing shopping cart, create one, add products and remove them from the cart and create orders. In order to reduce complexity in development just a single database is shared among all the services, for production each service would have its own database.

## Setup
Clone this repository, setup the .env variables, an example.env is provided. You must have installed Docker on your computer for deploying all the services with the message broker and the mongoDB.
The integration tests requires you to have an local instance of mongo running, you must set the connection variables on the .env file.

## Running the API
To run the API ```docker-compose up --build``` all the containers for the services will be deployed and connected.

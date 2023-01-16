## Using the API
The following endpoints are avaliable for this API:
- GET /api/topics
- GET /api/articles
- GET /api/articles/:article_id
- GET /api/articles/:article_id/comments
- POST /api/articles/:article_id/comments
- PATCH /api/articles/:article_id

## Project Setup
In order to have this project run locally on your own system, you will need to setup some environement variables.
To do this, create a file named ".env.test" and ".env.development".

## Test Env
Inside of your ".env.test" file, you will need setup your database by copy and pasting in the following code: 
"PGDATABASE=nc_news_test;"

## Development Env
Similarly, within your ".env.development" file you will need to add this code: "PGDATABASE=nc_news;"



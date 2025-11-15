## development

[mise](https://mise.jdx.dev/) is used to manage local development environment variables.

* `npm start`: Starts the web API server locally on port 3003
  * Make sure `packages/web-api-server/lib/runtime/` directory is created for the server to store
    data.
* `npm run load-test`: Runs load test against the local instance of web API server

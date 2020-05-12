// Server setup
var server = undefined;
const { ApolloServer } = require("apollo-server");
const temenos_module = require("../index");
const {schema, context} = temenos_module;

// Client setup
require("cross-fetch/polyfill");
var client = undefined;
const ApolloClient = require("apollo-boost").default;
const { gql } = require("apollo-boost");

describe("Tests the subdomain queries permission\n" + 
        "If the IS_ATTACHED environment variable is set to true, every request should test for authentication (resulting in an error in these context)", () => {
    beforeAll(async(done) => {
        s_print("info", "Updating environment variables");
        process.env.IS_ATTACHED = "true";

        s_print("loading", "Setting up Apollo Server");
        server = new ApolloServer({
            schema,
            context
        });

        let info = await server.listen({
            port: 8383
        });

        s_print("valid", `Server started on http://localhost:${info.port}`);

        s_print("loading", "Setting up Apollo Client");

        client = new ApolloClient({
            uri: `http://localhost:${info.port}`,
            onError: (err) => {}
        });

        s_print("valid", "Apollo client correctly setup.");
        s_print("info", "Starting testing procedure.");

        await new Promise(resolve => setTimeout(resolve, 500));

        done();
    });

    it("Testing authentication for subdomain", async () => {
        const subdomain_query = gql`
            {
                subdomain(id: 0) {
                    config_file
                }
            }
        `

        await expect(client.query({
            query: subdomain_query
        })).rejects.toThrowError(new Error("GraphQL error: Not authenticated"));
    });

    it("Testing authentication for subdomains", async () => {
        const subdomain_query = gql`
            {
                subdomains {
                    config_file
                }
            }
        `

        await expect(client.query({
            query: subdomain_query
        })).rejects.toThrowError(new Error("GraphQL error: Not authenticated"));


    });

    afterAll(async(done) => {

        s_print("loading", "Shutting down Apollo Server");

        await server.stop();

        s_print("loading", "Shutting down Apollo Client");
        
        await client.stop();

        s_print("info", "Destruction finished, moving on.\n\n");

        done();
    })
})
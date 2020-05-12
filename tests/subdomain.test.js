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

const fs = require("fs");

describe("Tests the subdomain queries", () => {
    beforeAll(async(done) => {
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

    it("Requesting all domains should return the number of files in the apache2 directory", async () => {
        let files = fs.readdirSync(process.env.APACHE_DIRECTORY);
        
        const full_query = gql`
            {
                subdomains {
                    server_name
                }
            }
        `;

        const {data} = await client.query({
            query: full_query
        });

        expect(data.subdomains).toHaveLength(files.length);
    });

    test("A proxy should have a port number and a VHost should have a directory", async () => {
        const proxy_query = gql`
            {
                subdomains {
                    type,
                    port
                }
            }
        `

        const {data} = await client.query({
            query: proxy_query
        });

        for(let subdomain of data.subdomains) {
            if(subdomain.type === "Proxy") expect(subdomain.port).not.toBeNull();
            else expect(subdomain.directory).not.toBeNull();
        }

    });

    test("Calling the subdomain endpoint without specifying an id should return an error", async () => {
        const no_id_query = gql`
            {
                subdomain {
                    port
                }
            }
        `

        await expect(client.query({
            query: no_id_query
        })).rejects.toThrowError(/status code 400/);
    });

    afterAll(async(done) => {

        s_print("loading", "Shutting down Apollo Server");

        await server.stop();

        s_print("loading", "Shutting down Apollo Client");
        
        await client.stop();

        s_print("info", "Destruction finished, moving on.\n\n");

        done();
    });
});

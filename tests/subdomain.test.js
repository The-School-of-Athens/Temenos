const { gql } = require("apollo-boost");
const client = require("./client-setup");

describe("Tests the subdomains Query", () =>{
    it("A request without having any return parameter should return an error", async () => {
        const empty_subdomains_query = gql`
        query {
            subdomains {}
        }
        `;

        await expect(client.query({
            query: empty_subdomains_query
        })).rejects.toThrowError("");
    });

    //it("A request without having server_name as return parameter should return an error")
})
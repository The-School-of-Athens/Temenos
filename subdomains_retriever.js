const fs = require("fs");
const apache_conf = require("apacheconf");

let subdomains = [];

function init() {
    update_subdomain_list();
}

function update_subdomain_list() {
    fs.readdir(process.env.APACHE_DIRECTORY, function(err, items) {
        subdomains = [];

        for(let index in items) {
            apache_conf(process.env.APACHE_DIRECTORY + "/" + items[index], function (err, config, parser) {
                if(err) throw err;

                let subdomain = {"config_file": items[index],
                                "type": "VHost"};

                if(config.VirtualHost) {
                    if(config.VirtualHost[0].ServerName) {
                        subdomain["server_name"] = config.VirtualHost[0].ServerName[0];
                    }

                    if(config.VirtualHost[0].ProxyPass !== undefined) {
                        subdomain["type"] = "Proxy";

                        let proxy_pass = config.VirtualHost[0].ProxyPass[0];

                        let port = proxy_pass.substring(
                            proxy_pass.lastIndexOf(':') + 1,
                            proxy_pass.lastIndexOf('/'));
                        subdomain["port"] = parseInt(port);
                    }
                }

                subdomains.push(subdomain);
            });
        }
    });

    setTimeout(update_subdomain_list, process.env.SUBDOMAIN_REFRESH_INTERVAL);
}

function get_subdomains() {
    return subdomains;
}

module.exports = {
    init,
    get_subdomains
};
const fs = require("fs");
const apache_directory = "/etc/apache2/sites-available";
const REFRESH_INTERVAL = 5000; // Set env file
const apache_conf = require("apacheconf");

let subdomains = [];

function init() {
    update_subdomain_list();
}

function update_subdomain_list() {
    fs.readdir(apache_directory, function(err, items) {
        subdomains = items;
        subdomains = [];

        for(let index in items) {
            apache_conf(apache_directory + "/" + items[index], function (err, config, parser) {
                if(err) throw err;

                let subdomain = {"config_file": items[index]};

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
                    } else {
                        subdomain["type"] = "VHost";

                        if(config.VirtualHost[0].Directory) {

                            let directory = config.VirtualHost[0].Directory[0]["$args"];

                            subdomain["directory"] = directory;
                        }
                    }
                }

                subdomains.push(subdomain);
            });
        }
    });

    setTimeout(update_subdomain_list, REFRESH_INTERVAL);
}

function get_subdomains() {
    return subdomains;
}

module.exports = {
    init,
    get_subdomains
};
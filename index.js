// Requires that you install Vault Cli: https://learn.hashicorp.com/tutorials/vault/getting-started-install
// Use:
//  vault login -method github token=GH_TOKEN
// Then make sure to set the const basePath to the correct path in vault
const { fstat } = require('fs');
const shell = require('shelljs');

const basePath = "something-secret//";

console.log(`Loading config from hashicorp vault: ${process.env.VAULT_ADDR}`);

function getSettings(path) {
    console.log(`Running: vault kv list -format=json "${path}"`);
    const allSettings = JSON.parse(shell.exec(`vault kv list -format=json "${path}"`).stdout);
    if (Array.isArray(allSettings)) {
        return allSettings.reduce((acc, cur) => {
            return {
                ...acc,
                [cur.replace("/", "")]: getSettings(`${path}/${cur}`)
            }
        }, {})
    } else {
        console.log(`Running: vault kv get -format=json "${path}"`);
        const vaultResponse = JSON.parse(shell.exec(`vault kv get -format=json "${path}"`).stdout);
        console.log(`Found: ${JSON.stringify(vaultResponse.data.data)}`);
        return vaultResponse?.data?.data ? vaultResponse.data.data : "";
    }
}


const vaultDump = getSettings(basePath);

const fs = require('fs');
fs.writeFileSync('settings.json', JSON.stringify(vaultDump));

console.log(`The data loaded is: ${JSON.stringify(vaultDump)}`);

const configuration = require("../../../public/override/configuration.json");
const ModuleBuilder = require("../../ModuleBuilder");
const webpack = require("webpack");

const jstr = data => JSON.stringify(data);

// TODO: replace oidc with a proper pkce module (cf project/hector-vb branch)
const MODULE_NAME = "oidc";

const getOidcImportCodeString = () => `import { createAuthContext } from '@dydu_ai/${MODULE_NAME}';`;

const getAuthContextCodeString = () => {
    return "const { AuthContext, Authenticated, useToken } = createAuthContext({" +
        "authorizeEndpoint: `${process.env.OIDC_URL}`," +
        "clientSecret: process.env.OIDC_CLIENT_SECRET," +
        "clientId: process.env.OIDC_CLIENT_ID," +
        "provider: process.env.OIDC_URL," +
        "scopes: configuration.oidc.scopes," +
        "tokenEndpoint: `${process.env.OIDC_URL}`," +
        "userInfosEndpoint: `${process.env.OIDC_URL}`" +
        "}); console.log('yes ?');";
}

module.exports = new ModuleBuilder()
    .setName(MODULE_NAME)
    .setFnIsEnabled(() => configuration?.oidc?.enable)
    .setReplaceCodeList([
        { search: '<import-oidc-module />', replace: getOidcImportCodeString(), flags: 'g' },
        { search: '<auth-context-code />', replace: getAuthContextCodeString(), flags: 'g' },
    ])
    .setFnGetPluginListWithWebpackEnv(env => {
        const QUALIFICATION = env.prod ? false : true;
        return new webpack.DefinePlugin({
            'process.env': {
                OIDC_CLIENT_ID: !QUALIFICATION ? jstr(configuration.oidc.clientIdProd) : jstr(configuration.oidc.clientIdPreprod),
                OIDC_URL: !QUALIFICATION ? jstr(configuration.oidc.prodPorovider) : jstr(configuration.oidc.preprodPorovider),
                QUALIFICATION
            }
        })
    })
    .build();
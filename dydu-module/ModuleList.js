const Oidc = require('./module/oidc/OidcModule');
const Voice = require('./module/voice/VoiceModule');
const WebpackShellPluginNext = require("webpack-shell-plugin-next");

const NPM_SCOPE_NAME_DYDU = '@dydu_ai';

const MODULE_LIST = [
    Oidc,
    Voice
];

const extractEnabledModuleListReducer = (arrResult, module) => {
    if (module.isEnabled())
        arrResult.push(module);
    return arrResult;
}

const getEnabledModuleList = () => MODULE_LIST.reduce(extractEnabledModuleListReducer, []);
const getEnabledModuleNameList = () => getEnabledModuleList().map(module => module.name);
const getEnabledModuleNameListPrependWithDyduScope = () => getEnabledModuleNameList().map(moduleName => `${NPM_SCOPE_NAME_DYDU}/${moduleName}`);

const makeNpmInstallStringWithModuleNameList = (moduleNameList) => "npm install " + moduleNameList.join(" ") + " --no-save";

const instantiateWebpackShellPluginNextWithStringScript = (stringScript) => {
    if (stringScript.length === 0)
        return null;
    return new WebpackShellPluginNext({
        onBuildStart:{
            blocking: true,
            parallel: false,
            scripts: [stringScript],
        }
    })
}

const extractReplaceItemListFromModuleList = (enabledModuleList) => enabledModuleList.reduce((arrResult, module) => {
    if (module?.replaceCodeList?.length && module.replaceCodeList.length > 0)
        arrResult = arrResult.concat(module.replaceCodeList);
    return arrResult;
}, []);

const makeStringReplaceLoaderWithListOfReplaceItem = (replaceItemList) => {
    if (replaceItemList.length === 0)
        return null;
    return {
        test: /\.js$/,
        loader: "string-replace-loader",
        options: { multiple: replaceItemList },
    }
}

const getEnabledModuleRuleListWithEnv = env => {
    return getEnabledModuleList().reduce((ruleListResult, mod) => {
        if (mod?.isEnabled())
            ruleListResult = ruleListResult.concat(mod.getRuleListWithWebpackEnv(env))
        return ruleListResult;
    }, [])
};

const getEnabledModulePluginListWithEnv = (env) => {
    return getEnabledModuleList().reduce((pluginListResult, mod) => {
        if (mod?.isEnabled())
            pluginListResult = pluginListResult.concat(mod.getPluginListWithWebpackEnv(env))
        return pluginListResult;
    }, [])
}
module.exports = {
    getRules: (env) => {
        let loaders = [];
        const enabledModuleList = getEnabledModuleList();
        if (enabledModuleList.length === 0)
            return loaders;

        const replaceItemList = extractReplaceItemListFromModuleList(enabledModuleList);
        const stringReplaceLoaderInstance = makeStringReplaceLoaderWithListOfReplaceItem(replaceItemList);
        if (stringReplaceLoaderInstance)
            loaders.push(stringReplaceLoaderInstance);

        return loaders.concat(getEnabledModuleRuleListWithEnv(env));
    },
    getPlugins: (env) => {
        let plugins = [];
        const moduleNameList = getEnabledModuleNameListPrependWithDyduScope();
        if (moduleNameList.length === 0)
            return plugins;

        const installScript = makeNpmInstallStringWithModuleNameList(moduleNameList)
        const webpackShellPluginNextInstance = instantiateWebpackShellPluginNextWithStringScript(installScript);
        if (webpackShellPluginNextInstance)
            plugins.push(webpackShellPluginNextInstance);

        console.info('--');
        console.info("@dydu_ai: Enabled modules: ", moduleNameList);
        console.info("@dydu_ai: will execute '"+ installScript +"'");
        console.info('--');

        return plugins.concat(getEnabledModulePluginListWithEnv(env));
    }
};

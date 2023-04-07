class ModuleBuilder {
    #value = {
        name: null,
        isEnabled: () => false,
        replaceCodeList: [],
        getPluginListWithWebpackEnv: () => [],
        getRuleListWithWebpackEnv: () => [],
    };

    constructor() {
        return this;
    }

    setName = (name) => {
        this.#value.name = name;
        return this;
    }

    setFnIsEnabled = (fn) => {
        this.#value.isEnabled = fn;
        return this;
    }

    setReplaceCodeList = (list) => {
        this.#value.replaceCodeList = list
        return this;
    }

    setFnGetPluginListWithWebpackEnv = (fn) => {
        this.#value.getPluginListWithWebpackEnv = fn;
        return this;
    }

    setFnGetRuleListWithWebpackEnv = (fn) => {
        this.#value.getRuleListWithWebpackEnv = fn;
        return this;
    }

    build = () => { return { ...this.#value }; }
}
module.exports = ModuleBuilder;

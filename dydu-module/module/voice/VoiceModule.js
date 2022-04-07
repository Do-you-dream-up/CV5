const configuration = require("../../../public/override/configuration.json");
const ModuleBuilder = require("../../ModuleBuilder");

const MODULE_NAME = "voice-module";

const getVoiceComponentCodeString = () => {
    return "<Voice DialogContext={DialogContext} configuration={configuration} Actions={Actions} show={!!Local.get(Local.names.gdpr)} t={t('input.actions.record')} />";
}

module.exports = new ModuleBuilder()
    .setName(MODULE_NAME)
    .setFnIsEnabled(() => configuration?.Voice?.enable)
    .setReplaceCodeList([
        {
            flags: "g",
            search: "<import-voice />",
            replace: "import Voice from '@dydu_ai/voice-module';",
        },
    ])
    .build();
sap.ui.define([], 
    function(){
        "use strict";

        return {
            genderFormatter: function(genderKey){
                const view = this.getView(),
                    i18nModel = view.getModel("i18n"),
                    resourceBundle = i18nModel.getResourceBundle(),
                    formattedText = resourceBundle.getText(`gender.${genderKey == 0 ? 'male' : 'female'}`);
    
                return formattedText;
            },
        }
});
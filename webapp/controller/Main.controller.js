sap.ui.define(
    [
        "sap/ui/core/mvc/Controller",
    ],
    function(BaseController) {
      "use strict";
  
      return BaseController.extend("at.clouddna.training00.zhoui5.controller.Main", {
        onInit() {
        },

        genderFormatter: function(genderKey){
            const view = this.getView(),
                i18nModel = view.getModel("i18n"),
                resourceBundle = i18nModel.getResourceBundle(),
                formattedText = resourceBundle.getText(`gender.${genderKey == 0 ? 'male' : 'female'}`);

            return formattedText;
        },

        onEmailPress: function(event){
            sap.m.URLHelper.triggerEmail(event.getSource().getText());
        }
      });
    }
  );
  
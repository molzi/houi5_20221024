sap.ui.define([
    "sap/ui/core/mvc/Controller"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller) {
        "use strict";

        return Controller.extend("at.clouddna.training00.zhoui5.controller.Customer", {
            onInit: function () {

            },

            genderFormatter: function(genderKey){
                const view = this.getView(),
                    i18nModel = view.getModel("i18n"),
                    resourceBundle = i18nModel.getResourceBundle(),
                    formattedText = resourceBundle.getText(`gender.${genderKey}`);

                return formattedText;
            }
        });
    });
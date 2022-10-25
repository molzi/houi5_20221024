sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, MessageBox) {
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
            },

            onSavePress: function(){
                const view = this.getView(),
                    model = view.getModel(),
                    data = model.getData();

                MessageBox.success(JSON.stringify(data));
            }
        });
    });
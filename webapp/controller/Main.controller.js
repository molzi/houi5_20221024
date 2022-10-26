sap.ui.define(
    [
        "sap/ui/core/mvc/Controller",
        "sap/m/MessageBox"
    ],
    function(BaseController, MessageBox) {
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
        },

        onCustomerDelete: function(event){
            let path = event.getParameter("listItem").getBindingContext().getPath(),
                model = this.getView().getModel(),
                resourceBundle = this.getView().getModel("i18n").getResourceBundle();

            MessageBox.warning(resourceBundle.getText("msg.confirm.delete.text"), {
               title: resourceBundle.getText("msg.confirm.delete.title"),
               actions: [MessageBox.Action.YES, MessageBox.Action.NO],
               emphasizedAction: MessageBox.Action.YES,
               onClose: (chosenAction)=>{
                   if(chosenAction === MessageBox.Action.YES){
                       model.remove(path, {
                           success: (data, respons)=>{
                                MessageBox.success(resourceBundle.getText("msg.delete.success"));
                           },
                           error: (error)=>{
                                MessageBox.error(error.message);
                           }
                       });
                   }
               }
            });


            debugger;
        }
      });
    }
  );
  
sap.ui.define(
    [
        "at/clouddna/training00/zhoui5/controller/BaseController",
        "sap/m/MessageBox",
        "at/clouddna/training00/zhoui5/controller/formatter/HOUI5Formatter"
    ],
    function(BaseController, MessageBox, HOUI5Formatter) {
      "use strict";

      return BaseController.extend("at.clouddna.training00.zhoui5.controller.Main", {
        ...HOUI5Formatter,

        onInit() {
            this.setContentDensity();
        },

        onEmailPress: function(event){
            sap.m.URLHelper.triggerEmail(event.getSource().getText());
        },

        onCreatePress: function(){
            this.getRouter().navTo("CreateCustomer");
        },

        onCustomerPress: function(event){
            const customerId = event.getSource().getBindingContext().getObject().CustomerId;


            this.getRouter().navTo("Customer", {
                customerId: customerId
            });
        },

        onCustomerDelete: function(event){
            let path = event.getParameter("listItem").getBindingContext().getPath(),
                model = this.getModel();

            MessageBox.warning(this.getLocalizedText("msg.confirm.delete.text"), {
               title: this.getLocalizedText("msg.confirm.delete.title"),
               actions: [MessageBox.Action.YES, MessageBox.Action.NO],
               emphasizedAction: MessageBox.Action.YES,
               onClose: (chosenAction)=>{
                   if(chosenAction === MessageBox.Action.YES){
                       model.remove(path, {
                           success: (data, respons)=>{
                                MessageBox.success(this.getLocalizedText("msg.delete.success"));
                           },
                           error: (error)=>{
                                MessageBox.error(error.message);
                           }
                       });
                   }
               }
            });


            //Promise based OData V2 Operations
            /*let read1Promise = new Promise((resolve, reject)=>{
                model.read("/1", {
                    success: (data)=>{
                        resolve(data);
                    },
                    error: (error)=>{
                        reject(error)
                    }
                })
            })

            let read2Promise = new Promise((resolve, reject)=>{
                model.read("/2", {
                    success: (data)=>{
                        resolve(data);
                    }
                })
            })

            Promise.all([read1Promise, read2Promise]).then(()=>{

            }).catch();*/
        }
      });
    }
  );
  
sap.ui.define([
    "at/clouddna/training00/zhoui5/controller/BaseController",
    "sap/m/MessageBox",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/Fragment",
    "sap/ui/core/routing/History",
    "at/clouddna/training00/zhoui5/controller/formatter/HOUI5Formatter"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, MessageBox, JSONModel, Fragment, History, HOUI5Formatter) {
        "use strict";

        return Controller.extend("at.clouddna.training00.zhoui5.controller.Customer", {
            ...HOUI5Formatter,

            _fragments: {},
            isCreateMode: false,

            onInit: function () {
                let editModel = new JSONModel({
                    editmode: false
                });

                this.setModel(editModel, "editModel");

                this.getRouter().getRoute("Customer").attachPatternMatched(this._onPatternMatched.bind(this), this);
                this.getRouter().getRoute("CreateCustomer").attachPatternMatched(this._onCreatePatternMatched.bind(this), this);
            },

            _onPatternMatched: function(event){
                let customerId = event.getParameter("arguments").customerId,
                    path = this.getModel().createKey("CustomerSet", {
                        CustomerId: customerId
                    });
                
                this.getView().bindElement("/" + path);

                this.isCreateMode = false;

                this._toggleEdit(false);
            },

            _onCreatePatternMatched: function(){
                let newCustomerContext = this.getModel().createEntry("/CustomerSet");

                this.getView().bindElement(newCustomerContext.getPath());

                this.isCreateMode = true;
                
                this._toggleEdit(true);
            },

            _toggleEdit: function(isEditMode){
                let editModel = this.getModel("editModel");

                editModel.setProperty("/editmode", isEditMode);

                this._showCustomerFragment(isEditMode ? "ChangeCustomer" : "DisplayCustomer");
            },

            _showCustomerFragment: function(fragmentName){
                let page = this.getView().byId("customer_page");

                page.removeAllContent();

                if(this._fragments[fragmentName]){
                    page.insertContent(this._fragments[fragmentName]);
                } else {
                    Fragment.load({
                        name: "at.clouddna.training00.zhoui5.view.fragment." + fragmentName,
                        controller: this,
                        id: this.getView().getId()
                    }).then((fragmentContent)=>{
                        this._fragments[fragmentName] = fragmentContent;  
                        page.insertContent(fragmentContent);
                    });
                }
            },

            onCancelPress: function(){
                let model = this.getModel();

                if(model.hasPendingChanges()){
                    model.resetChanges().then(()=>{
                        if(this.isCreateMode){
                            this.onNavBack();
                        } else {
                            this._toggleEdit(false);
                        }
                    });
                } else {
                    this._toggleEdit(false);
                }
            },

            onEditPress: function(){
                this._toggleEdit(true);
            },

            onSavePress: function(){
                let model = this.getModel(),
                    successText = this.getLocalizedText(this.isCreateMode ? "msg.create.success" : "msg.save.success");

                if(model.hasPendingChanges()){
                    model.submitChanges({
                        success: ()=>{
                            MessageBox.success(successText, {
                                onClose: ()=>{
                                    if(this.isCreateMode){
                                        this.onNavBack();
                                    } else {
                                        this._toggleEdit(false);
                                    }
                                }
                            });
                        },
                        error: (error)=>{
                            MessageBox.error(error.message);
                        }
                    });
                } else {
                    this._toggleEdit(false);
                }
            },
        });
    });
sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/Fragment",
    "sap/ui/core/routing/History"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, MessageBox, JSONModel, Fragment, History) {
        "use strict";

        return Controller.extend("at.clouddna.training00.zhoui5.controller.Customer", {
            _fragments: {},

            onInit: function () {
                let editModel = new JSONModel({
                    editmode: false
                });

                this.getView().setModel(editModel, "editModel");
                
                this._showCustomerFragment("DisplayCustomer");

                this.getOwnerComponent().getRouter().getRoute("Customer").attachPatternMatched(this._onPatternMatched.bind(this), this);
            },

            _onPatternMatched: function(event){
                let customerId = event.getParameter("arguments").customerId,
                    path = this.getView().getModel().createKey("CustomerSet", {
                        CustomerId: customerId
                    });
                
                this.getView().bindElement("/" + path);
            },

            _toggleEdit: function(isEditMode){
                let editModel = this.getView().getModel("editModel");

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

            genderFormatter: function(genderKey){
                const view = this.getView(),
                    i18nModel = view.getModel("i18n"),
                    resourceBundle = i18nModel.getResourceBundle(),
                    formattedText = resourceBundle.getText(`gender.${genderKey}`);

                return formattedText;
            },

            onCancelPress: function(){
                this._toggleEdit(false);
            },

            onEditPress: function(){
                this._toggleEdit(true);
            },

            onSavePress: function(){
                const view = this.getView(),
                    model = view.getModel(),
                    data = model.getData();

                MessageBox.success(JSON.stringify(data));

                this._toggleEdit(false);
            },

            onNavBack: function(){
                let history = History.getInstance(),
                    previousHash = history.getPreviousHash();

                if(previousHash){
                    window.history.go(-1);
                } else {
                    let router = this.getOwnerComponent().getRouter();

                    router.navTo("Main");
                }

                debugger;
            }
        });
    });
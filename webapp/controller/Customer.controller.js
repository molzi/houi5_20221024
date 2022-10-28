sap.ui.define([
    "at/clouddna/training00/zhoui5/controller/BaseController",
    "sap/m/MessageBox",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/Fragment",
    "sap/ui/core/routing/History",
    "at/clouddna/training00/zhoui5/controller/formatter/HOUI5Formatter",
    "sap/ui/core/Item"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, MessageBox, JSONModel, Fragment, History, HOUI5Formatter, Item) {
        "use strict";

        return Controller.extend("at.clouddna.training00.zhoui5.controller.Customer", {
            ...HOUI5Formatter,

            _fragments: {},
            _attachmentsDialog: undefined,
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

            onOpenAttachmentsPress: function(){
                if(!this._attachmentsDialog){
                    this._attachmentsDialog = Fragment.load({
                        name: "at.clouddna.training00.zhoui5.view.fragment.AttachmentDialog",
                        controller: this,
                        id: this.getView().getId()
                    }).then((fragmentContent)=>{
                        this.getView().addDependent(fragmentContent);
                        return fragmentContent;
                    });
                }

                this._attachmentsDialog.then((dialog)=>{
                    let uploadSet = this.getView().byId("attachmentdialog_uploadset");
                    uploadSet.setUploadUrl(this.getModel().sServiceUrl + this.getView().getObjectBinding().getPath() + "/Documents");

                    dialog.open();
                });
            },


            onCloseAttachmentDialogPress: function(){
                this._attachmentsDialog.then((dialog)=>{
                    dialog.close();
                })
            },

            onAfterItemAdded: function(event){
                let uploadSet = this.getView().byId("attachmentdialog_uploadset"),
                    uploadSetItem = event.getParameter("item"),
                    fileName = uploadSetItem.getFileName();
                    debugger;

                uploadSet.removeAllHeaderFields();

                let header = new Item({
                    key: "x-csrf-token",
                    text: this.getModel().getSecurityToken()
                });

                uploadSet.addHeaderField(header);

                header = new Item({
                    key: "slug",
                    text: fileName
                });

                uploadSet.addHeaderField(header);
            },

            onUploadCompleted: function(){
                this.getModel().refresh(true);
            },

            formatUrl: function(docId){
                let path = this.getModel().createKey("/CustomerDocumentSet", {
                    DocId: docId
                });

                return this.getModel().sServiceUrl + path + "/$value";
            },

            onRemoveAttachmentPress: function(event){
                this.getModel().remove(event.getSource().getBindingContext().sPath, {
                    success: ()=>{
                        this.getModel().refresh(true);
                    }
                });
            }
        });
    });
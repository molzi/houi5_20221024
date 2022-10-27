sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/routing/History",
    "sap/base/Log"
],
function(BaseController, History, Log) {
  "use strict";

  return BaseController.extend("at.clouddna.training00.zhoui5.controller.BaseController", {
    getRouter: function(){
        this.setContentDensity();
        return this.getOwnerComponent().getRouter();
    },

    getLocalizedText: function(textId, parameters){
        let bundle = this.getView().getModel("i18n").getResourceBundle();

        return bundle.getText(textId, parameters);
    },

    getModel: function (name) {
        return this.getView().getModel(name);
    },
    
    setModel: function (model, name) {
        return this.getView().setModel(model, name);
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
    },

    logDebug: function (sMessage) {
        let oLogger = Log.getLogger(this.getView().getControllerName());
        oLogger.debug("DEBUG - " + sMessage);
    },
    
    logError: function (sMessage) {
        let oLogger = Log.getLogger(this.getView().getControllerName());
        oLogger.error("ERROR - " + sMessage);
    },
    
    logFatal: function (sMessage) {
        let oLogger = Log.getLogger(this.getView().getControllerName());
        oLogger.fatal("FATAL - " + sMessage);
    },
    
    logInfo: function (sMessage) {
        let oLogger = Log.getLogger(this.getView().getControllerName());
        oLogger.info("INFO - " + sMessage);
    },
    
    logTrace: function (sMessage) {
        let oLogger = Log.getLogger(this.getView().getControllerName());
        oLogger.trace("TRACE - " + sMessage);
    },
    
    logWarning: function (sMessage) {
        let oLogger = Log.getLogger(this.getView().getControllerName());
        oLogger.warning("WARNING - " + sMessage);
    },

    _contentDensityClass: "",

    _getContentDensity: function(){
        if(this._contentDensityClass){
            if(sap.ui.Device.support.touch){
                this._contentDensityClass = "sapUiSizeCozy";
            } else {
                this._contentDensityClass = "sapUiSizeCompact";
            }
        }

        return this._contentDensityClass;
    },

    setContentDensity: function(){
        this.getView().addStyleClass(this._getContentDensity());
    }
  });
}
);

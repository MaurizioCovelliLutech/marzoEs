sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/ui/model/json/JSONModel"
  ], function(Controller, MessageToast, JSONModel) {
    "use strict";
  
    return Controller.extend("sap.btp.apui5.controller.View3", {
      onInit: function(){

        var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
        oRouter.getRoute("RouteView3").attachPatternMatched(this.onRouterMatched, this);
      },

      onRouterMatched: function(oEvent){

        const tmp = oEvent.getParameter("arguments").RouteView1;
            const datiCodificati = JSON.parse(atob(tmp));
            const tabellaNuovaView = new JSONModel(datiCodificati);
            this.getView().setModel(tabellaNuovaView, "tabellaNuovaView");
      }



    });

});
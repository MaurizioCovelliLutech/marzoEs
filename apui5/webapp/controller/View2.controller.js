sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast"
], function(Controller, MessageToast) {
    "use strict";
//aggiungere onInit controller
    return Controller.extend("sap.btp.apui5.controller.View2", {
        onInit: function(){
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.getRoute("Gianfra").attachPatternMatched(this.onRouterMatched, this);
        },

        onRouterMatched: function(oEvent){
            var datiPassati = oEvent.getParameter("arguments");
            
            datiPassati.nome;
            datiPassati.cognome;
            datiPassati.sesso;
            datiPassati.codiceFiscale;
            datiPassati.numeroTelefono;

            var oModel = new sap.ui.model.json.JSONModel(datiPassati);

            
        },
        
        onPress: function() {
            MessageToast.show("Ok, operazione andata");
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.navTo("RouteView1");
            this.clearFields();
        },



        clearFields: function() {
            var oView = this.getView();
            oView.byId("Sesso").setSelectedKey("");
            oView.byId("CF").setValue("");
            oView.byId.getId("Nome").setValue("");
            oView.byId("Cognome").setValue("");
            oView.byId("Telefono").setValue("");
        }
    });
});

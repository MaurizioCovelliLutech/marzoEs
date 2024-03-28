sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/m/MessageToast",
  "sap/ui/model/json/JSONModel"
], function(Controller, MessageToast, JSONModel) {
  "use strict";

  return Controller.extend("sap.btp.apui5.controller.View1", {
    onInit: function(){
        var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
        oRouter.getRoute("Gianfra").attachPatternMatched(this.onRouterMatched, this);

        
        var aData = [
            { Parametro: "Nome", Valore: "" },
            { Parametro: "Cognome", Valore: "" },
        ];

        this.getView().setModel(new JSONModel(aData), "modelloUno");
    },
    
      onPress: function() {
          var nome = this.getView().byId("Nome").getValue();
          var cognome = this.getView().byId("Cognome").getValue();
          var sesso = this.getView().byId("Sesso").getSelectedItem().getText();
          var codiceFiscale = this.getView().byId("CF").getValue();
          var numeroTelefono = this.getView().byId("Telefono").getValue();

          if (nome && cognome && sesso && numeroTelefono) {
              var oRouter = this.getOwnerComponent().getRouter();
              oRouter.navTo("Gianfra", {
                  nome: nome,
                  cognome: cognome,
                  sesso: sesso,
                  codiceFiscale: codiceFiscale,
                  numeroTelefono: numeroTelefono
              });
          } else {
              sap.m.MessageToast.show("eeeh NON hai compilato tutti i campi :C .");

          }

          var oView = this.getView();
          var oTable = oView.byId("tabellaProva");
          var oModel = oView.getModel();


         /* aData.forEach(function(oData) {
              var oItem = new sap.m.ColumnListItem({
                  cells: [
                      new sap.m.Label({ text: oData.Parametro }),
                      new sap.m.Input({ value: oData.Valore })
                  ]
              });

              oTable.addItem(oItem); //aggiungo il ColumnListItem alla tabella
          }); */
      },

      onSearch: function(oEvent) {
        var sQuery = oEvent.getParameter("query"); //prende il testo inserito
        var oTable = this.byId("tabellaProva");
        var oBinding = oTable.getBinding("items");

        if (sQuery && sQuery.length > 0) { //verifico il corretto inserimento del testo
            var oFilter = new sap.ui.model.Filter("Parametro", sap.ui.model.FilterOperator.Contains, sQuery); //se è tutto ok creo un filtro con il parametro nome preso dalla tabella cosi posso filtrare solo dove sta il nome cercato
            oBinding.filter(oFilter); //applichiamo il filtro alla tabella 
        } else {
            oBinding.filter([]); //con questo else togliamo tutti i filtri 
        }},

      navigate: function() {

        const oItem = btoa(JSON.stringify(this.getView().getModel("modelloUno").getData())); 
        const routerProva = this.getOwnerComponent().getRouter();
        routerProva.navTo("RouteView3",{RouteView1:oItem});

    }

  });
});

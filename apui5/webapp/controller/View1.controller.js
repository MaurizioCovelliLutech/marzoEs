sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/SearchField",
    "sap/m/Dialog",
    "sap/m/List",
    "sap/m/StandardListItem",
	"sap/ui/model/odata/v2/ODataModel",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/Fragment",
	"sap/m/MessageBox"
], function(Controller, SearchField, Dialog, List, StandardListItem,ODataModel,JSONModel,Fragment,MessageBox) {
    "use strict";

    const sURL = "/V2/Northwind/Northwind.svc/";

    // Mostrare inoltre i dati anagrafici dell’impiegato, ovvero Nome (FirstName), Cognome (LastName), 
    // Data assunzione (HireDate, formattata gg/mm/yyyy), Titolo (Title)

    return Controller.extend("sap.btp.apui5.controller.View1", {

        onInit: function () {
			this._wizard = this.byId("CreateProductWizard");
			this._oNavContainer = this.byId("wizardNavContainer");
			this._oWizardContentPage = this.byId("wizardContentPage");

			this.model = new sap.ui.model.json.JSONModel();
            
			this.model.setData({
				productNameState: "Error",
				productWeightState: "Error"
			});
			this.getView().setModel(this.model);
			this.model.setProperty("/firstName");
			this.model.setProperty("/availabilityType");
			this.model.setProperty("/navApiEnabled", true);
			this.model.setProperty("/productVAT", false);
			this.model.setProperty("/measurement", "");
			// this._setEmptyValue("/productManufacturer");
			// this._setEmptyValue("/productDescription");
			// this._setEmptyValue("/size");
			// this._setEmptyValue("/productPrice");
			// this._setEmptyValue("/manufacturingDate");
			// this._setEmptyValue("/discountGroup"); 

		},

		onSearch: async function (oEvent) {
           // var oTable = this.getView().byId("exportTable");
          //  var oBinding = oTable.getBinding("items");
            var aFilters = [];

            //var sCustomerId = oEvent.getParameter("selectionSet").getValue();
        
            // if (sCustomerId) {
            //     var oFilter = new Filter("Customer", FilterOperator.EQ, sCustomerId);
            //     aFilters.push(oFilter);
            // }

            var oModel = new ODataModel("/V2/Northwind/Northwind.svc/");

            const oData = await new Promise((resolve, reject) => {
                oModel.read("/Employees" , {
                    //filters: aFilters,
                    success: function(oData, response) {
                        resolve(oData);
                    },
                    error: function(error) {
                        reject(error);
                    }
                });
            });
			this.getView().getModel().setData(oData.results);
        
            //oBinding.filter(aFilters);
		},

		setfirstName: function (evt) {
			var firstName = evt.getSource().getTitle();
			this.model.setProperty("/firstName", firstName);
			this.byId("ProductStepChosenType").setText("Chosen First Name: " + firstName);
			this._wizard.validateStep(this.byId("firstNameStep"));
		},

		setfirstNameFromSegmented: function (evt) {
			var firstName = evt.getParameters().item.getText();
			this.model.setProperty("/firstName", firstName);
			this._wizard.validateStep(this.byId("firstNameStep"));
		},

		
		optionalStepActivation: function () {
			MessageToast.show(
				'This event is fired on activate of Step3.'
				);
			},

			optionalStepCompletion: function () {
			MessageToast.show(
				'This event is fired on complete of Step3. You can use it to gather the information, and lock the input data.'
				);
			},
			
			pricingActivate: function () {
			this.model.setProperty("/navApiEnabled", true);
		},

		pricingComplete: function () {
			this.model.setProperty("/navApiEnabled", false);
		},
		
		// scrollFrom4to2: function () {
		// 	this._wizard.goToStep(this.byId("ProductInfoStep"));
		// },
		
		goFrom4to3: function () {
			if (this._wizard.getProgressStep() === this.byId("PricingStep")) {
				this._wizard.previousStep();
			}
		},

		goFrom4to5: function () {
			if (this._wizard.getProgressStep() === this.byId("PricingStep")) {
				this._wizard.nextStep();
			}
		},

		wizardCompletedHandler: function () {
			this._oNavContainer.to(this.byId("wizardReviewPage"));
		},

		backToWizardContent: function () {
			this._oNavContainer.backToPage(this._oWizardContentPage.getId());
		},
		
		editStepOne: function () {
			this._handleNavigationToStep(0);
		},
		
		editStepTwo: function () {
			this._handleNavigationToStep(1);
		},

		editStepThree: function () {
			this._handleNavigationToStep(2);
		},

		editStepFour: function () {
			this._handleNavigationToStep(3);
		},
		
		_handleNavigationToStep: function (iStepNumber) {
			var fnAfterNavigate = function () {
				this._wizard.goToStep(this._wizard.getSteps()[iStepNumber]);
				this._oNavContainer.detachAfterNavigate(fnAfterNavigate);
			}.bind(this);

			this._oNavContainer.attachAfterNavigate(fnAfterNavigate);
			this.backToWizardContent();
		},
		
		_handleMessageBoxOpen: function (sMessage, sMessageBoxType) {
			MessageBox[sMessageBoxType](sMessage, { //definire bene la messagebox per il mio esercizio
				actions: [MessageBox.Action.YES, MessageBox.Action.NO],
				onClose: function (oAction) {
					if (oAction === MessageBox.Action.YES) {
						this._handleNavigationToStep(0);
						this._wizard.discardProgress(this._wizard.getSteps()[0]);
					}
				}.bind(this)
			});
		},

		_setEmptyValue: function (sPath) {
			this.model.setProperty(sPath, "n/a");
		},
		
		// handleWizardCancel: function () {
		// 	this._handleMessageBoxOpen("Are you sure you want to cancel your report?", "warning");
		// },
		
		handleWizardSubmit: function () {
			this._handleMessageBoxOpen("Are you sure you want to submit your report?", "confirm");
		},
		
		productWeighStateFormatter: function (val) {
			return isNaN(val) ? "Error" : "None";
		},

		discardProgress: function () {
            this._wizard.discardProgress(this.byId("firstNameStep"));
            
			var clearContent = function (content) {
                for (var i = 0; i < content.length; i++) {
					if (content[i].setValue) {
                        content[i].setValue("");
					}
                    
					if (content[i].getContent) {
                        clearContent(content[i].getContent());
					}
				}
			};
            
			this.model.setProperty("/lastNameState", "Error");
			this.model.setProperty("/firstNameState", "Error");
			clearContent(this._wizard.getSteps());
		},
        
        onContinue: function() {
			var oSelectedEmployee = this.getView().getModel("modEmployee").getProperty("/SelectedEmployee");
            // if (!oSelectedEmployee || !oSelectedEmployee.EmployeeID) {
            //     sap.m.MessageToast.show("eh eh devi inserire un impiegato prima di proseguire!");
            //     return;
            // }

			this._wizard.nextStep();

			
        },

		onValueHelpRequested: async function() {
			this._oValueHelpDialog = sap.ui.xmlfragment( "oFragment" ,"sap.btp.apui5.view.matchCodeFilterBar" , this);
			this._oValueHelpDialog.open();

			this.getView().addDependent(this._oValueHelpDialog);

			// var oTable = this.getView().byId("exportTable");
          //  var oBinding = oTable.getBinding("items");
		  var aFilters = [];

		  //var sCustomerId = oEvent.getParameter("selectionSet").getValue();
	  
		  // if (sCustomerId) {
		  //     var oFilter = new Filter("Customer", FilterOperator.EQ, sCustomerId);
		  //     aFilters.push(oFilter);
		  // }

		  var oModel = new ODataModel("/V2/Northwind/Northwind.svc/");

		  
		  const oData = await new Promise((resolve, reject) => {
			  oModel.read("/Employees" , {
				  //filters: aFilters,
				  success: function(oData, response) {
					  resolve(oData);
					},
					error: function(error) {
						reject(error);
					}
				});
			});	  
			//oBinding.filter(aFilters);
			this.getView().setModel(new JSONModel(oData.results), "modEmployee");


        },

		onValueHelpCancel: function() {

            this._oValueHelpDialog.close();
            this._oValueHelpDialog.destroy();
            this._oValueHelpDialog = null;
        },

		onValueHelpSelectionChange: function(oEvent) {
			var oTable = sap.ui.core.Fragment.byId("oFragment" , "customerTable")
			var oSelectedItem = oTable.getSelectedItem();
		
			if (oSelectedItem) {
				var selectedEmployee = oSelectedItem.getCells()[0].getText();//getbindingcontext
				this.getView().byId("FirstName").setValue(selectedEmployee);
			} else {
				
			}
		
			this.onValueHelpCancel();
		},

		prossimoStep: function() { //non va bene perchè non sto navigando tra view ma sto procedento sempre all'interno del wizard
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.navTo("Step3"); //in questo caso al 3 come prova
        },

		precedenteStep: function(){

			// this._handleMessageBoxOpen("Sei sicuro sicuro sicuro?");
			this._wizard.previousStep();
		},

		calculateTotalPrice: function(event) {
            var oItem = event.getSource().getParent();
            var prezzoUnita = parseFloat(oItem.getBindingContext().getProperty("UnitPrice"));
            var quantita = parseInt(oItem.getBindingContext().getProperty("Quantity"));
            var prezzoTotale = prezzoUnita * quantita;
            oItem.getBindingContext().setProperty("TotalPrice", prezzoTotale.toFixed(2));
        },
		
		
		
	});
});

//_______________ATTENZIONE______________________DA QUI PARTE LA QUARANTENA COMMENTI______________________ATTENZIONE________________

		/*onValueHelpSelectionChange: function(oEvent) {
            var selectedEmployee = oEvent.getParameter("ListItem").getCells()[0].getText();
            this.getView().byId("FirstName").setValue(selectedEmployee);

			this.getView().getSelectedItem()
			this.onValueHelpCancel();

        }

		/*onValueHelpSelectionChange: function(oEvent) {
			var listItem = oEvent.getParameter("listItem");
			if (listItem) {
				var selectedEmployee = listItem.getCells()[0].getText();
				if (selectedEmployee) {
					this.getView().byId("FirstName").setValue(selectedEmployee);
				}
			}
			this.getView().getSelectedItem();
			this.onValueHelpCancel();
		}
	
        
        /* onInit: function() {
            this.getView().setModel(new sap.ui.model.json.JSONModel({
                Employees: [],
                SelectedEmployee: {}
            }, "modCustomer"));
        },

        onSearch: function(oEvent) {
            var sQuery = oEvent.getParameter("query");
        },

        onManualInput: function(oEvent) {
            var sEmployeeInput = oEvent.getSource().getValue();
        },
		
        //Non troppo sicuro chiedere matteo
        onMatchCode: function() {
			var oModel = this.getView().getModel();
            var oDialog = new Dialog({
				title: "Seleziona impiegato",
                content: new List({
                    items: {
                        path: "/Employees",
                        template: new StandardListItem({
                            title: "{FirstName} {LastName}",
                            press: function(oEvent) {
                                var oSelectedItem = oEvent.getSource();
                                oModel.setProperty("/SelectedEmployee", oSelectedItem.getBindingContext().getObject());
                                oDialog.close();
                            }
                        })
                    }
                }),
                endButton: new Button({
                    text: "Annulla",
                    press: function() {
                        oDialog.close();
                    }
                })
            });
           // oDialog.open();
        },


        //non sicuro chiedere matteo
        formatHireDate: function(sHireDate) {
            var oDate = new Date(sHireDate);
            var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({ pattern: "dd/MM/yyyy" });
            return oDateFormat.format(oDate);
        } */

// additionalInfoValidation: function () {
// 	var name = this.byId("ProductName").getValue();
// 	var weight = parseInt(this.byId("ProductWeight").getValue());

// 	if (isNaN(weight)) {
// 		this._wizard.setCurrentStep(this.byId("ProductInfoStep"));
// 		this.model.setProperty("/productWeightState", "Error");
// 	} else {
// 		this.model.setProperty("/productWeightState", "None");
// 	}

// 	if (name.length < 6) {
// 		this._wizard.setCurrentStep(this.byId("ProductInfoStep"));
// 		this.model.setProperty("/productNameState", "Error");
// 	} else {
// 		this.model.setProperty("/productNameState", "None");
// 	}

// 	if (name.length < 6 || isNaN(weight)) {
// 		this._wizard.invalidateStep(this.byId("ProductInfoStep"));
// 	} else {
// 		this._wizard.validateStep(this.byId("ProductInfoStep"));
// 	}
// },
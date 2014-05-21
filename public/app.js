var ddapp  = angular.module("ddapp",[]);

ddapp.controller("ConverterCtrl", function(){
    this.inputText = "";
    this.outputName = "Decimal Degrees";
    this.converted = ["0.0, 0.0"];
});
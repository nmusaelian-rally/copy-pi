Ext.define('CustomApp', {
    extend: 'Rally.app.App',
    componentCls: 'app',
    items:{ html:'<a href="https://help.rallydev.com/apps/2.0rc3/doc/">App SDK 2.0rc3 Docs</a>'},
    _newObj : {},
    _type : null,
    launch: function() {
        Ext.create('Rally.ui.dialog.SolrArtifactChooserDialog', {
            width: 450,
            autoScroll: true,
            height: 525,
            title: 'Select to Copy',
            pageSize: 100,
            closable: false,
            selectionButtonText: 'Copy',                  
            artifactTypes: ['portfolioitem/theme','portfolioitem/initiative','portfolioitem/feature'],
            autoShow: true,
            storeConfig:{
                fetch: ['Name','PortfolioItemTypeName','FormattedID']
            },
            listeners: {
                artifactchosen: function(dialog, selectedRecord) {
                    console.log(selectedRecord.data.FormattedID + ', ' + selectedRecord.data.Name + ' of type ' + selectedRecord.data.PortfolioItemTypeName + ' was chosen');
                    this._type = selectedRecord.data.PortfolioItemTypeName;
                    this._newObj = selectedRecord.data;
                    this.getModel();
                },
                scope: this
            },
        }); 
    },
     getModel: function() {
        var that = this;
        that._type = 'PortfolioItem/' + that._type,
        Rally.data.ModelFactory.getModel({
            type: that._type,
            success: this.onModelRetrieved,
            scope: this
        });     
    },      
    onModelRetrieved: function(model) {
        this.model = model;
        this.createFeature();
    },

    createFeature: function() {
        var record = Ext.create(this.model, {
            Name: "(Copy of) " + this._newObj.Name,
        });
        record.save({
            callback: function(result, operation) {
                if(operation.wasSuccessful()) {
                    console.log('created ' + result.get('PortfolioItemTypeName') + ' : ' + result.get('ObjectID'),result.get('FormattedID'),result.get('Name'));
                }
                else{
                    console.log("error");
                }
            }
        });
    }       
});

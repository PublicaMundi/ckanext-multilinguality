// recline preview module
var dataExplorer;
//var LANGUAGE =  'fr';
var errorMsg;

this.ckan.module('recline_translate_read_preview', function (jQuery, _) {  
  return {
    options: {
      i18n: {
        errorLoadingPreview: "Could not load preview",
        errorDataProxy: "DataProxy returned an error",
        errorDataStore: "DataStore returned an error",
        previewNotAvailableForDataType: "Preview not available for data type: "
      },
      site_url: ""
    },

    initialize: function () {
        console.log('HELLO');
        console.log(jQuery("html")[0].getAttribute('lang'));
      jQuery.proxyAll(this, /_on/);
      // hack to make leaflet use a particular location to look for images
      this.button = jQuery("#button");
      var html = '<a href="#" class="btn" id="saveClicked">Save</a> <a href="#" class="btn btn-primary" id="publishClicked">Publish</a>';

      this.buttons = jQuery("#saveButtons").html(html);
      //this.buttons.hide();
      this.buttons.show();
      this.save_btn = jQuery("#saveClicked");
      this.publish_btn = jQuery("#publishClicked");
      this.el.ready(this._onReady);
    },
    _onReady: function() {
      this.loadPreviewDialog(preload_resource);  
    },

    // **Public: Loads a data preview**
    //
    // Fetches the preview data object from the link provided and loads the
    // parsed data from the webstore displaying it in the most appropriate
    // manner.
    //
    // link - Preview button.
    //
    // Returns nothing.
    loadPreviewDialog: function (resourceData) {
      var self = this;

      function showError(msg){
        msg = msg || _('error loading preview');
        window.parent.ckan.pubsub.publish('data-viewer-error', msg);
      }

      recline.Backend.DataProxy.timeout = 10000;

      // 2 situations
      // a) something was posted to the datastore - need to check for this
      // b) csv or xls (but not datastore)
      resourceData.formatNormalized = this.normalizeFormat(resourceData.format);

      resourceData.url  = this.normalizeUrl(resourceData.url);
      if (resourceData.formatNormalized === '') {
        var tmp = resourceData.url.split('/');
        tmp = tmp[tmp.length - 1];
        tmp = tmp.split('?'); // query strings
        tmp = tmp[0];
        var ext = tmp.split('.');
        if (ext.length > 1) {
          resourceData.formatNormalized = ext[ext.length-1];
        }
      }
      var dataset; 
      //, errorMsg;
      var lang = jQuery("html")[0].getAttribute('lang');
      // Datastore
      if (resourceData.datastore_active) {
        
        // Set endpoint of the resource to the datastore api (so it can locate
        // CKAN DataStore)
        resourceData.endpoint = jQuery('body').data('site-root') + 'api';
         
        resourceData.translation_language = lang;
         
         
        errorMsg = this.options.i18n.errorLoadingPreview + ': ' + this.options.i18n.errorDataStore;
        
        translate = new TranslateHelper(resourceData, lang); 
        var trans_lang; 
        var dataset;
        try{
            trans_lang = JSON.parse(resourceData.has_translations)[lang];
        }
        catch(err) {
            
        }
        var orig_lang = resourceData.resource_language || 'en';
        console.log('trasn');
        console.log(lang);
        console.log(orig_lang);
        console.log(resourceData);

        //resourceData = translate.delete(function() {}, function() { });
        if (orig_lang == lang || ("translation_resource" in resourceData)){
            //if (!("translation_resource" in resourceData)){
            resourceData.backend =  'ckan';
            dataset = new recline.Model.Dataset(resourceData);
            var translationResource = null;
            this.initializeDataset(dataset, resourceData);
        //}
        //else{
            //resourceData.backend =  'ckan';
        //}    alert('Cannot translate in origin language');
        }
        else{
            resourceData.backend =  'ckanTranslateRead';
            dataset = new recline.Model.Dataset(resourceData);
            console.log('dataset');
            console.log(dataset);

        var translationResource = null;
        this.initializeDataset(dataset, resourceData);
        }
      } 
      // CSV/XLS
      else if (resourceData.formatNormalized in {'csv': '', 'xls': ''}) {
        resourceData.format = resourceData.formatNormalized;
        resourceData.backend = 'dataproxy';
        dataset = new recline.Model.Dataset(resourceData);
        //console.log(dataset);
        errorMsg = this.options.i18n.errorLoadingPreview + ': ' +this.options.i18n.errorDataProxy;
        dataset.fetch()
          .done(function(dataset){
            dataset.bind('query:fail', function (error) {
              console.log('error');
              console.log(error);
              jQuery('.data-view-container', self.el).hide();
              jQuery('.header', self.el).hide();
            });
            self.initializeDataExplorer(dataset);
          })
          .fail(function(error){
            if (error.message) errorMsg += ' (' + error.message + ')';
            showError(errorMsg);
          });
      }
    },
    initializeDataset: function(dataset, resourceData) {
        var self = this;
        
        onComplete = function(){
            
        //dataExplorer.clearNotifications();
        //var selfi = this;
        var lang = jQuery("html")[0].getAttribute('lang');
        dataExplorer.model.fetch().done(function(dataset){
            console.log('data');
            console.log(dataset);
            var has_translations = dataset.attributes.has_translations;
            var res_id;
            console.log('hastransl');
            console.log(has_translations);
            console.log(lang);
            try{
                console.log('trying');
                res_id = JSON.parse(has_translations)[lang];
            }
            catch(err) {
                
            }
                console.log(res_id);
                console.log(dataset.attributes.endpoint);
                var res =translate.show_resource({endpoint:dataset.attributes.endpoint, id:res_id}).done(function(result){
                    console.log('res');
                    var result = result.result;
                    console.log(result);
                    var columns = {};
                    try{
                        console.log('trying2');
                        columns = JSON.parse(result.translation_columns);
                    }
                    catch(err2){
                        
                    }
                        console.log(columns);
                        console.log('sef');
                        console.log(self);
                        //jQuery(columns).each(function(col, idx){
                });
        });
        //repaint(columns);
    };
    onLoad = function(){
        dataExplorer.notify({message: 'Loading', loader:true, category: 'warning', persist: true});
        //setTimeout(function(){ dataExplorer.model.fetch()}, 3000);
    };

     console.log('!!!! 4');
     function showError(msg){
        msg = msg || _('error loading preview');
        window.parent.ckan.pubsub.publish('data-viewer-error', msg);
      }
     console.log('fetchind');
     console.log(dataset);
        dataset.fetch()
              .done(function(dataset1){
                var fields1 = dataset1.fields.models;
                var records1 = dataset1.records.models;
                
                self.initializeDataExplorer(dataset1);
                
          })
          .fail(function(error){
            if (error.message) errorMsg += ' (' + error.message + ')';
            showError(errorMsg);
          });
    },
    
    initializeDataExplorer: function (dataset) {
      var views = [
        {
          id: 'grid',
          label: 'Grid',
          view: new recline.View.SlickGrid({
            model: dataset,
            state: {  }
          })
        },
        
        ];

      var sidebarViews = [
        {
          id: 'valueFilter',
          label: 'Filters',
          view: new recline.View.ValueFilter({
            model: dataset
          })
        }
      ];
        console.log('dataset');
        console.log(dataset);
      dataExplorer = new recline.View.MultiView({
        el: this.el,
        model: dataset,
        views: views,
        sidebarViews: sidebarViews,
        config: {
          readOnly: true,
        }
      });
    
      
    },
    normalizeFormat: function (format) {
      var out = format.toLowerCase();
      out = out.split('/');
      out = out[out.length-1];
      return out;
    },
    normalizeUrl: function (url) {
      if (url.indexOf('https') === 0) {
        return 'http' + url.slice(5);
      } else {
        return url;
      }
    },
      };
});





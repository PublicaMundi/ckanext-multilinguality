// API calls helpers 
//

//this.TranslateApiHelper = this.TranslateApiHelper || {};

//(function ($, my) {
function TranslateHelper (resource, lang){
    this.resource;
    this.lang;
    this.initialize = function (resource, lang) {
        this.resource = resource;
        this.lang = lang; 
        console.log('HELP');
        console.log(this.lang);
    };

    this.create = function(ld, cb) {
        console.log('creating..');
        console.log(resource);
        var url = resource.endpoint + '/3/action/translate_resource_create';
        
        var package_id = this._strip_package_id(resource.url);
        console.log(package_id);
        var options = {
            resource_id:resource.id,
            package_id: package_id,
            language: lang,
        }
        return this.call_ajax(url, options, ld, cb);    
    };

    this.update = function(options, ld, cb) {
        var title_trans = title_trans || null;
        var options = options || {};
        var col_name = options.column;
        var mode = options.mode; 
        var title_trans = options.title;
        console.log('updating..');
        var self = this;
        var url = resource.endpoint + '/3/action/translate_resource_update';
        
        var translations = {};
        try{
            translations = JSON.parse(resource.has_translations);
        }
        catch(err) {
            alert(err);
        }

        console.log(translations);
        var new_res_id = translations[lang];
        
        var res = {endpoint:resource.endpoint, id:new_res_id};
        console.log('RESOURECE');
        console.log(new_res_id); 
        var options = {
                    resource_id: new_res_id,
                    column_name: col_name,
                    mode: mode,
                    translation: title_trans,
                }
        return this.call_ajax(url, options, ld, cb);           
    }; 

    this.delete = function(options, ld, cb) {
        var options = options || {};
        var col_name = options.column;

        console.log('deleting..');
        console.log(resource);
        console.log(col_name);
        var self = this;

        var url = resource.endpoint + '/3/action/translate_resource_delete';
        
        var translations = {};
        try{
            translations = JSON.parse(resource.has_translations);
        }
        catch(err) {
            alert(err);
        }
        var new_res_id = translations[lang];
        
        if (col_name !== undefined){
        
        var options = {
            resource_id: new_res_id,
            column_name: col_name
        }
        
        }
        else{
            var options = {
                resource_id: new_res_id
            }
        
        }
        return self.call_ajax(url, options, ld, cb);    
    };

    this.publish = function(options, ld, cb) {
        console.log('publishing..');
        console.log(resource);
        var url = resource.endpoint + '/3/action/translate_resource_publish';
        var translations = {};
        try{
            translations = JSON.parse(resource.has_translations);
        }
        catch(err) {
            alert(err);
        }
        
        var new_res_id = translations[lang];

        var options = {
            resource_id:new_res_id,
        }
        console.log('before calling ajax');
        console.log(ld);
        console.log(cb);
        return this.call_ajax(url, options, ld, cb);    
    };

    this.unpublish = function(options, ld, cb) {
        console.log('unpublishing..');
        console.log(resource);
        var url = resource.endpoint + '/3/action/translate_resource_unpublish';
        
        var translations = {};
        try{
            translations = JSON.parse(resource.has_translations);
        }
        catch(err) {
            alert(err);
        }
        
        var new_res_id = translations[lang];

        var options = {
            resource_id:new_res_id,
        }
        return this.call_ajax(url, options, ld, cb);    
    };

    this.show =  function(resource, cb) {
        console.log('showing..');
        console.log(resource.id);

        var url = resource.endpoint + '/3/action/datastore_search';
        
        var options = {
            id: resource.id,
        }
        return $.ajax({
                type: "POST",
                url: url,
                data: JSON.stringify(options),
                dataType: 'json',
                async: true, 
                complete: cb,
        });    
    },

    this.show_resource =  function(resource, cb) {
        console.log('showing..');
        console.log(resource.id);

        var url = resource.endpoint + '/3/action/resource_show';
        var options = {
            id: resource.id,
        }
        return $.ajax({
                type: "POST",
                url: url,
                data: JSON.stringify(options),
                dataType: 'json',
                async: true,
                complete: cb,
        });    
    },
    
    this.call_ajax = function(url, options, ld, cb) {
        return $.ajax({
            type: "POST",
            url: url,
            data: JSON.stringify(options),
            dataType: 'json',
            async: true,
            beforeSend: ld,
            complete: cb,
            success: function(response) {
                console.log('succeeded');
                console.log(response);
            },
            failure: function(response) {
                console.log('failed');
                console.log(response);
            },
            error: function(response) {
                //if (response.status == 409){
                //    return;
                //}
                console.log('error');
                console.log(response);
                alert('Error: .\n' + response.status + ':' + response.responseText);
            },
        });
    };
    this._strip_package_id = function(url) {
        // CKAN 2.2 doesnt provide package_id in resource_show
        // strip it from url
        var str = "dataset/";
        var start = url.indexOf(str)+str.length;
        var str = "/resource";
        var end = url.indexOf(str);
        return url.substring(start, end);

    };
    


};





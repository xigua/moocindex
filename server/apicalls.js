/*Meteor.methods({
    fetchFromService: function(vendorname) {
        var url = "https://www.parsehub.com/api/v2/projects/{PROJECT_TOKEN}/last_ready_run/data";
        var api_key = 'te79WidrkOmN_Fxs2e_kNnX5';
        if (vendorname === '慕课网') {
            //url = url.replace('{PROJECT_TOKEN}', 'tQQl5Voj4BKCTCypvGibDLfu');
            url = url.replace('{PROJECT_TOKEN}', 'tbNBvhG208xhGUpecAk62V80');
            console.log('start fetching remote results for imooc.com from ' + url);
            this.unblock();
            HTTP.get(url, {params: {api_key: api_key}, headers: {Accept: 'json/application', encoding: null}}, function(error, result) {
                if(error) {
                    console.log('http get FAILED!');
                } else {
                    console.log('http get SUCCESS');
                    if (result.statusCode === 200) {
                        if (result.headers['content-encoding'] && result.headers['content-encoding'].indexOf('gzip') > -1) {
                            console.log('The response is gzipped. Now unzip it.');
                            var unzipped = gunzip(result.content);
                            console.log(unzipped);
                        }
                        //console.log(result.content);
                        //console.log(result.data);
                    }
                }
            });
            return true;
        }
    }
});*/

Meteor.methods({
    fetchFromService: function(vendorname) {
        var url = "http://menus.zmenu.com/parsehub/{vendor}.api.json";
        if (vendorname === '慕课网') {
            url = url.replace('{vendor}', 'imooc');
            console.log('start fetching remote results for imooc.com from ' + url);
            this.unblock();
            HTTP.get(url, {headers: {Accept: 'json/application', encoding: null}}, function(error, result) {
                if(error) {
                    console.log('http get FAILED!');
                } else {
                    var json = JSON.parse(result.content);
                    _.each(json.courses, function(element, index, list) {
                        
                    });
                }
            });
        }
        return true;
    }
});
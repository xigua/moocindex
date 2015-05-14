Template.vendors.helpers({
    vendors: function(){
        return Vendors.find();
    }
});

Template.vendor.events = {
    'click button' : function (event, template) {
        console.log("Call server to fetch latest data for this vendor");

        //$('#fetchData').attr('disabled','true').val('获取数据中...');
        Meteor.call('fetchFromService', template.data.name, function(err, respJson) {
            if(err) {
                window.alert("Error: " + err.reason);
                console.log("error occured on receiving data on server. ", err );
            } else {
                console.log("respJson: ", respJson);
                //window.alert(respJson.length + ' tweets received.');
                Session.set("recentTweets",respJson);
            }
            //$('#fetchData').removeAttr('disabled').val('刷新数据');
        });
    }
};

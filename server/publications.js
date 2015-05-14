Meteor.publish('vendors', function() {
    return Vendors.find();
});
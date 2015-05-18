Template.search.events({
    "click #search-button": function(event) {
        var searchText = $('#search-box').val();
        Session.set('searchText', searchText);
    },

    "keyup #search-box": _.throttle(function(ev) {
        var searchText = $('#search-box').val();
        Session.set('searchText', searchText);
    }, 1000)
});

Template.search.rendered = function() {
    Session.set('searchText', '');
};

//Tracker.autorun(function() {
//    var searchText = Session.get('searchText');
//    Meteor.subscribe('searchCourses', searchText);
//});
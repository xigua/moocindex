Template.search.events({
    "click #search-button": function(event) {
        var searchText = $('#search-box').val();
        Session.set('searchText', searchText);
    },

    "keyup #search-box": _.throttle(function(ev) {
        var searchText = $('#search-box').val();
        Session.set('searchText', searchText);
        Session.set('itemsLimit', 20);
    }, 200)
});

Template.search.rendered = function() {
    Session.set('searchText', '');
};
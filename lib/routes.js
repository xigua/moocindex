Router.configure({
    layoutTemplate: 'layout'
    //loadingTemplate: 'loading',
    //waitOn: function() {
    //    var searchText = Session.get('searchText');
    //    var coursesLimit = Session.get('itemsLimit');
    //
    //    Meteor.subscribe('searchCourses', searchText, coursesLimit);
    //}
});

Router.route('/', {name: 'allCourses'});
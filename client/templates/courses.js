Template.allCourses.helpers({
    courses: function() {
        return Courses.find({}, {sort: {students: -1}, limit: Session.get('itemsLimit')});
    },

    courseCount: function() {
        return Courses.find().count();
    }
});

Template.allCourses.created = function() {
    Session.setDefault('itemsLimit', 20);

    // Deps.autorun() automatically rerun the subscription whenever Session.get('limit') changes
    // http://docs.meteor.com/#deps_autorun
    Deps.autorun(function() {
        Meteor.subscribe('searchCourses', Session.get('searchText'), Session.get('itemsLimit'));
    });
};

Template.allCourses.rendered = function() {
    // is triggered every time we scroll
    $(window).scroll(function() {
        if ($(window).scrollTop() + $(window).height() > $(document).height() - 50) {
            incrementLimit();
        }
    });
};

incrementLimit = function() {
    var newLimit = Session.get('itemsLimit') + 20;
    Session.set('itemsLimit', newLimit);
}
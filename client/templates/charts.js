function buildCoursesChart() {
    var record = VendorCharts.findOne({charttype: 'linechart', range: '7days', type: 'newCourses'});
    if (record && record.data) {
        $('#container-newCoursesChart').highcharts(record.data);
    }
}

function buildStudentsChart() {
    var record = VendorCharts.findOne({charttype: 'linechart', range: '7days', type: 'newStudents'});
    if (record && record.data) {
        $('#container-newStudentsChart').highcharts(record.data);
    }
}

Template.charts.rendered = function() {
    Deps.autorun(function () {
        if (VendorCharts.find().count() > 0) {
            buildCoursesChart();
            buildStudentsChart();
        }
    });
};
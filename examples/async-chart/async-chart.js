'use strict';
var { Component, h } = require('./../../src/component-simple.js');
var { thunk, store } = require('./../store.js');
var { init, addSeries } = require('./async-chart-reducer.js');
const highcharts = require('highcharts');

var List = Component.create({
    init: function() {
        this.componentName = 'async-chart';
    },
    componentDidMount: function() {
        this.unsubscribe = store.subscribe(function() {
            this.update(store.getState().chart);
        }.bind(this));

        this.chart = highcharts.chart('chart-container', {
            title: {
                text: 'Monthly Average Temperature',
                x: -20
            },
            subtitle: {
                text: 'Source: WorldClimate.com',
                x: -20
            },
            xAxis: {
                categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
                ]
            },
            yAxis: {
                title: {
                    text: 'Temperature (°C)'
                },
                plotLines: [{
                    value: 0,
                    width: 1,
                    color: '#808080'
                }]
            },
            tooltip: {
                valueSuffix: '°C'
            },
            legend: {
                layout: 'vertical',
                align: 'right',
                verticalAlign: 'middle',
                borderWidth: 0
            },
            series: this.props.series
        });

        if (this.props.series.length === 0) {
            this.chart.showLoading();
            setTimeout(thunk(init), 2000);
        }
    },

    componentWillUnmount: function() {
        this.unsubscribe();
        this.chart.destroy();
    },

    componentDidUpdate: function() {
        console.info('UPDATE CHART', this.props);
        while (this.chart.series.length > 0) {
            this.chart.series[0].remove(false);
        }
        this.props.series.forEach(series => this.chart.addSeries(series, false));
        this.chart.redraw();
        this.chart.hideLoading();
    },

    render: function() {
        return h('div#chart', [
            h('button', {
                on: {
                    click: thunk(addSeries)
                }
            }, 'add series'),
            h('button', {
                on: {
                    click: () => {
                        while (this.chart.series.length > 0) {
                            this.chart.series[0].remove(false);
                        }
                        this.chart.redraw();
                    }
                }
            }, 'reset'),
            h('hr'),
            h('div#chart-container')
        ]);
    }
});

module.exports = List;

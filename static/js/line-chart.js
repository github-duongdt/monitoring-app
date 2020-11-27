capitalize = (str) => {
  return str[0].toUpperCase() + str.slice(1, str.length)
}

var param = 'temperature', n_of_rec = 20, paused = false,
  unit = {
    temperature: '\u{2103}',
    ghi: 'W/m' + '2'.sup(),
    current: 'A',
    voltage: 'V',
    power: 'W'
  };

var chart = JSC.chart(
  'chart-div',
  {
    debug: true,
    legend: {
      position: 'inside top right',
      defaultEntry: {
        name: '%name',
        style: {
          fontFamily: 'sans-serif',
          fontSize: 14,
        },
        iconWidth: 20,
        value: ''
      }
    },
    title: {
      label: {
        text: 'Data Average: %average',
        style: {
          fontFamily: 'sans-serif',
          fontSize: 20,
        },
        offset: '0, -20',
      },
      position: 'center',
    },
    defaultSeries: { type: 'line', opacity: 1 },
    defaultPoint: {
      label: { text: '%yValue', autoHide: true },
      marker: {
        type: 'circle',
        size: 11,
        outline: { color: 'white', width: 2 }
      },
      tooltip: '%seriesName:<b>%yValue<b/>'
    },
    margin_right: 20,
    margin_top: 20,
    animation: { duration: 640 },
    // toolbar: {
    //   margin: 5,
    //   items: {
    //     Stop: {
    //       type: 'option',
    //       icon_name: 'system/default/pause',
    //       boxVisible: true,
    //       label: {
    //         text: 'Stop',
    //         style: {
    //           fontSize: 20,
    //           fontFamily: 'sans-serif',
    //           verticalAlign: 'center'
    //         }
    //       },
    //       events: { change: playPause },
    //       states_select: {
    //         icon_name: 'system/default/play',
    //         label_text: 'Continue'
    //       },
    //       position: '0,0',
    //       height: 30,
    //       margin_bottom: 18,
    //       tooltip: 'Stop/Continue real-time update'
    //     },
    //     Nrec: {
    //       type: 'select',
    //       items: '10, 20, 30, 40, 50',
    //       defaultItem: {
    //         label_style: {
    //           fontFamily: 'sans-serif',
    //           fontSize: 20
    //         },
    //         height: 30,
    //         margin_top: 5,
    //         outline: {
    //           color: 'rgba(0,0,0,0.3)',
    //           dashStyle: 'Solid',
    //           width: 1
    //         }
    //       },
    //       events_change: (val) => {
    //         n_of_rec = parseInt(val);
    //         updateData(param, n_of_rec);
    //       },
    //       label: {
    //         style: {
    //           fontSize: 20,
    //           fontFamily: 'sans-serif',
    //         },
    //         text: 'Number of records',
    //       },
    //       position: 'top left',
    //       margin_left: 70,
    //       margin_bottom: 18,
    //       width: 200,
    //       height: 30,
    //     },
    //   },
    // },
    xAxis: {
      scale_type: 'time',
      label: {
        text: 'Time Stamp',
        style: {
          fontSize: 20,
          fontFamily: 'sans-serif',
          fontWeight: 'bold'
        },
        offset: '0, 10'
      },
      cultureName: 'vi-VN',
      formatString: 'HH:MM:ss<br/>dd/MM/yy',
      overflow: 'hidden',
      crosshair_enabled: true,
    },
    yAxis: {
      formatString: 'n',
      label: {
        text: 'Data',
        style: {
          fontFamily: 'sans-serif',
          fontSize: 20,
          fontWeight: 'bold'
        }
      }
    },
    // series: [
    //   {
    //     name: 'Purchases',
    //     points: [
    //       ['1/1/2020', 29.9],
    //       ['1/2/2020', 71.5],
    //       ['1/3/2020', 106.4],
    //       ['1/6/2020', 129.2],
    //       ['1/7/2020', 144.0],
    //       ['1/8/2020', 176.0]
    //     ],
    //     emptyPointMode: 'ignore'
    //   }
    // ]
  }
);

/**
 * Adds a data point to the chart series.
 */

updateData = (param, n_of_rec) => {
  jQuery.ajax({
    url: '/ajax/chart',
    method: 'GET',
    data: {
      param: param,
      limit: n_of_rec
    },
    dataType: 'json',
    success: (data) => {
      chart.series([{
        name: param === 'ghi' ? param.toUpperCase() : capitalize(param),
        points: data.map((row) => {
          return [row.TimeStamp, row[param]]
        }),
        emptyPointMode: 'ignore'
      }]);
      chart.options({
        yAxis_label_text: (param === 'ghi' ? param.toUpperCase() : capitalize(param)) + ` (${unit[param]})`,
        title_label_text: (param === 'ghi' ? param.toUpperCase() + ' Average: %average ' : capitalize(param) + ' Average: %average ') + `${unit[param]}`
      })
    },
    error: (msg) => alert(msg)
  })
};

function playPause(val) {
  if (val === false) {
    clearInterval(INTERVAL_ID);
  } else {
    start();
  }
}

function start() {
  INTERVAL_ID = setInterval(function () {
    if (chart) {
      updateData(param, n_of_rec);
    }
  }, 10000);
}

(function ($) {
  $(document).ready(() => {
    updateData(param, n_of_rec);
    start();
    $(".dropdown-item.btn-param:contains(Temperature)").addClass('active');
    $(".dropdown-item.btn-nrec:contains(20)").addClass('active');
  });

  $('.dropdown-item.btn-param').on('click', function () {
    $(this).siblings().removeClass('active');
    $(this).addClass('active');
    console.log($(this));
    param = $(this).text().toLowerCase();
    updateData(param, n_of_rec);
  });

  $(".dropdown-item.btn-nrec").on('click', function () {
    $(this).siblings().removeClass('active');
    $(this).addClass('active');
    n_of_rec = $(this).text();
    updateData(param, n_of_rec);
  });

  $("#toggleStop").on('click', function () {
    var html = paused ? '<i class="fas fa-pause"></i> Stop' : '<i class="fas fa-play"></i> Continue';
    playPause(paused);
    $(this).html(html);
    paused = paused ? false : true;
  });
})(jQuery);

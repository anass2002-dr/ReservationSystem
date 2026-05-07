export function load() {
    $('.modal-container').on('click', this, function () {

    });
    $('#btnCreer').on('click', this, () => {
        ittone.show($("#popup"))
    })
    $('#popup').on('click', 'a.close,a.cancel', function () {
        // $.hide($('#popup,#popup2'))
        ittone.hide($("#popup"))
        // $("#popup").fadeOut(200);
        // $('#popup').addClass('d-none')
    })
    new simpleDatatables.DataTable($('.datatable')[0]);
    rangeStartCalendar($('#dateStart'), $('#dateEnd'))
    rangeEndCalendar($('#dateStart'), $('#dateEnd'))
    const startOfYear = moment().startOf('month').toDate();
    const endOfYear = moment().endOf('month').toDate();
    $('#rangestart').setDate(startOfYear);
    $('#rangeend').setDate(endOfYear);
    $('.type_date').inputDate()
    $('input').attr('autocomplete','off')
}
var rangeStartCalendar = function ($inputStart, $inputEnd) {
    $inputStart.calendar({
        type: 'date',
        monthFirst: false,
        endCalendar: $inputEnd,
        className: {
            prev: 'prev link left',
            next: 'next link right',
            prevIcon: 'chevron left icon',
            nextIcon: 'chevron right icon',
        },
        formatter: {
            date: function (date, settings) {
                if (!date) return '';
                console.log(date)
                var day = date.getDate();
                var month = date.getMonth() + 1;
                var year = date.getFullYear();
                return day + '/' + month + '/' + year;
            }
        },
        onChange: function (date) {
            
        }
    });
}
var rangeEndCalendar = function ($inputStart, $inputEnd) {
    $inputEnd.calendar({
        type: 'date',
        monthFirst: false,
        minDate: $inputStart.val(),
        startCalendar: $inputStart,
        className: {
            prev: 'prev link left',
            next: 'next link right',
            prevIcon: 'bi left icon',
            nextIcon: 'chevron right icon',
        },
        formatter: {
            date: function (date, settings) {
                if (!date) return '';
                var day = date.getDate();
                var month = date.getMonth() + 1;
                var year = date.getFullYear();
                return day + '/' + month + '/' + year;
            }
        },
        onChange: function (date) {
        }
    });
}
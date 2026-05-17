var ittone = (function () {
  const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 5000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer)
      toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
  });
  const url = new URL(window.location.href).origin;
  const pathname = new URL(window.location.href).pathname;
  const name = new URL(window.location.href).searchParams.get("name");
  return {
    init: function () {
      //loader();
      // i18n.init("fr");
      this.app();
      modal();
      forms();
      togglePassword();
      circular_image();
      headerMenuLongText();
      headerMenuClick(pathname, name);
      customBtn(url);
      $('#autoNavMore').on('click', this, function () {
        $(this).find('.auto-nav-more-list').toggleClass("show-nav-more scale-in-tr");
      });
      if ($('.date_range.dateStart').length) {
        $('.date_range.dateStart,.date_range.dateEnd').rangeDate();
      }
      if ($('.ui.calendar.inputDate').length) {
        $('.ui.calendar.inputDate').inputDate();
      }
      if ($('a[data-action="collapse"]').length) {
        collapseCard();
      }
      if ($('[data-depot="false"]').length) {
        $('[data-depot="false"]').attr('data-depot', ittone.settingParam().subDepot);
      }
      // var $loading = $('<div style="position: absolute;top: 0;right: 0;width: 100%;height: 100%;background-color: antiquewhite;"></div>');
      // //Attach the event handler to any element
      // $(document)
      //   .ajaxStart(function () {
      //      //ajax request went so show the loading image
      //      //setTimeout(() => {   $('body').append($loading); }, 200);

      //   })
      // .ajaxStop(function () {
      //     //got response so hide the loading image
      //     $loading.remove();
      //  });    
    },
    AjaxJson: function (url, data) {
      var list;
      $.ajax({
        type: 'POST',
        url: url,
        async: false,
        data: data,
        contentType: 'application/json; charset =utf-8',
        success: function (data) {
          list = data.d;
        },
        error: function (xhr, status, error) {
          var err = eval("(" + xhr.responseText + ")");
          //alertify.error(err.Message);
          ittone.error(err.Message);
          console.error(err.Message);
        }
      });
      return list;
    },
    UploaderImage: function ($input, path, fileName) {
      var image = null;
      let formdata = new FormData();
      if ($input.prop('files').length > 0) {
        file = $input.prop('files')[0];
        formdata.append("image", file);
        formdata.append("path", path);
        formdata.append("fileName", this.escapeRegExp(fileName));
        $.ajax({
          type: 'POST',
          url: 'AjaxFileUploader.ashx',
          async: false,
          data: formdata,
          processData: false,
          contentType: false,
          success: function (img) {
            image = img;
          },
          error: function (xhr, status, error) {
            var err = eval("(" + xhr.responseText + ")");
            ittone.error(err.Message);
            console.error(err.Message);
          }
        });
      }
      return image;
    },
    success: function (msg) {
      Toast.fire({
        icon: 'success',
        title: msg
      })
    },
    error: function (msg) {
      Toast.fire({
        icon: 'error',
        title: (msg)
      })
    },
    warning: function (msg) {
      Toast.fire({
        icon: 'warning',
        title: (msg)
      })
    },
    alert: function (title, msg, ok, annuler) {
      console.log('cbxn')
      let $modalAlert = $(`
          <div role="dialog" class="modal d-none">
            <div class="modal-dialog modal-md modal-dialog-centered alert">
              <div class="modal-content">
                <div class="modal-header">
                  <h5 class="modal-title">`+ (title) + `</h5>
                  <button type="button" class="btn-close"><i class="fa-solid fa-x"></i></button>
                </div>
                <span class="radiosStyle">
                  <div class="modal-body">
                    <div class="row">
                      <div class="col-12">
                            `+ (msg) + `
                      </div>
                    </div>
                  </div> 
                </span>
                <div class="modal-footer">
                  <button type="button" class="btn btn-light btn-annuler btn-rounded">`+ ("Cancel") + `</button>
                  <button type="submit" class="btn btn-success btn-sauvegarder btn-rounded mx-2">`+ ("OK") + `</button>
                </div>
              </div>
            </div>  
          </div>    
              `);
      $modalAlert.on('click', '.btn-sauvegarder', function () {
        ok();
        ittone.hide($modalAlert);
        $modalAlert.remove();
      });
      $modalAlert.on('click', '.btn-annuler,.btn-close', function () {
        annuler();
        ittone.hide($modalAlert);
        $modalAlert.remove();
      });
      $('body').append($modalAlert);
      this.show($modalAlert);
    },
    app: function () {
      // let user = this.AjaxJson(url + "/Default.aspx/User");
      // if (user) {
      //   $('#nomUser').text(user[0].nomUser);
      //   $('.nomUser').text(user[0].nomUser);
      //   sessionStorage.setItem('user', JSON.stringify(user[0]));
      //   menu.init(user[0].typeAdmin);
      //   this.dataDossier();
      // }
    },
    dataDossier: function () {
      if (pathname == '/ModeleDossier.aspx') {
        sessionStorage.removeItem('dataDossier');
      } else {
        if (sessionStorage.getItem('dataDossier')) {
          let data = JSON.parse(sessionStorage.getItem('dataDossier'));
          $('.nomDossier').text(data.Nom_dossier + " / " + this.getYear(data.dateExeEnd))
        } else {
          window.location.href = url + "/ModeleDossier.aspx";
        }
      }
    },
    convertFormToJSON: function (form) {
      const array = $(form).serializeArray();
      const json = {};
      $.each(array, function () {
        json[this.name] = this.value || "";
      });
      return json;
    },
    convertJsonToForm: function (form, json) {
      $.each(json, function (key, value) {
        if (value == null) {
          return;
        }
        setValueForms(form, key, value);
      });
    },
    hide: function ($el) {
      $el.addClass('scale-out-center');
      $el.addClass('d-none', 1000, function () {
        $(this).removeClass('scale-out-center');
        $(this).removeClass('scale-in-center');
      });
    },
    show: function ($el) {
      $el.addClass('scale-in-center', 100, function () {
        $(this).removeClass('d-none');
      });
    },
    idDossier: function () {
      this.dataDossier();
      let data = JSON.parse(sessionStorage.getItem('dataDossier'));
      return data.idDossier;
    },
    jsonIdDossier: function () {
      return {
        idDossier: this.idDossier()
      }
    },
    dateExeDossier: function () {
      let data = JSON.parse(sessionStorage.getItem('dataDossier'));
      return {
        dateExeStart: moment(data.dateExeStart).toDate(),
        dateExeEnd: moment(data.dateExeEnd).toDate()
      }
    },
    settingParam: function () {
      let data = JSON.parse(sessionStorage.getItem('user'));
      return {
        subDepot: data.subDepot,
        ttcCheck: data.ttcCheck,
        tvaCheck: data.tvaCheck
      }
    },
    convertDate: function (date) {
      if (moment(date).isValid())
        return moment(date).format("L");
      else
        return null;
    },
    getYear: function (date) {
      return moment(date).format('YYYY');
    },
    addInDataTable: function (table, data) {
      table.row.add(data).draw(false);
    },
    updateInDataTable: function (table, data, id) {
      try {
        let row = table.row('[data-id="' + id + '"]');
        row.data(data).draw(false);
      } catch (ex) {
      }
    },
    deleteRowDataTable: function (table, id) {
      table.row('[data-id="' + id + '"]').remove().draw(false);
    },
    getTrDatatable: function (table, id) {
      return $(table.row('[data-id="' + id + '"]').node())
    },
    getSubMenu: function () {
      return $('body').attr('name');
    },
    stringWithZero: function (number, length) {
      let my_string = '' + number;
      while (my_string.length < length) {
        my_string = '0' + my_string;
      }
      return my_string;
    },
    escapeRegExp: function (string) {
      return string.replace(/[^a-zA-Z ]/g, "").replace(/\s/g, '');
    },
    CurrencyFormat: function (money) {
      let x = 0;
      let setting = [{ pattern: `# !`, precision: 2, symbol: 'DH', decimal: ',', separator: ' ' }];
      if (sessionStorage.getItem('user')) {
        setting = JSON.parse(sessionStorage.getItem('user')).currencyFormat;
        if (!setting) setting = [{ pattern: `# !`, precision: 2, symbol: 'DH', decimal: ',', separator: ' ' }];
      }
      if (money >= 0) {
        x = currency(parseFloat(money), JSON.parse(setting)[0]).format()
      }
      else {
        x = '-' + currency(parseFloat(Math.abs(money)), JSON.parse(setting)[0]).format()
      }
      return x;
    },
    QteFormat: function (qte) {
      let setting = [{ pattern: `# !`, precision: 0, symbol: '', decimal: ',', separator: ' ' }];
      if (sessionStorage.getItem('user')) {
        setting = JSON.parse(sessionStorage.getItem('user')).qteFormat;
        if (!setting) setting = [{ pattern: `# !`, precision: 0, symbol: '', decimal: ',', separator: ' ' }];
      }
      return currency(parseFloat(qte), JSON.parse(setting)[0]).format();
    },
    QteFormatSymbol: function (qte, symbol) {
      let setting = [{ pattern: `# !`, precision: 0, symbol: symbol, decimal: ',', separator: ' ' }];
      if (sessionStorage.getItem('user')) {
        setting = JSON.parse(sessionStorage.getItem('user')).qteFormat;
        if (!setting) setting = [{ pattern: `# !`, precision: 0, symbol: symbol, decimal: ',', separator: ' ' }];
      }
      return currency(parseFloat(qte), JSON.parse(setting)[0]).format();
    },
    toFixedMoney: function (val) {
      let setting = JSON.parse(sessionStorage.getItem('user')).currencyFormat;
      if (setting) {
        let fixed = JSON.parse(setting)[0].precision;
        return parseFloat(val).toFixed(fixed);
      } else {
        return parseFloat(val).toFixed(2);
      }
    },
    collapseShow: function ($card) {
      $card.children(".card-content").collapse('show');
      $card.children(".card-header");
      $card.find('[data-action="collapse"]').addClass("rotate");
      $card.find('i').removeClass('fa-chevron-down');
      $card.find('i').addClass('fa-chevron-up');
    },
    collapseHide: function ($card) {
      $card.children(".card-content").collapse('hide');
      $card.children(".card-header");
      $card.find('[data-action="collapse"]').removeClass("rotate");
      $card.find('i').removeClass('fa-chevron-up');
      $card.find('i').addClass('fa-chevron-down');
    },
    generatorTable: function (columns_title, getData) {
      if (columns_title.length) {
        let $table = $('<table></table>');
        let th = '';
        for (let col in columns_title) {
          th += '<th>' + columns_title[col].title + '</th>';
        }
        let $thead = $('<thead><tr>' + th + '</tr></thead>');
        let $tbody = $('<tbody></tbody>');
        for (let i in getData) {
          let $tr = $('<tr></tr>');
          for (let col in columns_title) {
            let data = columns_title[col].data;
            let render = columns_title[col].render;
            if (render) {
              $tr.append('<td>' + render(getData[i][data]) + '</td>');
            } else {
              $tr.append('<td>' + getData[i][data] + '</td>');
            }
          }
          $tbody.append($tr);
        }
        $table.append($thead);
        $table.append($tbody);
        return $table.html();
      } else {
        return getData;
      }
    },
    numberToletter: function (number) {
      return trans(String(number));
    },
    defaultImgFolder: 'image/app/FOLDER-ITTONE.png',
    defaultImgArticle: 'image/app/modelProduits.png',
    pathImgArticle: 'image/data/article/',
    pathImgMenu: 'image/menu/',
    pathImprimant: 'imprimant/',
    pathImrementEntet: 'imprimant/entet/'
  }
})();
$(function () {
  ittone.init();
});
const modal = function () {
  $.modal = $('.modal[role="dialog"]');
  $.modal.on('click', '.btn-close', function () {
    ittone.hide($.modal);
  });
}
const collapseCard = function () {
  $('a[data-action="collapse"]').on("click", function (e) {
    e.preventDefault();
    $(this)
      .closest(".card")
      .children(".card-content")
      .collapse("toggle");

    $(this)
      .closest(".card")
      .children(".card-header");
    $(this)
      .closest(".card")
      .find('[data-action="collapse"]')
      .toggleClass("rotate");
    $(this).find('i').toggleClass('fa-chevron-up fa-chevron-down')
  });
}
const forms = function () {
  var forms = document.querySelectorAll('form');
  Array.prototype.slice.call(forms)
    .forEach(function (form) {
      form.addEventListener('submit', function (event) {
        event.preventDefault();
        event.stopPropagation();
        ittone.warning('required')
      }, false)
    });
}

const togglePassword = function () {
  $('[gid="togglePassword"]').on('click', this, function (event) {
    event.preventDefault();
    if ($(this).parents('.input-group').find('.form-control').attr("type") == "text") {
      $(this).parents('.input-group').find('.form-control').attr('type', 'password');
      $(this).addClass("fa-eye-slash");
      $(this).removeClass("fa-eye");
    } else if ($(this).parents('.input-group').find('.form-control').attr("type") == "password") {
      $(this).parents('.input-group').find('.form-control').attr('type', 'text');
      $(this).removeClass("fa-eye-slash");
      $(this).addClass("fa-eye");
    }
  });
}
const circular_image = function () {
  $('.inputCircular_image').on('change', this, function () {
    let input = this;
    if (this.files && this.files[0]) {
      var reader = new FileReader();
      reader.onload = function (e) {
        $(input).closest('.circular_image').css('background-image', 'url(' + e.target.result + ')');
        $(input).closest('.circular_image').hide();
        $(input).closest('.circular_image').addClass('changed');
        $(input).closest('.circular_image').fadeIn(650);
      }
      reader.readAsDataURL(input.files[0]);
    }
  });
}
const setValueForms = function (form, name, value) {
  if (typeof (value) === 'undefined' || value === null) {
    return;
  }
  var queryElements = $(form).find(
    'input[name="' + name + '"], select[name="' + name + '"], textarea[name="' + name + '"], ' +
    'input[name="' + name + '[]"], select[name="' + name + '[]"], textarea[name="' + name + '[]"]'
  );
  $.each(queryElements, function (index, element) {
    var obj = $(element);
    var type = null;
    if (typeof (obj.context) === 'undefined') {
      // jquery over 3.0
      type = obj.attr('type');
      if (typeof (type) === 'undefined') {
        var tagName = obj.prop('tagName');
        if (tagName === 'TEXTAREA') {
          type = 'textarea';
        } else if (tagName === 'SELECT') {
          if (typeof (obj.attr('multiple')) !== 'undefined'
            && (obj.attr('multiple').toLowerCase() === 'multiple' || obj.attr('multiple').toLowerCase() === 'true')
          ) {
            type = 'select-multiple';
          } else {
            type = 'select';
          }
        }
      }
    } else {
      // jquery 1.2
      type = obj.context.type;
    }

    switch (type) {
      case 'text':
      case 'hidden':
      case 'email':
      case 'date':
      case 'datetime-local':
      case 'color':
      case 'month':
      case 'number':
      case 'password':
      case 'search':
      case 'range':
      case 'tel':
      case 'url':
      case 'time':
      case 'week':
      case 'select-one':
      case 'select':
        obj.val(value);
        if ($(obj).parent().hasClass('form-outline')) {
          if (value != '') {
            $(obj).addClass('active');
            $(obj).parent().find('.form-notch-middle').css('width', 100);
          }
        }
        obj.triggerHandler('change');
        break;
      case 'checkbox':
        obj.each(function () {
          if (typeof (value) === 'string' || typeof (value) === 'number') {
            // single
            if ($(this).val().toString() === value.toString()) {
              $(this).prop('checked', true);
            } else {
              $(this).prop('checked', false);
            }
          } else if (typeof (value) === 'object') {
            // multiple
            $(this).prop('checked', false);
            for (var i in value) {
              if ($(this).val().toString() === value[i].toString()) {
                $(this).prop('checked', true);
              }
            }
          }
        });
        break;
      case 'select-multiple':
        $(this).find('option').each(function () {
          $(this).prop('selected', false);
          if (typeof (value) === 'object') {
            // multiple
            for (var i in value) {
              if ($(this).val().toString() === value[i].toString() || $(this).text() === value[i].toString()) {
                $(this).prop('selected', true);
              }
            }
          } else if ($(this).val().toString() === value.toString()) {
            $(this).prop('selected', true);
          }
        });
        break;
      case 'radio':
        obj.each(function () {
          if ($(this).val().toString() === value.toString()) {
            $(this).prop('checked', true);
          }
        });
        break;
      case 'textarea':
        obj.val(value);
        if ($(obj).parent().hasClass('form-outline')) {
          if (value != '') {
            $(obj).addClass('active');
            $(obj).parent().find('.form-notch-middle').css('width', 100);
          }
        }
        break;
      default:
        console.error('unknown type: ' + type);
        break;
    }
    //obj.change();
  });
}
const headerMenuLongText = function () {
  const $autoNav = $("#menu-header");
  const $autoNavWidth = $autoNav.height();
  if ($autoNavWidth > 48) {
    if ($('#autoNavMore').length) {
      var $autoNavMore = $('#autoNavMore');
      var $autoNavMoreList = $('#autoNavMoreList');
    } else {
      var $autoNavMore = $(`<li id="autoNavMore" class="d-flex align-items-center">
      <i class="fas fa-plus-square more-btn fs-5"></i>
      </li>`);
      var $autoNavMoreList = $(`<ul id="autoNavMoreList" class="auto-nav-more-list"></ul>`);
      $autoNavMore.append($autoNavMoreList);
      $autoNav.append($autoNavMore);
    }
    $autoNav.find('li.nav-item:nth-child(' + $autoNav.find('li.nav-item:not(#autoNavMoreList li.nav-item)').length + ')').prependTo($autoNavMoreList);
    headerMenuLongText();
  }
}
const headerMenuClick = function (pathname, name) {
  $('body').attr('name', name);
  $('#menu-header').find('.nav-item').removeClass('active');
  $('#menu-header').find("[data-model='" + name + "']").addClass('active');
  $('#breadcrumb').text($('#menu-header').find("[data-model='" + name + "']").attr('title'))
  $('#menu-header').on('click', '.nav-item:not(.newPage)', function () {
    window.location.href = pathname + '?name=' + $(this).attr('data-model');
  });
  $('#menu-header').on('mousedown', '.nav-item:not(.newPage)', function (event) {
    switch (event.which) {
      case 2:
        var url = pathname + '?name=' + $(this).attr('data-model');
        var win = window.open(url, '_blank');
        win.focus();
        break;
      case 3:
        var url = pathname + '?name=' + $(this).attr('data-model');
        var win = window.open(url, '_blank');
        win.focus();
        break;
    }
  });
}
const customBtn = function (url) {
  $('#homeMenu').on('click', this, function () {
    window.location.href = url + '/HomeMenu.aspx';
  });
  $('#ferme').on('click', this, function () {
    window.location.href = url + '/ModeleDossier.aspx';
  });
}
const loader = function () {
  $('body').append(`<div id="loader-wrapper">
  <div id="loader"></div>
  <div class="loader-section section-left"></div>
  <div class="loader-section section-right"></div>
</div>`);
}
const optionDatePicker = {
  type: 'date',
  monthFirst: false,
  formatter: {
    date: function (date, settings) {
      if (!date) return '';
      var day = date.getDate();
      var month = date.getMonth() + 1;
      var year = date.getFullYear();
      return day + '/' + month + '/' + year;
    }
  },
  text: {
    days: 'Di_Lu_Ma_Me_Je_Ve_Sa'.split('_'),
    months: 'janvier_février_mars_avril_mai_juin_juillet_août_septembre_octobre_novembre_décembre'.split('_'),
    monthsShort: 'janv._févr._mars_avr._mai_juin_juil._août_sept._oct._nov._déc.'.split('_'),
    today: "aujourd'hui",
    now: 'à présent',
    am: 'am',
    pm: 'pm'
  }
}
const optionDataTable = {
  language: {
    searchBuilder: {
      add: '+',
      condition: 'Comparator',
      clearAll: '<i class="fa-solid fa-rotate-right"></i>',
      delete: '<i class="fa-solid fa-trash"></i>',
      deleteTitle: 'Delete Title',
      data: 'Column',
      left: 'Left',
      leftTitle: 'Left Title',
      logicAnd: '&&',
      logicOr: '||',
      right: 'Right',
      rightTitle: 'Right Title',
      title: {
        0: 'Filters',
        _: 'Filters (%d)'
      },
      value: 'Option',
      valueJoiner: 'et',
      button: '<i class="fa-solid fa-filter"></i>',
    },
    url: "vendors/DataTables/i18n/French.json",
  },

  buttons: [
    'searchBuilder'
  ],
  dom: 'Bfrtip',
  select: {
    toggleable: false
  },
  deferRender: false,
  scrollY: 500,
  scrollCollapse: true,
  scroller: true,
  stateSave: true
}


jQuery.fn.extend({
  setVal: function (value) {
    $(this).val(value);
    if (value != '') {
      $(this).addClass('active');
      $(this).parent().find('.form-notch-middle').css('width', 100);
    }
  },
  setChecked: function (value) {
    $(this).prop('checked', value)
  },
  setReadonly: function (value) {
    $(this).prop('readonly', value)
  },
  setDisabled: function (value) {
    $(this).prop('disabled', value)
  },
  rangeDate: function (opt) {
    $(this[0]).calendar({
      ...optionDatePicker,
      ...opt,
      endCalendar: $(this[1])
    });
    $(this[1]).calendar({
      ...optionDatePicker,
      ...opt,
      startCalendar: $(this[0])
    });
  },
  inputDate: function (opt) {
    $(this).calendar({
      ...optionDatePicker,
      ...opt,
    });
  },
  setDate: function (value, change = false) {
    console.log(value)
    $(this).calendar("set date", moment(value).toDate(), true, change);
  },
  getDate: function () {
    return moment($(this).calendar("get date")).startOf('day').toDate();
  },
  randerTable: function (columns_title, data, opt) {
    $(this).html('');
    $(this).append('<table class="display responsive nowrap" style="width:100%"></table>');
    let table = $(this).find('table').DataTable({
      data: data,
      columns: columns_title,
      ...optionDataTable,
      ...opt
    })
    return table;
  },
  forEach: function (in_callback, in_optional_pause_ms) {
    if (!in_optional_pause_ms) in_optional_pause_ms = 10; // default
    return jQuery.forEach(this, in_optional_pause_ms, in_callback); // run it
  }
})
moment.locale('fr', {
  months: 'janvier_février_mars_avril_mai_juin_juillet_août_septembre_octobre_novembre_décembre'.split('_'),
  monthsShort: 'janv._févr._mars_avr._mai_juin_juil._août_sept._oct._nov._déc.'.split('_'),
  monthsParseExact: true,
  weekdays: 'dimanche_lundi_mardi_mercredi_jeudi_vendredi_samedi'.split('_'),
  weekdaysShort: 'dim._lun._mar._mer._jeu._ven._sam.'.split('_'),
  weekdaysMin: 'Di_Lu_Ma_Me_Je_Ve_Sa'.split('_'),
  weekdaysParseExact: true,
  longDateFormat: {
    LT: 'HH:mm',
    LTS: 'HH:mm:ss',
    L: 'DD/MM/YYYY',
    LL: 'D MMMM YYYY',
    LLL: 'D MMMM YYYY HH:mm',
    LLLL: 'dddd D MMMM YYYY HH:mm'
  },
  calendar: {
    sameDay: '[Aujourd’hui à] LT',
    nextDay: '[Demain à] LT',
    nextWeek: 'dddd [à] LT',
    lastDay: '[Hier à] LT',
    lastWeek: 'dddd [dernier à] LT',
    sameElse: 'L'
  },
  relativeTime: {
    future: 'dans %s',
    past: 'il y a %s',
    s: 'quelques secondes',
    m: 'une minute',
    mm: '%d minutes',
    h: 'une heure',
    hh: '%d heures',
    d: 'un jour',
    dd: '%d jours',
    M: 'un mois',
    MM: '%d mois',
    y: 'un an',
    yy: '%d ans'
  },
  dayOfMonthOrdinalParse: /\d{1,2}(er|e)/,
  ordinal: function (number) {
    return number + (number === 1 ? 'er' : 'e');
  },
  meridiemParse: /PD|MD/,
  isPM: function (input) {
    return input.charAt(0) === 'M';
  },
  meridiem: function (hours, minutes, isLower) {
    return hours < 12 ? 'PD' : 'MD';
  },
  week: {
    dow: 1, // Monday is the first day of the week.
    doy: 4 // Used to determine first week of the year.
  }
});
jQuery.forEach = function (in_array, in_pause_ms, in_callback) {
  if (!in_array.length) return; // make sure array was sent

  var i = 0; // starting index

  bgEach(); // call the function

  function bgEach() {
    if (in_callback.call(in_array[i], i, in_array[i]) !== false) {
      i++; // move to next item

      if (i < in_array.length) setTimeout(bgEach, in_pause_ms);
    }
  }

  return in_array; // returns array
};
// jQuery.fn.dataTable.Api.register('sum()', function () {
//   return this.flatten().reduce(function (a, b) {
//     if (typeof a === 'string') {
//       a = a.replace(/[^\d.-]/g, '') * 1;
//     }
//     if (typeof b === 'string') {
//       b = b.replace(/[^\d.-]/g, '') * 1;
//     }

//     return a + b;
//   }, 0);
// });
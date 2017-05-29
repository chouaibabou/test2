function initSelect() {
    $('.multi-select').multiSelect({
        selectableHeader: "<input type='text' class='form-control search-input' autocomplete='off' placeholder='" + Translator.trans('backoffice.common.search') + "...'>",
        selectionHeader: "<input type='text' class='form-control search-input' autocomplete='off' placeholder='" + Translator.trans('backoffice.common.search') + "...'>",
        selectableFooter: "<div style='width: 100%;text-align: center;'>" + Translator.trans('backoffice.common.add') + " <i class='fa fa-arrow-circle-right'></i></div>",
        selectionFooter: "<div style='width: 100%;text-align: center;'><i class='fa fa-arrow-circle-left'></i> "  + Translator.trans('backoffice.common.remove') + "</div>",
        afterInit: function(ms){
            var that = this,
                $selectableSearch = that.$selectableUl.prev(),
                $selectionSearch = that.$selectionUl.prev(),
                selectableSearchString = '#'+that.$container.attr('id')+' .ms-elem-selectable:not(.ms-selected)',
                selectionSearchString = '#'+that.$container.attr('id')+' .ms-elem-selection.ms-selected';

            that.qs1 = $selectableSearch.quicksearch(selectableSearchString)
                .on('keydown', function(e){
                    if (e.which === 40){
                        that.$selectableUl.focus();
                        return false;
                    }
                });

            that.qs2 = $selectionSearch.quicksearch(selectionSearchString)
                .on('keydown', function(e){
                    if (e.which == 40){
                        that.$selectionUl.focus();
                        return false;
                    }
                });
        },
        afterSelect: function(values){
            this.qs1.cache();
            this.qs2.cache();
            if ($(this.$element).hasClass('launchAjax')) { launchAjax('add', $(this.$element).data('key'), values, $(this.$element).data('url')); }

            //prevent launching ajax when calling multiselect select_all or deselect_all
            var launch = values ? values.length == 1 : 0;
            if ($(this.$element).hasClass('launchAjaxActu')) { launchAjaxActu('add', $(this.$element).data('key'), values, $(this.$element).data('url'), launch); }
        },
        afterDeselect: function(values){
            this.qs1.cache();
            this.qs2.cache();
            if ($(this.$element).hasClass('launchAjax')) { launchAjax('remove', $(this.$element).data('key'), values, $(this.$element).data('url')); }

            var launch = values ? values.length == 1 : 0;
            if ($(this.$element).hasClass('launchAjaxActu')) { launchAjaxActu('remove', $(this.$element).data('key'), values, $(this.$element).data('url'), launch); }
        }
    });
}

initSelect();
var list = {
        dep: [],
        livres: [],
        produits: [],
        roles: [],
    },
    lockedRaff = [],
    locks = [],
    $selectLivre = $('#app_form_raffinerie_chargement_compteLivre'),
    $selectPdt = $('#app_form_raffinerie_chargement_produit'),
    $selectRaff = $('#app_form_raffinerie_chargement_raffinerieBackup');
    $selectDos = $('#app_user_form_affectation_comptesDo');
    $selectsLivres = $('[id^=app_user_form_affectation_comptesLivre]');
    $selectTrans = $('#app_user_form_affectation_transporteurs');

window.launchAjax = function (action, key, value, urlReq) {
    if (action === 'add') {
        if(key=='roles'){
            list[key] = $('#app_user_form_affectation_roleToSelect').val();
        } else {
            $.each(value, function (cpt, item) { list[key].push(parseInt(item, 10));});
        }
    } else {
        if(key=='roles'){
            list[key] = $('#app_user_form_affectation_roleToSelect').val();
        } else {
            $.each(value, function (cpt, item) {
                var index = list[key].indexOf(parseInt(item, 10));
                if (index > -1) { list[key].splice(index, 1); }
            });
        }
    }

    $.ajax({
        url: urlReq,
        type: 'POST',
        data: { 'data': list[key] }
    }).done(function (data) {
        switch (data.select) {
        case 'compteLivre':
            $selectLivre.empty();
            var livres = [];
            $.each(data.list, function (key, item) {
                livres.push(item.id);
                $selectLivre.append('<option value="' + item.id + '" selected="selected">' + item.name + '</option>');
            });
            $selectLivre.multiSelect('destroy');
            launchAjax('add', 'livres', livres, $selectLivre.data('url'));
            break;
        case 'produit':
            $selectPdt.empty();
            $.each(data.list, function (key, item) {
                $selectPdt.append('<option value="' + item.id + '">' + item.name + '</option>');
            });
            $selectPdt.multiSelect('destroy');
            break;
        case 'msToDeselect':
            if(data.list.indexOf('transporteurs') > -1) {
                $selectTrans.multiSelect('deselect_all');
                $selectTrans.parent().parent().hide();
            }
            if(data.list.indexOf('comptesDo') > -1) {
                $selectDos.multiSelect('deselect_all');
                $selectDos.parent().parent().hide();
            }
            if(data.list.indexOf('comptesLivre') > -1) {
                $.each($selectsLivres, function (key, select) {
                    $(select).multiSelect('deselect_all');
                    $(select).parent().parent().hide();
                });
                $selectDos.multiSelect('deselect_all');
                $selectDos.parent().parent().hide();
            }
        default:
            $selectRaff.empty();
            lockedRaff = [];
            locks = data.blocages;
            $.each(data.list, function (key, item) {
                if (item.locked === 1) {
                    lockedRaff.push(item.id);
                    $selectRaff.append('<option value="' + item.id + '">' + item.name + '</option>');
                } else {
                    $selectRaff.append('<option value="' + item.id + '">' + item.name + '</option>');
                }
            });
            $selectRaff.multiSelect('destroy');
            break;
        }

        initSelect();
    });
};

window.launchAjaxActu = function (action, key, value, urlReq, launch) {
    var $selectRole = $('#app_form_actualite_roleToSelect'),
        $selectDo = $('#app_form_actualite_comptesDo'),
        $selectSecteur = $('#app_form_actualite_secteurs'),
        $selectLivre = $('#app_form_actualite_comptesLivre'),
        $selectTrans = $('#app_form_actualite_transporteurs'),
        datalist = {
            comptesDoSelected: {},
            secteursSelected: {},
            comptesLivreSelected: {},
            roles: {},
        },
        comptesDoSelected = $selectDo.find('option:selected'),
        secteursSelected = $selectSecteur.find('option:selected'),
        comptesLivreSelected = $selectLivre.find('option:selected');

    if (action === 'add') {
        if(key=='roles'){
            var top = $('html').scrollTop();

            datalist[key] = $selectRole.val();
            $selectDo.closest('.form-group').addClass('hidden');
            $selectSecteur.closest('.form-group').addClass('hidden');
            $selectLivre.closest('.form-group').addClass('hidden');
            $selectTrans.closest('.form-group').addClass('hidden');
            if (datalist[key] && $(datalist[key]).filter(["ROLE_APPROVISIONNEUR", "ROLE_ACHETEUR", "ROLE_ACHETEUR_CENTRAL"]).length > 0) {
                $selectDo.closest('.form-group').removeClass('hidden');
                $selectSecteur.closest('.form-group').removeClass('hidden');
                $selectLivre.closest('.form-group').removeClass('hidden');
                $selectDo.multiSelect('select_all');
                $selectSecteur.multiSelect('select_all');
                $selectLivre.multiSelect('select_all');
            }
            if (datalist[key] && $(datalist[key]).filter(["ROLE_TRANSPORTEUR", "ROLE_COORDINATEUR_TRANSPORTEUR"]).length > 0) {
                $selectTrans.closest('.form-group').removeClass('hidden');
                $selectTrans.multiSelect('select_all');
            }

            $('html').scrollTop(top);
        } else {
            if (comptesDoSelected.length > 0) {
                $.each(comptesDoSelected, function (cpt, item) { datalist['comptesDoSelected'][$(item).val()] = $(item).text();});
            }
            if (secteursSelected.length > 0) {
                $.each(secteursSelected, function (cpt, item) { datalist['secteursSelected'][$(item).val()] = $(item).text();});
            }
            if (comptesLivreSelected.length > 0) {
                $.each(comptesLivreSelected, function (cpt, item) { datalist['comptesLivreSelected'][$(item).val()] = $(item).text();});
            }
        }
    } else {
        if(key=='roles'){
            datalist[key] = $selectRole.val();
            $selectDo.closest('.form-group').addClass('hidden');
            $selectSecteur.closest('.form-group').addClass('hidden');
            $selectLivre.closest('.form-group').addClass('hidden');
            $selectTrans.closest('.form-group').addClass('hidden');
            if (datalist[key] && $(datalist[key]).filter(["ROLE_APPROVISIONNEUR", "ROLE_ACHETEUR", "ROLE_ACHETEUR_CENTRAL"]).length > 0) {
                $selectDo.closest('.form-group').removeClass('hidden');
                $selectSecteur.closest('.form-group').removeClass('hidden');
                $selectLivre.closest('.form-group').removeClass('hidden');
            } else {
                $selectDo.multiSelect('deselect_all');
                $selectSecteur.multiSelect('deselect_all');
                $selectLivre.multiSelect('deselect_all');
            }
            if (datalist[key] && $(datalist[key]).filter(["ROLE_TRANSPORTEUR", "ROLE_COORDINATEUR_TRANSPORTEUR"]).length > 0) {
                $selectTrans.closest('.form-group').removeClass('hidden');
            } else {
                $selectTrans.multiSelect('deselect_all');
            }
        } else {
            if (comptesDoSelected.length > 0) {
                $.each(comptesDoSelected, function (cpt, item) { datalist['comptesDoSelected'][$(item).val()] = $(item).text();});
            }
            if (secteursSelected.length > 0) {
                $.each(secteursSelected, function (cpt, item) { datalist['secteursSelected'][$(item).val()] = $(item).text();});
            }
            if (comptesLivreSelected.length > 0) {
                $.each(comptesLivreSelected, function (cpt, item) { datalist['comptesLivreSelected'][$(item).val()] = $(item).text();});
            }
        }
    }

    if (key!='roles' && launch) {
        $.ajax({
            url: urlReq,
            type: 'POST',
            data: { 'data': datalist }
        }).done(function (data) {
            // ajax request failed
            if (data[0] === '<') {
                window.location = '/login';
            }
            $selectLivre.empty();
            $selectSecteur.empty();
            $.each(data.comptesLivre, function (key, item) {
                $selectLivre.append('<option value="' + key + '">' + item + '</option>');
            });
            $.each(data.secteurs, function (key, item) {
                $selectSecteur.append('<option value="' + key + '">' + item + '</option>');
            });
            if (Object.keys(data.comptesLivreSelected).length > 0) {
                $selectLivre.val(Object.keys(data.comptesLivreSelected));
            }
            if (Object.keys(data.secteursSelected).length > 0) {
                $selectSecteur.val(Object.keys(data.secteursSelected));
            }
            $selectLivre.multiSelect('refresh');
            $selectSecteur.multiSelect('refresh');

            initSelect();
        });
    }


};

// rendre les champs 'date début', 'date fin' et 'motif' required quand la 'raffinerie chargement' et la 'raffinerie ref' sont différents
$('.select-raff').on('change', function () {
    window.checkRefineries();
    if ($(this).attr('id').contains('raffinerie_chargement_appro')){
        window.checkRaffinerieAndRaffRef();
    };
});

window.checkRaffinerieAndRaffRef = function () {
    $selectRaff = $('#app_form_raffinerie_chargement_appro_raffinerieBackup');
    $selectRaffRef = $('#app_form_raffinerie_chargement_appro_raffinerieRef');

    var raff = parseInt($selectRaff.val(), 10),
        raffRef = parseInt($selectRaffRef.val(), 10);

    $rRefModifDateDebut = $('#app_form_raffinerie_chargement_appro_rRefModifDateDebut');
    $rRefModifDateFin = $('#app_form_raffinerie_chargement_appro_rRefModifDateFin');
    $rRefModifMotif = $('#app_form_raffinerie_chargement_appro_rRefModifMotif');

    $rRefModifDateDebutLabel = $("label[for='app_form_raffinerie_chargement_appro_rRefModifDateDebut']");
    $rRefModifDateFinLabel = $("label[for='app_form_raffinerie_chargement_appro_rRefModifDateFin']");
    $rRefModifMotifLabel = $("label[for='app_form_raffinerie_chargement_appro_rRefModifMotif']");

    if (raff != raffRef){
        $rRefModifDateDebut.prop('required', true);
        $rRefModifDateFin.prop('required', true);
        $rRefModifMotif.prop('required', true);

        $rRefModifDateDebutLabel.find('span').remove();
        $rRefModifDateDebutLabel.append('<span style="color: red;"> * </span>');
        $rRefModifDateFinLabel.find('span').remove();
        $rRefModifDateFinLabel.append('<span style="color: red;"> * </span>');
        $rRefModifMotifLabel.find('span').remove();
        $rRefModifMotifLabel.append('<span style="color: red;"> * </span>');
    } else {
        $rRefModifDateDebut.prop('required', false);
        $rRefModifDateFin.prop('required', false);
        $rRefModifMotif.prop('required', false);

        $rRefModifDateDebutLabel.find('span').remove();
        $rRefModifDateFinLabel.find('span').remove();
        $rRefModifMotifLabel.find('span').remove();
    }
};

if(Object.keys($('#app_form_raffinerie_chargement_appro_raffinerieBackup')).length === 0){
    window.checkRaffinerieAndRaffRef();
}

window.checkRefineries = function () {
    var $alert = $('.alert-danger');

    $alert.addClass('hidden');

    $.each($('.select-raff'), function () {
        var $this = $(this);

        if ($.inArray(parseInt($this.val(), 10), lockedRaff) > -1) {
            $alert.removeClass('hidden');
            $alert.find('.raff').text($this.find('option:selected').text());

            $.each(locks, function (key, item) {
                if (item.idRaffinerie !== parseInt($this.val(), 10)) { return true; }
                $alert.find('.debut').text(item.lockDateDebut);
                $alert.find('.fin').text(item.lockMessageDateFin);
            });
        }
    });
};

/* handle "app_form_raffinerie_chargement_appro" select product change */
(function(){
    $('.select').change(function(){
        $that = $(this);
        if ($that.hasClass('launchAjax')) {
            $url = $that.data('url');
            $data = $that.find(":selected").val();
            var raff = $that.data('raffb'),
                raffRef = $that.data('raffref');
            $.ajax({
                url: $url,
                type: 'POST',
                data: { 'data': $data }
            }).done(function (data) {
                lockedRaff = [];
                locks = data.blocages;
                $selectRaff = $("#app_form_raffinerie_chargement_appro_raffinerieBackup");/*$that.closest('.form-group').next().find('select');*/
                $selectRaffRef = $("#app_form_raffinerie_chargement_appro_raffinerieRef");
                $selectRaff.empty();
                $selectRaffRef.empty();
                $.each(data.list, function (key, item) {
                    if (item.locked === 1) { lockedRaff.push(item.id); }
                    var selected = ($that.hasClass('edit')) ? 'selected="selected"' : '';
                    $selectRaff.append('<option value="' + item.id + '"' + ((item.id == raff) ? selected : '') + '>' + item.name + '</option>');
                    $selectRaffRef.append('<option value="' + item.id + '"' + ((item.id == raffRef) ? selected : '') + '>' + item.name + '</option>');
                });
                window.checkRefineries();
            });
        }
    }).change();
    $('.hideform').closest('.form-group').addClass('hidden');
})();

$('.timepicker-24').timepicker({
    autoclose: true,
    minuteStep: 1,
    showSeconds: false,
    showMeridian: false
});

tinymce.init({
    force_br_newlines : true,
    force_p_newlines : false,
    forced_root_block : false,
    selector: "textarea.tinymce",
    theme: "modern",
    language : window.locale + '_' + window.country.toUpperCase(),
    plugins: [
        "link",
    ],
    menubar: "edit table format insert",
    toolbar: "undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link"
});

tinymce.init({
    force_br_newlines : true,
    force_p_newlines : false,
    forced_root_block : false,
    selector: "textarea.tinymcemin",
    theme: "modern",
    language : window.locale + '_' + window.country.toUpperCase(),
    plugins: [
        "textcolor",
        "link"
    ],
    setup : function (ed) {
        ed.on('change', function (e) {
            $('#app_form_blocage_raffinerie_produit_message').val(ed.getContent());
        });
   },
    menubar: "",
    toolbar: "undo redo | fontselect | fontsizeselect | forecolor | bold italic underline | link ",
});

$('#nav-accordion').dcAccordion({
    eventType: 'click',
    autoClose: true,
    saveState: true,
    disableLink: true,
    speed: 'fast',
    showCount: false,
    autoExpand: true,
    // cookie: 'dcjq-accordion-1',
    classExpand: 'dcjq-current-parent'
});

var format = 'dd/mm/yyyy';
if (window.country == 'GB') {
    format = 'dd/mm/yyyy';
}
$('.dpYears').datepicker({
    format: format,
    language: window.locale,
    viewMode: 'days',
    autoclose: true
    // orientation: "top auto"
});

$('#deleteButton').on('click', function(e){
    e.preventDefault();
    var content = null;
     content = $('#deleteForm').attr('data-content');

    if(content === null) {
        content = Translator.trans('backoffice.common.confirm_deletion');
    }

    $("#deleteModal").modal();
    $("#deleteModal .modal-body").html(content);
    $("#deleteModal .modal-footer .btn-danger").on('click', function(){
        $('#deleteForm').submit();
    });
});

$('input[data-class="checkValue"]').on('blur', function () {
    var $this = $(this),
        minVal = parseFloat($this.data('min')),
        maxVal = parseFloat($this.data('max')),
        value = parseFloat($this.val());

    checkValues($this, minVal, maxVal, value);
});

function checkValues (domElement, minVal, maxVal, value) {
    var $this = $(domElement);

    $this.siblings('p').remove();

    if (window.country!='GB') {
        if (value < minVal || value > maxVal) {
            $this.closest('.form-group').addClass('has-error');
            // (value < minVal) ? $this.val(minVal) : $this.val(maxVal);
            if ($this.data('unit') && $this.data('unit') == 'dollar') {
                $this.after('<p class="text-danger">' + Translator.trans('backoffice.fixed_price_config.margin_value_interval') + ' ' + minVal + ' $/t et ' + maxVal + ' $/t</p>');
            } else {
                $this.after('<p class="text-danger">' + Translator.trans('backoffice.fixed_price_config.margin_value_interval') + ' ' + minVal + ' ' + Translator.trans('language.currency_symbol') + '/t ' + Translator.trans('language.and') + ' ' + maxVal + ' ' + Translator.trans('language.currency_symbol') + '/t</p>');
            }
        } else {
            $this.closest('.form-group').removeClass('has-error');
        }
    }
}

var valid = false;

$('.checkBeforeSubmit').closest('form').on('submit', function (e) {
    if (!valid) {
        e.preventDefault();

        // var $form = $(this).closest('form'),
        var $form = $(this),
            $inputToCheck = $form.find('input[data-class="checkValue"]');

        $.each($inputToCheck, function () {
            var $this = $(this),
                minVal = parseFloat($this.data('min')),
                maxVal = parseFloat($this.data('max')),
                value = parseFloat($this.val());

            checkValues($this, minVal, maxVal, value);
        });

        if ($form.find('p.text-danger').length === 0) {
            valid = true;
            $form.submit();
        }
    } else {
        valid = false;
    }
});


var validform = false;

$('.checkInputsBeforeSubmit').closest('form').on('submit', function (e) {
    if (!validform) {
        e.preventDefault();

        var $form = $(this),
            $inputRequiredToCheck = $form.find('input[data-class="checkRequiredValue"]');

        $.each($inputRequiredToCheck, function () {
            var $this = $(this),
                valField = $this.val(),
                requiredField = $this.prop('required');
            if (valField == '' && requiredField) {
                $this.closest('.form-group').addClass('has-error');
            } else {
                $this.closest('.form-group').removeClass('has-error');
            }
        });

        if ($form.find('.has-error').length === 0) {
            validform = true;
            $form.submit();
        }
    } else {
        validform = false;
    }
});

$('.select-search').select2();

// rendre le champ 'date début du blocage' required quand la case 'Activer blocage' est cochée
$('#app_form_blocage_raffinerie_produit_lockActivation').on('change', function () {
     window.checkBlocageRaff();
});

window.checkBlocageRaff = function () {
    $checkBlocage = $('#app_form_blocage_raffinerie_produit_lockActivation');
    var checkBlocage = $checkBlocage.is(":checked");
    $lockDateDebut = $('#app_form_blocage_raffinerie_produit_lockDateDebut');
    $lockDateDebutLabel = $("label[for='app_form_blocage_raffinerie_produit_lockDateDebut']");

    if (checkBlocage){
        $lockDateDebut.prop('required', true);
        $lockDateDebut.attr('data-class','checkRequiredValue');
        $lockDateDebutLabel.find('span').remove();
        $lockDateDebutLabel.append('<span style="color: red;"> * </span>');
    } else {
        $lockDateDebut.prop('required', false);
        $lockDateDebut.attr('data-class','');
        $lockDateDebutLabel.find('span').remove();
    }
};
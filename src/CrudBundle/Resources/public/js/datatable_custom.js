var searchWait = 0,
    searchWaitInterval;

$('.dataTables_filter input')
    .unbind('keypress keyup')
    .bind('keypress keyup', function (e) {
        var item = $(this);
        searchWait = 0;
        if (!searchWaitInterval) searchWaitInterval = setInterval(function () {
            if (searchWait>=3) {
                clearInterval(searchWaitInterval);
                searchWaitInterval = '';
                searchTerm = $(item).val();
                oTable.fnFilter(searchTerm);
                searchWait = 0;
            }
            searchWait++;
        },200);

    });

$("tfoot input")
    .unbind('keypress keyup')
    .bind('keypress keyup', function (e) {
        var item = $(this);
        searchWait = 0;
        if (!searchWaitInterval) searchWaitInterval = setInterval(function () {
            if (searchWait>=3) {
                clearInterval(searchWaitInterval);
                searchWaitInterval = '';
                oTable.fnFilter(item.val(), item.data('column'));
                searchWait = 0;
            }
            searchWait++;
        }, 200);
    });

$("tfoot input").each(function (i) {
    asInitVals[i] = this.value;
});

$("tfoot input").focus(function () {
    if (this.className === 'search_init') {
        this.className = '';
        this.value = '';
    }
});

$("tfoot input").blur(function (i) {
    if (this.value === '') {
        this.className = 'search_init';
        this.value = asInitVals[$('tfoot input').index(this)];
    }
});
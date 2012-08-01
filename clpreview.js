// Extract the actual posting link
var parent;
var i;
var index;
var p_span;
var imgs;
var link;

function visible($row) {
    var w = $(window);
    
    var windowTop = w.scrollTop();
    var windowBottom = windowTop + w.height();
    
    var rowTop = $row.offset().top;
    
    if ( windowTop < rowTop && windowBottom > rowTop ) {
        return true;
    } else {
        return false;
    }
}

function appendImage($row, src) {
    $row.append('<img src="'+src+'" width="200px" height="auto" style="margin:2px;"/>');
}

function getImages($row) {
    /* Get link to actual post */
    link = $row.children('a').attr('href');

    /* AJAX to get the images */
    $.ajax({
        async: true,
        type: 'GET',
        dataType: 'html',
        url: link,
        timeout: 1000,
        success: function(data) {
            var result = jQuery(data);
            if ( 0 == result.find('#iwt').length ) {
                if ( 0 == result.find('#iwi').length ) {
                    /* Inline image(s) */
                    imgs = result.find('img');
                    imgs.each(function(index) {
                        img = $(this).attr('src');
                        appendImage($row, img);
                    });
                } else {
                    /* If single image */
                    img = result.find('#iwi').attr('src');
                    appendImage($row, img);
                }
            } else {
                /* If multiple images */
                imgs = result.find('#iwt > .tn');
                imgs.each(function(index) {
                    img = $(this).find('a').attr('href');
                    appendImage($row, img);
                });
            }
        },
    });
}

/* Get all span.itempx with children
 * i.e. Not empty, contains images
 */
$('span.itempx > *').each(function(i) {

    /* Get ancestor row */
    parent = $(this).parents('p.row');
    //parent = $($('span.itempx > *')[0]).parents('p.row');

    /* TODO: Refactor visible check,
     * we don't want to compute window dims every time.
     * Maybe do 5 at a time??
     */    
    //if ( visible(parent) ) {
        setTimeout(getImages, 0, parent);
    //}
    
});


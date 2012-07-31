// Extract the actual posting link
var parent;
var i;
var index;
var p_span;
var imgs;
var link;

function getImages($row) {
    /* Get link to actual post */
    link = $row.children('a').attr('href');

    /* AJAX to get the images */
    $.ajax({
        async: false,
        type: 'GET',
        dataType: 'html',
        url: link,
        timeout: 1000,
        success: function(data) {
            var result = jQuery(data);
            if ( 0 == result.find('#iwt').length ) {
                /* If single image */
                img = result.find('#iwi').attr('src');
                $row.append('<img src="'+img+'" width="200px" height="auto" style="margin:2px;"/>');
            } else {
                /* If multiple images */
                imgs = result.find('#iwt > .tn');
                imgs.each(function(index) {
                    img = $(this).find('a').attr('href');
                    $row.append('<img src="'+img+'" width="200px" height="auto" style="margin:2px;"/>');
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
    
    setTimeout(getImages, 0, parent);
    
});


// Extract the actual posting link
var parent;
var i;
var index;
var p_span;
var imgs;
var link;

$('span.p').each(function(i) {
  parent = $(this).parent();
  link = parent.children('a').attr('href');

  $.ajax({
    async: false,
    type: 'GET',
    dataType: 'html',
    url: link,
    timeout: 1000,
    success: function(data) {
      var result = jQuery(data);
      imgs = result.find('img');
      imgs.each(function(index) {
        img = $(this);
        parent.append('<img src="'+img.attr('src')+'" width="200px" style="margin:2px;"/>');
      });
    },
  });

});


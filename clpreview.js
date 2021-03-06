/*
    tabSlideOUt v1.3
    
    By William Paoli: http://wpaoli.building58.com

    To use you must have an image ready to go as your tab
    Make sure to pass in at minimum the path to the image and its dimensions:
    
    example:
    
        $('.slide-out-div').tabSlideOut({
                tabHandle: '.handle',                         //class of the element that will be your tab -doesnt have to be an anchor
                pathToTabImage: 'images/contact_tab.gif',     //relative path to the image for the tab
                imageHeight: '133px',                         //height of tab image
                imageWidth: '44px',                           //width of tab image   
        });

    or you can leave out these options
    and set the image properties using css
    
*/


(function($){
    $.fn.tabSlideOut = function(callerSettings) {
        var settings = $.extend({
            tabHandle: '.handle',
            speed: 300, 
            action: 'click',
            tabLocation: 'left',
            topPos: '200px',
            leftPos: '20px',
            fixedPosition: false,
            positioning: 'absolute',
            pathToTabImage: null,
            imageHeight: null,
            imageWidth: null,
            onLoadSlideOut: false                       
        }, callerSettings||{});

        settings.tabHandle = $(settings.tabHandle);
        var obj = this;
        if (settings.fixedPosition === true) {
            settings.positioning = 'fixed';
        } else {
            settings.positioning = 'absolute';
        }
        
        //ie6 doesn't do well with the fixed option
        if (document.all && !window.opera && !window.XMLHttpRequest) {
            settings.positioning = 'absolute';
        }
        

        
        //set initial tabHandle css
        
        if (settings.pathToTabImage != null) {
            settings.tabHandle.css({
            'background' : 'url('+settings.pathToTabImage+') no-repeat',
            'width' : settings.imageWidth,
            'height': settings.imageHeight
            });
        }
        
        settings.tabHandle.css({ 
            'display': 'block',
            'textIndent' : '-99999px',
            'outline' : 'none',
            'position' : 'absolute'
        });
        
        obj.css({
            'line-height' : '1',
            'position' : settings.positioning
        });

        
        var properties = {
                    containerWidth: parseInt(obj.outerWidth(), 10) + 'px',
                    containerHeight: parseInt(obj.outerHeight(), 10) + 'px',
                    tabWidth: parseInt(settings.tabHandle.outerWidth(), 10) + 'px',
                    tabHeight: parseInt(settings.tabHandle.outerHeight(), 10) + 'px'
                };

        //set calculated css
        if(settings.tabLocation === 'top' || settings.tabLocation === 'bottom') {
            obj.css({'left' : settings.leftPos});
            settings.tabHandle.css({'right' : 0});
        }
        
        if(settings.tabLocation === 'top') {
            obj.css({'top' : '-' + properties.containerHeight});
            settings.tabHandle.css({'bottom' : '-' + properties.tabHeight});
        }

        if(settings.tabLocation === 'bottom') {
            obj.css({'bottom' : '-' + properties.containerHeight, 'position' : 'fixed'});
            settings.tabHandle.css({'top' : '-' + properties.tabHeight});
            
        }
        
        if(settings.tabLocation === 'left' || settings.tabLocation === 'right') {
            obj.css({
                'height' : properties.containerHeight,
                'top' : settings.topPos
            });
            
            settings.tabHandle.css({'top' : 0});
        }
        
        if(settings.tabLocation === 'left') {
            obj.css({ 'left': '-' + properties.containerWidth});
            settings.tabHandle.css({'right' : '-' + properties.tabWidth});
        }

        if(settings.tabLocation === 'right') {
            obj.css({ 'right': '-' + properties.containerWidth});
            settings.tabHandle.css({'left' : '-' + properties.tabWidth});
            
            $('html').css('overflow-x', 'hidden');
        }

        //functions for animation events
        
        settings.tabHandle.click(function(event){
            event.preventDefault();
        });
        
        var slideIn = function() {
            
            if (settings.tabLocation === 'top') {
                obj.animate({top:'-' + properties.containerHeight}, settings.speed).removeClass('open');
            } else if (settings.tabLocation === 'left') {
                obj.animate({left: '-' + properties.containerWidth}, settings.speed).removeClass('open');
            } else if (settings.tabLocation === 'right') {
                obj.animate({right: '-' + properties.containerWidth}, settings.speed).removeClass('open');
            } else if (settings.tabLocation === 'bottom') {
                obj.animate({bottom: '-' + properties.containerHeight}, settings.speed).removeClass('open');
            }    
            
        };
        
        var slideOut = function() {
            
            if (settings.tabLocation == 'top') {
                obj.animate({top:'-3px'},  settings.speed).addClass('open');
            } else if (settings.tabLocation == 'left') {
                obj.animate({left:'-3px'},  settings.speed).addClass('open');
            } else if (settings.tabLocation == 'right') {
                obj.animate({right:'-3px'},  settings.speed).addClass('open');
            } else if (settings.tabLocation == 'bottom') {
                obj.animate({bottom:'-3px'},  settings.speed).addClass('open');
            }
        };

        var clickScreenToClose = function() {
            obj.click(function(event){
                event.stopPropagation();
            });
            
            $(document).click(function(){
                slideIn();
            });
        };
        
        var clickAction = function(){
            settings.tabHandle.click(function(event){
                if (obj.hasClass('open')) {
                    slideIn();
                } else {
                    slideOut();
                }
            });
            
            clickScreenToClose();
        };
        
        var hoverAction = function(){
            obj.hover(
                function(){
                    slideOut();
                },
                
                function(){
                    slideIn();
                });
                
                settings.tabHandle.click(function(event){
                    if (obj.hasClass('open')) {
                        slideIn();
                    }
                });
                clickScreenToClose();
                
        };
        
        var slideOutOnLoad = function(){
            slideIn();
            setTimeout(slideOut, 500);
        };
        
        //choose which type of action to bind
        if (settings.action === 'click') {
            clickAction();
        }
        
        if (settings.action === 'hover') {
            hoverAction();
        }
        
        if (settings.onLoadSlideOut) {
            slideOutOnLoad();
        };
        
    };
})(jQuery);





// Extract the actual posting link
var parent;
var i;
var index;
var p_span;
var imgs;
var link;

function save_options() {
  localStorage['clpreview_enable'] = document.getElementById('clpreview_enable').checked;
  // Update status to let user know options were saved.
  var status = document.getElementById('status');
  status.innerHTML = "Options Saved.";
  setTimeout(function() {
    status.innerHTML = "";
  }, 750);
}
// Restores select box state to saved value from localStorage.
function restore_options( options ) {
    /* If options aren't yet set, set them */
    if ( 'undefined' == typeof localStorage['clpreview_enable'])
        localStorage['clpreview_enable'] = true;

    /* Get the options */
    options.enable = ('true' === localStorage['clpreview_enable']);
    document.getElementById('clpreview_enable').checked = options.enable;


}

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

/* Draw the options tab */
var $tab = $('<div>').addClass('slide-out-div').attr('style', 'padding:20px;width:250px;background:#ccc;border:1px solid #29216d');
$tab.append($('<a class="handle">Content</a>'));
$tab.append($('<input type="checkbox" id="enable" name="enable" value="" /> Enable image preview<br/>'));
$('body').append($tab);

$('.slide-out-div').tabSlideOut({
    tabHandle: '.handle',
    pathToTabImage: 'http://www.woofenbark.com/images/ImagePreview.png',
    imageHeight: '200px',
    imageWidth: '40px',
    tabLocation: 'left',
    speed: 300,
    action: 'click',
    topPos: '220px',
    fixedPosition: true
});

/* Check if we're enabled */
var options = new Object();
restore_options( options );

if ( options.enable ) {
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
}




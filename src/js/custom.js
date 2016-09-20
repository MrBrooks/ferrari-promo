/**************************************/
/* Custom JavaScript files supervisor */
/**************************************/

$(document).ready(function() {

    /* Custom */

 /*    //= ./common/material-init.js */
 /*    //= ./common/google-analytics.js */
 function DynamicGrid(){
    var items = $('.dynamin-grid .item');
    items.on('click',function(){
      $(this).addClass('active').removeClass('small').siblings().removeClass('active').addClass('small');
    });
  }

  function ProductView(){
    var products = $(".product-block .item");
    // var tabs = $("#text-info .tab");
    // var popups = $(".product-block .popup");
    products.each(function(){
      var lupes = $(this).find(".lupe");
      var tabs = $(this).find(".tab");
      var popups = $(this).find(".popup");
      var close_btns = popups.find('.btn-close');
      var mores = $(this).find(".product-more");
      lupes.on('click',function(){
          $(this).toggleClass('active').siblings().removeClass('active');
          // expand(parseInt($(this).attr('data-index')));
          $(tabs.get(parseInt($(this).attr('data-index'))-1)).addClass('active').siblings().removeClass('active');
        });
      mores.on('click',function(){
        $(popups.get(parseInt($(this).attr('data-index')) - 1)).addClass('active');
      });
      close_btns.on('click',function(){
        popups.removeClass('active');
      });

    });

    function fullView(){
      tabs.each(function(){
        $(this).find('.product-more').on('click', function(){
          $('.popup[data-index=""]')
        });
      });
    }
  }
 
  DynamicGrid();
  ProductView();
  var scroll_anim = new AnimOnScroll({
    selector: '.slide-from-down',
    visible: 'active'
  });

  var sliders = $('.slider').owlCarousel({
    dotsContainer: ".slider-preview",
    items: 1
  });


  var window_updater = new WindowUpdater([
    {
      event: "scroll",
      actions: [
        scroll_anim.updateView,
        // video_play.scrollControl,
        // econtenta_pixel.checkScrollConditions
      ]
    },
    {
      event: "resize",
      actions: [
        // anim_on_scroll.updateItems,
        // full_height.update
      ]
    }
  ]);

  $(window).trigger('scroll');
});



//JS CLASSES

function WindowUpdater(opts){ 
  var self = this, timer;
  // var opt = [
  //   {
  //     event: 'scroll',
  //     actions: [] 
  //   },
  //   {
  //     event: 'resize',
  //     actions: []
  //   }s
  // ];
  self.add = function(event, func){
    for(var i = 0; i < opts.length; i++){
      if(opts[i].event === event){
        opts[i].actions.push(func);
        break;
      }
    }
  };

  self.update = function(event){
    clearTimeout(timer);
    timer = setTimeout(function(){
      // console.log(event);
      if(event.data !== null){
        for(var i = 0; i < opts[event.data].actions.length; i++){
          opts[event.data].actions[i]();
        }
      }
      //do smthng
    },10);
  };

  self.onEvents = function(){
    for(var i = 0; i < opts.length; i++){
      $(window).on(opts[i].event, i, self.update);
    }
  };

  // self.initScroll = function(){
  // };

  // self.initResize = function(){
  // };

  // self.initAll = function(){
  // };
  self.onEvents();
}

function AnimOnScroll(options){
  var def = {
    selector: ".scroll-anim",
    visible: "visible"
  };

  var self = this;
  var opt = $.extend(def, options);

  var select = $(opt.selector);
  var items = [];
  var H = $(window).height(), if_mobile = $(window).width() < 768? true : false;

  
  function isHidden(elem){
    var ws = $(window).scrollTop();
    if( (elem.top >= ws + H) || (elem.top + elem.height <= ws)){
      return true;
    }
    return false;
  }

  function isVisible(elem){
    var ws = $(window).scrollTop();
    if( ((elem.top > ws) && (elem.top < ws+H)) || (elem.top + elem.height > ws && elem.top < ws)){
      return true;
    }
    return false;
  }

  function isFullyVisible(elem){
    var ws = $(window).scrollTop();
    if(elem.top > ws && elem.top + elem.height < ws + H){
      return true;
    }
    return false;
  }

  self.updateItems = function (){
    items = [];
    H = $(window).height();
    select.each(function(){
      items.push({
        item: $(this),
        top: $(this).offset().top,
        height: $(this).height()
      });
    });
  };

  self.updateView = function(){
    for(var i = 0; i < items.length; i++){
      if(!items[i].item.hasClass(opt.visible)){
        if(isVisible(items[i])){
          items[i].item.addClass(opt.visible);
        }
      }
    }
  };
  self.updateItems();

  if(if_mobile){
    select.addClass(opt.visible);
  }
}



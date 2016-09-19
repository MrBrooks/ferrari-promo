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

  var sliders = $('.slider').owlCarousel({
    dotsContainer: ".slider-preview",
    items: 1
  });
});



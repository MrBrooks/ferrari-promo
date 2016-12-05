/**************************************/
/* Custom JavaScript files supervisor */
/**************************************/

$(window).load(function(){
  // $('#preloader').fadeOut(500);
  lazyLoad();
});

$(document).ready(function() {

 function DynamicGrid(){
    var items = $('.dynamin-grid .item');
    var close_btn = $('.dynamin-grid .go-back');
    items.on('click',function(e){
      // console.log(e);
      $(this).addClass('active').removeClass('small').siblings().removeClass('active').addClass('small');
    });
    close_btn.on('click',function(e){
      // console.log(e);
      items.removeClass('small active');
      e.stopPropagation();
    });
  }

  function ProductView(){
    var products = $(".product-block .item");
    // var tabs = $("#text-info .tab");
    // var popups = $(".product-block .popup");
    var mobile = false;
    if($(window).width() < 768){
      mobile = true;
    }
    products.each(function(){
      var lupes = $(this).find(".lupe");
      var tabs = $(this).find(".tab");
      var popups = $(this).find(".popup");
      var close_btns = popups.find('.btn-close');
      var mores = $(this).find(".product-more");
      var back_to_look = $(this).find('.back-to-look');
      var start_block = $(this).find('#start');
      lupes.on('click',function(){
          $(this).css('transition-delay','0ms').addClass('active').siblings().removeClass('active');
          // expand(parseInt($(this).attr('data-index')));
          $(tabs.get(parseInt($(this).attr('data-index'))-1)).addClass('active').siblings().removeClass('active');
        });
      mores.on('click',function(){
        $(popups.get(parseInt($(this).attr('data-index')) - 1)).addClass('active');
        if(mobile){
          $("html").css('overflow','hidden');
        }
      });
      close_btns.on('click',function(){
        popups.removeClass('active');
        $("html").css('overflow','auto');
      });
      back_to_look.on('click',function(){
        tabs.removeClass('active');
        start_block.addClass('active');
        lupes.removeClass('active');
      });

    });

    function fullView(){
      tabs.each(function(){
        $(this).find('.product-more').on('click', function(){
          $('.popup[data-index=""]');
        });
      });
    }
  }
 
  DynamicGrid();
  ProductView();
  var fullheight = new FullHeight();

  var auto_play = new AutoPlay();
  auto_play.start();
  var scroll_anim = new AnimOnScroll({
    selector: '.slide-from-down:not(.no-scroll)',
    visible: 'active'
  });
  var start_anim = new AnimOnScroll({
    selector: '.start-anim',
    visible: 'playing'
  });

  $("input[name='phone']").mask('8 (000) 000-00-00',{placeholder: "8 (___) _ _ _-_ _-_ _"});

  var video_control = new VideoControl();

  var sliders = $(this).find('.slider');
  sliders.each(function(){
    var index = $(this).attr('data-slider-index');
    $(this).owlCarousel({
      dotsContainer: "#slider-preview-"+index,
      items: 1,
    });
  });
  var submit = new AjaxSubmit({
    form: "form",
    message: ".btn"
  });


  var window_updater = new WindowUpdater([
    {
      event: "scroll",
      actions: [
        scroll_anim.updateView,
        start_anim.updateView,
        video_control.update,
        // video_play.scrollControl,
        // econtenta_pixel.checkScrollConditions
      ]
    },
    {
      event: "resize",
      actions: [
        scroll_anim.updateItems,
        start_anim.updateItems,
        fullheight.update,
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

function AutoPlay(options){
  var def = {
    selector: ".auto-play",
    class: 'active',
    prev: 'prev',
    pause: 7000
  };
  var self = this;
  var opt = $.extend(def, options);

  var items, timer, count, iter;

  function init(){
    items = $(opt.selector);
    count = items.length;
    iter = 0;
    if(count > 0){
      $(items.get(iter)).addClass(opt.class);
    }
  }

  self.start = function (){
    if (count > 0){
      timer = setInterval(function(){
        if(iter < count-1){
          $(items).removeClass(opt.prev);
          $(items.get(iter % count)).addClass(opt.prev);
          $(items.get(++iter % count)).addClass(opt.class).siblings().removeClass(opt.class);
        } else self.stop();
      },opt.pause);
    }
  };

  self.stop = function (){
    clearInterval(timer);
  };

  init();
}

function VideoControl(){
  var vid;

  function init(){
    vid = document.getElementById("ferrari-video");
    vid.onended = function(){
      $("#anim-arrow").addClass('jumping');
      if($(window).width() >= 768){
        $("#hide-after-video").fadeOut(500);
      }
    };
  }

  this.update = function (){
    if($(window).width() >= 768){
      if($(window).scrollTop() > 20){
        vid.pause();
      } else{
        vid.play();
      }
    }
  };

  if($(window).width() > 768){
    init();
  }
}

function FullHeight(){
  var elements = $(".full-height"), wh;

  this.update = function(){
    wh = $(window).height();
    elements.each(setHeight)
  };

  function setHeight(){
    $(this).height(wh);
  }

  this.update();
}

//require JQUERY
function AjaxSubmit(options){
  var def = {
    form: '.ajax-submit',
    btn: '[type="submit"]',
    message: '.message',
    isMessageInput: false,
    inputs: 'input:not([type="submit"]), textarea',
    invalid: 'invalid', //class
    validate: validate, //boolean function(element)
    message_succsess: "Отплавлено",
    succsess_callback: function(){},
    error_callback: function(){},
  };
  var opts = $.extend(def, options);

  var form, btn, message, inputs, sendingFlag = false, message_init = "";

  function init(){
    form = $(opts.form);
    btn = form.find(opts.btn);
    // message = form.find(opts.message);
    // inputs = form.find(opts.inputs);
    form.on("submit", submit);
  }

  function submit(){
    var err = false;
    inputs = $(this).find(opts.inputs);
    message = $(this).find(opts.message);

    inputs.each(function(){
      if(opts.validate($(this))){
        $(this).removeClass(opts.invalid);
      } else{
        $(this).addClass(opts.invalid);
        err = true;
      }

    });

    if (!err){
      var data = $(this).serialize();
      $.ajax({
         type: 'POST',
         url: "send.php",
         dataType: 'json',
         data: data, 
         beforeSend: beforeSend,
         success: success,
         error: error,
         complete: complete
      });
    }
    return false;
  }

  function beforeSend(){
    if(opts.isMessageInput){
      message_init = message.val();
      message.val("Идет отправка...");
    } else{
      message_init = message.text();
      message.text("Идет отправка...");
    }
    btn.prop('disabled', true);
    sendingFlag = true;
  }

  function success(data){
    sendingFlag = false;
    if (data['error']) { 
      if(opts.isMessageInput){
        message.val("Ошибка");
      } else{
        message.text("Ошибка");
      }
    } else {
      if(opts.isMessageInput){
        message.val(opts.message_succsess);
      } else{
        message.text(opts.message_succsess);
      }
    }
    opts.succsess_callback();
  }

  function error(xhr, ajaxOptions, thrownError){
    sendingFlag = false;
    if(opts.isMessageInput){
      message.val("Ошибка");
    } else{
      message.text("Ошибка");
    }
    opts.error_callback();
    // console.log(xhr);
    // console.log(ajaxOptions);
    // console.log(thrownError);
    // btn.prop('disabled', false);
  }
  function complete(){
    if(sendingFlag){
      message.text(message_init);
      sendingFlag = false;
    }
    btn.prop('disabled', false);
  }
  function validate(el){
    var field_type = el.attr('data-type');
    switch(field_type){
      case 'required': 
        if (el.val() === ''){
          return false;
        }
        break;
      case 'email': 
        var isemail = /.+@.+\..+/i;
        var t = el.val();
        if(t === '' || !isemail.test(t)){
          return false;
        }
      break;
      default: ;
    }
    
    return true;
  }
  init();
}

function lazyLoad(){
  var items = $("[data-src]"), curr = 0;

  items.on('load', loadNext);

  function loadNext(){
    var src = $(items.get(curr)).attr('data-src');
    $(items.get(curr)).attr('src',src);
    curr++;
  }
  
  loadNext();
}
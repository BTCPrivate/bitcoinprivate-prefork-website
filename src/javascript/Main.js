$(function() {

  // Notification
  var notiSpam = null;
  $( document ).ready(function() {
    // Show on homepage
    if (window.location.pathname === '/') {
      var hashExists = document.getElementById("hero");
      var hashPosTop = hashExists.getBoundingClientRect().top;
     if (hashPosTop === 0) {
        notiSpam = new Noty({
          type: 'error',
          theme: 'bootstrap-v3',
          // timeout: 4000,
          layout: 'topRight',
          selector: 'testytest',
          closeWith: ['click', 'button'],
          callbacks: {
            onTemplate: function() {
              this.barDom.innerHTML = '<div class="noty_body" localization-tag="notification-scams"> <b>Warning : </b> We have received many reports of scam sites asking for seeds, private keys, or claiming to be our official wallet. You should never input your private key to any website. <b>BTCPRIVATE.ORG</b> is the only official website for our community. <br> <a class="alert-danger" href="https://github.com/BTCPrivate/official-links" target="_blank" localization-tag="notification-scams-cta"><b>See our official links.</b></a><div>';
            }
          }
        }).show();
      }
    }
  })

  // Nav : Slideout
  function close(eve) {
    eve.preventDefault();
    slideout.close();
  }

  var slideout = new Slideout({
    'touch': true,
    'panel': document.getElementById('panel'),
    'menu': document.getElementById('menu'),
    'padding': 256,
    'tolerance': 70,
    'side': 'right',
  });

  slideout.on('beforeopen', function() {
    this.panel.classList.add('content-panel-open');
    document.querySelector('.navbar-toggle').classList.add('toggle-open');
    document.querySelector('.navbar-header').classList.add('header-open');
  })
  slideout.on('open', function() {
    this.panel.addEventListener('click', close);
  })
  slideout.on('beforeclose', function() {
    this.panel.classList.remove('content-panel-open');
    this.panel.removeEventListener('click', close);
    document.querySelector('.navbar-toggle').classList.remove('toggle-open');
    document.querySelector('.navbar-header').classList.remove('header-open');
  });

  // Toggle button
  let togglers = document.querySelectorAll('.menu-toggle');
  togglers.forEach(p => p.addEventListener('click', function() {
    if (notiSpam !== null) {
      notiSpam.close();
    }
    slideout.toggle();
  }));

  // load localizations
  const language = url('?lang') || 'en';
  var browserLanguage = (navigator) ? navigator.language : undefined;

  if (browserLanguage && !url('?lang')) {
    browserLanguage = browserLanguage.replace('-', '_');

    if (browserLanguage.indexOf('en') === -1) {
      window.location = '/?lang=' + browserLanguage;
    }
  }

  if ($.inArray(language, Localizations.languages) !== -1) {
    $.each(Localizations, function(localizationTag, value) {
      $('[localization-tag="' + localizationTag + '"]').html(value[language]);
    });
  }

  //localization for whitepaper
    const whitePaperLanguage = ["de", "ja", "ru","zh_cn"];
    if ($.inArray(language, whitePaperLanguage) !== -1) {
        $('#whitepaper_href').attr("href", "/whitepaper_"+language+".pdf");
    }
  // scroll functionality
  $('.view-section').click(function(e) {
    e.preventDefault();

    $('html, body').animate({
      scrollTop: $($(this).attr('href')).position().top
    }, 500);
  });

  $('.close-modal').click(function(e) {
    e.preventDefault();

    $('.zcl-warning').hide();
  })


  // Get location object for parsing
  var getLocation = function(href) {
    var l = document.createElement("a");
    l.href = href;
    return l;
  };

  // Localization for all href links on page
  var domElems = document.getElementsByTagName("*");
  for (var i=0, max=domElems.length; i < max; i++) {
    if (window.location.search != "" && domElems[i].tagName == "A" && domElems[i].href && domElems[i].href.indexOf(window.location.origin) === 0 && domElems[i].href.indexOf("?lang=") < 0) {
      var urlParsed = getLocation(domElems[i].href);
      domElems[i].href = urlParsed.pathname+window.location.search+urlParsed.hash;
    }
  }

  // Startup Modal
    if(!mr_cookies.hasItem('onLoadModalCookie')){
        $('.on-load-modal').modal('show');
        mr_cookies.setItem('onLoadModalCookie', "true", 604800); //expires 7 days
    }
});


/*\
|*|  COOKIE LIBRARY THANKS TO MDN
|*|
|*|  A complete cookies reader/writer framework with full unicode support.
|*|
|*|  Revision #1 - September 4, 2014
|*|
|*|  https://developer.mozilla.org/en-US/docs/Web/API/document.cookie
|*|  https://developer.mozilla.org/User:fusionchess
|*|
|*|  This framework is released under the GNU Public License, version 3 or later.
|*|  http://www.gnu.org/licenses/gpl-3.0-standalone.html
|*|
|*|  Syntaxes:
|*|
|*|  * mr_cookies.setItem(name, value[, end[, path[, domain[, secure]]]])
|*|  * mr_cookies.getItem(name)
|*|  * mr_cookies.removeItem(name[, path[, domain]])
|*|  * mr_cookies.hasItem(name)
|*|  * mr_cookies.keys()
|*|
\*/

var mr_cookies = {
    getItem: function (sKey) {
        if (!sKey) { return null; }
        return decodeURIComponent(document.cookie.replace(new RegExp("(?:(?:^|.*;)\\s*" + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=\\s*([^;]*).*$)|^.*$"), "$1")) || null;
    },
    setItem: function (sKey, sValue, vEnd, sPath, sDomain, bSecure) {
        if (!sKey || /^(?:expires|max\-age|path|domain|secure)$/i.test(sKey)) { return false; }
        var sExpires = "";
        if (vEnd) {
            switch (vEnd.constructor) {
                case Number:
                    sExpires = vEnd === Infinity ? "; expires=Fri, 31 Dec 9999 23:59:59 GMT" : "; max-age=" + vEnd;
                    break;
                case String:
                    sExpires = "; expires=" + vEnd;
                    break;
                case Date:
                    sExpires = "; expires=" + vEnd.toUTCString();
                    break;
            }
        }
        document.cookie = encodeURIComponent(sKey) + "=" + encodeURIComponent(sValue) + sExpires + (sDomain ? "; domain=" + sDomain : "") + (sPath ? "; path=" + sPath : "") + (bSecure ? "; secure" : "");
        return true;
    },
    removeItem: function (sKey, sPath, sDomain) {
        if (!this.hasItem(sKey)) { return false; }
        document.cookie = encodeURIComponent(sKey) + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT" + (sDomain ? "; domain=" + sDomain : "") + (sPath ? "; path=" + sPath : "");
        return true;
    },
    hasItem: function (sKey) {
        if (!sKey) { return false; }
        return (new RegExp("(?:^|;\\s*)" + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=")).test(document.cookie);
    },
    keys: function () {
        var aKeys = document.cookie.replace(/((?:^|\s*;)[^\=]+)(?=;|$)|^\s*|\s*(?:\=[^;]*)?(?:\1|$)/g, "").split(/\s*(?:\=[^;]*)?;\s*/);
        for (var nLen = aKeys.length, nIdx = 0; nIdx < nLen; nIdx++) { aKeys[nIdx] = decodeURIComponent(aKeys[nIdx]); }
        return aKeys;
    }
};

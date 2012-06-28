/* original code: https://gist.github.com/2058263 */

    /* use jQuery as container for more convenience */
    (function($) {
        /**
         * Create a popunder
         *
         * @param  sUrl Url to open as popunder
         * @param  int block time in hours
         *
         * @return jQuery
         */
        $.popunder = function(sUrl, blockTime) {
            var bSimple = $.browser.msie,
                run = function() {
                    $.popunderHelper.open(sUrl, blockTime, bSimple);
                };
            (bSimple) ? run() : window.setTimeout(run, 1);
            return $;
        };
        
        /* several helper functions */
        $.popunderHelper = {
            /**
             * Helper to create a (optionally) random value with prefix
             *
             * @param  int blockTime block time in hours
             *
             * @return boolean
             */
            cookieCheck: function(sUrl, blockTime) {
                var name = this.rand('puCookie', false); 
                    cookie = $.cookies.get(name),
                    ret = false;
                
                if (!cookie) {
                    cookie = sUrl;
                }
                else if (cookie.indexOf(sUrl) === -1) {
                    cookie += sUrl;
                }
                else {
                    ret = true;
                }
                
                $.cookies.set(name, cookie, {
                    expiresAt: new Date((new Date()).getTime() + blockTime * 3600000)
                });
                
                return ret;
            },
            
            /**
             * Helper to create a (optionally) random value with prefix
             *
             * @param  string name
             * @param  boolean rand
             *
             * @return string
             */
            rand: function(name, rand) {
                var p = (name) ? name : 'pu_';
                return p + (rand === false ? '' : Math.floor(89999999*Math.random()+10000000));
            },
            
            /**
             * Open the popunder
             *
             * @param  string sUrl The URL to open
             * @param  int blockTime block time in hours
             * @param  boolean bSimple Use the simple popunder
             *
             * @return boolean
             */
            open: function(sUrl, blockTime, bSimple) {
                var _parent = self,
                    sToolbar = (!$.browser.webkit && (!$.browser.mozilla || parseInt($.browser.version, 10) < 12)) ? 'yes' : 'no',
                    sOptions,
                    popunder;
                
                if (blockTime && $.popunderHelper.cookieCheck(sUrl, blockTime)) {
                    return false;
                }
                
                if (top != self) {
                    try {
                        if (top.document.location.toString()) {
                            _parent = top;
                        }
                    }
                    catch(err) { }
                }
        
                /* popunder options */
                sOptions = 'toolbar=' + sToolbar + ',scrollbars=yes,location=yes,statusbar=yes,menubar=no,resizable=1,width=' + (screen.availWidth - 10).toString();
                sOptions += ',height=' + (screen.availHeight - 122).toString() + ',screenX=0,screenY=0,left=0,top=0';
        
                /* create pop-up from parent context */
                popunder = _parent.window.open(sUrl, $.popunderHelper.rand(), sOptions);
                if (popunder) {
                    popunder.blur();
                    if (bSimple) {
                        /* classic popunder, used for ie*/
                        window.focus();
                        try { opener.window.focus(); }
                        catch (err) { }
                    }
                    else {
                        /* popunder for e.g. ff4+, chrome */
                        popunder.init = function(e) {
                            with (e) {
                                (function() {
                                    if (typeof window.mozPaintCount != 'undefined') {
                                        var x = window.open('about:blank');
                                        x.close();
                                    }
        
                                    try { opener.window.focus(); }
                                    catch (err) { }
                                })();
                            }
                        };
                        popunder.params = {
                            url: sUrl
                        };
                        popunder.init(popunder);
                    }
                }
                
                return true;
            }
        };
    })(jQuery);


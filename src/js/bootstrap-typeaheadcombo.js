/* =============================================================
 * bootstrap-typeaheadcombo.js v1
 * =============================================================
 * Copyright 2013 Tomas Pastorek
 *
 * Based on boostrap-combobox.js by Daniel Farrell
 * https://github.com/danielfarrell/bootstrap-combobox/ 
 *  
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ============================================================ */

!function( $ ) {

 "use strict";

    var TypeaheadCombo = function(element, options) {
        this.options = $.extend({}, $.fn.typeaheadCombo.defaults, options);
        this.$element = $(element);
        this.$container = this.setup();        
        this.$button = this.$element.parent().find('.dropdown-toggle');
        this.$menu = $(this.options.menu).appendTo('body');
        this.updater = this.options.updater || this.updater;
        this.matcher = this.options.matcher || this.matcher;
        this.sorter = this.options.sorter || this.sorter;
        this.highlighter = this.options.highlighter || this.highlighter;
        this.shown = false;
        this.showAll = false;
        this.refresh();
        this.setAttributes();
        this.listen();
    };

    /* NOTE: EXTENDS BOOTSTRAP-TYPEAHEAD.js
      ========================================== */

    TypeaheadCombo.prototype = $.extend({}, $.fn.typeahead.Constructor.prototype, {
        constructor: TypeaheadCombo,
        setup: function() {
            var container = $(this.options.containerTemplate);
            this.$element.wrap(container);
            this.$element.parent().append(this.options.containerButtonTemplate);
            return container;
        },
        disable: function() {
            this.$element.prop('disabled', true);
            this.$button.attr('disabled', true);
            this.$button.off('click');
        },
        enable: function() {
            this.$element.prop('disabled', false);
            this.$button.attr('disabled', false);
            this.$button.on('click', $.proxy(this.toggle, this));
        },
        setAttributes: function () {
            this.options.placeholder = this.$element.attr('data-placeholder') || this.options.placeholder;
            this.$element.attr('placeholder', this.options.placeholder);
            this.$element.attr('autocomplete', 'off');
        },
        toggle: function() {
            if (this.shown) {
                this.hide();
            } else {
                this.showAll = true;
                this.$element.focus();
                this.lookup();
            }
        },                
        
        refresh: function () {            
            this.source = this.options.source;            
        }

        // modified typeahead function removing the blank handling 
        ,
        lookup: function () {
            if (this.showAll) {
                this.query = '';
                this.showAll = false;
            } else {
                this.query = this.$element.val();
            }
            
            var items = $.isFunction(this.source) ? this.source(this.query, $.proxy(this.process, this)) : this.source;
            return items ? this.process(items) : this;
        }

        // modified typeahead function adding button handling and remove mouseleave
        ,
        listen: function() {
            this.$element
                .on('focus', $.proxy(this.focus, this))
                .on('blur', $.proxy(this.blur, this))
                .on('keypress', $.proxy(this.keypress, this))
                .on('keyup', $.proxy(this.keyup, this));

            if (this.eventSupported('keydown')) {
                this.$element.on('keydown', $.proxy(this.keydown, this));
            }

            this.$menu
                .on('click', $.proxy(this.click, this))
                .on('mouseenter', 'li', $.proxy(this.mouseenter, this))
                .on('mouseleave', 'li', $.proxy(this.mouseleave, this));

            this.$button
                .on('click', $.proxy(this.toggle, this));
        }

        // modified typeahead function to clear on type and prevent on moving around
        ,
        keyup: function(e) {
            switch (e.keyCode) {
                case 40: // down arrow
                case 39: // right arrow
                case 38: // up arrow
                case 37: // left arrow
                case 36: // home
                case 35: // end
                case 16: // shift
                case 17: // ctrl
                case 18: // alt
                    break;
                case 9:  // tab
                case 13: // enter
                    if (!this.shown) return;
                    this.select();
                    break;
                case 27:
                    // escape
                    if (!this.shown) return;
                    this.hide();
                    break;
            default:                
                this.lookup();
            }

            e.stopPropagation();
            e.preventDefault();
        }

        // modified typeahead function to force a match and add a delay on hide
        ,
        blur: function() {
            var that = this;
            this.focused = false;
            if (!this.mousedover && this.shown) setTimeout(function () { that.hide(); }, 200);
        }

        // modified typeahead function to not hide
        ,
        mouseleave: function() {
            this.mousedover = false;
        }
    });

    /* PLUGIN DEFINITION
    * =========================== */

    $.fn.typeaheadCombo = function(option) {
        return this.each(function() {
            var $this = $(this), data = $this.data('typeaheadCombo'), options = typeof option == 'object' && option;
            if (!data) $this.data('typeaheadCombo', (data = new TypeaheadCombo(this, options)));
            if (typeof option == 'string') data[option]();
        });
    };

    $.fn.typeaheadCombo.defaults = {
        containerTemplate: '<div class="combobox-container"></div>',
        containerButtonTemplate: '<span class="add-on btn dropdown-toggle" data-dropdown="dropdown"><span class="caret"/></span>',
        menu: '<ul class="typeahead typeahead-long dropdown-menu"></ul>',
        item: '<li><a href="#"></a></li>'
    };

    $.fn.typeaheadCombo.Constructor = TypeaheadCombo;

}( window.jQuery );

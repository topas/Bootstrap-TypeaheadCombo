# Bootstrap Typeahead Combobox

Simply textbox input with typeahead and dropdown button.

Based on Bootstrap Combobox by Daniel Farrell https://github.com/danielfarrell/bootstrap-combobox

## How to use it

The dependencies are the Bootstrap stylesheet(CSS or LESS) and also the typeahead javascript plugin. Include them and then the stylesheet(CSS or LESS) and javascript.

Then just activate the plugin on a normal textbox input:

    <input type="text" class="combo">    

    <script type="text/javascript">
      var countries = ["Czech Republic", "Germany", "Poland", "Austria", "Slovakia"];

      $(document).ready(function(){
        $('.combo').typeaheadCombo({ source: countries });
      });
    </script>


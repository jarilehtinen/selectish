/**
 * Selectish
 * Style your <selects>
 *
 * @author Jari Lehtinen, @jarilehtinen
 */
jQuery.fn.extend({
    selectish: function() {
        var hidden = '<input type="hidden" name="%name%" value="%value%">',
            select = '<div class="selectish selectish-%name% %class%" data-select-name="%name%"><div class="selectish-options"></div></div>',
            option = '<div class="option%selected%" data-value="%value%">%title%</div>';

        this.each(function() {
            var selectEl = this,
                name = $(this).attr('name'),
                preSelectedValue = $(this).val();

            // Create elements
            var containerEl = select.format({
                    name: name,
                    class: $(this).attr('class')
                }),
                hiddenEl = hidden.format({
                    name: name,
                    value: preSelectedValue ? preSelectedValue : ''
                }),
                options = '';

            // Create options
            $(this).find('option').each(function() {
                options += option.format({
                    value: $(this).attr('value'),
                    title: $(this).text(),
                    selected: $(this).is(':selected') ? ' selected' : ''
                });
            });

            // Add container before original select
            $(this).before(containerEl);

            // Place the hidden input to carry selected value,
            // since hidden select's selection can't be modified
            $(this).before(hiddenEl);

            // Remove select
            $(this).remove();

            // Class for created element
            var el = '.selectish-' + $(this).attr('name');

            // Add options
            $(el).find('.selectish-options').append(options);

            // Move the list to correct position if a value is pre-selected
            if (preSelectedValue) {
                // Calculate clicked option and container top position difference
                var topDiff = ($(el).find('.option.selected').offset().top - $(el).offset().top) * -1;
                $(el).find('.option:first-child').css('margin-top', topDiff);
            }

            // Option click behaviour
            $(el).find('.option').on('click', function() {
                var opened = false;

                if (!$(this).parent().parent().hasClass('opened')) {
                    $(this).parent().parent().addClass('opened');
                    opened = true;
                }

                // Calculate clicked option and container top position difference
                var topDiff = ($(this).offset().top - $(el).offset().top) * -1;
                $(el).find('.option:first-child').css('margin-top', topDiff);

                // Add selected class
                $(el).find('.option').removeClass('selected');
                $(this).addClass('selected');

                // Update original select
                $('input[name='+name+']').val($(this).data('value'));

                // Close if not opened with last click
                if (!opened) {
                    $(el).removeClass('opened');
                }
            });
        });
    }
});

/**
 * String format
 *
 * Usage:
 * var string = 'Some text %1% %2%';
 * string.format(replace1, replace2);
 */
if (!String.prototype.format) {
    String.prototype.format = function() {
        var text = this;

        for (var arg in arguments[0]) {
            text = text.replace(new RegExp('%'+arg+'%','g'), arguments[0][arg]);
        }

        return text;
    };
}

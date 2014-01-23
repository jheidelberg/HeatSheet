/*
	Expandify jQuery Plugin
	v0.5.0
	https://github.com/mholt/jquery.expandify
*/
(function($)
{
	var _maxRowsDefault = 5;
	var _idcounter = 0;
	var _textareas = {};


	$.fn.expandify = function(maxRows)
	{
		var id = _idcounter++;
		this.data('expandoID', id);

		_textareas[id] = {
			jqelem: this,
			maxRows: maxRows || _maxRowsDefault || 5,
			lastKeyWasEnter: false
		};

		this.attr('rows', 1).keydown(function(e)
		{
			var id = $(this).data('expandoID');
			
			var rows = parseInt($(this).attr('rows'));

			if (e.keyCode == 13)
			{
				_textareas[id].lastKeyWasEnter = true;
				$(this).attr('rows', Math.min(rows + 1, _textareas[id].maxRows));
			}
			else
				_textareas[id].lastKeyWasEnter = false;
		}).keyup(function(e)
		{
			var id = $(this).data('expandoID');
			
			if (_textareas[id].lastKeyWasEnter)
				return;

			if (e.keyCode == 13)
			{
				var rows = parseInt($(this).attr('rows'));
				$(this).attr('rows', Math.min(rows + 1, _textareas[id].maxRows));
			}
			else
			{
				var newlines = $(this).val().match(/\n/g) || [];
				$(this).attr('rows', Math.min(newlines.length + 1, _textareas[id].maxRows));
			}
		});

		return this;
	};
}(jQuery));
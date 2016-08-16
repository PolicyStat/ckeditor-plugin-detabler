'use strict';

(function () {
    CKEDITOR.plugins.add('detabler', {
		init: function (editor) {
			editor.addCommand('detable', {
				exec: function (editor) {
					var path,
						table,
						cells,
						currentCell;

					path = editor.elementPath();
					table = path.contains('table');

					if (table) {
						cells = table.find('td, th');
						for (var i=0; i < cells.count(); i++) {
							currentCell = cells.getItem(i);
							currentCell.renameNode('p');
							currentCell.insertBefore(table);
						}
						table.remove();
					}
				},
				refresh: function (editor, path) {
					if (this.state !== CKEDITOR.TRISTATE_DISABLED) {
						if (path.contains('table')) {
							this.setState(CKEDITOR.TRISTATE_ON);
						}
						else {
							this.setState(CKEDITOR.TRISTATE_OFF);
						}
					}
				}
			});
		}
	});
})();

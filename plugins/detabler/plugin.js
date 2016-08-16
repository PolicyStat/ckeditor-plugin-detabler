'use strict';

(function () {
    CKEDITOR.plugins.add('detabler', {
		requires: 'table,contextmenu',
		init: function (editor) {
			editor.addCommand('detable', {
				exec: function (editor) {
					var path,
						table,
						cells,
						currentCell,
						currentCellChildren;

					path = editor.elementPath();
					table = path.contains('table');

					if (table) {
						cells = table.find('td, th');
						for (var i = 0; i < cells.count(); i++) {
							currentCell = cells.getItem(i);
							currentCellChildren = currentCell.getChildren();
							for (var j = 0; j < currentCellChildren.count(); j++) {
								currentCellChildren.getItem(j).insertBefore(table);
							}
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

			if (editor.contextMenu) {
				editor.addMenuItem('detable', {
					label: 'Extract content from table',
					command: 'detable',
					group: 'table'
				});

				editor.contextMenu.addListener(function (element) {
					if (element.getAscendant('table', true)) {
						return { detable: CKEDITOR.TRISTATE_OFF };
					}
				});
			}
		}
	});
})();

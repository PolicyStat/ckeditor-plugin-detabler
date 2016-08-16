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
						currentItem;

					path = editor.elementPath();
					table = path.contains('table');

					if (table) {
						table.$.normalize(); // we don't want to deal with un-merged text nodes here.
						cells = table.find('td, th');
						// loop through all cell-like items
						for (var i = 0; i < cells.count(); i++) {
							currentCell = cells.getItem(i);

							// we can't iterate through the children nodeList here
							// because this while loop removes items from children 1 by 1
							while (currentItem = currentCell.getChild(0)) {
								// we should manually wrap the text nodes in p tags
								// otherwise we are at the mercy of HTML autofixing
								// and neighboring cell content may get merged into the same p
								if (currentItem.type === CKEDITOR.NODE_TEXT) {
									var wrapper = new CKEDITOR.dom.element('p');
									currentItem.appendTo(wrapper);
									currentItem = wrapper;
								}
								currentItem.insertBefore(table);
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

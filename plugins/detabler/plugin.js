'use strict';

(function () {
    CKEDITOR.plugins.add('detabler', {
		init: function (editor) {
			editor.addCommand('detable', {
				exec: function (editor) {
					//alert( 'Executing a command for the editor name "' + editor.name + '"!' );
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

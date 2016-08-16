/* bender-tags: editor,unit */
/* bender-ckeditor-plugins: contextmenu,detabler */

(function () {
    bender.editor = {
        config: {
            enterMode: CKEDITOR.ENTER_P
        }
    };
    bender.test({
		setUp: function () {
			this.command = this.editorBot.editor.getCommand('detable');
		},
		contextMenuItemIsPresent: function (editor) {
			editor.contextMenu.open(editor.editable());

			var itemExists = false;
			for (var i = 0; i < editor.contextMenu.items.length; ++i)
				if (editor.contextMenu.items[i].command == 'detable')
					itemExists = true;

			editor.contextMenu.hide();

			return itemExists;
		},
        'context menu item is not present outside of tables': function () {
            var editor = this.editorBot.editor,
                startHtml;

            startHtml = '<p>foobar^</p>' +
                '<p>baz</p>' +
                '<table><tbody><tr><td>leave me alone</td></tr></tbody></table>';

            this.editorBot.setHtmlWithSelection(
                startHtml
            );
			// setHtmlWithSelection doesn't appear to refresh command state, so we must manually do it
			this.command.refresh(editor, editor.elementPath());

			assert.areEqual(false, this.contextMenuItemIsPresent(editor));

        },
        'context menu item is present inside of tables': function () {
            var editor = this.editorBot.editor,
                startHtml;

            startHtml = '<p>foo</p><table><tbody><tr><td>^foo</td><td>bar</td></tr></tbody></table>';

            this.editorBot.setHtmlWithSelection(
                startHtml
            );
			// setHtmlWithSelection doesn't appear to refresh command state, so we must manually do it
			this.command.refresh(editor, editor.elementPath());

			assert.areEqual(true, this.contextMenuItemIsPresent(editor));

        },
    });
})();

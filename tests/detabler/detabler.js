/* bender-tags: editor,unit */
/* bender-ckeditor-plugins: detabler */

(function () {
    bender.editor = {
        config: {
            enterMode: CKEDITOR.ENTER_P
        }
    };
    bender.test({
        assertHtml: function (expected, actual, msg) {
            assert.areEqual(bender.tools.fixHtml(expected), bender.tools.fixHtml(actual), msg);
        },
		setUp: function () {
			this.command = this.editorBot.editor.getCommand('detable');
		},
        'it does not do anything outside of tables': function () {
            var editor = this.editorBot.editor,
                startHtml,
                endHtml;

            startHtml = '<p>foobar^</p>' +
                '<p>baz</p>' +
                '<table><tbody><tr><td>leave me alone</td></tr></tbody></table>';

            endHtml = '<p>foobar</p>' +
                '<p>baz</p>' +
                '<table><tbody><tr><td>leave me alone</td></tr></tbody></table>';

            this.editorBot.setHtmlWithSelection(
                startHtml
            );

			assert.areEqual(CKEDITOR.TRISTATE_OFF, this.command.state);

            editor.execCommand('detable');

            this.assertHtml(endHtml, editor.getData(), 'Editor data does not match.');
        },
        'it converts table cells to p tags': function () {
            var editor = this.editorBot.editor,
                startHtml,
				startHtmlWithoutSelection,
                endHtml;

            startHtml = '<p>foo</p><table><tbody><tr><td>^foo</td><td>bar</td></tr></tbody></table>';
			startHtmlWithoutSelection = '<p>foo</p><table><tbody><tr><td>foo</td><td>bar</td></tr></tbody></table>';
            endHtml = '<p>foo</p><p>foo</p><p>bar</p>';

            this.editorBot.setHtmlWithSelection(
                startHtml
            );

			assert.areEqual(CKEDITOR.TRISTATE_ON, this.command.state);

            editor.execCommand('detable');

            this.assertHtml(endHtml, editor.getData(), 'Editor data does not match.');

			editor.execCommand('undo');

			this.assertHtml(startHtmlWithoutSelection, editor.getdata(), 'Editor data does not match after being undone.');
        },
    });
})();

/* bender-tags: editor,unit */
/* bender-ckeditor-plugins: contextmenu,detabler */

(function () {
	'use strict';
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
				'<table>' +
					'<tbody>' +
						'<tr><td>leave me alone</td></tr>' +
					'</tbody>' +
				'</table>';

			endHtml = '<p>foobar</p>' +
				'<p>baz</p>' +
				'<table>' +
					'<tbody>' +
						'<tr><td>leave me alone</td></tr>' +
					'</tbody>' +
				'</table>';

			this.editorBot.setHtmlWithSelection(startHtml);
			// setHtmlWithSelection doesn't appear to refresh command state, so we must manually do it
			this.command.refresh(editor, editor.elementPath());

			assert.areEqual(CKEDITOR.TRISTATE_OFF, this.command.state);

			editor.execCommand('detable');

			this.assertHtml(endHtml, editor.getData(), 'Editor data does not match.');
		},
		'it converts table cells to p tags': function () {
			var editor = this.editorBot.editor,
				startHtml,
				startHtmlWithoutSelection,
				endHtml;

			startHtml = '<p>foo</p>' +
				'<table>' +
					'<tbody>' +
						'<tr><td>^foo</td><td>bar</td></tr>' +
					'</tbody>' +
				'</table>';
			startHtmlWithoutSelection = '<p>foo</p><table><tbody><tr><td>foo</td><td>bar</td></tr></tbody></table>';
			endHtml = '<p>foo</p><p>foo</p><p>bar</p>';

			this.editorBot.setHtmlWithSelection(startHtml);
			// setHtmlWithSelection doesn't appear to refresh command state, so we must manually do it
			this.command.refresh(editor, editor.elementPath());

			assert.areEqual(CKEDITOR.TRISTATE_ON, this.command.state);

			editor.execCommand('detable');

			this.assertHtml(endHtml, editor.getData(), 'Editor data does not match.');

			editor.execCommand('undo');

			this.assertHtml(startHtmlWithoutSelection, editor.getData(), 'Editor data does not match after being undone.');
		},
		'it does not create nested p': function () {
			var editor = this.editorBot.editor,
				startHtml,
				endHtml;

			startHtml = '<table>' +
					'<tbody>' +
						'<tr><td><p>^foo</p></td><td>bar</td></tr>' +
					'</tbody>' +
				'</table>';
			endHtml = '<p>foo</p><p>bar</p>';

			this.editorBot.setHtmlWithSelection(startHtml);
			// setHtmlWithSelection doesn't appear to refresh command state, so we must manually do it
			this.command.refresh(editor, editor.elementPath());

			assert.areEqual(CKEDITOR.TRISTATE_ON, this.command.state);

			editor.execCommand('detable');

			this.assertHtml(endHtml, editor.getData(), 'Editor data does not match.');
		},
		'it handles multiple non-text children in the same cell': function () {
			var editor = this.editorBot.editor,
				startHtml,
				endHtml;

			startHtml = '<table>' +
					'<tbody>' +
						'<tr><td><p>^foo</p><p>bar</p></td></tr>' +
				'</tbody>' +
			'</table>';
			endHtml = '<p>foo</p><p>bar</p>';

			this.editorBot.setHtmlWithSelection(startHtml);

			// setHtmlWithSelection doesn't appear to refresh command state, so we must manually do it
			this.command.refresh(editor, editor.elementPath());

			assert.areEqual(CKEDITOR.TRISTATE_ON, this.command.state);

			editor.execCommand('detable');

			this.assertHtml(endHtml, editor.getData(), 'Editor data does not match.');
		},
		'it does not break up un-normalized text nodes': function () {
			// this case is pretty ugly to set up, since you can't express neighboring textnodes as a string.
			var editor = this.editorBot.editor,
				startHtml,
				endHtml,
				tds;

			startHtml = '<table>' +
					'<tbody>' +
						'<tr><td>^foo</td><td>bar</td></tr>' +
					'</tbody>' +
				'</table>';
			endHtml = '<p>foo</p><p>bar</p>';

			this.editorBot.setHtmlWithSelection(startHtml);

			// split foo and bar

			tds = editor.document.find('td');
			tds.getItem(0).getChild(0).split(1);
			tds.getItem(1).getChild(0).split(2);

			this.command.refresh(editor, editor.elementPath());

			assert.areEqual(CKEDITOR.TRISTATE_ON, this.command.state);

			editor.execCommand('detable');

			this.assertHtml(endHtml, editor.getData(), 'Editor data does not match.');
		},
		'it wraps other elements in p tags': function () {
			var editor = this.editorBot.editor,
				startHtml,
				endHtml,
				tds;

			startHtml = '<table>' +
				'<tbody>' +
				'<tr><td><strong>^foo</strong></td><td><em>bar</em></td></tr>' +
				'</tbody>' +
				'</table>';
			endHtml = '<p><strong>foo</strong></p><p><em>bar</em></p>';

			this.editorBot.setHtmlWithSelection(startHtml);

			this.command.refresh(editor, editor.elementPath());

			editor.execCommand('detable');

			this.assertHtml(endHtml, editor.getData(), 'Editor data does not match.');
		},
		'it only removes the table the selection is in': function () {
			var editor = this.editorBot.editor,
				startHtml,
				startHtmlWithoutSelection,
				endHtml;

			startHtml = '<table>' +
				'<tbody>' +
					'<tr><td>' +
						'<table>' +
							'<tbody>' +
								'<tr><td>^foo</td><td>bar</td></tr>' +
							'</tbody>' +
						'</table>' +
					'</td></tr>' +
					'</tbody>' +
				'</table>';
			endHtml = '<table>' +
					'<tbody>' +
						'<tr><td><p>foo</p><p>bar</p></td></tr>' +
					'</tbody>' +
				'</table>';

			this.editorBot.setHtmlWithSelection(startHtml);
			// setHtmlWithSelection doesn't appear to refresh command state, so we must manually do it
			this.command.refresh(editor, editor.elementPath());

			assert.areEqual(CKEDITOR.TRISTATE_ON, this.command.state);

			editor.execCommand('detable');

			this.assertHtml(endHtml, editor.getData(), 'Editor data does not match.');
		}
	});
})();

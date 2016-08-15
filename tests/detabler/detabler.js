/* bender-tags: editor,unit */
/* bender-ckeditor-plugins: detabler */

(function() {
    bender.editor = {
        config: {
            enterMode: CKEDITOR.ENTER_P
        }
    };
    bender.test({
        assertHtml: function( expected, actual, msg ) {
		    assert.areEqual( bender.tools.fixHtml( expected ), bender.tools.fixHtml( actual ), msg );
	    },
        'it does not do anything outside of tables': function() {
            var editor = this.editorBot.editor,
                input = '<p>foobar^</p>' +
                    '<p>baz</p>' +
                    '<table><tbody><td>leave me alone</td></tbody></table>';

            this.editorBot.setHtmlWithSelection(
                html
            );

            editor.execCommand( 'detable' );

            this.assertHtml( input, editor.getData(), 'Editor data does not match.' );
        },
        'it converts table cells to p tags': function() {
            var editor = this.editorBot.editor,
                startHtml,
                endHtml;

            startHtml = '<p>foo></p><table><tbody><td>^foo</td><td>bar</td></tbody></table>';
            endHtml = '<p>foo</p><p>foo</p><p>bar</p>';

            this.editorBot.setHtmlWithSelection(
                startHtml
            );

            editor.execCommand( 'detable' );

            this.assertHtml( endHtml, editor.getData(), 'Editor data does not match.' );
        }
    });
})();
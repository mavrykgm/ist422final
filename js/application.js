$(function(){

	var Notekeeper = {};

	(function(app){

		var $title = $('#noteTitle'),
			$note = $('#noteContent'),
			$ul = $('#noteList'),
			li = '<li><a href="#pgNotesDetail?title=LINK">ID</a></li>',
			notesHdr = '<li data-role="list-divider">Note List</li>',
			noNotes = '<li id="noNotes">There are no notes stored.</li>';

		app.init = function(){
			app.bindings();
			app.checkForStorage();
		};

		app.bindings = function(){
			$('#btnSubmit').on('touchend', function(e){
				e.preventDefault();
				app.addNote(
					$('#noteTitle').val(),
					$('#noteContent').val()
				);
			});
			$(document).on('touchend', '#noteList a', function(e){
				e.preventDefault();
				var href = $(this)[0].href.match(/\?.*$/)[0];
				var title = href.replace(/^\?title=/,'');
				app.loadNote(title);
			});
			$(document).on('touchend', '#btnDelete', function(e){
				e.preventDefault();
				var key = $(this).data('href');
				app.deleteNote(key);
			});
		};

		app.loadNote = function(title){
			var notes = app.getNotes(),
				note = notes[title],
				page = ['<div data-role="page">',
							'<div data-role="header">',
								'<a id="btnReturn" href="#logbookPage" data-role="button" class="ui-btn-left">Return</a>',
								'<h1>Logbook Notes</h1>',
								'<a id="btnDelete" href="" data-href="ID" data-role="button" class="ui-btn-right">Delete</a>',
							'</div>',
							'<div role="main" class="ui-content"><h3>TITLE</h3><p>NOTE</p></div>',
						'</div>'].join('');
			var newPage = $(page);
			//append it to the page container
			newPage.html(function(index,old){
				return old
						.replace(/ID/g,title)
						.replace(/TITLE/g,title
						.replace(/-/g,' '))
						.replace(/NOTE/g,note);
			}).appendTo($.mobile.pageContainer);
			$.mobile.changePage(newPage);
		};

		app.addNote = function(title, note){
			var notes = localStorage['Notekeeper'],
				notesObj;
			if (notes === undefined || notes === '') {
				notesObj = {};
			} else {
				notesObj = JSON.parse(notes);
			}
			notesObj[title.replace(/ /g,'-')] = note;
			localStorage['Notekeeper'] = JSON.stringify(notesObj);
			$note.val('');
			$title.val('');
			app.displayNotes();
		};

		app.getNotes = function(){
			var notes = localStorage['Notekeeper'];
			if(notes) return JSON.parse(notes);
			return [];
		};

		app.displayNotes = function(){
			var notesObj = app.getNotes(),
				html = '',
				n;
			for (n in notesObj) {
				html += li.replace(/ID/g,n.replace(/-/g,' ')).replace(/LINK/g,n);
			}
			$ul.html(notesHdr + html).listview('refresh');
		};

		app.deleteNote = function(key){
			var notesObj = app.getNotes();
			delete notesObj[key];
			localStorage['Notekeeper'] = JSON.stringify(notesObj);
			$.mobile.changePage('#logbookPage');
			app.checkForStorage();
		};

		app.checkForStorage = function(){
			var notes = app.getNotes();
			if (!$.isEmptyObject(notes)) {
				app.displayNotes();
			} else {
				$ul.html(notesHdr + noNotes).listview('refresh');
			}
		};

		app.init();

	})(Notekeeper);
});
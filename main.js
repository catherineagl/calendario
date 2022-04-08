$(document).ready(function () {
	let $calendar = $('#calendar');
	let $eventName = $('#event-name');
	let dayEvents = '';

	for (let i = 1; i < 31; i++) {
		$calendar.append(`
			<div
				id="${i}"
				class="col border p-0 date showModal"
				style="width: 120px; height: 140px"
				role="button"
				type="button"
				data-bs-toggle="modal"
				data-bs-target="#eventModal"
			>
        <div class="w-100" style="pointer-events: none">
          <div class="bg-light mw-100 text-end fw-bold px-1">${i}</div>
          <ul id="event-list" class="px-1 list-unstyled" data-id="${i}">
          </ul>
        </div>
      </div>`);
	}

	//READ
	$(function () {
		$.ajax({
			url: 'http://localhost:3000/calendar',
			success: function (data) {
				$.each(data, function (i, day) {
					let $date = $(`[data-id="${i + 1}"]`);

					if (day.events.length >= 1) {
						let parseEvents = JSON.parse(day.events);

						$.each(parseEvents, function (i, event) {
							$date.append(`
						<li class="text-truncate fw-bold" style="color: #3166b5">${event}</li>
						`);
						});
					} else return;
				});
			},
			error: function () {
				alert('error cargando datos');
			},
		});
	});

	$('.showModal').click(function (e) {
		let $events = $('#modal-events-list');
		let $inputId = $('#input-id');
		$('#save-edit-event').replaceWith(
			'<div id="add-event" class="btn btn-success my-2">Agregar</div>'
		);
		$events.empty();
		$eventName.val('');
		$inputId.val('');
		let id = e.target.id;
		$inputId.val(id);

		$(function () {
			$.ajax({
				url: `http://localhost:3000/calendar/` + id,
				success: function (data) {
					if (data.events.length >= 1) {
						dayEvents = JSON.parse(data.events);
						$.each(dayEvents, function (i, event) {
							$events.append(`
							<li
							class="d-flex align-items-center justify-content-between list-group-item"
							>
							<h6>${event}</h6>
							<div>
								<button id="edit-event" data-title="${event}" type="button" class="btn btn-warning btn-sm">
									Editar
								</button>
								<button id="delete-event" data-title="${event}" type="button" class="btn btn-danger btn-sm">
									Eliminar
								</button>
							</div>
						`);
						});
					}
				},
			});
		});
	});

	//CREATE
	$('#add-event').on('click', function () {
		let $id = $('#input-id').val();
		$.ajax({
			url: `http://localhost:3000/calendar/` + $id,
			method: 'put',
			dataType: 'json',
			data: { events: JSON.stringify([...dayEvents, $eventName.val()]) },
			succes: function (data) {
				console.log(data);
			},
		});
	});

	//EDIT
	$(document).on('click', '#edit-event', function (e) {
		let title = e.target.dataset.title;
		$eventName.val(title);
		$('#add-event').replaceWith(
			`<div id="save-edit-event" class="btn btn-warning my-2" data-title="${title}">Editar</div>`
		);
	});

	$(document).on('click', '#save-edit-event', function (e) {
		let title = e.target.dataset.title;
		let $id = $('#input-id').val();
		let i = dayEvents.indexOf(title);
		dayEvents[i] = $eventName.val();
		$.ajax({
			url: `http://localhost:3000/calendar/` + $id,
			method: 'put',
			dataType: 'json',
			data: {
				events: JSON.stringify(dayEvents),
			},
			succes: function (data) {
				console.log(data);
			},
		});
	});

	//DELETE
	$(document).on('click', '#delete-event', function (e) {
		let $id = $('#input-id').val();
		let title = e.target.dataset.title;
		let i = dayEvents.indexOf(title);
		dayEvents.splice(i, 1);
		$.ajax({
			url: `http://localhost:3000/calendar/` + $id,
			method: 'put',
			dataType: 'json',
			data: {
				events: JSON.stringify(dayEvents),
			},
			succes: function (data) {
				console.log(data);
			},
		});
	});
});

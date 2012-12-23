function getProgressBar(progressContainer, file, btn) {
  // Given the progressContainer (will toggle visibility), when the btn is cliked
  progressContainer.hide();
  $(btn).on('click', function (evnt) {
    $(progressContainer).show();
    var data = new FormData();
    // TODO: add check to make sure file was selected
    data.append('file', file.files[0]);
    data.apend('size', file.files[0].size);
    data.append('name', file.files[0].name);

    $.ajax({
      xhr: function () {
        var xhr = $.ajaxSettings.xhr();
        if (xhr) {
          xhr.onprogress(function (evnt) {
            if (evnt.lengthComputable) {
              var percentage = (evnt.loaded / evnt.total) * 100;
              $(progressContainer).find('#progressBar').width(percentage);
            }
          });
        }
      },
      type: 'POST',
      data: data,
      url: '/upload',
      success: function (data) {
        // if successful: data = { 'success' : 'Video URL' }
        // else : data = { 'error' : 'error msg'}
      },
      error: function () {
        // TODO: look up ajax-related error cases
      }
    });

  });
}
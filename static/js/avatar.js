exports.build_bot_create_widget = function () {

    // We have to do strange gyrations with the file input to clear it,
    // where we replace it wholesale, so we generalize the file input with
    // a callback function.
    const get_file_input = function () {
        return $('#bot_avatar_file_input');
    };

    const file_name_field = $('#bot_avatar_file');
    const input_error = $('#bot_avatar_file_input_error');
    const clear_button = $('#bot_avatar_clear_button');
    const upload_button = $('#bot_avatar_upload_button');

    return upload_widget.build_widget(
        get_file_input,
        file_name_field,
        input_error,
        clear_button,
        upload_button
    );
};

exports.build_bot_edit_widget = function (target) {
    const get_file_input = function () {
        return target.find('.edit_bot_avatar_file_input');
    };

    const file_name_field = target.find('.edit_bot_avatar_file');
    const input_error = target.find('.edit_bot_avatar_error');
    const clear_button = target.find('.edit_bot_avatar_clear_button');
    const upload_button = target.find('.edit_bot_avatar_upload_button');

    return upload_widget.build_widget(
        get_file_input,
        file_name_field,
        input_error,
        clear_button,
        upload_button
    );
};

exports.build_user_avatar_widget = function (upload_function) {
    if (page_params.avatar_source === 'G') {
        $("#user_avatar_delete_button").hide();
        $("#user-avatar-source").show();
    } else {
        $("#user-avatar-source").hide();
    }
    const basic = $("#image_demo").croppie({
        viewport: {width: 200, height: 200, type: 'square'},
        boundary: {width: 300, height: 300},
        showZoomer: true,
        maxZoomedCropWidth: 400,
        enableExif: true,
    });
    $('#user_avatar_file_input').on('change', function () {
        const reader = new FileReader();

        reader.onload = function (e) {
            basic.croppie("bind", {
                url: e.target.result,
                points: [77, 469, 280, 739],
            }).then(function () {
                $('.cr-slider').attr({min: 0.1000, max: 1.5000});
            });

        };

        reader.readAsDataURL(this.files[0]);
        overlays.open_modal('upload_image_model');
    });
    const get_file_input = function () {
        return $('#user_avatar_file_input').expectOne();

    };

    $("#user_avatar_delete_button").on('click keydown', function (e) {
        e.preventDefault();
        e.stopPropagation();
        channel.del({
            url: '/json/users/me/avatar',
            success: function () {
                $("#user_avatar_delete_button").hide();
                $("#user-avatar-source").show();
                // Need to clear input because of a small edge case
                // where you try to upload the same image you just deleted.
                get_file_input().val('');
                // Rest of the work is done via the user_events -> avatar_url event we will get
            },
        });
    });

    if (settings_account.user_can_change_avatar()) {
        return upload_widget.build_direct_upload_widget(
            get_file_input,
            $("#user_avatar_file_input_error").expectOne(),
            $("#user-settings-avatar").expectOne(),
            upload_function,
            page_params.max_avatar_file_size
        );
    }
};

window.avatar = exports;

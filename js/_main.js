console.info('PixivHelper running...')

$(document).ready(() => {
    var p = phPan()

    p
        .insertAfter($('._user-profile-card'))
        .append(phTitle)
        .append(phButtonPan)

    // run animation
    p.hide().fadeIn()
})

function phPan() {
    return $('<div/>')
        .addClass('ph-pan _user-profile-card-badges')
}

function phTitle() {
    return $('<div/>')
        .addClass('ph-title')
        .text('Pixiv Helper')
}

function phButtonPan() {
    return $('<div/>')
        .addClass('_follow-buttons')
        .append(phButtonDownload)
        .append(phButtonOpenAllWorks)
}

function phButtonDownload() {
    return $('<div/>')
        .addClass('follow-button js-follow-button')
        .text('Download')
}

function phButtonOpenAllWorks() {
    return $('<div/>')
        .addClass('follow-button js-follow-button')
        .text('Open all works')
}

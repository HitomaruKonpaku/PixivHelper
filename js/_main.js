console.info('PixivHelper running...')

$(document).ready(() => {
    var uri = URI(window.location)
    var qs = uri.search(true)
    var p = phPan()
        .append(phTitle)

    if (uri.path().indexOf('member_illust') != -1) {
        var bp = phButtonPan()

        if (qs.id) {
            bp.append(phButtonOpenWorks)
        } else if (qs.mode && qs.illust_id) {
            bp.append(phButtonDownload)
        }

        p
            .append(bp)
            .insertAfter($('._user-profile-card'))
            .hide().fadeIn()
    }
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
}

function phButtonDownload() {
    return $('<div/>')
        .attr('id', 'phi-download')
        .addClass('follow-button js-follow-button')
        .text('Download')
        .click(() => {
            downloadWorker()
        })
}

function phButtonOpenWorks() {
    return $('<div/>')
        .addClass('follow-button js-follow-button')
        .text('Open works')
        .click(() => {
            var action = 'openTabs'
            var links = []
            $($('.image-item').get().reverse())
                .each((index, item) => {
                    let arr = $('a', $(item))
                    let a = $(arr)[arr.length - 1]
                    let href = $(a).attr('href')
                    links.push(href)
                })
            chrome.runtime.sendMessage({ action, links })
        })
}

function downloadWorker() {
    var action = 'download'
    var links = []

    if ($('.original-image').length != 0) {
        let src = $('.original-image').attr('data-src')
        let uri = URI(src)
        links.push(uri)
        chrome.runtime.sendMessage({ action, links })
    } else if ($('._work.multiple').length != 0) {

    } else {
        alert('Not supported!')
    }
}
console.info('PixivHelper running...')

$(document).ready(() => {
    let uri = URI(window.location)
    let qs = uri.search(true)
    let p = phPan().append(phTitle)

    if (uri.path().indexOf('member_illust') != -1) {
        let bp = phButtonPan()

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
            let action = 'openTabs'
            let links = []
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
    let action = 'download'
    let links = []

    if ($('.original-image').length != 0) {
        let src = $('.original-image').attr('data-src')
        links.push(src)
        chrome.runtime.sendMessage({ action, links })
    } else if ($('._work.multiple').length != 0) {
        let url = $('._work.multiple').attr('href')
        $.get(url, data => {
            let total = $('.item-container', data).length
            $('.item-container', data).each(function(index) {
                let url = $(this).find('a').first().attr('href')
                $.get(url, function(data) {
                    let img = $(data).filter('img')[0]
                    let src = $(img).attr('src')
                    links.push(src)
                    if (links.length == total) {
                        chrome.runtime.sendMessage({ action, links })
                    }
                })
            })
        })
    } else {
        alert('Not supported!')
    }
}
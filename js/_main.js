console.info('PixivHelper running...')

$(document).ready(() => {
    let uri = URI(window.location),
        query = uri.search(true)

    if (uri.path().indexOf('member_illust') != -1) {
        let panel = phPan().append(phTitle),
            bp = phButtonPan()

        if (query.id) {
            bp.append(phButtonOpenWorks)
        } else if (query.mode && query.illust_id) {
            bp.append(phButtonDownload)
            bp.append(phDownloadProgress().hide())
        }

        panel
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

function phDownloadProgress() {
    return $('<div/>')
        .attr('id', 'phi-download-progress')
        .addClass('cssload-squeeze')
        .append($('<span/>'), $('<span/>'), $('<span/>'), $('<span/>'), $('<span/>'))
}

function phButtonDownload() {
    return $('<div/>')
        .attr('id', 'phi-download')
        .addClass('follow-button js-follow-button')
        .text('Download')
        .click(() => {
            runDownload()
        })
}

function phButtonOpenWorks() {
    return $('<div/>')
        .addClass('follow-button js-follow-button')
        .text('Open works')
        .click(() => {
            runOpenWorks()
        })
}

function runOpenWorks() {
    let action = 'openTabs'
    let links = []

    $($('.image-item').get().reverse())
        .each((index, item) => {
            let arr = $('a', $(item))
            let a = $(arr)[arr.length - 1]
            let href = $(a).attr('href')
            links.push('https://www.pixiv.net' + href)
        })

    chrome.runtime.sendMessage({ action, links })
}

function runDownload() {
    let action = 'download'
    let links = []

    refreshDownloadUI()

    if ($('.original-image').length != 0) {
        let src = $('.original-image').attr('data-src')
        links.push(src)
        processingDownload(links)
    } else if ($('._work.multiple').length != 0) {
        let url = $('._work.multiple').attr('href')
        $.get(url).done(function(data) {
            let total = $('.item-container', data).length
            $('.item-container', data).each(function(index) {
                let url2 = $(this).find('a').first().attr('href')
                $.get(url2).done(function(data) {
                    let img = $(data).filter('img')[0]
                    let src = $(img).attr('src')
                    links.push(src)
                    if (links.length == total) {
                        processingDownload(links)
                    }
                })
            })
        })
    } else {
        processingDownload()
        alert('Not supported!')
    }
}

function processingDownload(links) {
    let total = links.length,
        count = 0

    console.log(links)

    links.forEach(link => {
        downloadPromise(link)
            .then(() => { count++ })
            .catch(() => { count++ })
            .then(() => {
                if (count == total) {
                    refreshDownloadUI()
                }
            })
    })
}

function refreshDownloadUI() {
    $('#phi-download').toggle()
    $('#phi-download-progress').toggle()
}
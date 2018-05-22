$(document).ready(() => {
    console.log('Pixiv Helper running!')

    const hide = [
        '._3M6FtEB',
    ]
    hide.forEach(v => { setTimeout(() => { $(v).remove() }, 1000) })

    setTimeout(start(), 1000)
})

function start() {
    const appID = 'pixiv-helper'
    const html = $('<div>')
        .attr('id', appID)
        .addClass('_user-profile-card-badges')
        .load(chrome.runtime.getURL('html/pixiv.html'))

    $('._user-profile-card, ._3q5XQJU')
        .after(html)
        .ready(() => {
            let pathname = window.location.pathname
            let search = window.location.search

            let app = new Vue({
                el: `#${appID}`,
                data: {
                    showOpenWorks:
                        pathname.indexOf('member_illust') != -1 &&
                        ['id'].every(v => RegExp(`[?&]${v}\=`).test(search)),
                    showDownload:
                        pathname.indexOf('member_illust') != -1 &&
                        ['mode', 'illust_id',].every(v => RegExp(`[?&]${v}\=`).test(search)),
                    downloading: false,
                },
                methods: {
                    openWorks: () => {
                        console.log('Openning works in new tab...')
                        app.downloading = true

                        const task = 'openWorks'
                        let links = []

                        $($('.image-item').get().reverse())
                            .each((index, item) => {
                                let arr = $('a', $(item))
                                let a = $(arr)[arr.length - 1]
                                let href = $(a).attr('href')
                                let url = 'https://www.pixiv.net' + href
                                links.push(url)
                            })

                        console.log(links)
                        chrome.runtime.sendMessage({ task, links }, callback => {
                            if (callback.status == 'done') {
                                app.downloading = false
                            }
                        })
                    },
                    downloadWork: () => {
                        console.log('Downloading...')
                        app.downloading = true

                        const task = 'download'
                        let links = []

                        if ($('.original-image').length != 0) {
                            let src = $('.original-image').attr('data-src')
                            links.push(src)
                            processingDownload(links)
                        } else if ($('._work.multiple').length != 0) {
                            let url = $('._work.multiple').attr('href')
                            $.get(url).done(function (data) {
                                let total = $('.item-container', data).length
                                $('.item-container', data).each(function (index) {
                                    let url2 = $(this).find('a').first().attr('href')
                                    $.get(url2).done(function (data) {
                                        let img = $(data).filter('img')[0]
                                        let src = $(img).attr('src')
                                        links.push(src)
                                        if (links.length == total) {
                                            processingDownload(links)
                                        }
                                    })
                                })
                            })
                        }

                        function processingDownload(params) {
                            const total = links.length
                            let count = 0

                            console.log(links)

                            links.forEach(link => {
                                downloadPromise(link)
                                    .then()
                                    .catch(err => console.error(err))
                                    .then(() => {
                                        count++
                                        if (count == total) {
                                            app.downloading = false
                                        }
                                    })
                            })
                        }

                    },
                },
            })
        })
}
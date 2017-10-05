chrome.runtime.onInstalled.addListener(function() {
    chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
        chrome.declarativeContent.onPageChanged.addRules([{

            conditions: [
                new chrome.declarativeContent.PageStateMatcher({
                    pageUrl: { hostEquals: 'www.pixiv.net' }
                })
            ],

            actions: [
                new chrome.declarativeContent.ShowPageAction()
            ]

        }])
    })
})

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    console.log(message)
        // console.log(sender)

    if (!message.action) return
    let links = message.links

    if (message.action == 'openTabs') {
        links.forEach(link => {
            chrome.tabs.create({ url: link, active: false })
        })
    }

    if (message.action == 'download') {
        let total = links.length,
            count = 0

        links.forEach(link => {
            downloadPromise(link)
                .then(() => { count++ })
                .catch(() => { count++ })
                .then(() => {
                    if (count == total) {
                        sendResponse({ status: 'done' })
                    }
                })
        })

        return true
    }
})
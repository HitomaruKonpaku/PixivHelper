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
    console.log(sender)

    if (!message.action) return
    var links = message.links
    console.log(links)

    if (message.action == 'openTabs') {
        links.forEach(link => {
            link = 'https://www.pixiv.net' + link
            chrome.tabs.create({ url: link, active: false })
        })
    }

    if (message.action == 'download') {
        links.forEach(link => {
            console.log(link.toString())
        })
    }
})
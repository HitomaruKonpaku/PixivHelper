chrome.runtime.onInstalled.addListener(function () {
    chrome.declarativeContent.onPageChanged.removeRules(undefined, function () {
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

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    console.log(message)
    // console.log(sender)

    if (!message.task) return
    const task = message.task
    const links = message.links

    if (task == 'openWorks') {
        links.forEach(link => { chrome.tabs.create({ url: link, active: false }) })
        sendResponse({ status: 'done' })
    }
    
})
function downloadPromise(url, fileName) {
    if (!url) return

    if (!fileName) {
        let uri = new URI(url)
        fileName = uri.filename()
    }

    return new Promise((resolve, reject) => {
        let xhr = new XMLHttpRequest
        xhr.addEventListener('load', resolve)
        xhr.addEventListener('error', reject)
        xhr.open('GET', url, true)
        xhr.responseType = 'blob'
        xhr.onload = (e) => { download(e.target.response, fileName) }
        xhr.send()
    })
}
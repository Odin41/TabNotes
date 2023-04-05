function setBandge()
{
    chrome.action.setBadgeText({ text: "!" });
}

function clearBandge()
{
    chrome.action.setBadgeText({ text: "" });
}

String.prototype.hashCode = function () {
    var hash = 5381, i = this.length
    while (i)
        hash = (hash * 33) ^ this.charCodeAt(--i)
    return hash >>> 0;
}

try {
    importScripts('../js/main.js',);
  } catch (e) {
    console.error(e);
  }

let tabHash;
let removeOnCloseTab = false;

async function load() {
     if(!tabHash)
        return;

    const key = tabHash + "";
    clearBandge();
    chrome.storage.local.get(key).then((result) => {
        if(result[key]) {
            setBandge();
        }
    });

    chrome.storage.local.get("removeOnCloseTab").then((result) => {
        if(result["removeOnCloseTab"])
            removeOnCloseTab = result["removeOnCloseTab"];
    });
}

function reddenPage() {
    let note = document.getElementById('note-modal');
    if(note.length == 0)
    {
        createModal();
    }

    note.style.display = "block";
    
  }

  function createModal()
  {
        var divModal = $('<div id="note-modal"><p></p></div>');
        $(document).append(divModal);

  }


function getHash(tabs) {
    if(tabs.length == 0 || !tabs[0].url)
    {
        tabHash = null;
        return;
    }

    let url = tabs[0].url;
    let hash = url.hashCode();

    if(hash)
    {
        tabHash = "tab_" +  + hash;
        load();
    }
    
    if (!url.includes('chrome://')) {
        chrome.scripting.executeScript({
            target: { tabId: tabs[0].id, allFrames: true },
            function: reddenPage
        });
    }

  
  }

  function clear() {
    if(!tabHash || !removeOnCloseTab)
        return;

    const key = tabHash + "";
    chrome.storage.local.remove(key);
    clearBandge();
}

function handleUpdated() {
    chrome.tabs.query({ active: true, lastFocusedWindow: true }).then((tabs) => getHash(tabs));
  }
  
  chrome.tabs.onUpdated.addListener(handleUpdated);

  chrome.tabs.onActivated.addListener(handleUpdated);

  chrome.tabs.onRemoved.addListener(clear);

  
  String.prototype.hashCode = function () {
    var hash = 5381, i = this.length
    while (i)
        hash = (hash * 33) ^ this.charCodeAt(--i)
    return hash >>> 0;
}

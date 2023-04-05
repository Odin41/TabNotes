var note;
var tabHash;

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
  }

function load() {
    if(!tabHash)
        return;

    const key = tabHash;

    note.value = "";
    clearBandge();
    chrome.storage.local.get(key).then((result) => {
        for (let key in result) {
            note.value = result[key];
            setBandge();
        }
    });
}


function save() {

    if (!tabHash || !note.value) {
        return;
    }
    const key = tabHash;

    var data = {};
    data[key] = note.value;

    chrome.storage.local.set(data);
    setBandge();
    window.close();
}

function clear() {
    if(!tabHash)
        return;

    const key = tabHash;

    chrome.storage.local.remove(key);
    note.value = "";
    clearBandge();
}

document.addEventListener('DOMContentLoaded', async function () {
  
   note = document.getElementById('note');

   const saveButton = document.getElementById('save');
   saveButton.addEventListener('click', save);

   const clarButton = document.getElementById('clear');
   clarButton.addEventListener('click', clear);

   init();
});

function init()
{
    chrome.tabs.query({ active: true, lastFocusedWindow: true }).then((tabs) => getHash(tabs));
    //getAllTabs();
}


chrome.tabs.onActivated.addListener(init);

function getAllTabs()
{
    chrome.storage.sync.get(null, function(items) {
        var allKeys = Object.keys(items);
        console.log(allKeys);
    });
}


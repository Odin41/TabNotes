var removeOnCloseTab = false;

function init()
{
    chrome.storage.local.get("removeOnCloseTab").then((result) => {
        if(result)
        {
            removeOnCloseTab = result["removeOnCloseTab"];
            $('#removeOnCloseTab').prop('checked', removeOnCloseTab);
        }
    });

    load();
}


function getAllTabs()
{
    
    return result;
}


function load()
{

    let allKeys;
    chrome.storage.local.get(null, function(items) {
        allKeys = Object.keys(items);
        let tabs = [];
        for(let i = 0; i < allKeys.length; i++)
        {
            let key = allKeys[i];
            if(key.startsWith("tab_"))
            {
                tabs.push(key.replace('tab_',"") - 0);
            }
        }
    
        let openTabs = new Set();
        chrome.tabs.query({}).then(function(wTabs){
            for(let i = 0; i < wTabs.length; i++)
            {
                let url = wTabs[i].url;
                if(!url.includes('chrome://') && !openTabs.has(url.hashCode()))
                    openTabs.add(url.hashCode());
            }
    
            let list = $('<ul class="list-group">');
            for(let item in tabs)
            {
                let intItem = tabs[item] - 0;

                let element = $('<li class="list-group-item d-flex justify-content-between align-items-center ' +  
                + '"><span class="' + (!openTabs.has(intItem) ? " text-decoration-line-through" : "") + '">' + items['tab_' + intItem] + 
                '</span><button class="btn btn-danger removeStorage" data-hashtab="tab_' + intItem + '">Удалить</button></li>');

                list.append(element);
            }
        
            $('#list').empty().append(list);

            $('.removeStorage').on('click', function(e)
            {
                let that = $(this);
                let parent = that.parent();
        
                let key = that.data("hashtab");
        
                chrome.storage.local.remove(key);
                parent.remove();
            });

        });
    });
}




function save()
{
    const clearOnCloseTab = $('#removeOnCloseTab');
    chrome.storage.local.set({"removeOnCloseTab": clearOnCloseTab.is(':checked')});
    window.close();
}

document.addEventListener('DOMContentLoaded', async function () {
  
    const saveButton = document.getElementById('save');
    saveButton.addEventListener('click', save);
 
     init();
 });
 

reloadDuolingoTabs();

function reloadDuolingoTabs() {
    chrome.windows.getAll({
        populate: true,
        windowTypes: ['normal', 'panel', 'popup'],
    }, (windows) => {
        windows.forEach((window) => {
            window.tabs!.forEach((tab) => {
                if (tab.url!.includes("duolingo.com")) {
                    chrome.tabs.update(tab.id!, {url: "https://www.duolingo.com/learn"})
                        .then();
                }
            });
        });
    });
}
module.exports.getAllDepIDS = async (MyClient,baseIDS)=>{
    let lookIDS=baseIDS;
    let willDownloadedIDS=[];
    let fetchedItems = [];

    do {
        willDownloadedIDS = willDownloadedIDS.concat(lookIDS);
        
        var items = await MyClient.getItems(lookIDS);
        if (items.success == false) return;

        fetchedItems = fetchedItems.concat(items.data);
        

        var HasChilds = items.data.filter(x => x.children != null && x.children.length > 0);
        
        if (HasChilds.length > 0) {

            lookIDS = [];

            HasChilds.forEach(SingleItem => {
                var NewIDS= lookIDS.concat(SingleItem.children.map(x => x.publishedfileid));
                NewIDS.forEach(SingleID => {
                    if(willDownloadedIDS.includes(SingleID)===false && lookIDS.includes(SingleID)===false){
                        lookIDS.push(SingleID);
                    }
                });
            });

        } else {
            lookIDS = null;
        }


    } while (lookIDS != null);

    return {
        IDS:willDownloadedIDS,
        Items:fetchedItems
    };
};

module.exports.formatBytes= (bytes, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}
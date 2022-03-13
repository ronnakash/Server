//TODO: filter results to prevent nosql injection


const urlParser = (url : string) : any => {
    let urlParams = new URLSearchParams(url.split('?')[1]);
    let entries = urlParams.entries();
    return {find: paramsToObject(entries)}
}

function paramsToObject(entries : IterableIterator<[string, string]>) {
    let result : any = {};
    for(const [key, value] of entries) {
        let newVal = value;
        if (value==='$gte=1234'){
            let urlParams = new URLSearchParams(value);
            let entries = urlParams.entries();
            newVal = paramsToObject(entries)
        }
        result[key] = value;
    }
    return result;
  }



export default urlParser
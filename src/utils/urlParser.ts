//TODO: filter results to prevent nosql injection


const urlParser = (url : string) : any => {
    let urlParams = new URLSearchParams(url.split('?')[1]);
    let entries = urlParams.entries();
    return {find: paramsToObject(entries)}
}

function paramsToObject(entries : IterableIterator<[string, string]>) {
    let result : any = {};
    for(const [key, value] of entries) { // each 'entry' is a [key, value] tupple
        result[key] = value;
    }
    return result;
  }



export default urlParser
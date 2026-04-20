import { HttpParams } from "@angular/common/http";

export function buildCleanParams(filters: Record<string, any> | null): HttpParams {
    let params = new HttpParams();
    if(!filters){
        return params;
    }
    Object.keys(filters).forEach(key => {
        const value = filters[key];
        if (Array.isArray(value)) {
            value.forEach(item => {
                params = params.append(key, item);
            });
        } else if(value !== null && value !== ''){
            params = params.set(key, value.toString());
        }
    })

    return params;
}
import { HttpRequestItem, CyiaHttpService } from 'cyia-ngx-common';

export function dataSourceFromReq(http: CyiaHttpService, httpRequestConfig: HttpRequestItem) {
    return http.request(httpRequestConfig).toPromise(this)
}

/**
 * 预定义返回自身值
 *
 * @export
 * @param {*} value
 * @returns {Promise<any>}
 */
export function dataSourceFromSelf(value): Promise<any> {
    return new Promise((res) => {
        res({ label: this.value, value: this.value })
    })
}
//todo 1.返回
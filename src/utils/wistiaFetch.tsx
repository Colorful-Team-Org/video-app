const wistiaFetch = async (url: string, method: string, contentType: string, auth: string, body: any) => {
    const result = await fetch(url, {
        method: method,
        headers: new Headers({
            'Content-Type': contentType,
            'Authorization': auth
        }),
        cache: 'no-cache',
        body: body,
        credentials: 'same-origin'
    })

    return result;
}

export default wistiaFetch;

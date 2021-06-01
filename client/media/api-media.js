const create = async (params, credentials, media) => {
    try {
        let response = await fetch('/api/media/new/' + params.userId, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + credentials.t
            },
            body: media
        })

        return await response.json()
    } catch (e) {
        console.log(e)
    }
}

export { create };
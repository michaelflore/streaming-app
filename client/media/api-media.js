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

const listPopular = async (signal) => {
    try {
        let response = await fetch('/api/media/popular', {
            method: 'GET',
            signal: signal,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })

        return await response.json()
    } catch (e) {
        console.log(e)
    }
}

const listByUser = async (params) => {
    try {
        let response = await fetch('/api/media/by/' + params.userId, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })

        return await response.json()
    } catch (e) {
        console.log(e)
    }
}

export { create, listPopular, listByUser };
const getAdminBoard = async (params, credentials, signal) => {
    try {
        let response = await fetch('/api/admin/' + params.adminId, {
            method: "GET",
            signal: signal,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + credentials.t
            }
        })

        let user = await response.json()
        return user

    } catch (e) {
        console.log(e)
    }
}

export { getAdminBoard };
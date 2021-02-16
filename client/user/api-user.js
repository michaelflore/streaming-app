const getSpecificUser = async (params, credentials, signal) => {
    try {
        let response = await fetch('/api/users/' + params.userId, {
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

export { getSpecificUser };
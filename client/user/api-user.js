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

const updateUser = async(params, credentials, user) => {
    try {
        const response = await fetch('/api/users/' + params.userId, {
            method: "PUT",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + credentials.t
            },
            body: JSON.stringify(user)
        })

        return await response.json()
    } catch (e) {
        console.log(e)
    }
}

const removeUser = async (params, credentials) => {
    try {
        let response = await fetch('/api/users/' + params.userId, {
            method: "DELETE",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + credentials.t
            }
        })

        return await response.json();

    } catch (e) {
        console.log(e)
    }
}

export { getSpecificUser, updateUser, removeUser };
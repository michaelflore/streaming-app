//Sign up new user
const signup = async (newUser) => {
    try {
        let response = await fetch("/auth/signup", {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newUser)
        })

        if (!response.ok) {
            const message = `An error has occured: ${response.status}`;
            throw new Error(message);
        }

        let data = await response.json()

        //Return first response
        return data;

    } catch (e) {
        console.log(e)
    }
}

//Sign In
const signin = async (user) => {
    try {
        let response = await fetch("/auth/signin", {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify(user)
        })

        //Return first response
        return await response.json();

    } catch (e) {
        console.log(e)
    }
}

//Sign Out
const signout = async () => {
    try {
        let response = await fetch("/auth/signout", {
            method: "GET"
        })

        return await response.json();
    } catch (e) {
        console.log(e)
    }
}

export { signup, signin, signout };
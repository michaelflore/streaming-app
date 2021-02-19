/* Where we handle json web tokens in session storage */

import { signout } from "./api-auth";

const auth = {
    isAuthenticated() {
        if(typeof window == "undefined") {
            return false
        }

        if(sessionStorage.getItem('jwt')) {
            return JSON.parse(sessionStorage.getItem('jwt'))
        } else {
            return false
        }
    },
    authenticate(jwt, cb) {
        if(typeof window !== "undefined") {
            sessionStorage.setItem('jwt', JSON.stringify(jwt))
            cb()
        }
    },
    removeJWT(cb) {

        if(typeof window !== "undefined") {
            sessionStorage.removeItem('jwt')
        }

        //Go to landing
        cb()

        //Second response
        signout().then((data) => {
            document.cookie = "t=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
            console.log("In removeJWT " + data)
        })
    },
    isAdmin() {
        if(sessionStorage.getItem("jwt")) {
            let jwt = JSON.parse(sessionStorage.getItem('jwt'))

            return jwt.user.roles.includes("ROLE_ADMIN")
        } else {
            return false
        }
    },
    updatedNameEmail(updateObj) {
        let prevData = JSON.parse(sessionStorage.getItem('jwt'));

        Object.keys(updateObj).forEach((value) => {
            prevData.user[value] = updateObj[value]
        });

        sessionStorage.setItem('jwt', JSON.stringify(prevData));
    }
}

export default auth;
import {withAuth} from "next-auth/middleware"

export default withAuth({
    pages:{
        signIn:"/"    //The signIn property is used to define the path to the sign-in page. In this case, it redirects users to the home page ("/") if they are not authenticated.
    }
})

export const config={
    matcher:[
        "/users/:path*",
        "/conversations/:path*"

    ]
}

//The withAuth function is used to protect certain routes by ensuring that only authenticated users can access them.

//Declare environment
const local_server = "https://localhost:44303/api/"                         //Write localhost and port
const public_server = "http://apiescrile.somee.com/api/"                        //Write WEB API public address
const local_sources = ""       //Write App local resources

const env = local_server                                  //Select your environment (local or public server)

//Users API
const allUsers_route = env + "user/users"
const loginUser_route = env + "user/login"
const signupUser_route = env + "user/register"


//Ejemplo de rutas API
/*
const allUsers_route = env + "Users"
const postUser_route = env + "Users/"
const loginUser_route = env + "Users/login"
const editProfileFile_route = env + "Users/putProfileFile/"
const signupUser_route = env + "Users/signup"
const dataUser_route = env + "Users/"
const totalUser_route = env + "Users/GetTotalUsers"
*/





//Ruta de somee
//http://apiescrile.somee.com/api/
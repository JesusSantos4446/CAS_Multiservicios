//Declare environment
const local_server = "https://localhost:44303/"                         //Write localhost and port
const public_server = "http://apiescrile.somee.com/"                        //Write WEB API public address
const local_sources = ""       //Write App local resources

const env = public_server                                  //Select your environment (local or public server)

//Users API
const allUsers_route = env + "api/user/users"
const loginUser_route = env + "api/user/login"
const signupUser_route = env + "api/user/register"

//Clients API
const allClients_route = env + "api/client/clients"
const addClient_route = env + "api/client/register"
const editClient_route = env + "api/client/editClient/"
const deleteClient_route = env + "api/client/deleteClient/"
const uploadImg_route = env + "api/client/uploadImage"
const deleteImg_route = env + "api/client/deleteImage/"
const viewImg_route = env + "imgCot/"

//Quotes API
const allQuotes_route = env + "api/quote/quotes"


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
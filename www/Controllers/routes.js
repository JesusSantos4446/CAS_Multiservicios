//Declare environment
const local_server = "https://localhost:44303/"                             //Write localhost and port
const public_server = "http://apiescrile.somee.com/"                        //Write WEB API public address
const local_sources = ""       //Write App local resources

const env = local_server                                  //Select your environment (local or public server)

//Users API
const allUsers_route = env + "api/user/users"
const loginUser_route = env + "api/user/login"
const signupUser_route = env + "api/user/register"
const editUser_route = env + "api/user/update/"
const deleteUser_route = env + "api/user/delete/"
const showUserWithId_route = env + "api/user/user/"

//Clients API
const allClients_route = env + "api/client/clients"
const addClient_route = env + "api/client/register"
const addGuest_route = env + "api/client/guest"
const editClient_route = env + "api/client/editClient/"
const deleteClient_route = env + "api/client/deleteClient/"
const uploadImg_route = env + "api/client/uploadImage"
const deleteImg_route = env + "api/client/deleteImage/"
const viewImg_route = env + "imgCot/"

//Quotes API
const allQuotes_route = env + "api/quote/quotes"
const addQuote_route = env + "api/quote/register"
const editQuote_route = env + "api/quote/update/"

//Catalog API
const allCatalog_route = env + "api/catalog/catalogs"
const searchInCatalog_route = env + "api/catalog/search"


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
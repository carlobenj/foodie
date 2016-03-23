using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Cors;
using FoodieApi.Models;

namespace FoodieApi.Controllers
{
    [EnableCors(origins: "*", headers: "*", methods: "*")]
    public class AccountController : ApiController
    {
        AccountModels md = new AccountModels();
        FoodieToolSet fts = new FoodieToolSet();

        public AccountObject_ResponseWrapper Post(AccountObject_Request obj)
        {
            //credentials decryption
            CredentialsObject credentials = new CredentialsObject();
            credentials = fts.GetCredentials(obj.api_key);

            AccountObject_ResponseWrapper response = new AccountObject_ResponseWrapper();
            if (credentials.private_key == fts.PrivateKey && credentials.MyID == obj.foodict_ID)
            {
                response.isAuthorized = true;
                response.result = md.getMyAccount(obj.user_ID, obj.foodict_ID); //foodict
            }
            else
            {
                response.isAuthorized = false;
                response.result = null;
            }
            return response;
        }

        public EditAccountObject_ResponseWrapper Put(EditAccountObject_Request obj)
        {
            //credentials decryption
            CredentialsObject credentials = new CredentialsObject();
            credentials = fts.GetCredentials(obj.api_key);

            EditAccountObject_ResponseWrapper response = new EditAccountObject_ResponseWrapper();
            if (credentials.private_key == fts.PrivateKey && credentials.MyID == obj.foodict_ID)
            {
                response.isAuthorized = true;
                response.result = md.editMyAccount(obj); //foodict
            }
            else
            {
                response.isAuthorized = false;
                response.result = false;
            }
            return response;
        }
    }
}

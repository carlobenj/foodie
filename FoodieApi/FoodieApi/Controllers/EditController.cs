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
    public class EditController : ApiController
    {
        EditModels md = new EditModels();
        FoodieToolSet fts = new FoodieToolSet();

        public EditObject_ResponseWrapper Put(string api_key, int user_ID, int foodict_ID)
        {
            CredentialsObject credentials = new CredentialsObject();
            credentials = fts.GetCredentials(api_key);

            EditObject_ResponseWrapper response = new EditObject_ResponseWrapper();
            if (credentials.private_key == fts.PrivateKey && credentials.MyID == foodict_ID)
            {
                response.isAuthorized = true;
                response.result = md.getEditItems(user_ID, credentials.MyID); //foodict
            }
            else
            {
                response.isAuthorized = false;
                response.result = null;
            }
            return response;
        }
    }
}
